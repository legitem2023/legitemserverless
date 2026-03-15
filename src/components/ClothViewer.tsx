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
  
  // Store references for cleanup
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const meshesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a3a);
    sceneRef.current = scene;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3, 2, 4);
    camera.lookAt(0, 1.2, 0);
    cameraRef.current = camera;

    // Create renderer with context loss handling
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      powerPreference: "high-performance",
      preserveDrawingBuffer: true, // Helps with context loss
      alpha: false
    });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    // Handle context loss
    renderer.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      console.log('WebGL context lost, attempting to recover...');
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }, false);

    renderer.domElement.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored');
      // Re-setup scene on context restore
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        setupSceneAfterRestore();
      }
    }, false);

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.2, 0);
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

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
    meshesRef.current = [];

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
                mat.needsUpdate = true; // Force material update
              });
            } else if (child.material) {
              child.material.roughness = 0.5;
              child.material.metalness = 0.0;
              child.material.needsUpdate = true; // Force material update
            }
            
            meshesRef.current.push(child);
          }
        });
        
        scene.add(shirtGroup);
        setLoading(false);
        console.log(`Loaded ${meshesRef.current.length} meshes`);
      },
      undefined,
      (err) => {
        console.error('Error loading model:', err);
        setError('Failed to load model');
        setLoading(false);
      }
    );

    // Helper function for context restore
    const setupSceneAfterRestore = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Re-add all objects to scene if needed
      // The scene should still have its objects, but we might need to re-upload textures
      meshesRef.current.forEach(mesh => {
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => {
              // Check if material has a map property (like MeshStandardMaterial)
              if ('map' in mat && mat.map) {
                mat.map.needsUpdate = true;
              }
              mat.needsUpdate = true;
            });
          } else {
            // Check if material has a map property (like MeshStandardMaterial)
            if ('map' in mesh.material && mesh.material.map) {
              mesh.material.map.needsUpdate = true;
            }
            mesh.material.needsUpdate = true;
          }
        }
      });
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      // Check if context is still valid
      const gl = rendererRef.current.getContext();
      if (gl && gl.isContextLost()) {
        // If context is lost, just request next frame and skip rendering
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      try {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      } catch (e) {
        console.error('Render error:', e);
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = 500;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      
      // Dispose controls
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      
      // Dispose geometries and materials
      meshesRef.current.forEach(mesh => {
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => mat.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
      meshesRef.current = [];
      
      // Dispose renderer and remove DOM element
      if (rendererRef.current) {
        const domElement = rendererRef.current.domElement;
        if (domElement && domElement.parentNode) {
          domElement.parentNode.removeChild(domElement);
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      
      // Clear references
      sceneRef.current = null;
      cameraRef.current = null;
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
