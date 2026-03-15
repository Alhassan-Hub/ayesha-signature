"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Webcam from 'react-webcam';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Float, useGLTF, PresentationControls, Center } from '@react-three/drei';
import * as THREE from 'three';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';

// ==========================================
// 1. CONFIGURATIONS (THE SMART SWITCH)
// ==========================================
const customizerConfigs = {
  'magic-cup': { scale: 2.2, position: [0, -0.5, 0], rotation: [0, 0, 0], enableAI: true },
  
  // THE MAT IS QUARANTINED: AI is OFF. Size is reduced. Tilted so it can be seen.
  'prayer-mat': { scale: 0.35, position: [0, -0.5, 0], rotation: [Math.PI / 4, 0, 0], enableAI: false },
  
  'signature-hijab': { scale: 0.25, position: [0, -1, 0], rotation: [0, 0, 0], enableAI: true } 
};

// ==========================================
// 2. THE 3D MODEL HANDLER
// ==========================================
function ProductModel({ product, config, targetRotation }) {
  const { scene } = useGLTF(product.file);
  const clone = useMemo(() => scene.clone(), [scene]);
  const spinRef = useRef();

  useFrame((state, delta) => {
    // If AI is disabled (like for the Mat), do absolutely nothing. Let the user drag it.
    if (!config.enableAI || !spinRef.current) return;
    
    // If AI is enabled, apply the smooth Telekinesis math
    spinRef.current.rotation.y = THREE.MathUtils.lerp(
      spinRef.current.rotation.y, 
      targetRotation.current.y, 
      delta * 5
    );
  });

  return (
    // Outer group safely applies the tilt/position
    <group position={config.position} rotation={config.rotation}>
      {/* Inner group handles the spinning so they don't fight */}
      <group ref={spinRef}>
        <primitive object={clone} scale={config.scale} />
      </group>
    </group>
  );
}

// ==========================================
// 3. MAIN UI & AI ENGINE
// ==========================================
export default function CustomizerModal({ product, onClose }) {
  const webcamRef = useRef(null);
  const config = customizerConfigs[product.id];
  
  const [aiStatus, setAiStatus] = useState("INITIALIZING...");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const targetRotation = useRef({ y: 0 }); 
  const requestRef = useRef(null);
  const historyX = useRef([]);

  // --- THE AI ENGINE ---
  useEffect(() => {
    // IF THIS IS THE PRAYER MAT, KILL THE AI IMMEDIATELY.
    if (!config.enableAI) {
      setAiStatus("3D TOUCH ENABLED: DRAG TO ROTATE");
      setIsReady(true);
      return; 
    }

    let net;
    const progressInterval = setInterval(() => {
      setLoadingProgress(p => (p < 90 ? p + 5 : p));
    }, 200);

    const runHandpose = async () => {
      try {
        setAiStatus("CALIBRATING SENSORS...");
        net = await handpose.load(); 
        
        clearInterval(progressInterval);
        setLoadingProgress(100);
        setAiStatus("LINK ACTIVE: MOVE HAND LEFT/RIGHT");
        setIsReady(true);
        
        detect(net);
      } catch (error) {
        clearInterval(progressInterval);
        setAiStatus("AI FAILED. CHECK CAMERA.");
      }
    };

    const detect = async (model) => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const hands = await model.estimateHands(video);

        if (hands.length > 0) {
          const palmX = hands[0].landmarks[0][0]; 
          const rawX = ((videoWidth - palmX) / videoWidth) * 2 - 1.0;

          historyX.current.push(rawX);
          if (historyX.current.length > 10) historyX.current.shift();
          const avgX = historyX.current.reduce((a, b) => a + b, 0) / historyX.current.length;

          let finalX = avgX;
          if (Math.abs(avgX) < 0.15) finalX = 0;

          targetRotation.current = { y: finalX * (Math.PI / 1.5) };
        } else {
          historyX.current = [];
          targetRotation.current = { y: 0 };
        }
      }
      requestRef.current = requestAnimationFrame(() => detect(model));
    };

    runHandpose();

    return () => {
      clearInterval(progressInterval);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [config.enableAI]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#030105]/95 backdrop-blur-2xl text-white overflow-hidden animate-in fade-in duration-500">
      
      {/* ONLY RENDER THE WEBCAM IF AI IS ENABLED */}
      {config.enableAI && (
        <div className="absolute opacity-0 pointer-events-none w-[10px] h-[10px] overflow-hidden -z-50">
          <Webcam ref={webcamRef} muted={true} width={640} height={480} />
        </div>
      )}

      {/* TOP BAR */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        <button 
          onClick={onClose} 
          className="pointer-events-auto flex items-center gap-2 text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors bg-white/5 px-5 py-3 rounded-full border border-white/10 backdrop-blur-md"
        >
          <span>←</span> Disconnect
        </button>
        
        {/* STATUS BADGE */}
        <div className="flex flex-col items-end">
          <div className={`px-4 py-2 rounded-full border transition-all duration-1000 ${isReady ? 'border-[#DDA7A5] bg-[#DDA7A5]/10 shadow-[0_0_15px_rgba(221,167,165,0.3)]' : 'border-white/20 bg-white/5'}`}>
            <p className={`text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold ${isReady ? 'text-[#DDA7A5]' : 'text-white/50 animate-pulse'}`}>
              {isReady ? (config.enableAI ? '🟢 ' : '✨ ') : '🟡 '} {aiStatus}
            </p>
          </div>
          {!isReady && config.enableAI && (
            <div className="w-full h-0.5 bg-white/10 mt-2 rounded-full overflow-hidden">
              <div className="h-full bg-[#DDA7A5] transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
            </div>
          )}
        </div>
      </div>

      {/* THE 3D CANVAS */}
      <div className="absolute inset-0 z-0 pb-20">
        <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} intensity={2.5} color="#DDA7A5" />
          <Environment preset="city" />
          
          {/* We wrap it in PresentationControls so the user can drag the mat around with their finger! */}
          <PresentationControls global config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
            <Float speed={isReady && config.enableAI ? 0 : 2} rotationIntensity={isReady && config.enableAI ? 0 : 0.1} floatIntensity={0.1}>
              <Center>
                <ProductModel product={product} config={config} targetRotation={targetRotation} />
              </Center>
            </Float>
          </PresentationControls>
          
          <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#DDA7A5" />
        </Canvas>
      </div>

      {/* MINIMALIST BOTTOM ACTION BAR */}
      <div className="absolute bottom-10 w-full flex flex-col items-center justify-center z-50 pointer-events-none px-6">
        
        {isReady && config.enableAI && (
          <p className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.3em] mb-6 drop-shadow-md animate-pulse">
            Hold palm to camera to guide the object
          </p>
        )}

        <button 
          className="pointer-events-auto w-full max-w-sm py-5 bg-[#FDF8F5] text-black font-bold text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-[#DDA7A5] hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
          onClick={() => {
            const msg = `Hello Ayesha! I would like to order the ${product.name}.`;
            window.open(`https://wa.me/23272273689?text=${encodeURIComponent(msg)}`, '_blank');
          }}
        >
          Proceed to Order
        </button>
      </div>

    </div>
  );
}