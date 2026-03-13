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
    controls.dampingFactor = 0.05;
    controls.autoRotate = false; // Disable auto-rotate
    controls.target.set(0, 1.2, 0);
    controls.enableZoom = true;
    controls.rotateSpeed = 0.5;

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

    // Add a second fill light from the back
    const backLight = new THREE.DirectionalLight(0x88aaff, 0.3);
    backLight.position.set(-1, 2, -3);
    scene.add(backLight);

    // Simple ground with grid helper for reference
    const gridHelper = new THREE.GridHelper(6, 20, 0x888888, 0x444444);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    const groundGeometry = new THREE.CircleGeometry(5, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a3a, roughness: 0.8, transparent: true, opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Load and setup the shirt
    const loader = new GLTFLoader();
    let allMeshes: THREE.Mesh[] = [];
    let simulator: any = null;

    // Simple cloth simulator with wind only (no control influence)
    class SimpleClothSimulator {
      meshes: THREE.Mesh[];
      particles: { 
        pos: THREE.Vector3; 
        originalPos: THREE.Vector3;
        velocity: THREE.Vector3;
        pinned: boolean;
        meshIndex: number;
        vertexIndex: number;
      }[] = [];
      constraints: { a: number; b: number; restLength: number }[] = [];
      tempVec = new THREE.Vector3();
      
      // Physics parameters - tuned for stability
      gravity = -2.5;
      damping = 0.95;
      windStrength = 0.2;
      windSpeed = 0.3;
      time = 0;
      stiffness = 0.5;

      constructor(meshes: THREE.Mesh[]) {
        this.meshes = meshes;
        
        // Initialize particles from all meshes
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
            
            // Transform to world position
            const worldPos = new THREE.Vector3(x, y, z).applyMatrix4(mesh.matrixWorld);
            
            this.particles.push({
              pos: worldPos.clone(),
              originalPos: worldPos.clone(),
              velocity: new THREE.Vector3(0, 0, 0),
              pinned: false,
              meshIndex,
              vertexIndex: i
            });
          }
        });
        
        console.log(`Initialized ${this.particles.length} particles`);
        
        // Create constraints between nearby vertices
        this.createConstraints();
        this.pinShoulders();
      }

      createConstraints() {
        const threshold = 0.25; // Connection distance
        
        for (let i = 0; i < this.particles.length; i++) {
          const p1 = this.particles[i];
          
          for (let j = i + 1; j < this.particles.length; j++) {
            const p2 = this.particles[j];
            
            const dist = p1.pos.distanceTo(p2.pos);
            
            if (dist < threshold) {
              this.constraints.push({
                a: i,
                b: j,
                restLength: dist
              });
            }
          }
        }
        
        console.log(`Created ${this.constraints.length} constraints`);
      }

      pinShoulders() {
        // Find top region
        let maxY = -Infinity;
        for (let p of this.particles) {
          if (p.pos.y > maxY) maxY = p.pos.y;
        }
        
        const shoulderY = maxY - 0.15;
        
        // Pin vertices in shoulder region
        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          if (p.pos.y > shoulderY) {
            p.pinned = true;
          }
        }
        
        console.log(`Pinned ${this.particles.filter(p => p.pinned).length} shoulder vertices`);
      }

      simulate(deltaTime: number) {
        this.time += deltaTime;
        deltaTime = Math.min(deltaTime, 0.016); // Cap at 60fps equivalent
        
        if (deltaTime < 0.001) return;

        // Apply forces and update positions
        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          if (p.pinned) {
            // Reset pinned vertices to original position
            p.pos.copy(p.originalPos);
            p.velocity.set(0, 0, 0);
            continue;
          }

          // Apply gravity
          p.velocity.y += this.gravity * deltaTime;
          
          // Apply gentle wind (varies with time and position)
          const windX = Math.sin(this.time * 0.5 + p.pos.z) * this.windStrength * deltaTime * 10;
          const windZ = Math.cos(this.time * 0.3 + p.pos.x) * this.windStrength * deltaTime * 10;
          
          p.velocity.x += windX;
          p.velocity.z += windZ;
          
          // Apply damping
          p.velocity.multiplyScalar(this.damping);
          
          // Update position
          p.pos.x += p.velocity.x * deltaTime * 30;
          p.pos.y += p.velocity.y * deltaTime * 30;
          p.pos.z += p.velocity.z * deltaTime * 30;
        }

        // Solve constraints (multiple times for stability)
        const iterations = 3;
        for (let iter = 0; iter < iterations; iter++) {
          for (let c of this.constraints) {
            const p1 = this.particles[c.a];
            const p2 = this.particles[c.b];
            
            if (p1.pinned && p2.pinned) continue;
            
            const delta = this.tempVec.copy(p2.pos).sub(p1.pos);
            const dist = delta.length();
            if (dist === 0) continue;
            
            const correction = (c.restLength - dist) / dist * this.stiffness * 0.3;
            delta.multiplyScalar(correction);
            
            if (!p1.pinned && !p2.pinned) {
              p1.pos.sub(delta);
              p2.pos.add(delta);
            } else if (!p1.pinned) {
              p1.pos.sub(delta.multiplyScalar(2));
            } else if (!p2.pinned) {
              p2.pos.add(delta.multiplyScalar(2));
            }
          }
        }

        // Update mesh geometries
        for (let mesh of this.meshes) {
          const positions = mesh.geometry.attributes.position.array;
          // Clear positions
          for (let i = 0; i < positions.length; i++) {
            positions[i] = 0;
          }
        }
        
        // Apply new positions
        for (let p of this.particles) {
          const mesh = this.meshes[p.meshIndex];
          const positions = mesh.geometry.attributes.position.array;
          
          // Transform world position back to local space
          const localPos = p.pos.clone();
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
        setDebug('Processing shirt...');
        
        // Collect ALL meshes and store their world matrices
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Update matrix world to ensure correct transforms
            child.updateWorldMatrix(true, true);
            
            // Enhance material
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.roughness = 0.8;
                mat.metalness = 0.0;
                mat.side = THREE.DoubleSide;
              });
            } else if (child.material) {
              child.material.roughness = 0.8;
              child.material.metalness = 0.0;
              child.material.side = THREE.DoubleSide;
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
        const scale = 1.8 / size.y;
        gltf.scene.scale.set(scale, scale, scale);
        
        // Center the whole group
        gltf.scene.position.set(-center.x * scale, 1.2 - center.y * scale, -center.z * scale);
        
        // Update matrices after transformations
        gltf.scene.updateWorldMatrix(true, true);
        
        scene.add(gltf.scene);
        
        // Initialize simulator
        simulator = new SimpleClothSimulator(allMeshes);
        
        setLoading(false);
        setDebug(`Cloth simulation active - Wind: ${simulator.windStrength}`);
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

    // Animation loop - completely separate from controls
    let clock = new THREE.Clock();
    let lastTime = performance.now() / 1000;

    const animate = () => {
      requestAnimationFrame(animate);

      const currentTime = performance.now() / 1000;
      const deltaTime = Math.min(currentTime - lastTime, 0.1); // Cap delta time
      lastTime = currentTime;

      // Run simulation independently
      if (simulator) {
        simulator.simulate(deltaTime);
      }

      // Update controls separately
      controls.update();
      
      // Render
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
    position: 'relative',
    width: '100%',
    height: '500px',
    backgroundColor: '#1a1a2e',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }} ref={containerRef} />
      {loading && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#ccc', background: 'rgba(0,0,0,0.6)', padding: '8px 15px', borderRadius: '20px', zIndex: 10 }}>
          {debug}
        </div>
      )}
      {error && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#ff6b6b', background: 'rgba(0,0,0,0.6)', padding: '8px 15px', borderRadius: '20px', zIndex: 10 }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
      }
