"use client";
import React from 'react';
import Spline from '@splinetool/react-spline';

export default function GlobalCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Spline scene="https://prod.spline.design/0jQ8LoMV23f-93IP/scene.splinecode" />
      {/* Changed from white to a very subtle dark vignette so text is readable but the neon glows! */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
    </div>
  );
}