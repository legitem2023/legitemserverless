'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

interface ClothViewerProps {
  modelPath?: string;
}

// Improved spring-mass system for cloth simulation
class ClothSimulator {
  geometry: THREE.BufferGeometry;
  particles: { position: THREE.Vector3; velocity: THREE.Vector3; mass: number; pinned: boolean }[] = [];
  springs: { p1: number; p2: number; restLength: number; stiffness: number }[] = [];
  tempVec = new THREE.Vector3();
  gravity = 4.0;          // Reduced gravity for softer fall
  damping = 0.98;          // Slightly higher damping
  stiffness = 0.6;         // Lower stiffness to allow draping
  iterations = 5;          // More iterations for stability

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
        pinned: false,
      });
    }
  }

  initSprings() {
    const indexAttr = this.geometry.index;
    if (!indexAttr) return;

    const indices = indexAttr.array;
    const edgeSet = new Set<string>();

    for (let i = 0; i < indices.length; i += 3) {
      const a = indices[i];
      const b = indices[i+1];
      const c = indices[i+2];

      this.addSpring(a, b, edgeSet);
      this.addSpring(b, c, edgeSet);
      this.addSpring(c, a, edgeSet);
    }

    // Add bending springs (skipped for simplicity)
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
        stiffness: this.stiffness,
      });
    }
  }

  simulate(deltaTime: number, wind: THREE.Vector3) {
    const sub = this.tempVec;
    deltaTime = Math.min(deltaTime, 0.05); // Smaller cap for stability

    // Apply forces (gravity, wind)
    for (let p of this.particles) {
      if (p.pinned) continue;
      p.velocity.y -= this.gravity * deltaTime;
      p.velocity.x += wind.x * deltaTime;
      p.velocity.z += wind.z * deltaTime;
    }

    // Solve constraints multiple times
    for (let iter = 0; iter < this.iterations; iter++) {
      for (let s of this.springs) {
        const p1 = this.particles[s.p1];
        const p2 = this.particles[s.p2];

        sub.copy(p2.position).sub(p1.position);
        const dist = sub.length();
        if (dist === 0) continue;

        const correction = (dist - s.restLength) / dist * s.stiffness * 0.5;
        const correctionVec = sub.multiplyScalar(correction);

        if (!p1.pinned) p1.position.add(correctionVec);
        if (!p2.pinned) p2.position.sub(correctionVec);
      }
    }

    // Update velocities and integrate
    for (let p of this.particles) {
      if (p.pinned) {
        p.velocity.set(0, 0, 0);
        continue;
      }
      // Estimate velocity from position change
      p.velocity.copy(p.position).sub(p.velocity).multiplyScalar(1/deltaTime);
      p.velocity.multiplyScalar(this.damping);
      p.position.addScaledVector(p.velocity, deltaTime);
    }

    // Apply to geometry
    const positions = this.geometry.attributes.position.array;
    for (let i = 0; i < this.particles.length; i++) {
      positions[i*3] = this.particles[i].position.x;
      positions[i*3+1] = this.particles[i].position.y;
      positions[i*3+2] = this.particles[i].position.z;
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  // Pin vertices near the top (shoulders)
  pinTopVertices(threshold: number = 0.2) {
    // Find the highest Y coordinate
    let maxY = -Infinity;
    for (let p of this.particles) {
      if (p.position.y > maxY) maxY = p.position.y;
    }
    const pinY = maxY - threshold;
    for (let p of this.particles) {
      if (p.position.y >= pinY) {
        p.pinned = true;
      }
    }
  }
}

export default function ClothViewer({ modelPath = '/white_t-shirt_with_print.glb' }: ClothViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState('Initializing...');

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222); // Dark background to see shirt better

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 1.5, 3);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = false; // No ground, so shadows off
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(2, 3, 2);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-2, 1, -2);
    scene.add(backLight);

    // Load GLB shirt
    const loader = new GLTFLoader();
    let shirtMesh: THREE.Mesh | null = null;
    let simulator: ClothSimulator | null = null;

    loader.load(
      modelPath,
      (gltf) => {
        setDebug('Model loaded, setting up cloth...');

        // Find the first mesh
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh && !shirtMesh) {
            shirtMesh = child;
            child.castShadow = false;
            child.receiveShadow = false;

            // Clone geometry for simulation
            const geom = child.geometry.clone();
            child.geometry = geom;

            // Center and scale to a reasonable size
            geom.center();
            const box = new THREE.Box3().setFromBufferAttribute(geom.attributes.position as THREE.BufferAttribute);
            const size = box.getSize(new THREE.Vector3());
            const scale = 1.5 / Math.max(size.x, size.y, size.z); // Scale to ~1.5 units tall
            geom.scale(scale, scale, scale);

            // Move up so it's above origin
            geom.translate(0, 1.0, 0);

            // Initialize simulator
            simulator = new ClothSimulator(geom);
            // Pin the top vertices (shoulders)
            simulator.pinTopVertices(0.15);

            scene.add(gltf.scene);
            setLoading(false);
            setDebug('Cloth simulation running');
          }
        });

        if (!shirtMesh) {
          setError('No mesh found in model');
        }
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

    // Animation
    let clock = new THREE.Clock();
    const wind = new THREE.Vector3(0.3, 0, 0.1); // Gentle wind

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (simulator && shirtMesh) {
        simulator.simulate(delta, wind);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
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
    backgroundColor: '#222',
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
        <div style={{ position: 'absolute', bottom: 10, left: 10, color: '#ccc' }}>
          {debug}
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
