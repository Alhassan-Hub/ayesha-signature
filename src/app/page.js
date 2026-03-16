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

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
   const gridRef = useRef(null);
   
  const WHATSAPP_URL = "https://wa.me/23272273689?text=Hello%20Ayesha!";
  const TIKTOK_URL = "https://www.tiktok.com/@ayeshassignature1";
  
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
        gsap.fromTo(el, { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
        });
      });
    }
  }, [isLoading]);

  return (
    // LIGHT THEME: Soft Cream Background
    <main className="relative w-full overflow-hidden font-sans bg-[#FAF9F6] text-[#2C2424]">
      
      <Navbar />

      <div className="relative z-10 pt-32">
        
        {/* --- THE BIOGRAPHY HERO SECTION --- */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-16 lg:px-24">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
            
            {/* Left: Ayesha's Story */}
            <div className="w-full md:w-3/5 reveal-text">
              <p className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Meet the Founder</p>
              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8 text-[#2C2424]">
                "Nothing but faith <br /> 
                <span className="text-[#DDA7A5] italic font-light">and a vision."</span>
              </h1>
              <p className="text-sm md:text-lg opacity-80 leading-relaxed mb-6 font-light">
                Assalamu alaikum. I'm Ayesha. One year ago, I came on here with a simple promise: if you are looking for affordable, intentional Muslim packages, then I am your right choice. Alhamdulillah, you guys believed in me.
              </p>
              <p className="text-sm md:text-lg opacity-80 leading-relaxed mb-10 font-light">
                For a whole year, you have trusted me with your Ramadan packages, your prayer sets, and your hijabs. You didn't just support a business—you supported a dream. As we prepare for this beautiful season of Ibadah, let me help you craft the perfect, meaningful gift once again.
              </p>
              <Link href="/shop" className="inline-block px-10 py-4 bg-[#DDA7A5] text-white rounded-full uppercase tracking-widest text-[10px] font-bold transition-all hover:bg-[#D4AF37] shadow-lg">
                Explore The Collection
              </Link>
            </div>

           {/* Right: Elegant Logo Placeholder */}
            <div className="w-full md:w-2/5 reveal-text">
              <div className="w-full aspect-[3/4] bg-white rounded-t-full p-2 shadow-xl border border-gray-100">
                <div className="w-full h-full rounded-t-full bg-[#FDF8F5] overflow-hidden relative flex items-center justify-center">
                  
                  {/* Shows the logo perfectly centered in the arch */}
                  <img src="/logo.png" alt="Ayesha's Signature" className="w-1/2 h-auto object-contain opacity-60" />

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- SCROLLING MARQUEE (Rose Gold) --- */}
        <section className="w-full py-5 overflow-hidden flex whitespace-nowrap bg-[#FDF8F5] border-y border-[#DDA7A5]/20 mt-16">
          <div className="animate-marquee flex gap-12 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase items-center text-[#DDA7A5]">
            <span>✦ Premium Hijabs</span><span>✦ Prayer Mats</span><span>✦ Gift Box</span><span>✦ Hijab Bouquet</span>
            <span>✦ Premium Hijabs</span><span>✦ Prayer Mats</span><span>✦ Gift Box</span><span>✦ Hijab Bouquet</span>
          </div>
        </section>

        {/* --- SHOP GRID --- */}
        <section className="py-24 px-6 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 reveal-text text-center border-b border-gray-200 pb-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2424]">Curated Selection</h2>
            </div>

            {isLoading ? (
              <div className="text-center py-20"><p className="opacity-50 uppercase tracking-widest text-[10px]">Loading collection...</p></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20"><p className="opacity-50 uppercase tracking-widest text-[10px]">No products featured yet.</p></div>
            ) : (
              <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 gap-y-10">
                {products.map((product) => (
                  <div key={product.id} className="group cursor-pointer reveal-text flex flex-col bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-gray-50 mb-4">
                      <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110" />
                    </div>
                    <div className="flex flex-col items-start gap-1 px-1">
                      <h3 className="text-xs md:text-sm font-serif font-bold group-hover:text-[#DDA7A5] transition-colors">{product.name}</h3>
                      {product.price && <p className="text-[10px] opacity-60 tracking-widest mb-3">{product.price}</p>}
                    </div>
                    <a 
                      href={`https://wa.me/23272273689?text=${encodeURIComponent(`Hello Ayesha! I would like to order this item:\n\n*${product.name}*\n${product.price ? `Price: ${product.price}\n` : ''}Image: ${product.imageUrl}`)}`} 
                      target="_blank" rel="noopener noreferrer"
                      className="mt-auto w-full py-3 text-center border border-[#DDA7A5] text-[#DDA7A5] text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#DDA7A5] hover:text-white transition-all duration-300 rounded-lg"
                    >
                      Order Now
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-16 flex justify-center reveal-text pb-6">
              <Link href="/shop" className="group relative px-10 py-4 overflow-hidden rounded-full border border-[#DDA7A5] bg-transparent text-[#DDA7A5] text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:text-white">
                <span className="relative z-10">View Full Collection</span>
                <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-[#DDA7A5] transition-transform duration-500 group-hover:scale-100 z-0"></div>
              </Link>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-gray-200 bg-white py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left flex flex-col items-center md:items-start">
              <img src="/logo.png" alt="Ayesha's Signature" className="h-10 w-auto object-contain mb-4" onError={(e) => e.target.style.display='none'} />
              <h2 className="font-serif font-bold text-lg tracking-wide mb-1 text-[#2C2424]">Ayesha's Signature</h2>
              <p className="text-[10px] opacity-60 tracking-[0.2em] uppercase">Elegance in every thread.</p>
            </div>
            <div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] uppercase opacity-70">
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#DDA7A5] transition-colors">TikTok</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#DDA7A5] transition-colors">WhatsApp</a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 text-center text-[9px] opacity-40 tracking-[0.3em] uppercase">
            &copy; {new Date().getFullYear()} Ayesha's Signature. All Rights Reserved.
          </div>
        </footer>

      </div>
    </main>
  );
}