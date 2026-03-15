"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Text, PresentationControls, ContactShadows, Float, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import Webcam from 'react-webcam';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';

// ==========================================
// 1. 3D CONFIGURATIONS
// ==========================================
const customizerConfigs = {
  'magic-cup': { scale: 2.5, position: [0, -0.5, 0], rotation: [0, 0, 0], textPosition: [0, 0, 1.1] },
  'prayer-mat': { scale: 0.5, position: [0, -0.5, 0], rotation: [Math.PI / 4, 0, 0], textPosition: [0, 0.1, 0.5] },
  'signature-hijab': { scale: 0.25, position: [0, -1, 0], rotation: [0, 0, 0] } 
};

// ==========================================
// 2. THE 3D MODELS
// ==========================================
function PrayerMatModel({ color, customText, config }) {
  const { scene } = useGLTF('/mat.glb');
  const clone = useMemo(() => scene.clone(), [scene]);
  
  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.color = new THREE.Color(color);
      }
    });
  }, [color, clone]);

  return (
    <group position={config.position} rotation={config.rotation}>
      <primitive object={clone} scale={config.scale} />
      <Text position={config.textPosition} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.25} color="#D4AF37" anchorX="center" anchorY="middle">
        {customText || "YOUR NAME"}
      </Text>
    </group>
  ); 
}

function HijabModel({ color, config }) {
  const { scene } = useGLTF('/hijab.glb');
  const clone = useMemo(() => scene.clone(), [scene]);
  
  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        const n = child.name.toLowerCase();
        if (!n.includes('head') && !n.includes('face') && !n.includes('body') && !n.includes('mannequin')) {
          child.material = child.material.clone();
          child.material.color = new THREE.Color(color);
        }
      }
    });
  }, [color, clone]);

  return <primitive object={clone} scale={config.scale} position={config.position} rotation={config.rotation} />;
}

function MagicCupModel({ customText, config }) {
  const { scene } = useGLTF('/cup.glb');
  const clone = useMemo(() => scene.clone(), [scene]);

  return (
    <group position={config.position} rotation={config.rotation}>
      <primitive object={clone} scale={config.scale} />
      <Text position={config.textPosition} fontSize={0.25} maxWidth={1.5} textAlign="center" color="#D4AF37" anchorX="center" anchorY="middle">
        {customText || "YOUR NAME"}
      </Text>
    </group>
  );
}

