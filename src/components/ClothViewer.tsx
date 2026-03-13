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
    let allMeshes: THREE.Mesh[] = [];
    let simulator: any = null;

    // Unified cloth simulator for all parts
    class UnifiedClothSimulator {
      meshes: THREE.Mesh[];
      allParticles: { 
        current: THREE.Vector3; 
        previous: THREE.Vector3;
        pinned: boolean;
        originalPos: THREE.Vector3;
        meshIndex: number;
        vertexIndex: number;
      }[] = [];
      constraints: { a: number; b: number; restLength: number; stiffness: number }[] = [];
      tempVec = new THREE.Vector3();
      
      // Physics parameters
      gravity = -3.0;
      damping = 0.98;
      windStrength = 0.3;
      windFrequency = 0.8;
      time = 0;

      constructor(meshes: THREE.Mesh[]) {
        this.meshes = meshes;
        
        // First, collect all vertices from all meshes
        let globalVertexIndex = 0;
        
        meshes.forEach((mesh, meshIndex) => {
          // Clone geometry for each mesh
          const geom = mesh.geometry.clone();
          mesh.geometry = geom;
          
          const positions = geom.attributes.position.array;
          const count = positions.length / 3;
          
          for (let i = 0; i < count; i++) {
            const x = positions[i*3];
            const y = positions[i*3+1];
            const z = positions[i*3+2];
            
            // Transform to world position (considering mesh transform)
            const worldPos = new THREE.Vector3(x, y, z).applyMatrix4(mesh.matrixWorld);
            
            this.allParticles.push({
              current: worldPos.clone(),
              previous: worldPos.clone(),
              originalPos: worldPos.clone(),
              pinned: false,
              meshIndex,
              vertexIndex: i
            });
            
            globalVertexIndex++;
          }
        });
        
        console.log(`Total particles: ${this.allParticles.length}`);
        
        // Now create constraints between nearby vertices (including across meshes)
        this.createAllConstraints();
        this.pinShouldersAndCollar();
      }

      createAllConstraints() {
        // Find vertices that are close to each other (including between different meshes)
        // This connects front, back, and shoulders
        const threshold = 0.15; // Distance threshold for connecting vertices
        
        for (let i = 0; i < this.allParticles.length; i++) {
          const p1 = this.allParticles[i];
          
          // Only check against vertices after i to avoid duplicates
          for (let j = i + 1; j < this.allParticles.length; j++) {
            const p2 = this.allParticles[j];
            
            // Calculate distance
            const dist = p1.current.distanceTo(p2.current);
            
            // If vertices are close enough, create a constraint
            if (dist < threshold) {
              // Different stiffness based on whether it's within same mesh or across meshes
              const stiffness = (p1.meshIndex === p2.meshIndex) ? 0.9 : 0.7;
              
              this.constraints.push({
                a: i,
                b: j,
                restLength: dist,
                stiffness
              });
            }
          }
        }
        
        console.log(`Created ${this.constraints.length} constraints connecting all parts`);
      }

      pinShouldersAndCollar() {
        // Find the highest points (shoulders)
        let maxY = -Infinity;
        for (let p of this.allParticles) {
          if (p.current.y > maxY) maxY = p.current.y;
        }
        
        const shoulderThreshold = maxY - 0.2;
        
        // Also find center X to identify collar area
        let centerX = 0;
        let count = 0;
        for (let p of this.allParticles) {
          if (p.current.y > shoulderThreshold) {
            centerX += p.current.x;
            count++;
          }
        }
        centerX /= count;
        
        // Pin shoulder vertices
        for (let i = 0; i < this.allParticles.length; i++) {
          const p = this.allParticles[i];
          
          // Pin if in top region (shoulders and collar)
          if (p.current.y > shoulderThreshold) {
            p.pinned = true;
            
            // Update the actual mesh vertex to maintain position
            const mesh = this.meshes[p.meshIndex];
            const positions = mesh.geometry.attributes.position.array;
            const localPos = p.originalPos.clone();
            
            // Transform back to local space
            const worldToLocal = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
            localPos.applyMatrix4(worldToLocal);
            
            positions[p.vertexIndex * 3] = localPos.x;
            positions[p.vertexIndex * 3 + 1] = localPos.y;
            positions[p.vertexIndex * 3 + 2] = localPos.z;
          }
        }
        
        console.log(`Pinned ${this.allParticles.filter(p => p.pinned).length} vertices at shoulders`);
      }

      simulate(deltaTime: number) {
        this.time += deltaTime;
        deltaTime = Math.min(deltaTime, 0.03);
        
        // Verlet integration
        for (let i = 0; i < this.allParticles.length; i++) {
          const p = this.allParticles[i];
          if (p.pinned) continue;
          
          // Calculate velocity
          const velocity = new THREE.Vector3().copy(p.current).sub(p.previous);
          
          // Save current as previous
          p.previous.copy(p.current);
          
          // Apply gravity
          p.current.y += this.gravity * deltaTime * deltaTime * 4;
          
          // Apply dynamic wind (varies with height)
          const windFactor = 1 - (p.current.y / 3); // More wind at bottom
          const windX = Math.sin(this.time * this.windFrequency + p.current.z) * this.windStrength * deltaTime * 3 * windFactor;
          const windZ = Math.cos(this.time * this.windFrequency * 0.5 + p.current.x) * this.windStrength * deltaTime * 3 * windFactor;
          
          p.current.x += windX;
          p.current.z += windZ;
          
          // Apply damping
          p.current.x += velocity.x * (this.damping - 1);
          p.current.z += velocity.z * (this.damping - 1);
          p.current.y += velocity.y * (this.damping - 1) * 0.5;
        }

        // Solve constraints multiple times
        const iterations = 10;
        
        for (let iter = 0; iter < iterations; iter++) {
          for (let c of this.constraints) {
            const p1 = this.allParticles[c.a];
            const p2 = this.allParticles[c.b];
            
            if (p1.pinned && p2.pinned) continue;
            
            const delta = this.tempVec.copy(p2.current).sub(p1.current);
            const dist = delta.length();
            if (dist === 0) continue;
            
            const correction = (c.restLength - dist) / dist * c.stiffness * 0.5;
            delta.multiplyScalar(correction);
            
            if (!p1.pinned && !p2.pinned) {
              p1.current.sub(delta);
              p2.current.add(delta);
            } else if (!p1.pinned) {
              p1.current.sub(delta.multiplyScalar(2));
            } else if (!p2.pinned) {
              p2.current.add(delta.multiplyScalar(2));
            }
          }
        }

        // Update all meshes with new vertex positions
        for (let mesh of this.meshes) {
          const positions = mesh.geometry.attributes.position.array;
          // Reset positions to zero before applying updates
          for (let i = 0; i < positions.length; i++) {
            positions[i] = 0;
          }
        }
        
        // Apply updated positions to each mesh
        for (let p of this.allParticles) {
          const mesh = this.meshes[p.meshIndex];
          const positions = mesh.geometry.attributes.position.array;
          
          // Transform world position back to local space
          const localPos = p.current.clone();
          const worldToLocal = new THREE.Matrix4().copy(mesh.matrixWorld).invert();
          localPos.applyMatrix4(worldToLocal);
          
          positions[p.vertexIndex * 3] = localPos.x;
          positions[p.vertexIndex * 3 + 1] = localPos.y;
          positions[p.vertexIndex * 3 + 2] = localPos.z;
        }
        
        // Update all meshes
        for (let mesh of this.meshes) {
          mesh.geometry.attributes.position.needsUpdate = true;
          mesh.geometry.computeVertexNormals();
        }
      }
    }

    loader.load(
      modelPath,
      (gltf) => {
        setDebug('Processing all shirt parts...');
        
        // Collect ALL meshes
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Enhance material
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.roughness = 0.7;
                mat.metalness = 0.1;
              });
            } else if (child.material) {
              child.material.roughness = 0.7;
              child.material.metalness = 0.1;
            }
            
            child.castShadow = true;
            child.receiveShadow = true;
            
            allMeshes.push(child);
          }
        });

        if (allMeshes.length === 0) {
          setError('No meshes found in model');
          return;
        }

        // Scale and position the entire group
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Scale to reasonable size
        const scale = 1.5 / size.y;
        gltf.scene.scale.set(scale, scale, scale);
        
        // Center the whole group
        gltf.scene.position.set(-center.x * scale, 1.2 - center.y * scale, -center.z * scale);
        
        scene.add(gltf.scene);
        
        // Initialize unified simulator with ALL meshes
        simulator = new UnifiedClothSimulator(allMeshes);
        
        setLoading(false);
        setDebug(`Cloth simulation active on ${allMeshes.length} connected parts`);
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
