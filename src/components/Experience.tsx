
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GestureType } from '../types';
import { ShapeService } from '../services/shapeService';
import { GestureService } from '../services/gestureService';
import { PARTICLE_COUNT, LERP_FACTOR, NOISE_STRENGTH } from '../constants';

interface ExperienceProps {
  onGestureDetected: (gesture: GestureType) => void;
}

const Experience: React.FC<ExperienceProps> = ({ onGestureDetected }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Shared vector for performance
  const _vector = new THREE.Vector3();

  const sceneRef = useRef<{
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    particles: THREE.Points,
    targetPositions: Float32Array,
    currentGesture: GestureType,
    handOffset: THREE.Vector3,
    handLandmarker: any,
    gestureChangeTime: number
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    
    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    
    const material = new THREE.PointsMaterial({
      size: 0.5,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const targetPositions = ShapeService.generatePoints(GestureType.NONE, PARTICLE_COUNT);
    const handOffset = new THREE.Vector3(0, 0, 0);

    sceneRef.current = {
      scene, camera, renderer, particles, targetPositions,
      currentGesture: GestureType.NONE,
      handOffset,
      handLandmarker: null,
      gestureChangeTime: performance.now()
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    const loadMediaPipe = async () => {
      try {
        const { HandLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        if (sceneRef.current) sceneRef.current.handLandmarker = handLandmarker;
      } catch (err) {
        console.error("Failed to load MediaPipe:", err);
      }
    };
    loadMediaPipe();

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => videoRef.current?.play();
          }
        }).catch(err => console.error("Camera access denied:", err));
    }

    let lastTime = 0;
    let gestureDebounce = 0;
    let pendingGesture = GestureType.NONE;

    const animate = (time: number) => {
      animID = requestAnimationFrame(animate);
      if (!sceneRef.current) return;

      const { renderer, scene, camera, particles, targetPositions, handOffset, handLandmarker, currentGesture } = sceneRef.current;
      const deltaTime = time - lastTime;
      lastTime = time;

      // Handle hand detection
      if (handLandmarker && videoRef.current && videoRef.current.readyState >= 2) {
        const results = handLandmarker.detectForVideo(videoRef.current, time);
        if (results.landmarks && results.landmarks.length > 0) {
          let finalDetected: GestureType = GestureType.NONE;
          let combinedX = 0, combinedY = 0;

          if (results.landmarks.length === 2) {
            const g1 = GestureService.classify(results.landmarks[0]);
            const g2 = GestureService.classify(results.landmarks[1]);
            if (g1 === GestureType.PALM && g2 === GestureType.PALM) {
              finalDetected = GestureType.TWO_PALMS;
            } else {
              finalDetected = g1 !== GestureType.NONE ? g1 : g2;
            }
            const c1 = GestureService.getHandCentroid(results.landmarks[0]);
            const c2 = GestureService.getHandCentroid(results.landmarks[1]);
            combinedX = (c1.x + c2.x) / 2;
            combinedY = (c1.y + c2.y) / 2;
          } else {
            finalDetected = GestureService.classify(results.landmarks[0]);
            const c = GestureService.getHandCentroid(results.landmarks[0]);
            combinedX = c.x;
            combinedY = c.y;
          }

          const targetX = (0.5 - combinedX) * 14; 
          const targetY = (0.5 - combinedY) * 10;
          handOffset.x += (targetX - handOffset.x) * 0.15;
          handOffset.y += (targetY - handOffset.y) * 0.15;
          
          if (finalDetected !== pendingGesture) {
            pendingGesture = finalDetected;
            gestureDebounce = 0;
          } else {
            gestureDebounce += deltaTime;
            if (gestureDebounce > 80 && finalDetected !== currentGesture) {
                // BAKE ROTATION: Transform current positions by current rotation matrix
                // then reset rotation to 0 so the new shape appears 'straight'
                const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute;
                const currentPos = posAttr.array as Float32Array;
                const bakeMatrix = new THREE.Matrix4().makeRotationFromEuler(particles.rotation);
                
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                  const i3 = i * 3;
                  _vector.set(currentPos[i3], currentPos[i3 + 1], currentPos[i3 + 2]);
                  _vector.applyMatrix4(bakeMatrix);
                  currentPos[i3] = _vector.x;
                  currentPos[i3 + 1] = _vector.y;
                  currentPos[i3 + 2] = _vector.z;
                }
                particles.rotation.set(0, 0, 0);
                posAttr.needsUpdate = true;

                // Update state
                sceneRef.current.currentGesture = finalDetected;
                sceneRef.current.gestureChangeTime = time;
                const newTarget = ShapeService.generatePoints(finalDetected, PARTICLE_COUNT);
                sceneRef.current.targetPositions.set(newTarget);
                onGestureDetected(finalDetected);
            }
          }
        }
      }

      // Handle particles and morphing
      const posAttr = particles.geometry.attributes.position as THREE.BufferAttribute;
      const currentPos = posAttr.array as Float32Array;

      // Rotation Logic: Wait 1s, then ramp up to slow rotation
      const timeSinceChange = time - sceneRef.current.gestureChangeTime;
      const rotationDelay = 800;
      const rotationRamp = 1500;
      const speedFactor = Math.min(1.0, Math.max(0, (timeSinceChange - rotationDelay) / rotationRamp));
      const rotationSpeed = speedFactor * 0.006;
      particles.rotation.y += rotationSpeed;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const tx_base = targetPositions[i3];
        const ty_base = targetPositions[i3 + 1];
        const tz_base = targetPositions[i3 + 2];

        // "Alive" subtle motion - specific to shape type
        let dynamicOffsetH = 0;
        let dynamicOffsetV = 0;
        if (currentGesture === GestureType.THUMBS_UP) { // Jellyfish pulse
            dynamicOffsetV = Math.sin(time * 0.002 + ty_base * 0.5) * 0.25;
            dynamicOffsetH = Math.cos(time * 0.001 + i) * 0.1;
        } else if (currentGesture === GestureType.PEACE) { // Galaxy spin/drift
            dynamicOffsetH = Math.sin(time * 0.0005 + i) * 0.15;
        }

        const tx = tx_base + handOffset.x + dynamicOffsetH;
        const ty = ty_base + handOffset.y + dynamicOffsetV;
        const tz = tz_base + handOffset.z;

        const noise = NOISE_STRENGTH * (1 + Math.sin(time * 0.001 + i) * 0.5);
        const nx = (Math.random() - 0.5) * noise;
        const ny = (Math.random() - 0.5) * noise;
        const nz = (Math.random() - 0.5) * noise;

        currentPos[i3] += (tx + nx - currentPos[i3]) * LERP_FACTOR;
        currentPos[i3 + 1] += (ty + ny - currentPos[i3 + 1]) * LERP_FACTOR;
        currentPos[i3 + 2] += (tz + nz - currentPos[i3 + 2]) * LERP_FACTOR;
      }

      posAttr.needsUpdate = true;
      
      renderer.render(scene, camera);
    };

    let animID = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animID);
      renderer.dispose();
      scene.clear();
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none">
      <video 
        ref={videoRef} 
        playsInline 
        muted 
        className="fixed bottom-6 right-6 w-40 h-28 rounded-xl border border-white/10 shadow-2xl opacity-40 grayscale pointer-events-none scale-x-[-1] object-cover" 
      />
    </div>
  );
};

export default Experience;
