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

// FALLBACK REVIEWS (Used only if her database is empty)
const defaultReviews = [
  { text: `"The packaging was absolutely stunning. I ordered the Signature Box for my mother and it exceeded all expectations. The quality of the hijab is incredible."`, name: "Fatima S.", initial: "F" },
  { text: `"I requested a custom engraved prayer mat for my husband. It arrived perfectly on time and the detail is flawless. Will definitely be ordering my Ramadan gifts here."`, name: "Mariam K.", initial: "M" },
  { text: `"Alhamdulillah, finally a luxury modest brand that actually cares about the details. From the customer service to the fabric quality, everything is 10/10."`, name: "Zainab A.", initial: "Z" }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [liveReviews, setLiveReviews] = useState(defaultReviews); // Holds Firebase reviews
  const [isLoading, setIsLoading] = useState(true);
  const [activeReview, setActiveReview] = useState(0);

  const storyLeftRef = useRef(null);
  const storyRightRef = useRef(null);

  const WHATSAPP_URL = "https://wa.me/23272273689?text=Hello%20Ayesha!";
  const TIKTOK_URL = "https://www.tiktok.com/@ayeshassignature1";

  // Fading Review Timer (Automatically adjusts to how many reviews she uploads!)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % liveReviews.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [liveReviews.length]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // Fetch Products & Reviews from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch 4 Homepage Products
        const qProd = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapProd = await getDocs(qProd);
        const liveProds = [];
        snapProd.forEach((doc) => liveProds.push({ id: doc.id, ...doc.data() }));
        setProducts(liveProds.filter(item => item.isFeatured === true).slice(0, 4));

        // Fetch Live Reviews
        const qRev = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const snapRev = await getDocs(qRev);
        if (!snapRev.empty) {
          const revs = [];
          snapRev.forEach((doc) => revs.push({ id: doc.id, ...doc.data() }));
          setLiveReviews(revs); // Overrides the defaults!
        }
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

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
      <Navbar />
      <div className="relative z-10 pt-32">
        
        {/* HERO SECTION */}
        <section className="relative h-[75vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="dust-particle" style={{ left: `${Math.random() * 100}%`, width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`, animationDuration: `${Math.random() * 5 + 5}s`, animationDelay: `${Math.random() * 5}s` }}></div>
            ))}
          </div>
          <div className="pointer-events-auto reveal-text text-[#2C2424] z-10"> 
            <h1 className="text-5xl md:text-8xl font-light tracking-widest uppercase mb-4">Ayesha's<span className="block font-serif font-bold italic lowercase text-5xl md:text-8xl mt-2 text-[#DDA7A5]">signature</span></h1>
            <p className="text-xs md:text-sm tracking-[0.4em] uppercase opacity-70 mt-8">Elegance in every thread</p>
          </div>
        </section>

        {/* BIOGRAPHY SECTION */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 mb-16">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-3/5 reveal-text" ref={storyLeftRef}>
              <p className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Meet the Founder</p>
              <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-8 text-[#2C2424]">"Nothing but faith <br /> <span className="text-[#DDA7A5] italic font-light">and a vision."</span></h1>
              <p className="text-sm md:text-lg opacity-80 leading-relaxed mb-6 font-light">Assalamu alaikum. I'm Ayesha. One year ago, I came on here with a simple promise: if you are looking for affordable, intentional Muslim packages, then I am your right choice. Alhamdulillah, you guys believed in me.</p>
              <p className="text-sm md:text-lg opacity-80 leading-relaxed mb-10 font-light">For a whole year, you have trusted me with your Ramadan packages, your prayer sets, and your hijabs. You didn't just support a business—you supported a dream. As we prepare for this beautiful season of Ibadah, let me help you craft the perfect, meaningful gift once again.</p>
              <Link href="/shop" className="inline-block px-10 py-4 bg-[#DDA7A5] text-white rounded-full uppercase tracking-widest text-[10px] font-bold transition-all hover:bg-[#D4AF37] shadow-lg">Explore The Collection</Link>
            </div>
            <div className="w-full md:w-2/5 reveal-text mt-8 md:mt-0" ref={storyRightRef}>
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                <img src="/ayesha.jpg" alt="Ayesha - Founder" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1589467332212-003661eb1a47?auto=format&fit=crop&q=80&w=800"; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* SCROLLING MARQUEE */}
        <section className="w-full py-5 overflow-hidden flex whitespace-nowrap bg-[#FDF8F5] border-y border-[#DDA7A5]/20 mt-16">
          <div className="animate-marquee flex gap-12 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase items-center text-[#DDA7A5]">
            <span>✦ Premium Hijabs</span><span>✦ Prayer Mats</span><span>✦ Gift Box</span><span>✦ Hijab Bouquet</span>
            <span>✦ Premium Hijabs</span><span>✦ Prayer Mats</span><span>✦ Gift Box</span><span>✦ Hijab Bouquet</span>
          </div>
        </section>

        {/* SHOP GRID */}
        <section className="py-24 px-6 md:px-16 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 reveal-text text-center border-b border-gray-200 pb-6"><h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2424]">Curated Selection</h2></div>
            {isLoading ? (
              <div className="text-center py-20"><p className="opacity-50 uppercase tracking-widest text-[10px]">Loading collection...</p></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20"><p className="opacity-50 uppercase tracking-widest text-[10px]">No products featured yet.</p></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 gap-y-10">
                {products.map((product) => (
                  <div key={product.id} className="group cursor-pointer reveal-text flex flex-col bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-gray-50 mb-4"><img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-110" /></div>
                    <div className="flex flex-col items-start gap-1 px-1"><h3 className="text-xs md:text-sm font-serif font-bold group-hover:text-[#DDA7A5] transition-colors line-clamp-1">{product.name}</h3>{product.price && <p className="text-[10px] opacity-60 tracking-widest mb-3">{product.price}</p>}</div>
                    <a href={`https://wa.me/23272273689?text=${encodeURIComponent(`Hello Ayesha! I would like to order this item:\n\n*${product.name}*\n${product.price ? `Price: ${product.price}\n` : ''}Image: ${product.imageUrl}`)}`} target="_blank" rel="noopener noreferrer" className="mt-auto w-full py-3 text-center border border-[#DDA7A5] text-[#DDA7A5] text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#DDA7A5] hover:text-white transition-all duration-300 rounded-lg">Order Now</a>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-16 flex justify-center reveal-text pb-6">
              <Link href="/shop" className="group relative px-10 py-4 overflow-hidden rounded-full border border-[#DDA7A5] bg-transparent text-[#DDA7A5] text-[10px] font-bold tracking-[0.2em] uppercase transition-all hover:text-white"><span className="relative z-10">View Full Collection</span><div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-[#DDA7A5] transition-transform duration-500 group-hover:scale-100 z-0"></div></Link>
            </div>
          </div>
        </section>

        {/* --- CUSTOMER REVIEWS (DYNAMIC FROM FIREBASE!) --- */}
        <section className="py-24 px-6 md:px-16 lg:px-24 bg-[#FDF8F5] border-y border-[#DDA7A5]/20">
          <div className="max-w-3xl mx-auto text-center reveal-text">
            <p className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Client Love</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C2424] mb-12">What they say about us</h2>

            <div className="relative h-[280px] md:h-[200px] w-full flex justify-center items-center">
              {liveReviews.map((review, idx) => (
                <div key={idx} className={`absolute w-full px-4 transition-all duration-1000 ease-in-out flex flex-col items-center ${activeReview === idx ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 -z-10 pointer-events-none'}`}>
                  <div className="flex text-[#D4AF37] text-xl mb-6">★★★★★</div>
                  <p className="text-gray-600 font-light leading-relaxed italic text-base md:text-lg mb-8 max-w-2xl">{review.text}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#DDA7A5]/20 rounded-full flex items-center justify-center text-[#DDA7A5] font-serif font-bold text-lg">{review.initial}</div>
                    <div className="text-left"><h4 className="text-xs font-bold text-[#2C2424] uppercase tracking-widest">{review.name}</h4><p className="text-[9px] text-gray-400 uppercase tracking-widest">Verified Buyer</p></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-3 mt-4">
              {liveReviews.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${activeReview === idx ? 'w-8 bg-[#DDA7A5]' : 'w-2 bg-gray-300'}`}></div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white py-16 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <img src="/logo.png" alt="Ayesha's Signature" className="h-12 w-auto object-contain mb-4" onError={(e) => e.target.style.display='none'} />
              <h2 className="font-serif font-bold text-lg tracking-wide mb-2 text-[#2C2424]">Ayesha's Signature</h2>
              <p className="text-[10px] opacity-60 tracking-[0.2em] uppercase leading-relaxed max-w-xs">Premium modest fashion and luxury Islamic gifting. Elegance in every thread.</p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#DDA7A5] mb-4">Contact Us</h3>
              <ul className="text-xs text-gray-500 flex flex-col gap-3">
                <li><a href={WHATSAPP_URL} className="hover:text-[#DDA7A5] transition-colors">WhatsApp: +232 72 273689</a></li>
                <li><a href="mailto:contact@ayeshas-signature.com" className="hover:text-[#DDA7A5] transition-colors">contact@ayeshas-signature.com</a></li>
                <li><a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#DDA7A5] transition-colors">TikTok: @ayeshassignature1</a></li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#DDA7A5] mb-4">Delivery & Policies</h3>
              <ul className="text-xs text-gray-500 flex flex-col gap-3 font-light">
                <li className="flex items-start gap-2 justify-center md:justify-start"><span className="text-[#DDA7A5]">✦</span> Nationwide delivery across Sierra Leone.</li>
                <li className="flex items-start gap-2 justify-center md:justify-start"><span className="text-[#DDA7A5]">✦</span> Standard delivery within 2-4 business days.</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-100 text-center text-[9px] text-gray-400 tracking-[0.3em] uppercase flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Ayesha's Signature. All Rights Reserved.</p>
            <p>Designed for Modest Elegance.</p>
          </div>
        </footer>

      </div>
    </main>
  );
}