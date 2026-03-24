"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar({ externalOpenState, setExternalOpenState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const WHATSAPP_URL = "https://wa.me/23272273689?text=Hello%20Ayesha!";

  // SYNC LOGIC: If the Home page triggers the modal, update internal state
  useEffect(() => {
    if (externalOpenState) {
      setIsAboutOpen(true);
    }
  }, [externalOpenState]);

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen || isAboutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, isAboutOpen]);

  // Function to close the modal and reset parent state
  const closeAbout = () => {
    setIsAboutOpen(false);
    if (setExternalOpenState) setExternalOpenState(false);
  };

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
            <button onClick={() => { setIsOpen(false); setIsAboutOpen(true); }} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] flex justify-between text-left">About Us <span>→</span></button>
          </div>
        </div>
      </div>

      {/* =========================================
          THE FULL-SCREEN "ABOUT US" MODAL
          ========================================= */}
      <div className={`fixed inset-0 z-[200] bg-[#FAF9F6] transition-all duration-700 ease-in-out flex flex-col overflow-y-auto ${isAboutOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        
        <button onClick={closeAbout} className="fixed top-6 right-6 z-[250] w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 hover:text-[#DDA7A5] text-lg font-bold">
          ✕
        </button>

        <div className="max-w-6xl mx-auto w-full px-6 py-20">
          <header className="text-center mb-16">
            <h2 className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.5em] mb-4">The Heart of the Brand</h2>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#2C2424] italic">Meet Isata Barrie</h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* LEFT COLUMN: THE FOUNDER CARD */}
            <div className="md:col-span-5">
              <div className="bg-white p-4 rounded-[40px] shadow-2xl border border-gray-100">
                <div className="relative w-full aspect-[4/5] rounded-[30px] overflow-hidden shadow-inner">
                   <img 
                    src="/ayesha.jpg" 
                    alt="Isata Barrie - Founder" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1589467332212-003661eb1a47?auto=format&fit=crop&q=80&w=800"; }} 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#2C2424]/60 via-transparent to-transparent flex items-end p-8">
                     <p className="text-white text-3xl font-serif italic">IB</p>
                   </div>
                </div>
                
                <div className="text-center py-6">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#DDA7A5] mb-2">Founder & Creative Director</p>
                  <p className="text-2xl font-serif font-bold text-[#2C2424]">Isata Barrie</p>
                  
                  <div className="mt-6 flex justify-center gap-3">
                    <span className="bg-gray-50 px-4 py-2 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100">Fullah</span>
                    <span className="bg-gray-50 px-4 py-2 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100">Muslim</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: THE BIOGRAPHY */}
            <div className="md:col-span-7">
              <div className="space-y-6 text-gray-600 leading-relaxed font-light text-sm md:text-base">
                <p className="text-xl md:text-2xl font-serif text-[#2C2424] italic mb-10 border-l-4 border-[#DDA7A5] pl-6 py-2">
                  "Success is not only measured by personal achievements but also by the positive impact one makes in the lives of others."
                </p>
                
                <p>
                  Isata Barrie is a passionate entrepreneur, dedicated student, and hardworking professional with a strong commitment to personal growth and community development. Currently in her final year at the <strong>Institute of Public Administration and Management (IPAM)</strong>, she is specializing in Procurement, Logistics, and Supply Chain Management.
                </p>

                <p>
                  Through her studies, Isata has developed a deep understanding of business operations, resource management, and strategic decision-making. Alongside her academic journey, she works full-time as a Salesperson at <strong>Watu Simu</strong>, gaining invaluable experience in sales, communication, and customer service.
                </p>

                <p>
                  As the founder of <strong>Ayesha’s Signature</strong>, Isata has built a brand on creativity, quality, and authenticity. Her mission is to provide unique products while empowering herself and inspiring other young entrepreneurs to pursue their dreams with confidence and faith.
                </p>

                <div className="bg-[#2C2424] p-8 rounded-3xl text-white mt-10 shadow-xl">
                    <h4 className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-widest mb-3">Our Core Values</h4>
                    <p className="text-sm font-light leading-loose italic opacity-90">
                      "With determination, discipline, and faith, Isata continues to grow, striving to build a legacy that reflects excellence, purpose, and inspiration."
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}