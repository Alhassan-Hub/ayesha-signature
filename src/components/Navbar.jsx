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
          <div className="bg-[#FAF9F6]/95 backdrop-blur-3xl border border-gray-200 rounded-3xl p-6 flex flex-col gap-6 shadow-xl">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] flex justify-between">Home <span>→</span></Link>
            <Link href="/shop" onClick={() => setIsOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] flex justify-between">The Collection <span>→</span></Link>
            <button onClick={() => { setIsOpen(false); setIsAboutOpen(true); }} className="text-sm font-bold uppercase tracking-widest text-[#2C2424] flex justify-between text-left">About Us <span>→</span></button>
          </div>
        </div>
      </div>

      {/* ABOUT MODAL */}
      <div className={`fixed inset-0 z-[200] bg-[#FAF9F6] transition-all duration-700 ease-in-out flex flex-col overflow-y-auto ${isAboutOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <button onClick={() => setIsAboutOpen(false)} className="fixed top-6 right-6 z-[250] w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 hover:text-[#DDA7A5]">✕</button>

        <div className="max-w-5xl mx-auto w-full px-6 py-24">
          <h2 className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.4em] mb-4 text-center">The Heart of the Brand</h2>
          <h1 className="text-4xl md:text-7xl font-serif font-bold text-[#2C2424] mb-16 text-center italic">Meet Isata Barrie</h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Left Column: Personal Info */}
            <div className="md:col-span-5 flex flex-col gap-8">
              <div className="aspect-[4/5] bg-gray-200 rounded-[40px] overflow-hidden shadow-2xl relative">
                <img src="/founder.jpg" alt="Isata Barrie" className="w-full h-full object-cover" onError={(e) => e.target.src="https://via.placeholder.com/800x1000?text=Ayesha"} />
                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/80 backdrop-blur-md rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#DDA7A5] mb-1">Founder & Creative Director</p>
                    <p className="text-lg font-serif font-bold text-[#2C2424]">Isata Barrie</p>
                </div>
              </div>
              <div className="flex gap-4">
                 <div className="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Heritage</p>
                    <p className="text-sm font-medium text-[#2C2424]">Fullah by tribe</p>
                 </div>
                 <div className="flex-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Faith</p>
                    <p className="text-sm font-medium text-[#2C2424]">Muslim</p>
                 </div>
              </div>
            </div>

            {/* Right Column: The Story */}
            <div className="md:col-span-7 flex flex-col gap-8">
              <div className="prose prose-sm md:prose-base text-gray-600 leading-relaxed font-light">
                <p className="mb-6 text-lg font-serif text-[#2C2424] italic">
                  "Success is not only measured by personal achievements but also by the positive impact one makes in the lives of others."
                </p>
                <p className="mb-6">
                  Isata Barrie is a passionate entrepreneur, dedicated student, and hardworking professional with a strong commitment to personal growth and community development. Currently in her final year at the <strong>Institute of Public Administration and Management (IPAM)</strong>, she is specializing in Procurement, Logistics, and Supply Chain Management. 
                </p>
                <p className="mb-6">
                  Through her studies, Isata has developed a deep understanding of business operations, resource management, and strategic decision-making. This academic foundation is paired with practical experience; she works full-time at <strong>Watu Simu</strong>, where she interacts with customers daily, refining her skills in sales, communication, and professional relationship building.
                </p>
                <p className="mb-6">
                  As the founder of <strong>Ayesha’s Signature</strong>, Isata has created a brand built on creativity, quality, and authenticity. Her mission goes beyond fashion—it is about providing unique products while empowering herself and inspiring other young entrepreneurs to pursue their dreams with confidence.
                </p>
                <p>
                  Guided by the values of integrity, humility, and service, Isata continues to grow as a professional and entrepreneur, striving to build a legacy that reflects excellence and purpose.
                </p>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8 flex items-center justify-between">
                 <img src="/signature.png" alt="Signature" className="h-12 opacity-50 grayscale" onError={(e) => e.target.style.display='none'} />
                 <div className="text-right font-bold text-[10px] tracking-[0.2em] uppercase text-[#2C2424]">
                    Est. 2023
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}