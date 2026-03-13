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
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Minimal scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 1.5, 3);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    // Simple lighting
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(1, 2, 1);
    scene.add(dirLight);

    // Load model WITHOUT any physics
    const loader = new GLTFLoader();
    
    loader.load(
      modelPath,
      (gltf) => {
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const scale = 2.0 / Math.max(size.x, size.y, size.z);
        gltf.scene.scale.set(scale, scale, scale);
        gltf.scene.position.set(-center.x * scale, 1.0 - center.y * scale, -center.z * scale);
        
        // Enhance materials
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (Array.isArray(child.material)) {
              child.material.forEach(m => {
                m.roughness = 0.6;
                m.metalness = 0.1;
              });
            } else if (child.material) {
              child.material.roughness = 0.6;
              child.material.metalness = 0.1;
            }
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        scene.add(gltf.scene);
        setLoading(false);
      },
      (progress) => {
        // Progress callback
      },
      (error) => {
        console.error('Error loading model:', error);
        setError('Failed to load model');
        setLoading(false);
      }
    );

    // Simple animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Just rotate the model slightly for demonstration
      // No physics to prevent crashing
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
    <div style={{ position: 'relative', width: '100%', height: '500px', background: '#111122' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {loading && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, color: 'white', background: 'rgba(0,0,0,0.5)', padding: '8px 15px', borderRadius: '20px' }}>
          Loading shirt...
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
