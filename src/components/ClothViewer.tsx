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
    controls.target.set(0, 1.2, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

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

    // Ground reference
    const gridHelper = new THREE.GridHelper(6, 20, 0x888888, 0x444444);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Load model
    const loader = new GLTFLoader();
    let shirtGroup: THREE.Group | null = null;
    let originalPositions: Map<THREE.Mesh, Float32Array> = new Map();
    let time = 0;

    loader.load(
      modelPath,
      (gltf) => {
        shirtGroup = gltf.scene;
        
        // Center and scale
        const box = new THREE.Box3().setFromObject(shirtGroup);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const scale = 1.8 / size.y;
        shirtGroup.scale.set(scale, scale, scale);
        shirtGroup.position.set(-center.x * scale, 1.2 - center.y * scale, -center.z * scale);
        
        // Store original positions for all meshes
        shirtGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Clone geometry
            const geom = child.geometry.clone();
            child.geometry = geom;
            
            // Store original positions
            const positions = geom.attributes.position.array.slice();
            originalPositions.set(child, positions);
            
            // Enhance material
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.roughness = 0.8;
                mat.metalness = 0.0;
              });
            } else if (child.material) {
              child.material.roughness = 0.8;
              child.material.metalness = 0.0;
            }
            
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        scene.add(shirtGroup);
        setLoading(false);
        console.log(`Loaded shirt with ${originalPositions.size} meshes`);
      },
      undefined,
      (err) => {
        console.error('Error loading model:', err);
        setError('Failed to load model');
        setLoading(false);
      }
    );

    // Animation loop with RIGID swaying (keeps parts attached)
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.02;

      if (shirtGroup && originalPositions.size > 0) {
        // Apply a gentle rotation to the ENTIRE shirt
        // This keeps all parts perfectly attached
        const swayX = Math.sin(time * 0.8) * 0.05; // 5 degree sway
        const swayZ = Math.cos(time * 0.6) * 0.03; // 3 degree sway
        
        // Instead of moving vertices, rotate the whole group slightly
        shirtGroup.rotation.x = swayX;
        shirtGroup.rotation.z = swayZ;
        
        // Add a tiny bit of squash and stretch (still as a whole)
        const squash = 1 + Math.sin(time * 1.5) * 0.01;
        shirtGroup.scale.y = 1.8 / 1.5 * squash; // Maintain base scale
        shirtGroup.scale.x = 1.8 / 1.5 * (2 - squash); // Compensate width
        
        // Keep the group centered
        shirtGroup.position.y = 1.2 + Math.sin(time * 1.2) * 0.02;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();

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

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', background: '#1a1a2e' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {loading && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#ccc', background: 'rgba(0,0,0,0.6)', padding: '8px 15px', borderRadius: '20px' }}>
          Loading shirt...
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
