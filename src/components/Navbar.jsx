"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false); // Controls the About Us Modal!
  
  const WHATSAPP_URL = "https://wa.me/23272273689?text=Hello%20Ayesha!";

  return (
    <>
      <div className="fixed top-0 w-full z-[100] pointer-events-none">
        <nav className="w-full bg-white/90 backdrop-blur-xl border-b border-gray-200 pointer-events-auto transition-all">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
            
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Ayesha's Signature" className="h-8 md:h-10 w-auto object-contain" onError={(e) => e.target.style.display='none'} />
              <span className="font-serif font-bold text-sm md:text-lg tracking-[0.2em] text-[#2C2424] uppercase hover:text-[#DDA7A5] transition-colors">
                Ayesha's Signature
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#2C2424]">
              <Link href="/" className="hover:text-[#DDA7A5] transition-colors">Home</Link>
              <Link href="/shop" className="hover:text-[#DDA7A5] transition-colors">Shop</Link>
              
              {/* NEW ABOUT US BUTTON */}
              <button onClick={() => setIsAboutOpen(true)} className="hover:text-[#DDA7A5] transition-colors uppercase tracking-[0.2em]">
                About Us
              </button>

              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#2C2424] text-white rounded-full hover:bg-[#DDA7A5] transition-all shadow-lg">
                Contact
              </a>
            </div>

            <button className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] pointer-events-auto" onClick={() => setIsOpen(!isOpen)}>
              <span className={`w-6 h-[1.5px] bg-[#2C2424] transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[6.5px] bg-[#DDA7A5]' : ''}`}></span>
              <span className={`w-6 h-[1.5px] bg-[#2C2424] transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-[1.5px] bg-[#2C2424] transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[6.5px] bg-[#DDA7A5]' : ''}`}></span>
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div className={`absolute top-[70px] left-4 right-4 md:hidden pointer-events-auto transition-all duration-500 origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50 pointer-events-none'}`}>
          <div className="bg-[#FAF9F6]/95 backdrop-blur-3xl border border-gray-200 rounded-3xl p-6 flex flex-col gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] hover:text-[#DDA7A5] transition-colors border-b border-gray-200 pb-4 flex justify-between">
              Home <span className="text-[#DDA7A5]">→</span>
            </Link>
            <Link href="/shop" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] hover:text-[#DDA7A5] transition-colors border-b border-gray-200 pb-4 flex justify-between">
              The Collection <span className="text-[#DDA7A5]">→</span>
            </Link>
            
            {/* MOBILE ABOUT BUTTON */}
            <button onClick={() => { setIsOpen(false); setIsAboutOpen(true); }} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] hover:text-[#DDA7A5] transition-colors border-b border-gray-200 pb-4 flex justify-between text-left">
              About Us <span className="text-[#DDA7A5]">→</span>
            </button>

            <a href={WHATSAPP_URL} onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest text-[#DDA7A5] flex justify-between">
              Contact Us <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================
          THE FULL-SCREEN "ABOUT US" MODAL
          ========================================= */}
      <div className={`fixed inset-0 z-[200] bg-[#FAF9F6]/95 backdrop-blur-2xl transition-all duration-700 ease-in-out flex flex-col px-6 md:px-24 overflow-y-auto ${isAboutOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        
        {/* Close Button */}
        <div className="w-full flex justify-end py-8 sticky top-0 bg-[#FAF9F6]/80 backdrop-blur-md z-10">
          <button onClick={() => setIsAboutOpen(false)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 hover:bg-[#DDA7A5] hover:text-white transition-colors">
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="max-w-4xl mx-auto w-full pb-32 mt-4 md:mt-12">
          <h2 className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Behind the Brand</h2>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#2C2424] mb-12">Ayesha's Signature</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div>
              <h3 className="text-lg font-serif font-bold text-[#2C2424] mb-4">Our Mission</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-light mb-8">
                To provide accessible, luxury modest fashion and intentional gifting experiences. We believe that elegance should speak your language, and every gift should carry profound meaning.
              </p>
              <h3 className="text-lg font-serif font-bold text-[#2C2424] mb-4">Our Vision</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-light">
                To become the premier destination for modern Muslimahs seeking quality, authenticity, and beauty in their everyday essentials and sacred Ibadah.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#DDA7A5] mb-4">The Founder</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-light italic">
                "One year ago, I started with a simple promise: if you are looking for affordable, intentional Muslim packages, I am your right choice. You didn't just support a business—you supported a dream. Thank you for trusting Ayesha's Signature."
              </p>
              <p className="mt-6 text-xs font-bold tracking-widest uppercase text-[#2C2424]">— Ayesha Bari</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}