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
    let allMeshes: THREE.Mesh[] = [];
    let originalPositions: Float32Array[] = [];
    let meshOffsets: { x: number; y: number; z: number }[] = [];
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
        
        // Process all meshes and store their world positions
        shirtGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Clone geometry
            const geom = child.geometry.clone();
            child.geometry = geom;
            
            // Convert vertices to world space and store
            const positions = geom.attributes.position.array;
            const worldPositions = new Float32Array(positions.length);
            
            // Get mesh's world matrix
            child.updateWorldMatrix(true, false);
            const matrix = child.matrixWorld;
            
            // Transform each vertex to world space
            for (let i = 0; i < positions.length; i += 3) {
              const vertex = new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2]
              );
              vertex.applyMatrix4(matrix);
              worldPositions[i] = vertex.x;
              worldPositions[i + 1] = vertex.y;
              worldPositions[i + 2] = vertex.z;
            }
            
            originalPositions.push(worldPositions);
            
            // Store mesh offset from group center
            meshOffsets.push({
              x: child.position.x,
              y: child.position.y,
              z: child.position.z
            });
            
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
        
        scene.add(shirtGroup);
        setLoading(false);
        console.log(`Loaded ${allMeshes.length} meshes with unified softbody`);
      },
      undefined,
      (err) => {
        console.error('Error loading model:', err);
        setError('Failed to load model');
        setLoading(false);
      }
    );

    // Animation loop with unified softbody
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.02;

      if (allMeshes.length > 0 && originalPositions.length > 0) {
        // Apply SAME deformation to ALL meshes based on world position
        allMeshes.forEach((mesh, meshIndex) => {
          const origWorldPos = originalPositions[meshIndex];
          if (!origWorldPos) return;
          
          const positions = mesh.geometry.attributes.position.array;
          
          // Get mesh's current transform
          const matrix = mesh.matrixWorld;
          const inverseMatrix = new THREE.Matrix4().copy(matrix).invert();
          
          // Process each vertex
          for (let i = 0; i < positions.length; i += 3) {
            // Get original WORLD position
            const worldX = origWorldPos[i];
            const worldY = origWorldPos[i + 1];
            const worldZ = origWorldPos[i + 2];
            
            // Calculate height factor (0 at bottom, 1 at top of whole shirt)
            const heightFactor = (worldY - 0.5) / 1.5; // Adjust based on your shirt's height
            
            // Apply SAME wind formula to ALL vertices based on world position
            const windX = Math.sin(time * 1.2 + worldY * 2) * 0.08;
            const windZ = Math.cos(time * 1.0 + worldX * 2) * 0.08;
            const flutter = Math.sin(time * 2.5 + worldZ * 3) * 0.04;
            
            // More movement at bottom
            const bottomFactor = Math.max(0, 1 - heightFactor * 1.2);
            
            // Combined movement (SAME for all meshes at same world position)
            const moveX = windX * bottomFactor;
            const moveY = Math.sin(time * 1.5 + worldX) * 0.02 * bottomFactor;
            const moveZ = (windZ + flutter) * bottomFactor;
            
            // Create new world position
            const newWorldPos = new THREE.Vector3(
              worldX + moveX,
              worldY + moveY,
              worldZ + moveZ
            );
            
            // Convert back to local space
            newWorldPos.applyMatrix4(inverseMatrix);
            
            // Apply to geometry
            positions[i] = newWorldPos.x;
            positions[i + 1] = newWorldPos.y;
            positions[i + 2] = newWorldPos.z;
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
          Loading unified softbody shirt...
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
