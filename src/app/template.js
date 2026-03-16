"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Template({ children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // The Frosted Dissolve: Starts blurry and transparent, fades into sharp focus
    gsap.fromTo(containerRef.current, 
      { opacity: 0, filter: "blur(12px)" }, 
      { opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
    );
  }, []);

  return <div ref={containerRef}>{children}</div>;
}