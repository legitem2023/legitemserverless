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
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean setup - only what's needed
    const container = containerRef.current;
    const width = container.clientWidth;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a3a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2, 1.5, 3);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // Renderer - minimal config
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls - essential only
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Lights - minimal but effective
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 3, 3);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-2, 1, -2);
    scene.add(backLight);

    // Load model
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        
        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const scale = 2.0 / size.y;
        model.scale.set(scale, scale, scale);
        model.position.set(-center.x * scale, 1 - center.y * scale, -center.z * scale);
        
        scene.add(model);
      },
      undefined,
      (error) => console.error('Error loading model:', error)
    );

    // Animation
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const newWidth = containerRef.current.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
      
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
      
      controls.dispose();
    };
  }, [modelPath, height]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: `${height}px`,
        background: '#2a2a3a'
      }} 
    />
  );
}
