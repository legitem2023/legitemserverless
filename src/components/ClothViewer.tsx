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
    controls.autoRotateSpeed = 1.0;

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
    const gridHelper = new THREE.GridHelper(6, 20, 0x888888, 0x444444);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Load model
    const loader = new GLTFLoader();
    let shirtGroup: THREE.Group | null = null;
    let meshes: THREE.Mesh[] = [];
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
        
        // Collect all meshes and store original positions
        shirtGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Clone geometry to work with
            const geom = child.geometry.clone();
            child.geometry = geom;
            
            // Store original positions
            const positions = geom.attributes.position.array.slice();
            originalPositions.set(child, positions);
            
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
            meshes.push(child);
          }
        });
        
        scene.add(shirtGroup);
        setLoading(false);
        console.log(`Loaded ${meshes.length} meshes for softbody`);
      },
      undefined,
      (err) => {
        console.error('Error loading model:', err);
        setError('Failed to load model');
        setLoading(false);
      }
    );

    // Animation loop with simple softbody
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.02;

      if (meshes.length > 0 && originalPositions.size > 0) {
        // Simple softbody deformation
        meshes.forEach((mesh) => {
          const origPos = originalPositions.get(mesh);
          if (!origPos) return;
          
          const positions = mesh.geometry.attributes.position.array;
          
          // Apply gentle sine wave deformation
          for (let i = 0; i < positions.length; i += 3) {
            // Get original position
            const origX = origPos[i];
            const origY = origPos[i + 1];
            const origZ = origPos[i + 2];
            
            // Calculate deformation based on position and time
            const wave1 = Math.sin(time * 2 + origY * 3) * 0.02;
            const wave2 = Math.cos(time * 1.5 + origX * 2) * 0.02;
            const wave3 = Math.sin(time * 2.5 + origZ * 2) * 0.02;
            
            // Apply deformation (more at bottom, less at top)
            const heightFactor = (origY + 1) / 2; // 0 at bottom, 1 at top
            const deformAmount = (1 - heightFactor * 0.7) * 0.05; // More deformation at bottom
            
            positions[i] = origX + Math.sin(time * 2 + origY) * deformAmount;
            positions[i + 1] = origY + Math.cos(time * 1.5 + origX) * deformAmount * 0.5;
            positions[i + 2] = origZ + Math.sin(time * 2.5 + origZ) * deformAmount;
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
    <div style={{ position: 'relative', width: '100%', height: '500px', background: '#1a1a2e' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {loading && (
        <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#ccc', background: 'rgba(0,0,0,0.6)', padding: '8px 15px', borderRadius: '20px' }}>
          Loading shirt with softbody...
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
