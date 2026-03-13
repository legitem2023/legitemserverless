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
    let meshes: THREE.Mesh[] = [];
    let originalPositions: Float32Array[] = [];
    let boundingBoxes: THREE.Box3[] = [];
    let time = 0;

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
        
        // Process all meshes
        shirtGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Clone geometry
            const geom = child.geometry.clone();
            child.geometry = geom;
            
            // Store original positions
            const positions = geom.attributes.position.array.slice();
            originalPositions.push(positions);
            
            // Store bounding box for this mesh
            const meshBox = new THREE.Box3().setFromObject(child);
            boundingBoxes.push(meshBox);
            
            // Enhance material
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.roughness = 0.7;
                mat.metalness = 0.1;
                mat.emissive = new THREE.Color(0x111122);
              });
            } else if (child.material) {
              child.material.roughness = 0.7;
              child.material.metalness = 0.1;
              child.material.emissive = new THREE.Color(0x111122);
            }
            
            child.castShadow = true;
            child.receiveShadow = true;
            meshes.push(child);
          }
        });
        
        scene.add(shirtGroup);
        setLoading(false);
        console.log(`Loaded ${meshes.length} meshes for wind animation`);
      },
      undefined,
      (err) => {
        console.error('Error loading model:', err);
        setError('Failed to load model');
        setLoading(false);
      }
    );

    // Animation loop with visible wind effect
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.03; // Slower time progression

      if (meshes.length > 0 && originalPositions.length > 0) {
        meshes.forEach((mesh, meshIndex) => {
          const origPos = originalPositions[meshIndex];
          if (!origPos) return;
          
          const positions = mesh.geometry.attributes.position.array;
          const meshBox = boundingBoxes[meshIndex];
          
          if (!meshBox) return;
          
          // Get mesh bounds
          const meshMinY = meshBox.min.y;
          const meshMaxY = meshBox.max.y;
          const meshHeight = meshMaxY - meshMinY;
          
          // Apply wind-like deformation to each vertex
          for (let i = 0; i < positions.length; i += 3) {
            const origX = origPos[i];
            const origY = origPos[i + 1];
            const origZ = origPos[i + 2];
            
            // Calculate normalized height (0 at bottom, 1 at top)
            const normalizedY = (origY - meshMinY) / meshHeight;
            
            // Wind parameters - adjusted for visibility
            const windSpeed = 1.5;
            const windStrength = 0.15; // 15% movement
            
            // Primary wind direction (diagonal)
            const windDirX = Math.sin(time * windSpeed + origY * 2) * windStrength;
            const windDirZ = Math.cos(time * windSpeed * 0.8 + origX * 2) * windStrength;
            
            // Secondary flutter
            const flutterX = Math.sin(time * 3 + origZ * 3) * 0.08;
            const flutterZ = Math.cos(time * 2.5 + origX * 3) * 0.08;
            
            // More movement at bottom, less at top
            const heightFactor = Math.max(0, 1 - normalizedY * 1.5); // Top stays more stable
            
            // Combine movements
            const moveX = (windDirX + flutterX) * heightFactor;
            const moveY = Math.sin(time * 2 + origX) * 0.03 * (1 - normalizedY); // Slight vertical bounce
            const moveZ = (windDirZ + flutterZ) * heightFactor;
            
            // Apply movement
            positions[i] = origX + moveX;
            positions[i + 1] = origY + moveY;
            positions[i + 2] = origZ + moveZ;
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
          Loading shirt with wind effect...
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
