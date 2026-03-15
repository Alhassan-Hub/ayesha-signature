"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const WHATSAPP_URL = "https://wa.me/23272273689?text=Hello%20Ayesha!";

  return (
    <div className="fixed top-0 w-full z-[100] pointer-events-none">
      {/* THE MAIN NAVIGATION BAR */}
      <nav className="w-full bg-[#090212]/50 backdrop-blur-xl border-b border-white/5 pointer-events-auto transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
          
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Ayesha's Signature" className="h-8 md:h-10 w-auto object-contain" onError={(e) => e.target.style.display='none'} />
            <span className="font-serif font-bold text-sm md:text-lg tracking-[0.2em] text-[#FDFBFF] uppercase hover:text-[#D1A3FF] transition-colors">
              Ayesha's Signature
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-[0.2em] uppercase text-white">
            <Link href="/" className="hover:text-[#D1A3FF] transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-[#D1A3FF] transition-colors">Shop</Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#111] border border-white/20 text-white rounded-full hover:bg-[#D1A3FF] hover:text-black hover:border-[#D1A3FF] transition-all shadow-lg">
              Contact
            </a>
          </div>

          <button className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]" onClick={() => setIsOpen(!isOpen)}>
            <span className={`w-6 h-[1.5px] bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[6.5px] bg-[#D1A3FF]' : ''}`}></span>
            <span className={`w-6 h-[1.5px] bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-[1.5px] bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[6.5px] bg-[#D1A3FF]' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* INNOVATIVE FLOATING CAPSULE MENU (Not Full Screen!) */}
      <div className={`absolute top-[80px] left-4 right-4 md:hidden pointer-events-auto transition-all duration-500 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50 pointer-events-none'}`}>
        <div className="bg-[#0A0514]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-[#D1A3FF] transition-colors border-b border-white/5 pb-4 flex justify-between">
            Home <span className="text-[#D1A3FF]">→</span>
          </Link>
          <Link href="/shop" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-white hover:text-[#D1A3FF] transition-colors border-b border-white/5 pb-4 flex justify-between">
            The Collection <span className="text-[#D1A3FF]">→</span>
          </Link>
          <a href={WHATSAPP_URL} onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest text-[#D1A3FF] flex justify-between">
            Contact Us <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}