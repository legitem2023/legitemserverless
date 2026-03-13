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

    // Scene setup with better lighting for white shirt
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a3a); // Slightly lighter background

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3, 2, 4);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.2, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    // Enhanced lighting for white shirt
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Key light - warm
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
    keyLight.position.set(2, 3, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Fill light - cool
    const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.8);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);

    // Back light - rim lighting
    const backLight = new THREE.DirectionalLight(0xffffff, 0.6);
    backLight.position.set(0, 2, -3);
    scene.add(backLight);

    // Top light
    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 4, 1);
    scene.add(topLight);

    // Soft point lights for fill
    const pointLight1 = new THREE.PointLight(0xffaa88, 0.4);
    pointLight1.position.set(1, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x88aaff, 0.3);
    pointLight2.position.set(-1, 1, -1);
    scene.add(pointLight2);

    // Ground reference with better color
    const gridHelper = new THREE.GridHelper(6, 20, 0xaaaaaa, 0x666666);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    const groundGeometry = new THREE.CircleGeometry(4, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2a2a3a, 
      roughness: 0.7,
      metalness: 0.1,
      emissive: new THREE.Color(0x111122)
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Load model
    const loader = new GLTFLoader();
    let allMeshes: THREE.Mesh[] = [];
    let originalPositions: Float32Array[] = [];
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
            
            // ENHANCE MATERIAL FOR WHITE TSHIRT
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.roughness = 0.4; // Less rough for more light reflection
                mat.metalness = 0.0; // No metalness for fabric
                mat.emissive = new THREE.Color(0x000000);
                mat.emissiveIntensity = 0;
                mat.flatShading = false;
                mat.side = THREE.DoubleSide; // Show inside if visible
                
                // Preserve original texture if exists
                if (mat.map) {
                  mat.map.encoding = THREE.sRGBEncoding;
                  mat.map.needsUpdate = true;
                }
              });
            } else if (child.material) {
              child.material.roughness = 0.4;
              child.material.metalness = 0.0;
              child.material.emissive = new THREE.Color(0x000000);
              child.material.emissiveIntensity = 0;
              child.material.flatShading = false;
              child.material.side = THREE.DoubleSide;
              
              if (child.material.map) {
                child.material.map.encoding = THREE.sRGBEncoding;
                child.material.map.needsUpdate = true;
              }
            }
            
            child.castShadow = true;
            child.receiveShadow = true;
            allMeshes.push(child);
          }
        });
        
        scene.add(shirtGroup);
        setLoading(false);
        console.log(`Loaded ${allMeshes.length} meshes with enhanced white shirt materials`);
      },
      undefined,
      (err) => {
        console.error('Error loading model:', err);
        setError('Failed to load model');
        setLoading(false);
      }
    );

    // Animation loop with softer movement
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.015;

      if (allMeshes.length > 0 && originalPositions.length > 0) {
        allMeshes.forEach((mesh, meshIndex) => {
          const origPos = originalPositions[meshIndex];
          if (!origPos) return;
          
          const positions = mesh.geometry.attributes.position.array;
          
          // Get mesh bounds for height factor
          let minY = Infinity, maxY = -Infinity;
          for (let i = 1; i < origPos.length; i += 3) {
            minY = Math.min(minY, origPos[i]);
            maxY = Math.max(maxY, origPos[i]);
          }
          const heightRange = maxY - minY;
          
          // Apply gentler movement
          for (let i = 0; i < positions.length; i += 3) {
            const origX = origPos[i];
            const origY = origPos[i + 1];
            const origZ = origPos[i + 2];
            
            // Normalized height (0 at bottom, 1 at top)
            const heightFactor = (origY - minY) / heightRange;
            
            // Softer wind movement
            const windStrength = 0.04; // Reduced from 0.08
            const windSpeed = 1.0;
            
            // Gentler waves
            const moveX = Math.sin(time * windSpeed + origY * 1.5) * windStrength * (1 - heightFactor * 0.8);
            const moveZ = Math.cos(time * windSpeed * 0.9 + origX * 1.5) * windStrength * (1 - heightFactor * 0.8);
            const moveY = Math.sin(time * 1.2 + origX * 2) * 0.01 * (1 - heightFactor);
            
            positions[i] = origX + moveX;
            positions[i + 1] = origY + moveY;
            positions[i + 2] = origZ + moveZ;
          }
          
          mesh.geometry.attributes.position.needsUpdate = true;
          mesh.geometry.computeVertexNormals(); // Recalculate normals for proper lighting
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
          Loading white shirt with soft lighting...
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
