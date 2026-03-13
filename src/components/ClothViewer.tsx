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
    scene.background = new THREE.Color(0x2a2a3a);

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.2, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
    keyLight.position.set(2, 3, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.9);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.7);
    backLight.position.set(0, 2, -3);
    scene.add(backLight);

    // Ground
    const gridHelper = new THREE.GridHelper(6, 20, 0xaaaaaa, 0x666666);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Load model
    const loader = new GLTFLoader();
    let allMeshes: THREE.Mesh[] = [];
    let originalWorldPositions: Float32Array[] = [];
    let vertexMap: Map<string, { meshIndices: number[], vertexIndices: number[] }> = new Map();
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
        
        // Update matrices to get correct world positions
        shirtGroup.updateWorldMatrix(true, true);
        
        // First pass: collect ALL vertices in world space
        const tempVertices: { mesh: THREE.Mesh, meshIndex: number, vertexIndex: number, worldPos: THREE.Vector3 }[] = [];
        
        shirtGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const meshIndex = allMeshes.length;
            allMeshes.push(child);
            
            // Clone geometry
            const geom = child.geometry.clone();
            child.geometry = geom;
            
            // Get world matrix
            const matrix = child.matrixWorld;
            
            // Get positions
            const positions = geom.attributes.position.array;
            
            // Store original positions and collect vertices
            for (let i = 0; i < positions.length; i += 3) {
              const localPos = new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2]
              );
              
              // Convert to world space
              const worldPos = localPos.clone().applyMatrix4(matrix);
              
              tempVertices.push({
                mesh: child,
                meshIndex,
                vertexIndex: i / 3,
                worldPos
              });
            }
          }
        });
        
        // Group vertices by their world position (rounded to avoid floating point issues)
        tempVertices.forEach(item => {
          const key = `${item.worldPos.x.toFixed(4)},${item.worldPos.y.toFixed(4)},${item.worldPos.z.toFixed(4)}`;
          
          if (!vertexMap.has(key)) {
            vertexMap.set(key, { meshIndices: [], vertexIndices: [] });
          }
          const entry = vertexMap.get(key)!;
          entry.meshIndices.push(item.meshIndex);
          entry.vertexIndices.push(item.vertexIndex);
        });
        
        console.log(`Found ${vertexMap.size} unique vertex positions across ${allMeshes.length} meshes`);
        
        // Store original world positions for each mesh
        allMeshes.forEach((mesh, meshIndex) => {
          const geom = mesh.geometry;
          const positions = geom.attributes.position.array;
          const worldPositions = new Float32Array(positions.length);
          
          const matrix = mesh.matrixWorld;
          
          for (let i = 0; i < positions.length; i += 3) {
            const localPos = new THREE.Vector3(
              positions[i],
              positions[i + 1],
              positions[i + 2]
            );
            const worldPos = localPos.clone().applyMatrix4(matrix);
            worldPositions[i] = worldPos.x;
            worldPositions[i + 1] = worldPos.y;
            worldPositions[i + 2] = worldPos.z;
          }
          
          originalWorldPositions.push(worldPositions);
          
          // Enhance material
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => {
              mat.roughness = 0.4;
              mat.metalness = 0.0;
            });
          } else if (mesh.material) {
            mesh.material.roughness = 0.4;
            mesh.material.metalness = 0.0;
          }
          
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        });
        
        scene.add(shirtGroup);
        setLoading(false);
      },
      undefined,
      (err) => {
        console.error('Error loading model:', err);
        setError('Failed to load model');
        setLoading(false);
      }
    );

    // Animation loop with synchronized vertex movement
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.015;

      if (allMeshes.length > 0 && originalWorldPositions.length > 0 && vertexMap.size > 0) {
        // Create a map for new world positions
        const newWorldPositions = new Map<string, THREE.Vector3>();
        
        // Calculate movement for each UNIQUE vertex position
        vertexMap.forEach((value, key) => {
          // Parse the original world position from the key
          const [x, y, z] = key.split(',').map(Number);
          
          // Calculate height factor for this vertex
          const minY = 0.3; // Adjust based on your shirt
          const maxY = 2.1; // Adjust based on your shirt
          const heightFactor = Math.max(0, Math.min(1, (y - minY) / (maxY - minY)));
          
          // Apply SAME movement formula to this unique vertex
          const windStrength = 0.03;
          const windSpeed = 1.0;
          
          const moveX = Math.sin(time * windSpeed + y * 1.5) * windStrength * (1 - heightFactor * 0.7);
          const moveZ = Math.cos(time * windSpeed * 0.9 + x * 1.5) * windStrength * (1 - heightFactor * 0.7);
          const moveY = Math.sin(time * 1.2 + x * 2) * 0.008 * (1 - heightFactor);
          
          // Store new world position
          newWorldPositions.set(key, new THREE.Vector3(
            x + moveX,
            y + moveY,
            z + moveZ
          ));
        });
        
        // Apply the calculated movements to ALL meshes
        allMeshes.forEach((mesh, meshIndex) => {
          const origWorldPos = originalWorldPositions[meshIndex];
          if (!origWorldPos) return;
          
          const positions = mesh.geometry.attributes.position.array;
          const matrix = mesh.matrixWorld;
          const inverseMatrix = new THREE.Matrix4().copy(matrix).invert();
          
          // Process each vertex
          for (let i = 0; i < positions.length; i += 3) {
            const vertexIndex = i / 3;
            
            // Get original world position
            const worldX = origWorldPos[i];
            const worldY = origWorldPos[i + 1];
            const worldZ = origWorldPos[i + 2];
            
            // Find the key for this vertex
            const key = `${worldX.toFixed(4)},${worldY.toFixed(4)},${worldZ.toFixed(4)}`;
            
            // Get the new world position (all vertices with same key get SAME movement)
            const newWorldPos = newWorldPositions.get(key);
            
            if (newWorldPos) {
              // Convert back to local space
              const localPos = newWorldPos.clone().applyMatrix4(inverseMatrix);
              
              positions[i] = localPos.x;
              positions[i + 1] = localPos.y;
              positions[i + 2] = localPos.z;
            }
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
          Loading shirt with synchronized movement...
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
