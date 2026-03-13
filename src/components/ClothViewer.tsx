'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

interface ClothViewerProps {
  modelPath?: string;
}

// Spring-mass system for cloth simulation
class ClothSimulator {
  geometry: THREE.BufferGeometry;
  particles: { position: THREE.Vector3; velocity: THREE.Vector3; mass: number }[] = [];
  springs: { p1: number; p2: number; restLength: number; stiffness: number }[] = [];
  tempVec = new THREE.Vector3();
  tempVec2 = new THREE.Vector3();

  constructor(geometry: THREE.BufferGeometry) {
    this.geometry = geometry;
    this.initParticles();
    this.initSprings();
  }

  initParticles() {
    const positions = this.geometry.attributes.position.array;
    const count = positions.length / 3;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        position: new THREE.Vector3(positions[i*3], positions[i*3+1], positions[i*3+2]),
        velocity: new THREE.Vector3(0, 0, 0),
        mass: 1.0,
      });
    }
  }

  initSprings() {
    const indexAttr = this.geometry.index;
    if (!indexAttr) return; // need indexed geometry

    const indices = indexAttr.array;
    const edgeSet = new Set<string>();

    // Build edges from triangles
    for (let i = 0; i < indices.length; i += 3) {
      const a = indices[i];
      const b = indices[i+1];
      const c = indices[i+2];

      this.addSpring(a, b, edgeSet);
      this.addSpring(b, c, edgeSet);
      this.addSpring(c, a, edgeSet);
    }

    // Also add bending springs (skip for simplicity)
  }

  addSpring(i1: number, i2: number, edgeSet: Set<string>) {
    const key = i1 < i2 ? `${i1}-${i2}` : `${i2}-${i1}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      const p1 = this.particles[i1].position;
      const p2 = this.particles[i2].position;
      const restLength = p1.distanceTo(p2);
      this.springs.push({
        p1: i1,
        p2: i2,
        restLength,
        stiffness: 0.8,
      });
    }
  }

  simulate(deltaTime: number, wind: THREE.Vector3, gravity: number) {
    const sub = this.tempVec;
    const force = this.tempVec2;
    const damping = 0.99;

    // Apply gravity and wind
    for (let p of this.particles) {
      p.velocity.y -= gravity * deltaTime * p.mass;
      p.velocity.x += wind.x * deltaTime;
      p.velocity.z += wind.z * deltaTime;
    }

    // Solve constraints (springs)
    const iterations = 3;
    for (let iter = 0; iter < iterations; iter++) {
      for (let s of this.springs) {
        const p1 = this.particles[s.p1];
        const p2 = this.particles[s.p2];

        sub.copy(p2.position).sub(p1.position);
        const dist = sub.length();
        if (dist === 0) continue;

        const correction = (dist - s.restLength) / dist * s.stiffness * 0.5;
        const correctionVec = sub.multiplyScalar(correction);

        if (!this.isPinned(s.p1)) p1.position.add(correctionVec);
        if (!this.isPinned(s.p2)) p2.position.sub(correctionVec);
      }
    }

    // Update velocities and integrate
    for (let p of this.particles) {
      if (this.isPinned(p)) continue;
      p.velocity.copy(p.position).sub(p.velocity).multiplyScalar(1/deltaTime);
      p.velocity.multiplyScalar(damping);
      p.position.copy(p.position).addScaledVector(p.velocity, deltaTime);
    }

    // Update geometry
    const positions = this.geometry.attributes.position.array;
    for (let i = 0; i < this.particles.length; i++) {
      positions[i*3] = this.particles[i].position.x;
      positions[i*3+1] = this.particles[i].position.y;
      positions[i*3+2] = this.particles[i].position.z;
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  // Simple pin: top few vertices (adjust based on your shirt)
  isPinned(idxOrParticle: number | { position: THREE.Vector3 }): boolean {
    if (typeof idxOrParticle === 'number') {
      const y = this.particles[idxOrParticle].position.y;
      return y > 1.5; // pin vertices above a certain height
    }
    return false;
  }
}

export default function ClothViewer({ modelPath = '/shirt.glb' }: ClothViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState('Initializing...');

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // sky blue

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 1.5, 3);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);

    // --- Lighting (suitable for a shirt) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(2, 3, 2);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-2, 1, -2);
    scene.add(backLight);

    // Add a subtle ground plane
    const planeGeo = new THREE.PlaneGeometry(10, 10);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    plane.receiveShadow = true;
    scene.add(plane);

    // --- Load GLB model (shirt) ---
    const loader = new GLTFLoader();
    let shirtMesh: THREE.Mesh | null = null;
    let simulator: ClothSimulator | null = null;

    loader.load(
      modelPath,
      (gltf) => {
        setDebug('Model loaded, applying cloth simulation...');

        // Assume the first mesh is the shirt
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            shirtMesh = child;
            child.castShadow = true;
            child.receiveShadow = true;

            // Clone geometry for simulation (we'll modify positions)
            const geom = child.geometry.clone();
            child.geometry = geom;

            // Center and scale if needed
            geom.center();
            const box = new THREE.Box3().setFromBufferAttribute(geom.attributes.position as THREE.BufferAttribute);
            const size = box.getSize(new THREE.Vector3());
            const scale = 1 / Math.max(size.x, size.y, size.z);
            geom.scale(scale, scale, scale);

            // Move up so it rests on ground
            geom.translate(0, 0.5, 0);

            // Initialize cloth simulator
            simulator = new ClothSimulator(geom);

            // Pin vertices with highest Y (shoulders)
            const positions = geom.attributes.position.array;
            // FIX: explicitly type the filter callback parameters
            const maxY = Math.max(...positions.filter((_value: number, i: number) => i % 3 === 1));
            for (let i = 0; i < positions.length / 3; i++) {
              if (positions[i*3+1] > maxY - 0.2) {
                if (simulator.particles[i]) {
                  simulator.particles[i].mass = 1000; // essentially pinned
                }
              }
            }

            scene.add(gltf.scene);
            setLoading(false);
            setDebug('Cloth simulation active');
          }
        });
      },
      (progress) => {
        if (progress.total) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setDebug(`Loading: ${percent}%`);
        }
      },
      (err) => {
        setError('Failed to load model');
        setDebug('Error loading model');
        console.error(err);
      }
    );

    // --- Animation loop with cloth simulation ---
    let clock = new THREE.Clock();
    const wind = new THREE.Vector3(0.5, 0, 0.2); // constant wind

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1); // cap for stability

      if (simulator && shirtMesh) {
        // Simulate cloth
        simulator.simulate(delta, wind, 9.8);

        // Update bounding box for shadows
        shirtMesh.geometry.computeBoundingBox();
        shirtMesh.geometry.computeBoundingSphere();
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // --- Resize handler ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath]);

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '500px',
    backgroundColor: '#87CEEB',
    overflow: 'hidden'
  };

  const canvasWrapperStyle: React.CSSProperties = {
    width: '100%',
    height: '500px',
    position: 'relative',
  };

  return (
    <div style={containerStyle}>
      <div style={canvasWrapperStyle} ref={containerRef} />
      {loading && (
        <div style={{ position: 'absolute', bottom: 10, left: 10, color: '#333' }}>
          Loading: {debug}
        </div>
      )}
      {error && (
        <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'red' }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
