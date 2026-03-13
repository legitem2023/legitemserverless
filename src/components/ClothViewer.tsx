'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

interface ClothViewerProps {
  modelPath?: string;
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
    scene.background = new THREE.Color(0x1a1a2e);

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3, 2, 4);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1.2, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 5, 3);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffaa88, 0.5);
    fillLight.position.set(-2, 2, 2);
    scene.add(fillLight);

    // Simple ground
    const groundGeometry = new THREE.CircleGeometry(5, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a3a, roughness: 0.8 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Load and setup the shirt
    const loader = new GLTFLoader();
    let shirtMesh: THREE.Mesh | null = null;
    let simulator: any = null;

    // Advanced cloth simulator using Position-Based Dynamics
    class PBDClothSimulator {
      mesh: THREE.Mesh;
      originalPositions: Float32Array;
      particles: { 
        current: THREE.Vector3; 
        previous: THREE.Vector3;
        pinned: boolean;
        mass: number;
      }[] = [];
      constraints: { a: number; b: number; restLength: number; stiffness: number }[] = [];
      tempVec = new THREE.Vector3();
      
      // Physics parameters - tuned for t-shirt fabric
      gravity = -3.5;
      damping = 0.99;
      windStrength = 0.4;
      windFrequency = 0.5;
      time = 0;

      constructor(mesh: THREE.Mesh) {
        this.mesh = mesh;
        
        // Clone the geometry to work with
        const geometry = mesh.geometry.clone();
        mesh.geometry = geometry;
        
        // Store original positions as reference
        const positionAttr = geometry.attributes.position;
        this.originalPositions = new Float32Array(positionAttr.array);
        
        this.initParticles();
        this.initConstraints();
        this.pinShouldersAndCollar();
      }

      initParticles() {
        const positions = this.mesh.geometry.attributes.position.array;
        const count = positions.length / 3;
        
        for (let i = 0; i < count; i++) {
          const x = positions[i*3];
          const y = positions[i*3+1];
          const z = positions[i*3+2];
          
          this.particles.push({
            current: new THREE.Vector3(x, y, z),
            previous: new THREE.Vector3(x, y, z),
            pinned: false,
            mass: 1.0
          });
        }
      }

      initConstraints() {
        const indices = this.mesh.geometry.index?.array;
        if (!indices) return;

        const edgeSet = new Set<string>();
        
        // Create structural constraints (edges of triangles)
        for (let i = 0; i < indices.length; i += 3) {
          const a = indices[i];
          const b = indices[i+1];
          const c = indices[i+2];
          
          this.addConstraint(a, b, edgeSet, 0.9); // High stiffness for structure
          this.addConstraint(b, c, edgeSet, 0.9);
          this.addConstraint(c, a, edgeSet, 0.9);
        }

        // Add some bending constraints (skip every other vertex for performance)
        console.log(`Created ${this.constraints.length} constraints`);
      }

      addConstraint(i1: number, i2: number, edgeSet: Set<string>, stiffness: number) {
        const key = i1 < i2 ? `${i1}-${i2}` : `${i2}-${i1}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          const p1 = this.particles[i1].current;
          const p2 = this.particles[i2].current;
          const restLength = p1.distanceTo(p2);
          this.constraints.push({
            a: i1,
            b: i2,
            restLength,
            stiffness
          });
        }
      }

      pinShouldersAndCollar() {
        // Find top region vertices (shoulders and collar)
        // Get bounding box
        let minY = Infinity, maxY = -Infinity;
        for (let p of this.particles) {
          if (p.current.y < minY) minY = p.current.y;
          if (p.current.y > maxY) maxY = p.current.y;
        }
        
        const shoulderThreshold = maxY - 0.15; // Top 15% is shoulders
        
        // Also find center top for collar
        let centerX = 0, count = 0;
        for (let p of this.particles) {
          if (p.current.y > shoulderThreshold) {
            centerX += p.current.x;
            count++;
          }
        }
        centerX /= count;
        
        // Pin vertices in shoulder region
        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          if (p.current.y > shoulderThreshold) {
            // Shoulder area - partially pinned
            p.pinned = true;
            p.mass = 1000; // Very heavy
            
            // Store original position for these pinned vertices
            this.originalPositions[i*3] = p.current.x;
            this.originalPositions[i*3+1] = p.current.y;
            this.originalPositions[i*3+2] = p.current.z;
          }
        }
        
        console.log(`Pinned ${this.particles.filter(p => p.pinned).length} vertices at shoulders`);
      }

      simulate(deltaTime: number) {
        this.time += deltaTime;
        deltaTime = Math.min(deltaTime, 0.03); // Cap for stability
        
        // Verlet integration with forces
        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          if (p.pinned) {
            // Keep pinned vertices at original positions
            p.current.set(
              this.originalPositions[i*3],
              this.originalPositions[i*3+1],
              this.originalPositions[i*3+2]
            );
            p.previous.copy(p.current);
            continue;
          }
          
          // Calculate velocity
          const velocity = new THREE.Vector3().copy(p.current).sub(p.previous);
          
          // Save current position as previous
          p.previous.copy(p.current);
          
          // Apply gravity
          p.current.y += this.gravity * deltaTime * deltaTime * 5;
          
          // Apply dynamic wind
          const windX = Math.sin(this.time * this.windFrequency) * this.windStrength * deltaTime * 2;
          const windZ = Math.cos(this.time * this.windFrequency * 0.7) * this.windStrength * deltaTime * 2;
          p.current.x += windX;
          p.current.z += windZ;
          
          // Add some damping
          p.current.x += velocity.x * (this.damping - 1);
          p.current.z += velocity.z * (this.damping - 1);
        }

        // Solve constraints multiple times
        const iterations = 8; // More iterations for better stability
        
        for (let iter = 0; iter < iterations; iter++) {
          for (let c of this.constraints) {
            const p1 = this.particles[c.a];
            const p2 = this.particles[c.b];
            
            if (p1.pinned && p2.pinned) continue;
            
            const delta = this.tempVec.copy(p2.current).sub(p1.current);
            const dist = delta.length();
            if (dist === 0) continue;
            
            const correction = (c.restLength - dist) / dist * c.stiffness * 0.5;
            delta.multiplyScalar(correction);
            
            if (!p1.pinned && !p2.pinned) {
              // Both move
              p1.current.sub(delta);
              p2.current.add(delta);
            } else if (!p1.pinned) {
              // Only p1 moves
              p1.current.sub(delta.multiplyScalar(2));
            } else if (!p2.pinned) {
              // Only p2 moves
              p2.current.add(delta.multiplyScalar(2));
            }
          }
        }

        // Update mesh geometry
        const positions = this.mesh.geometry.attributes.position.array;
        for (let i = 0; i < this.particles.length; i++) {
          positions[i*3] = this.particles[i].current.x;
          positions[i*3+1] = this.particles[i].current.y;
          positions[i*3+2] = this.particles[i].current.z;
        }
        
        this.mesh.geometry.attributes.position.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
      }
    }

    loader.load(
      modelPath,
      (gltf) => {
        setDebug('Processing shirt for cloth simulation...');
        
        // Find the shirt mesh
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh && !shirtMesh) {
            shirtMesh = child;
            
            // Enhance material for better cloth appearance
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.roughness = 0.7;
                mat.metalness = 0.1;
              });
            } else if (child.material) {
              child.material.roughness = 0.7;
              child.material.metalness = 0.1;
            }
            
            // Center and scale the shirt appropriately
            const box = new THREE.Box3().setFromObject(child);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            
            // Scale to reasonable size
            const scale = 1.5 / size.y;
            child.scale.set(scale, scale, scale);
            
            // Position it
            child.position.set(0, 1.2, 0);
            
            // Setup shadows
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Clone geometry for simulation
            const geom = child.geometry.clone();
            child.geometry = geom;
            
            // Center the geometry locally
            geom.center();
            
            // Initialize simulator
            simulator = new PBDClothSimulator(child);
            
            scene.add(gltf.scene);
            setLoading(false);
            setDebug('Cloth simulation running on shirt');
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
        setError('Failed to load shirt model');
        console.error(err);
        setLoading(false);
      }
    );

    // Animation
    let clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (simulator) {
        simulator.simulate(delta);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

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
    backgroundColor: '#1a1a2e',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', height: '500px', position: 'relative' }} ref={containerRef} />
      {loading && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#ccc', background: 'rgba(0,0,0,0.6)', padding: '8px 15px', borderRadius: '20px' }}>
          {debug}
        </div>
      )}
      {error && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#ff6b6b', background: 'rgba(0,0,0,0.6)', padding: '8px 15px', borderRadius: '20px' }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
                                      }
