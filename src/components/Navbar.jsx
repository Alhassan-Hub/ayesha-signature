"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const WHATSAPP_URL = "https://wa.me/23272273689?text=Hello%20Ayesha!";

  return (
    <div className="fixed top-0 w-full z-[100] pointer-events-none">
      {/* THE MAIN NAVIGATION BAR (Light Theme) */}
      <nav className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 pointer-events-auto transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
          
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Ayesha's Signature" className="h-8 md:h-10 w-auto object-contain" onError={(e) => e.target.style.display='none'} />
            <span className="font-serif font-bold text-sm md:text-lg tracking-[0.2em] text-[#2C2424] uppercase hover:text-[#DDA7A5] transition-colors">
              Ayesha's Signature
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#2C2424]">
            <Link href="/" className="hover:text-[#DDA7A5] transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-[#DDA7A5] transition-colors">Shop</Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#2C2424] border border-[#2C2424] text-white rounded-full hover:bg-[#DDA7A5] hover:border-[#DDA7A5] transition-all shadow-lg">
              Contact
            </a>
          </div>

          {/* Hamburger Menu Icon (Dark Lines) */}
          <button className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] pointer-events-auto" onClick={() => setIsOpen(!isOpen)}>
            <span className={`w-6 h-[1.5px] bg-[#2C2424] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[6.5px] bg-[#DDA7A5]' : ''}`}></span>
            <span className={`w-6 h-[1.5px] bg-[#2C2424] transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-[1.5px] bg-[#2C2424] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[6.5px] bg-[#DDA7A5]' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* LIGHT THEME FLOATING CAPSULE MENU */}
      <div className={`absolute top-[80px] left-4 right-4 md:hidden pointer-events-auto transition-all duration-500 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50 pointer-events-none'}`}>
        <div className="bg-[#FAF9F6]/95 backdrop-blur-3xl border border-gray-200 rounded-3xl p-6 flex flex-col gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] hover:text-[#DDA7A5] transition-colors border-b border-gray-200 pb-4 flex justify-between">
            Home <span className="text-[#DDA7A5]">→</span>
          </Link>
          <Link href="/shop" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] hover:text-[#DDA7A5] transition-colors border-b border-gray-200 pb-4 flex justify-between">
            The Collection <span className="text-[#DDA7A5]">→</span>
          </Link>
          <a href={WHATSAPP_URL} onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest text-[#DDA7A5] flex justify-between">
            Contact Us <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}