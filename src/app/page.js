"use client";
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlobalCanvas from '@/components/GlobalCanvas';
import Navbar from '@/components/Navbar';
import { db } from '@/utils/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Lenis from 'lenis';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const storyLeftRef = useRef(null);
  const storyRightRef = useRef(null);
  const gridRef = useRef(null);

  const WHATSAPP_URL = "https://wa.me/23272273689?text=Hello%20Ayesha!";
  const TIKTOK_URL = "https://vt.tiktok.com/ZSu56wLdo/";

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const liveProducts = [];
        snapshot.forEach((doc) => liveProducts.push({ id: doc.id, ...doc.data() }));
        setProducts(liveProducts.filter(item => item.isFeatured === true).slice(0, 4));
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      gsap.utils.toArray('.reveal-text').forEach((el) => {
        gsap.fromTo(el, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
        });
      });

      gsap.to(storyLeftRef.current, {
        y: -50,
        ease: "none",
        scrollTrigger: { trigger: storyLeftRef.current, start: "top bottom", end: "bottom top", scrub: true }
      });
      
      gsap.to(storyRightRef.current, {
        y: -100,
        ease: "none",
        scrollTrigger: { trigger: storyRightRef.current, start: "top bottom", end: "bottom top", scrub: true }
      });
    }
  }, [isLoading]);

  return (
    <main className="relative w-full overflow-hidden font-sans text-[#FDFBFF] bg-[#090212]">
      
      <GlobalCanvas />
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#090212] z-0 pointer-events-none"></div>

      <Navbar />

      <div className="relative z-10 pointer-events-none pt-32">
        
        {/* --- HERO SECTION --- */}
        <section className="h-[75vh] flex flex-col items-center justify-center text-center px-4">
          <div className="pointer-events-auto reveal-text text-white"> 
            <h1 className="text-5xl md:text-8xl font-light tracking-widest uppercase mb-4 drop-shadow-2xl">
              Ayesha's
              <span className="block font-serif font-bold italic lowercase text-5xl md:text-8xl mt-2 text-[#D1A3FF] drop-shadow-[0_0_20px_rgba(209,163,255,0.3)]">
                signature
              </span>
            </h1>
            <p className="text-xs md:text-sm tracking-[0.4em] uppercase opacity-70 mt-8">
              Elegance in every thread
            </p>
          </div>
        </section>

        {/* --- STORY SECTION --- */}
        <section className="py-24 px-6 md:px-16 lg:px-24 w-full">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-24 pointer-events-auto">
            <div className="w-full md:w-1/2" ref={storyLeftRef}>
              <p className="text-[#D1A3FF] text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Our Journey</p>
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                "Nothing but faith <br /> 
                <span className="text-[#D1A3FF] italic font-light">and a vision."</span>
              </h2>
            </div>

            <div className="w-full md:w-1/2 md:mt-12" ref={storyRightRef}>
              <div className="bg-white/5 p-8 rounded-3xl backdrop-blur-md border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <p className="text-sm md:text-lg opacity-80 leading-relaxed mb-6 font-light">
                  One year ago, I started with a simple promise: if you are looking for affordable, intentional Muslim packages, I am your right choice. Alhamdulillah, you didn't just support a business—you supported a dream. 
                </p>
                <p className="text-sm md:text-lg opacity-80 leading-relaxed mb-8 font-light">
                  For a whole year, you've trusted Ayesha's Signature with your Ramadan packages, bespoke prayer sets, and premium hijabs. Let me help you craft the perfect, meaningful gift once again.
                </p>
                <Link href="/shop" className="inline-block px-10 py-4 bg-[#FDF8F5] text-black rounded-full uppercase tracking-[0.2em] text-[10px] font-bold transition-all hover:bg-[#DDA7A5] hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105">
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- MARQUEE --- */}
        <section className="w-full py-5 overflow-hidden flex whitespace-nowrap border-y border-white/5 pointer-events-auto bg-[#030105]/80 backdrop-blur-md mt-10">
          <div className="animate-marquee flex gap-12 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase items-center text-[#D1A3FF] opacity-90">
            <span>✦ Premium Hijabs</span><span>✦ Prayer Mats</span><span>✦ Gift Box</span><span>✦ Hijab Bouquet</span>
            <span>✦ Premium Hijabs</span><span>✦ Prayer Mats</span><span>✦ Gift Box</span><span>✦ Hijab Bouquet</span>
          </div>
        </section>

        {/* --- SHOP GRID --- */}
        <section className="py-24 px-6 md:px-16 lg:px-24 relative z-20 pointer-events-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 reveal-text text-center md:text-left border-b border-white/10 pb-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">Curated Selection</h2>
            </div>

            {isLoading ? (
              <div className="text-center py-20"><p className="opacity-50 uppercase tracking-widest text-[10px]">Loading collection...</p></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20"><p className="opacity-50 uppercase tracking-widest text-[10px]">No products featured yet.</p></div>
            ) : (
              <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 gap-y-12 mt-10">
                {products.map((product) => (
                  <div key={product.id} className="group cursor-pointer reveal-text">
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#111] rounded-lg shadow-sm border border-white/5">
                      <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                    </div>
                    <div className="mt-4 flex flex-col items-start gap-1">
                      <h3 className="text-xs md:text-sm font-serif font-bold group-hover:text-[#D1A3FF] transition-colors">{product.name}</h3>
                      {product.price && <p className="text-[10px] opacity-50 tracking-widest">{product.price}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* --- CENTERED & SPACED BUTTON --- */}
            <div className="mt-20 flex justify-center reveal-text">
              <Link href="/shop" className="group relative px-10 py-4 overflow-hidden rounded-full border border-white/20 bg-transparent text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:border-[#DDA7A5] inline-block">
                <span className="relative z-10 group-hover:text-black transition-colors duration-500">View Full Collection</span>
                <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-[#DDA7A5] transition-transform duration-500 group-hover:scale-100 z-0"></div>
              </Link>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/10 bg-[#030105] py-16 px-6 pointer-events-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <h2 className="font-serif font-bold text-lg tracking-wide mb-1">Ayesha's Signature</h2>
              <p className="text-[10px] opacity-50 tracking-[0.2em] uppercase">Elegance in every thread.</p>
            </div>
            <div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#D1A3FF] transition-colors">TikTok</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#D1A3FF] transition-colors">WhatsApp</a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 text-center text-[9px] opacity-30 tracking-[0.3em] uppercase">
            &copy; {new Date().getFullYear()} Ayesha's Signature. All Rights Reserved.
          </div>
        </footer>

      </div>
    </main>
  );
}