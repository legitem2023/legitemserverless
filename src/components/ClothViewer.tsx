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
    scene.background = new THREE.Color(0x000000);

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3, 2, 4);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.2, 0);
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.8;

    // Simple lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 3, 3);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xfff0e6, 0.6);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);

    // Simple ground
    const gridHelper = new THREE.GridHelper(6, 20, 0x888888, 0x444444);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Load model
    const loader = new GLTFLoader();
    let meshes: THREE.Mesh[] = [];
    let phase = 0;

    loader.load(
      modelPath,
      (gltf) => {
        const shirtGroup = gltf.scene;
        
        // Center and scale
        const box = new THREE.Box3().setFromObject(shirtGroup);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const scale = 1.8 / size.y;
        shirtGroup.scale.set(scale, scale, scale);
        shirtGroup.position.set(-center.x * scale, 1.2 - center.y * scale, -center.z * scale);
        
        // Collect meshes and prepare materials
        shirtGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Clone geometry
            const geom = child.geometry.clone();
            child.geometry = geom;
            
            // Simple material settings
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.roughness = 0.5;
                mat.metalness = 0.0;
              });
            } else if (child.material) {
              child.material.roughness = 0.5;
              child.material.metalness = 0.0;
            }
            
            meshes.push(child);
          }
        });
        
        scene.add(shirtGroup);
        setLoading(false);
        console.log(`Loaded ${meshes.length} meshes`);
      },
      undefined,
      (err) => {
        console.error('Error loading model:', err);
        setError('Failed to load model');
        setLoading(false);
      }
    );

    // Gentle animation - SUBTLE movement
    const animate = () => {
      requestAnimationFrame(animate);
      
      phase += 0.01; // Slower phase change

      if (meshes.length > 0) {
        meshes.forEach((mesh) => {
          const positions = mesh.geometry.attributes.position.array;
          
          // Store original positions if not already stored
          if (!mesh.userData.originalPositions) {
            mesh.userData.originalPositions = positions.slice();
          }
          
          const originalPos = mesh.userData.originalPositions;
          
          // Very subtle movement
          for (let i = 0; i < positions.length; i += 3) {
            const origX = originalPos[i];
            const origY = originalPos[i + 1];
            const origZ = originalPos[i + 2];
            
            // Height factor (0 at bottom, 1 at top)
            const heightFactor = (origY + 0.8) / 2.2; // Adjust based on your shirt
            
            // TINY movements - max 0.01 units (about 1% of shirt size)
            const windX = Math.sin(phase * 1.5 + origY * 2) * 0.004 * heightFactor;
            const windZ = Math.cos(phase * 1.3 + origX * 2) * 0.004 * heightFactor;
            const windY = Math.sin(phase * 2 + origX) * 0.002 * heightFactor;
            
            positions[i] = origX + windX;
            positions[i + 1] = origY + windY;
            positions[i + 2] = origZ + windZ;
          }
          
          mesh.geometry.attributes.position.needsUpdate = true;
          mesh.geometry.computeVertexNormals();
        });
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
    <div style={{ position: 'relative', width: '100%', height: '500px', background: '#2a2a3a' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {loading && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '8px 15px', borderRadius: '20px' }}>
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
