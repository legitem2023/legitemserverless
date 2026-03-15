'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ClothViewerProps {
  modelPath?: string;
  height?: number;
}

export default function ClothViewer({ 
  modelPath = '/white_t-shirt_with_print.glb',
  height = 500
}: ClothViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number>(0);
  const contextLostRef = useRef<boolean>(false);

  // Function to initialize or re-initialize the scene
  const initScene = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;

    // Clear container if needed
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1f2a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2.5, 1.8, 3.5);
    camera.lookAt(0, 1.2, 0);
    cameraRef.current = camera;

    // Renderer with context loss handling
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      powerPreference: "high-performance",
      preserveDrawingBuffer: true // Important for context loss
    });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Handle context loss
    renderer.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      console.log('WebGL context lost');
      contextLostRef.current = true;
    });

    renderer.domElement.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored');
      contextLostRef.current = false;
      // Re-initialize everything
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        setupScene();
      }
    });

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    setupScene();
  };

  const setupScene = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const scene = sceneRef.current;
    
    // Clear scene
    while(scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(3, 4, 3);
    mainLight.castShadow = true;
    mainLight.receiveShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffeedd, 0.5);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(0, 1, -3);
    scene.add(backLight);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        console.log('✅ Model loaded successfully');
        const model = gltf.scene;
        modelRef.current = model;
        
        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const scale = 2.2 / size.y;
        model.scale.set(scale, scale, scale);
        model.position.set(-center.x * scale, 1.2 - center.y * scale, -center.z * scale);
        
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('❌ Error loading model:', error);
        // Add a fallback cube
        const geometry = new THREE.BoxGeometry(1, 1.2, 0.3);
        const material = new THREE.MeshStandardMaterial({ color: 0xe3b34c, wireframe: true });
        const fallback = new THREE.Mesh(geometry, material);
        fallback.position.set(0, 1.2, 0);
        scene.add(fallback);
      }
    );
  };

  // Animation loop
  useEffect(() => {
    if (!containerRef.current) return;

    initScene();

    const animate = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current && !contextLostRef.current) {
        if (controlsRef.current) {
          controlsRef.current.update();
        }
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current || contextLostRef.current) return;
      
      const width = containerRef.current.clientWidth;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
    };
  }, [modelPath, height]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: `${height}px`,
        background: '#1a1f2a',
        position: 'relative'
      }} 
    />
  );
          }
