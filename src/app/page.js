"use client";
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import { db } from '@/utils/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Lenis from 'lenis';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

const defaultReviews = [
  { text: `"The packaging was absolutely stunning. I ordered the Signature Box for my mother and it exceeded all expectations. The quality of the hijab is incredible."`, name: "Fatima S.", initial: "F" },
  { text: `"I requested a custom engraved prayer mat for my husband. It arrived perfectly on time and the detail is flawless. Will definitely be ordering my Ramadan gifts here."`, name: "Mariam K.", initial: "M" },
  { text: `"Alhamdulillah, finally a luxury modest brand that actually cares about the details. From the customer service to the fabric quality, everything is 10/10."`, name: "Zainab A.", initial: "Z" }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [liveReviews, setLiveReviews] = useState(defaultReviews);
  const [isLoading, setIsLoading] = useState(true);
  const [activeReview, setActiveReview] = useState(0);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const storyLeftRef = useRef(null);
  const storyRightRef = useRef(null);

  const WHATSAPP_URL = "https://wa.me/23272273689?text=Hello%20Ayesha!";
  const TIKTOK_URL = "https://www.tiktok.com/@ayeshassignature1";

  // Review Transition Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % liveReviews.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [liveReviews.length]);

  // Smooth Scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Firebase Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const qProd = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapProd = await getDocs(qProd);
        const liveProds = [];
        snapProd.forEach((doc) => liveProds.push({ id: doc.id, ...doc.data() }));
        setProducts(liveProds.filter(item => item.isFeatured === true).slice(0, 4));

        const qRev = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const snapRev = await getDocs(qRev);
        if (!snapRev.empty) {
          const revs = [];
          snapRev.forEach((doc) => revs.push({ id: doc.id, ...doc.data() }));
          setLiveReviews(revs);
        }
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!isLoading) {
      gsap.utils.toArray('.reveal-text').forEach((el) => {
        gsap.fromTo(el, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } });
      });
      gsap.to(storyLeftRef.current, { y: -30, ease: "none", scrollTrigger: { trigger: storyLeftRef.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.to(storyRightRef.current, { y: -80, ease: "none", scrollTrigger: { trigger: storyRightRef.current, start: "top bottom", end: "bottom top", scrub: true } });
    }
  }, [isLoading]);

  return (
    <main className="relative w-full overflow-hidden font-sans bg-[#FAF9F6] text-[#2C2424]">
      <Navbar externalOpenState={isAboutOpen} setExternalOpenState={setIsAboutOpen} />

      <div className="relative z-10 pt-32">
        
        {/* HERO SECTION WITH GOLD PARTICLES */}
        <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="dust-particle" 
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  width: `${Math.random() * 3 + 1}px`, 
                  height: `${Math.random() * 3 + 1}px`, 
                  animationDuration: `${Math.random() * 5 + 5}s`, 
                  animationDelay: `${Math.random() * 5}s`,
                  backgroundColor: '#DDA7A5',
                  position: 'absolute',
                  borderRadius: '50%',
                  opacity: 0.4
                }}
              ></div>
            ))}
          </div>
          <div className="reveal-text z-10"> 
            <h1 className="text-6xl md:text-9xl font-light tracking-tighter mb-4">Ayesha's<span className="block font-serif font-bold italic lowercase text-6xl md:text-9xl mt-2 text-[#DDA7A5]">signature</span></h1>
            <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase opacity-60 mt-8 font-bold">Elegance in every thread</p>
          </div>
        </section>

        {/* PROFESSIONAL BIOGRAPHY SECTION */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 mb-24">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-12 md:gap-24">
            <div className="w-full md:w-3/5 reveal-text order-2 md:order-1" ref={storyLeftRef}>
              <p className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.4em] mb-4">The Heart of the Brand</p>
              <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8 text-[#2C2424]">
                Crafting elegance, <br /> 
                <span className="text-[#DDA7A5] italic font-light">with purpose.</span>
              </h2>
              <div className="space-y-6 text-sm md:text-base opacity-90 leading-relaxed font-light text-gray-700">
                <p>Isata Barrie is a passionate entrepreneur and final-year student at <strong>IPAM</strong>, specializing in Procurement and Supply Chain Management. Her academic foundation, paired with her work at <strong>Watu Simu</strong>, drives the excellence behind Ayesha's Signature.</p>
                <p>As the founder, Isata has built a brand rooted in creativity and authenticity. Proudly <strong>Fullah</strong> by tribe and <strong>Muslim</strong> by faith, she is guided by values of integrity and service.</p>
                <p className="italic border-l-4 border-[#DDA7A5] pl-6 py-2 text-[#2C2424] font-serif text-lg">"Success is measured by the positive impact one makes in the lives of others."</p>
              </div>
              <div className="mt-12 flex flex-wrap gap-8 items-center">
                <Link href="/shop" className="inline-block px-12 py-5 bg-[#2C2424] text-white rounded-full uppercase tracking-widest text-[10px] font-bold transition-all hover:bg-[#DDA7A5] hover:scale-105 shadow-xl">Explore The Collection</Link>
                <button onClick={() => setIsAboutOpen(true)} className="text-[10px] uppercase tracking-widest font-bold border-b-2 border-[#DDA7A5] pb-1 hover:text-[#DDA7A5] transition-all">Read Full Story</button>
              </div>
            </div>
            <div className="w-full md:w-2/5 reveal-text order-1 md:order-2" ref={storyRightRef}>
              <div className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 group">
                <img src="/ayesha.jpg" alt="Isata Barrie" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1589467332212-003661eb1a47?auto=format&fit=crop&q=80&w=800"; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2424]/80 via-transparent to-transparent flex items-end p-10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mb-1">Founder & CEO</p>
                    <p className="text-2xl font-serif font-bold text-white tracking-wide">Isata Barrie</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RESTORED SCROLLING MARQUEE */}
        <section className="w-full py-8 overflow-hidden flex whitespace-nowrap bg-[#FDF8F5] border-y border-[#DDA7A5]/20 my-16">
          <div className="animate-marquee flex gap-12 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase items-center text-[#DDA7A5]">
            <span>✦ Premium Hijabs</span><span>✦ Prayer Mats</span><span>✦ Gift Box</span><span>✦ Hijab Bouquet</span>
            <span>✦ Premium Hijabs</span><span>✦ Prayer Mats</span><span>✦ Gift Box</span><span>✦ Hijab Bouquet</span>
            <span>✦ Premium Hijabs</span><span>✦ Prayer Mats</span><span>✦ Gift Box</span><span>✦ Hijab Bouquet</span>
          </div>
        </section>

        {/* SHOP GRID SECTION (BEAUTIFUL HEADLINE RESTORED) */}
        <section className="py-24 px-6 md:px-16 lg:px-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 reveal-text text-center border-b border-gray-100 pb-10">
                <p className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Our Selection</p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#2C2424]">The Featured Edit</h2>
            </div>
            
            {isLoading ? (
              <div className="text-center py-20"><p className="opacity-50 uppercase tracking-widest text-[10px] animate-pulse">Loading Collection...</p></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-12">
                {products.map((product) => (
                  <div key={product.id} className="group flex flex-col bg-[#FAF9F6] p-4 rounded-3xl border border-transparent hover:border-gray-100 hover:shadow-2xl transition-all duration-500">
                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-gray-50 mb-6 shadow-sm">
                        <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110" />
                    </div>
                    <div className="px-1 mb-6">
                        <h3 className="text-xs md:text-sm font-serif font-bold mb-1 text-[#2C2424]">{product.name}</h3>
                        <p className="text-[10px] text-[#DDA7A5] font-bold tracking-widest uppercase">{product.price}</p>
                    </div>
                    <a href={`https://wa.me/23272273689?text=${encodeURIComponent(`Hello Ayesha! I'm interested in: ${product.name}`)}`} target="_blank" className="mt-auto w-full py-4 text-center bg-[#DDA7A5] text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#2C2424] transition-all duration-300 rounded-xl shadow-lg">Order Now</a>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-20 flex justify-center reveal-text">
              <Link href="/shop" className="px-12 py-5 border-2 border-[#DDA7A5] text-[#DDA7A5] rounded-full uppercase tracking-widest text-[10px] font-bold hover:bg-[#DDA7A5] hover:text-white transition-all">View Full Collection</Link>
            </div>
          </div>
        </section>

        {/* RESTORED TRANSITIONING REVIEWS */}
        <section className="py-32 px-6 md:px-16 lg:px-24 bg-[#FDF8F5] border-y border-[#DDA7A5]/20">
          <div className="max-w-4xl mx-auto text-center reveal-text">
            <p className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2424] mb-16">Client Love</h2>
            <div className="relative h-[300px] md:h-[200px] flex items-center justify-center">
              {liveReviews.map((review, idx) => (
                <div key={idx} className={`absolute w-full transition-all duration-1000 ease-in-out flex flex-col items-center ${activeReview === idx ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
                  <div className="text-[#D4AF37] text-xl mb-6">★★★★★</div>
                  <p className="text-lg md:text-2xl text-gray-600 italic font-light leading-relaxed mb-8 max-w-2xl">"{review.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#DDA7A5]/20 rounded-full flex items-center justify-center text-[#DDA7A5] font-serif font-bold text-xl">{review.initial || review.name[0]}</div>
                    <div className="text-left"><h4 className="text-xs font-bold text-[#2C2424] uppercase tracking-widest">{review.name}</h4><p className="text-[9px] text-gray-400 uppercase tracking-widest">Verified Buyer</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER WITH RESTORED TIKTOK */}
        <footer className="bg-[#2C2424] text-white py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col items-center md:items-start space-y-6">
  {/* This image now fully deletes itself if not found, removing the white box */}
  <img 
    src="/logo.png" 
    alt="" 
    className="h-10 w-auto object-contain" 
    style={{ filter: 'brightness(0) invert(1)' }}
    onError={(e) => e.currentTarget.remove()} 
  />
  <h2 className="font-serif font-bold text-2xl tracking-widest italic text-[#DDA7A5]">signature</h2>
  <p className="text-[10px] md:text-[11px] opacity-60 uppercase tracking-[0.2em] leading-loose max-w-xs">
    Premium modest fashion and luxury Islamic gifting crafted with intention in Sierra Leone.
  </p>
</div>
            <div>
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#DDA7A5] mb-8 underline underline-offset-8">Navigation</h3>
               <ul className="text-[11px] uppercase tracking-widest space-y-5 opacity-80 font-bold">
                  <li><Link href="/" className="hover:text-[#DDA7A5] transition-colors">Home</Link></li>
                  <li><Link href="/shop" className="hover:text-[#DDA7A5] transition-colors">The Collection</Link></li>
                  <li><button onClick={() => setIsAboutOpen(true)} className="hover:text-[#DDA7A5] transition-colors">Our Story</button></li>
               </ul>
            </div>
            <div>
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#DDA7A5] mb-8 underline underline-offset-8">Connect</h3>
               <ul className="text-[11px] uppercase tracking-widest space-y-5 opacity-80 font-bold">
                  <li><a href={WHATSAPP_URL} target="_blank" className="hover:text-[#DDA7A5]">WhatsApp</a></li>
                  <li><a href={TIKTOK_URL} target="_blank" className="hover:text-[#DDA7A5]">TikTok</a></li>
                  <li><p className="opacity-50">Freetown, Sierra Leone</p></li>
               </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 text-center text-[9px] text-white/30 tracking-[0.4em] uppercase">
            <p>&copy; {new Date().getFullYear()} Ayesha's Signature. All Rights Reserved.</p>
          </div>
        </footer>

      </div>
    </main>
  );
}