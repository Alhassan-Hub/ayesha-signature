"use client";
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { 
  Float, 
  Sparkles, 
  MeshReflectorMaterial, 
  MeshTransmissionMaterial, 
  Center
} from '@react-three/drei';
import * as THREE from 'three';

export default function BoutiqueScene() {
  const sceneRef = useRef(null);
  const outerRing = useRef(null);
  const innerRing = useRef(null);
  const coreRef = useRef(null);

  useFrame((state) => {
    if (!sceneRef.current) return;

    const t = state.clock.getElapsedTime();

    // 1. THE GOOGLE AI MOUSE PARALLAX (Smooth drifting)
    const targetX = (state.pointer.x * Math.PI) / 12;
    const targetY = (state.pointer.y * Math.PI) / 12;

    sceneRef.current.rotation.x = THREE.MathUtils.lerp(sceneRef.current.rotation.x, -targetY, 0.05);
    sceneRef.current.rotation.z = THREE.MathUtils.lerp(sceneRef.current.rotation.z, -targetX, 0.05);

    // Base slow rotation
    sceneRef.current.rotation.y += 0.001;

    // 2. THE GOOGLE AI "BREATHING" EFFECT
    // Applied to the glass rings so they tilt and sway organically
    if (outerRing.current) {
      outerRing.current.rotation.z = Math.sin(t * 0.2) * 0.1;
      outerRing.current.rotation.x = Math.cos(t * 0.15) * 0.1 + Math.PI / 4;
    }
    if (innerRing.current) {
      innerRing.current.rotation.z = Math.cos(t * 0.2) * 0.1;
      innerRing.current.rotation.y = Math.sin(t * 0.15) * 0.1 + Math.PI / 4;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.005;
      coreRef.current.rotation.x += 0.002;
    }
  });

  return (
    <group ref={sceneRef}>
      
      {/* LUXURY GOLD DUST */}
      <Sparkles count={60} scale={8} size={2} speed={0.2} opacity={0.4} color="#D4AF37" />

      <Float speed={1.2} floatIntensity={0.3} rotationIntensity={0.1}>
        <Center position={[0, 0.6, 0]}>
          
          {/* LAYER 1: The Outer Frosted Rose-Gold Ring */}
          <mesh ref={outerRing}>
            <torusGeometry args={[1.8, 0.15, 64, 128]} />
            <MeshTransmissionMaterial 
              backside
              backsideThickness={0.5}
              thickness={0.5}
              roughness={0.15} // Frosted blur
              transmission={1} 
              ior={1.5} 
              chromaticAberration={0.05} // Prismatic edges
              color="#FDF8F5" 
            />
          </mesh>

          {/* LAYER 2: The Inner Polished Champagne Ring */}
          <mesh ref={innerRing}>
            <torusGeometry args={[1.3, 0.2, 64, 128]} />
            <MeshTransmissionMaterial 
              backside
              backsideThickness={0.5}
              thickness={1}
              roughness={0.02} // Highly polished
              transmission={1}
              ior={1.5}
              chromaticAberration={0.08}
              color="#DDA7A5"
            />
          </mesh>

          {/* LAYER 3: The Solid Gold Core */}
          <mesh ref={coreRef} scale={0.5}>
            <octahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial 
              color="#D4AF37" 
              metalness={1} 
              roughness={0.1} 
            />
          </mesh>

        </Center>
      </Float>

      {/* THE SATIN STUDIO FLOOR */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[200, 50]} 
          resolution={512} 
          mixBlur={0.5} 
          mixStrength={8} 
          roughness={0.6}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0A0808"
          metalness={0.15}
        />
      </mesh>

    </group>
  );
}