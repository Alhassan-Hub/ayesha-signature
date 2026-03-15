"use client";
import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export default function LoadingScreen() {
  // This automatically tracks all 3D files downloading in the background!
  const { progress, active } = useProgress(); 
  const [isHidden, setIsHidden] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // When progress hits 100%, wait half a second, then fade out smoothly
    if (progress === 100 || !active) {
      const timer1 = setTimeout(() => setIsFadingOut(true), 800);
      const timer2 = setTimeout(() => setIsHidden(true), 1800); // Completely remove it after fade
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [progress, active]);

  if (isHidden) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030105] transition-opacity duration-1000 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex flex-col items-center max-w-xs w-full px-6">
        
        {/* Optional Logo */}
        <img src="/logo.png" alt="Logo" className="h-12 w-auto mb-6 animate-pulse opacity-80" onError={(e) => e.target.style.display='none'} />
        
        <h1 className="font-serif font-bold text-xl tracking-[0.2em] uppercase text-[#FDFBFF] mb-8 animate-pulse text-center">
          Ayesha's Signature
        </h1>

        {/* Minimalist Progress Line */}
        <div className="w-full h-[2px] bg-white/10 relative overflow-hidden mb-4 rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-[#DDA7A5] transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Text Stats */}
        <div className="flex justify-between w-full text-[8px] font-bold uppercase tracking-[0.3em] text-[#DDA7A5]">
          <span>{progress < 100 ? 'Preparing Studio...' : 'Welcome'}</span>
          <span>{Math.round(progress)}%</span>
        </div>

      </div>
    </div>
  );
}