// ==========================================
// 3. MAIN UI & INVISIBLE AI
// ==========================================
export default function CustomizerModal({ product, onClose }) {
  const webcamRef = useRef(null);
  
  // States
  const [selectedColorIndex, setSelectedColorIndex] = useState(0); 
  const [customText, setCustomText] = useState("");
  const [aiStatus, setAiStatus] = useState("Waking up AI...");
  const requestRef = useRef(null);

  const config = customizerConfigs[product.id];
  const showColors = product.id === 'signature-hijab' || product.id === 'prayer-mat'; 
  const showText = product.id === 'magic-cup' || product.id === 'prayer-mat';         

  const colors = [
    { name: "Pearl", hex: "#FAF9F6" }, 
    { name: "Rose Gold", hex: "#DDA7A5" },
    { name: "Emerald", hex: "#097969" }, 
    { name: "Midnight", hex: "#1A1515" },
  ];
  
  const currentColor = colors[selectedColorIndex];

  // --- THE INVISIBLE AI BRAIN ---
  useEffect(() => {
    let net;
    let lastX = null;
    let lastSwipeTime = 0;

    const runHandpose = async () => {
      try {
        net = await handpose.load();
        setAiStatus("✨ AI Active: Wave hand left/right to change color!");
        detect(net);
      } catch (error) {
        setAiStatus("AI Gesture unavailable.");
      }
    };

    const detect = async (model) => {
      if (webcamRef.current && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const hands = await model.estimateHands(video);

        if (hands.length > 0) {
          const currentX = hands[0].landmarks[0][0]; // Wrist position

          if (lastX !== null) {
            const deltaX = currentX - lastX;
            const now = Date.now();

            // Swipe Detection (1 second cooldown)
            if (now - lastSwipeTime > 1000) {
              if (deltaX > 50) {
                // Swiped Right
                setSelectedColorIndex((prev) => (prev + 1) % colors.length);
                lastSwipeTime = now;
              } else if (deltaX < -50) {
                // Swiped Left
                setSelectedColorIndex((prev) => (prev - 1 + colors.length) % colors.length);
                lastSwipeTime = now;
              }
            }
          }
          lastX = currentX;
        } else {
          lastX = null;
        }
      }
      requestRef.current = requestAnimationFrame(() => detect(model));
    };

    if (showColors) {
      runHandpose();
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [showColors, colors.length]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#030105]/95 backdrop-blur-2xl text-white overflow-hidden animate-in fade-in duration-300">
      
      {/* INVISIBLE WEBCAM (Runs the AI, but totally hidden from user) */}
      <div className="absolute opacity-0 pointer-events-none w-[10px] h-[10px] overflow-hidden -z-50">
        <Webcam ref={webcamRef} muted={true} width={640} height={480} />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        <button onClick={onClose} className="pointer-events-auto flex items-center gap-2 text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <span>←</span> Back
        </button>
        <h2 className="text-[10px] font-serif font-bold tracking-widest uppercase opacity-50">{product.name}</h2>
      </div>

      {/* AI Status Badge (Tells them the magic is ready) */}
      {showColors && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
            <p className="text-[9px] uppercase tracking-widest text-[#DDA7A5] font-bold">
              {aiStatus}
            </p>
          </div>
        </div>
      )}

      {/* THE 3D CANVAS (Takes up the whole screen) */}
      <div className="absolute inset-0 z-0 pb-40">
        <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <spotLight position={[10, 10, 10]} intensity={2.5} color="#DDA7A5" />
          <Environment preset="city" />
          
          <PresentationControls global config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
              <Center>
                {product.id === 'magic-cup' && <MagicCupModel customText={customText} config={config} />}
                {product.id === 'prayer-mat' && <PrayerMatModel color={currentColor.hex} customText={customText} config={config} />}
                {product.id === 'signature-hijab' && <HijabModel color={currentColor.hex} config={config} />}
              </Center>
            </Float>
          </PresentationControls>
          <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#DDA7A5" />
        </Canvas>
      </div>

      {/* BOTTOM MENU */}
      <div className="absolute bottom-0 w-full bg-[#0A0808] border-t border-white/10 rounded-t-[1.5rem] p-5 pb-8 z-50 flex flex-col gap-4 shadow-[0_-10px_50px_rgba(0,0,0,0.9)] max-h-[50vh] overflow-y-auto">
        
        {showColors && (
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Fabric Color (Swipe hand or click)</h3>
            <div className="flex gap-3">
              {colors.map((c, idx) => (
                <button 
                  key={c.name} 
                  onClick={() => setSelectedColorIndex(idx)} 
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${selectedColorIndex === idx ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-transparent opacity-50 hover:opacity-100'}`} 
                  style={{ backgroundColor: c.hex }} 
                />
              ))}
            </div>
          </div>
        )}

        {showText && (
          <div>
            <h3 className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Personalize</h3>
            <input type="text" maxLength={15} placeholder="Enter name..." value={customText} onChange={(e) => setCustomText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white uppercase tracking-widest focus:outline-none focus:border-[#DDA7A5] transition-all" />
          </div>
        )}

        <button 
          className="w-full py-4 mt-1 bg-[#FDF8F5] text-black font-bold text-[9px] uppercase tracking-[0.3em] rounded-lg hover:bg-[#DDA7A5] hover:text-white transition-all duration-300" 
          onClick={() => {
            const details = [
              showColors ? `Color: ${currentColor.name}` : null,
              showText && customText ? `Name: ${customText}` : null
            ].filter(Boolean).join(' | ');
            const msg = `Hello Ayesha! I want to order the custom ${product.name}. ${details ? `Details: [ ${details} ]` : ''}`;
            window.open(`https://wa.me/23272273689?text=${encodeURIComponent(msg)}`, '_blank');
          }}
        >
          Confirm & Order
        </button>

      </div>
    </div>
  );
}