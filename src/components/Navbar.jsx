"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const WHATSAPP_URL = "https://wa.me/23272273689?text=Hello%20Ayesha!";

  useEffect(() => {
    if (isOpen || isAboutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, isAboutOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
        <nav className="w-full bg-white/90 backdrop-blur-xl border-b border-gray-200 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
            <Link href="/" className="flex items-center gap-3">
              <span className="font-serif font-bold text-sm md:text-lg tracking-[0.2em] text-[#2C2424] uppercase hover:text-[#DDA7A5] transition-colors">
                Ayesha's Signature
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#2C2424]">
              <Link href="/" className="hover:text-[#DDA7A5] transition-colors">Home</Link>
              <Link href="/shop" className="hover:text-[#DDA7A5] transition-colors">Shop</Link>
              <button onClick={() => setIsAboutOpen(true)} className="hover:text-[#DDA7A5] transition-colors uppercase tracking-[0.2em]">
                About Us
              </button>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#2C2424] text-white rounded-full hover:bg-[#DDA7A5] transition-all shadow-lg text-[10px] uppercase font-bold tracking-widest">
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
          <div className="bg-[#FAF9F6]/95 backdrop-blur-3xl border border-gray-200 rounded-3xl p-6 flex flex-col gap-6 shadow-xl">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] flex justify-between">Home <span>→</span></Link>
            <Link href="/shop" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] flex justify-between">The Collection <span>→</span></Link>
            <button onClick={() => { setIsOpen(false); setIsAboutOpen(true); }} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] flex justify-between text-left text-sm font-bold">About Us <span>→</span></button>
          </div>
        </div>
      </div>

      {/* ABOUT MODAL */}
      <div className={`fixed inset-0 z-[200] bg-[#FAF9F6] transition-all duration-700 ease-in-out flex flex-col overflow-y-auto ${isAboutOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button onClick={() => setIsAboutOpen(false)} className="fixed top-6 right-6 z-[250] w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 hover:text-[#DDA7A5]">✕</button>

        <div className="max-w-6xl mx-auto w-full px-6 py-20">
          <h2 className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.4em] mb-4 text-center">Behind the Brand</h2>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-[#2C2424] mb-16 text-center italic">Isata Barrie</h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            
            {/* PHOTO SECTION (Uses exact logic from your Home.js) */}
            <div className="md:col-span-5">
              <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border border-gray-200">
                <img 
                  src="/ayesha.jpg" 
                  alt="Isata Barrie - Founder" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1589467332212-003661eb1a47?auto=format&fit=crop&q=80&w=800"; }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">Founder & CEO</p>
                      <p className="text-xl font-serif font-bold text-white">Isata Barrie</p>
                   </div>
                </div>
              </div>
            </div>

            {/* BIOGRAPHY SECTION */}
            <div className="md:col-span-7">
              <div className="space-y-6 text-gray-600 leading-relaxed font-light text-sm md:text-base">
                <p className="text-xl font-serif text-[#2C2424] italic mb-8 border-l-4 border-[#DDA7A5] pl-6">
                  "Success is not only measured by personal achievements but also by the positive impact one makes in the lives of others."
                </p>
                
                <p>
                  Isata Barrie is a passionate entrepreneur, dedicated student, and hardworking professional with a strong commitment to personal growth and community development. She is currently in her final year at the <strong>Institute of Public Administration and Management (IPAM)</strong>, where she is studying Procurement, Logistics, and Supply Chain Management. 
                </p>

                <p>
                  Alongside her academic journey, Isata works full-time as a Salesperson at <strong>Watu Simu</strong>, where she interacts with customers daily, building relationships and gaining practical experience in sales, communication, and customer service.
                </p>

                <p>
                  As the founder of <strong>Ayesha’s Signature</strong>, Isata has built a brand on creativity, quality, and authenticity. Through her business, she aims to provide unique products and services while empowering herself and inspiring other young entrepreneurs to pursue their dreams.
                </p>

                <p>
                  Proudly <strong>Fullah</strong> by tribe and <strong>Muslim</strong> by faith, Isata is guided by values of integrity, hard work, humility, and service to others. With determination and discipline, she continues to grow as a professional, striving to build a legacy that reflects excellence and purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}