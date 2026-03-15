'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ClothViewerProps {
  modelPath?: string;
  height?: number;
  backgroundColor?: THREE.ColorRepresentation;
  autoRotate?: boolean;
}

interface LoaderState {
  loading: boolean;
  error: string | null;
  progress: number;
}

export default function ClothViewer({ 
  modelPath = '/white_t-shirt_with_print.glb',
  height = 500,
  backgroundColor = 0x000000,
  autoRotate = false
}: ClothViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  
  const [loaderState, setLoaderState] = useState<LoaderState>({
    loading: true,
    error: null,
    progress: 0
  });

  // Memoized scene setup
  const initializeScene = useCallback((): boolean => {
    if (!containerRef.current) return false;

    const container = containerRef.current;
    const width = container.clientWidth;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(3, 2, 4);
    camera.lookAt(0, 1.2, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      powerPreference: "high-performance",
      alpha: false,
      depth: true,
      stencil: false
    });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputEncoding = THREE.sRGBEncoding;
    rendererRef.current = renderer;
    
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.2, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.maxPolarAngle = Math.PI / 2; // Prevent going under ground
    controlsRef.current = controls;

    return true;
  }, [backgroundColor, height, autoRotate]);

  // Memoized lighting setup
  const setupLights = useCallback((scene: THREE.Scene): void => {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Main directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 3, 3);
    mainLight.castShadow = false;
    scene.add(mainLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xfff0e6, 0.6);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);

    // Optional rim light for better edge definition
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
    rimLight.position.set(-1, 2, -3);
    scene.add(rimLight);
  }, []);

  // Memoized ground helper
  const setupGround = useCallback((scene: THREE.Scene): void => {
    const gridHelper = new THREE.GridHelper(6, 20, 0x888888, 0x444444);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Add subtle ambient occlusion plane
    const groundPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshStandardMaterial({ 
        color: 0x1a1a2a, 
        emissive: 0x0a0a14,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      })
    );
    groundPlane.rotation.x = -Math.PI / 2;
    groundPlane.position.y = 0.01;
    scene.add(groundPlane);
  }, []);

  // Memoized model loading
  const loadModel = useCallback((scene: THREE.Scene): void => {
    const loader = new GLTFLoader();
    
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        
        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const scale = 1.8 / size.y;
        model.scale.set(scale, scale, scale);
        
        // Position model
        model.position.set(
          -center.x * scale,
          1.2 - center.y * scale,
          -center.z * scale
        );
        
        // Optimize materials and geometries
        model.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            // Optimize geometry
            if (child.geometry.attributes.normal) {
              child.geometry.attributes.normal = child.geometry.attributes.normal.clone();
            }
            
            // Optimize material
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                if (mat instanceof THREE.Material) {
                  mat.roughness = 0.5;
                  mat.metalness = 0.0;
                  mat.emissive = new THREE.Color(0x000000);
                  mat.needsUpdate = true;
                }
              });
            } else if (child.material instanceof THREE.Material) {
              child.material.roughness = 0.5;
              child.material.metalness = 0.0;
              child.material.emissive = new THREE.Color(0x000000);
              child.material.needsUpdate = true;
            }
            
            // Enable frustum culling
            child.frustumCulled = true;
          }
        });
        
        scene.add(model);
        modelRef.current = model;
        
        setLoaderState({
          loading: false,
          error: null,
          progress: 100
        });
      },
      (progress) => {
        const percentComplete = (progress.loaded / progress.total) * 100;
        setLoaderState(prev => ({
          ...prev,
          progress: percentComplete
        }));
      },
      (error) => {
        console.error('Error loading model:', error);
        setLoaderState({
          loading: false,
          error: 'Failed to load model',
          progress: 0
        });
      }
    );
  }, [modelPath]);

  // Animation loop
  useEffect(() => {
    if (!containerRef.current) return;

    const initialized = initializeScene();
    if (!initialized) return;

    const scene = sceneRef.current!;
    const camera = cameraRef.current!;
    const renderer = rendererRef.current!;
    const controls = controlsRef.current!;

    setupLights(scene);
    setupGround(scene);
    loadModel(scene);

    // Animation function
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = height;
      
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      // Clean up geometries and materials
      if (sceneRef.current) {
        sceneRef.current.traverse((object: THREE.Object3D) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else if (object.material instanceof THREE.Material) {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [initializeScene, setupLights, setupGround, loadModel, height]);

  // Memoized loader display
  const loaderDisplay = useMemo(() => {
    if (!loaderState.loading && !loaderState.error) return null;
    
    return (
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        color: '#fff',
        background: 'rgba(0,0,0,0.6)',
        padding: '8px 15px',
        borderRadius: '20px',
        backdropFilter: 'blur(4px)',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 10
      }}>
        {loaderState.loading && (
          <>
            <span style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <span>
              {loaderState.progress > 0 
                ? `Loading... ${Math.round(loaderState.progress)}%` 
                : 'Loading shirt...'}
            </span>
            <style jsx>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </>
        )}
        {loaderState.error && (
          <span style={{ color: '#ff6b6b' }}>
            ⚠️ {loaderState.error}
          </span>
        )}
      </div>
    );
  }, [loaderState]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: `${height}px`, 
      background: '#2a2a3a',
      overflow: 'hidden'
    }}>
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          touchAction: 'none' // Prevent touch scrolling while interacting
        }} 
      />
      {loaderDisplay}
    </div>
  );
}
