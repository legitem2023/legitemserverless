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
    scene.background = new THREE.Color(0x111122);

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3, 2, 4);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.2, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(2, 5, 3);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    const d = 4;
    mainLight.shadow.camera.left = -d;
    mainLight.shadow.camera.right = d;
    mainLight.shadow.camera.top = d;
    mainLight.shadow.camera.bottom = -d;
    mainLight.shadow.camera.near = 2;
    mainLight.shadow.camera.far = 10;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffccaa, 0.5);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);

    // Simple ground plane for shadow reference
    const groundGeometry = new THREE.CircleGeometry(5, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.8, metalness: 0.2 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Load the shirt model (invisible, just for collision)
    const loader = new GLTFLoader();
    let shirtModel: THREE.Group | null = null;
    let clothMesh: THREE.Mesh | null = null;
    let clothSimulator: any = null;

    // Create cloth plane that will drape over the shirt
    const createCloth = () => {
      // Create a grid of vertices for cloth
      const widthSegments = 30;
      const heightSegments = 40;
      const clothWidth = 2.0;
      const clothHeight = 2.5;
      
      const geometry = new THREE.BufferGeometry();
      const vertices: number[] = [];
      const indices: number[] = [];
      const normals: number[] = [];
      const uvs: number[] = [];

      // Create vertices
      for (let i = 0; i <= heightSegments; i++) {
        const y = (i / heightSegments - 0.5) * clothHeight;
        for (let j = 0; j <= widthSegments; j++) {
          const x = (j / widthSegments - 0.5) * clothWidth;
          const z = 0;
          vertices.push(x, y + 1.5, z);
          uvs.push(j / widthSegments, i / heightSegments);
        }
      }

      // Create indices for triangles
      for (let i = 0; i < heightSegments; i++) {
        for (let j = 0; j < widthSegments; j++) {
          const a = i * (widthSegments + 1) + j;
          const b = i * (widthSegments + 1) + j + 1;
          const c = (i + 1) * (widthSegments + 1) + j;
          const d = (i + 1) * (widthSegments + 1) + j + 1;

          indices.push(a, b, c);
          indices.push(b, d, c);
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();

      // Cloth material
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.1,
        emissive: 0x000000,
        side: THREE.DoubleSide,
        flatShading: false
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    // Simple position-based cloth simulation
    class SimpleClothSimulator {
      mesh: THREE.Mesh;
      particles: { pos: THREE.Vector3; oldPos: THREE.Vector3; pinned: boolean }[] = [];
      constraints: { a: number; b: number; restDist: number }[] = [];
      gravity = new THREE.Vector3(0, -2.0, 0);
      wind = new THREE.Vector3(0.2, 0, 0.1);
      tempVec = new THREE.Vector3();

      constructor(mesh: THREE.Mesh) {
        this.mesh = mesh;
        this.initParticles();
        this.initConstraints();
      }

      initParticles() {
        const positions = this.mesh.geometry.attributes.position.array;
        const count = positions.length / 3;
        
        for (let i = 0; i < count; i++) {
          const x = positions[i*3];
          const y = positions[i*3+1];
          const z = positions[i*3+2];
          
          this.particles.push({
            pos: new THREE.Vector3(x, y, z),
            oldPos: new THREE.Vector3(x, y, z),
            pinned: y > 2.2 // Pin top edge (shoulders)
          });
        }
      }

      initConstraints() {
        const indices = this.mesh.geometry.index?.array;
        if (!indices) return;

        const edgeSet = new Set<string>();
        
        for (let i = 0; i < indices.length; i += 3) {
          const a = indices[i];
          const b = indices[i+1];
          const c = indices[i+2];
          
          this.addConstraint(a, b, edgeSet);
          this.addConstraint(b, c, edgeSet);
          this.addConstraint(c, a, edgeSet);
        }
      }

      addConstraint(i1: number, i2: number, edgeSet: Set<string>) {
        const key = i1 < i2 ? `${i1}-${i2}` : `${i2}-${i1}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          const p1 = this.particles[i1].pos;
          const p2 = this.particles[i2].pos;
          const restDist = p1.distanceTo(p2);
          this.constraints.push({ a: i1, b: i2, restDist });
        }
      }

      simulate(deltaTime: number) {
        deltaTime = Math.min(deltaTime, 0.03); // Stability
        
        // Verlet integration
        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          if (p.pinned) continue;
          
          const vel = new THREE.Vector3().copy(p.pos).sub(p.oldPos);
          p.oldPos.copy(p.pos);
          
          // Apply forces
          p.pos.add(vel);
          p.pos.x += this.wind.x * deltaTime * 2;
          p.pos.y += this.gravity.y * deltaTime * deltaTime * 5;
          p.pos.z += this.wind.z * deltaTime * 2;
        }

        // Solve constraints multiple times
        const iterations = 5;
        for (let iter = 0; iter < iterations; iter++) {
          for (let c of this.constraints) {
            const p1 = this.particles[c.a];
            const p2 = this.particles[c.b];
            
            if (p1.pinned && p2.pinned) continue;
            
            const delta = new THREE.Vector3().copy(p2.pos).sub(p1.pos);
            const dist = delta.length();
            if (dist === 0) continue;
            
            const correction = (c.restDist - dist) / dist * 0.5;
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

        // Update mesh geometry
        const positions = this.mesh.geometry.attributes.position.array;
        for (let i = 0; i < this.particles.length; i++) {
          positions[i*3] = this.particles[i].pos.x;
          positions[i*3+1] = this.particles[i].pos.y;
          positions[i*3+2] = this.particles[i].pos.z;
        }
        this.mesh.geometry.attributes.position.needsUpdate = true;
        this.mesh.geometry.computeVertexNormals();
      }
    }

    loader.load(
      modelPath,
      (gltf) => {
        setDebug('Loading shirt model...');
        
        // Get the shirt model
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            shirtModel = gltf.scene;
            
            // Make the original shirt semi-transparent and wireframe for reference
            child.material = new THREE.MeshStandardMaterial({
              color: 0x336699,
              transparent: true,
              opacity: 0.3,
              wireframe: true
            });
            child.castShadow = false;
            child.receiveShadow = false;
          }
        });

        if (shirtModel) {
          // Scale and position the shirt model
          shirtModel.scale.set(0.8, 0.8, 0.8);
          shirtModel.position.set(0, 0.8, 0);
          shirtModel.rotation.y = Math.PI;
          scene.add(shirtModel);
        }

        // Create cloth
        clothMesh = createCloth();
        scene.add(clothMesh);

        // Initialize simulator
        clothSimulator = new SimpleClothSimulator(clothMesh);
        
        setLoading(false);
        setDebug('Cloth simulation active');
      },
      (progress) => {
        if (progress.total) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setDebug(`Loading shirt: ${percent}%`);
        }
      },
      (err) => {
        setError('Failed to load shirt model');
        console.error(err);
        setLoading(false);
      }
    );

    // Animation loop
    let clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      if (clothSimulator) {
        clothSimulator.simulate(delta);
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
    backgroundColor: '#111122',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', height: '500px', position: 'relative' }} ref={containerRef} />
      {loading && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#ccc', background: 'rgba(0,0,0,0.5)', padding: '8px 15px', borderRadius: '20px' }}>
          {debug}
        </div>
      )}
      {error && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#ff6b6b', background: 'rgba(0,0,0,0.5)', padding: '8px 15px', borderRadius: '20px' }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
      }
