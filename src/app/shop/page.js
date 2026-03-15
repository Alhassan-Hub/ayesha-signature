"use client";
import React, { useEffect, useState, useRef, Suspense } from 'react';
import { db } from '@/utils/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import CustomizerModal from '@/components/CustomizerModal';
import GlobalCanvas from '@/components/GlobalCanvas';
import Link from 'next/link';

const modelConfigs = {
  'magic-cup': { scale: 1.7, position: [0, 0, 0], rotation: [0, 0, 0] },
  'prayer-mat': { scale: 0.3, position: [0, 0, 0], rotation: [Math.PI / 6, 0, 0] },
  'signature-hijab': { scale: 0.3, position: [0, 0, 0], rotation: [0, Math.PI / 4, 0] }
};

useGLTF.preload('/cup.glb');
useGLTF.preload('/mat.glb');
useGLTF.preload('/hijab.glb');

function CarouselItem({ file, isCurrent, config }) {
  const { scene } = useGLTF(file);
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const targetScale = isCurrent ? config.scale : 0;
    const currentScale = groupRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 5);
    
    groupRef.current.scale.set(nextScale, nextScale, nextScale);
    groupRef.current.visible = nextScale > 0.01;

    if (isCurrent) groupRef.current.rotation.y += delta * 0.4; 
    else groupRef.current.rotation.y = 0; 
  });

  return (
    <group position={config.position} rotation={[config.rotation[0], 0, config.rotation[2]]}>
      <group ref={groupRef} scale={0}>
        <Float speed={isCurrent ? 2 : 0} rotationIntensity={0} floatIntensity={isCurrent ? 0.2 : 0}>
          <Center><primitive object={scene} /></Center>
        </Float>
      </group>
    </group>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCustomizer, setActiveCustomizer] = useState(null); 
  const [currentIndex, setCurrentIndex] = useState(0);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('ayeshas_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    setIsCartLoaded(true);
  }, []);

  useEffect(() => {
    if (isCartLoaded) localStorage.setItem('ayeshas_cart', JSON.stringify(cart));
  }, [cart, isCartLoaded]);

  const customItems = [
    { id: 'magic-cup', title: 'The Magic Cup', tag: 'Personalized Engraving', file: '/cup.glb' },
    { id: 'prayer-mat', title: 'Premium Prayer Mat', tag: 'Custom Engraving', file: '/mat.glb' },
    { id: 'signature-hijab', title: 'Signature Hijab', tag: 'Color Selection', file: '/hijab.glb' }
  ];

  const activeItem = customItems[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!activeCustomizer) setCurrentIndex((prev) => (prev + 1) % customItems.length);
    }, 8000); 
    return () => clearInterval(timer);
  }, [customItems.length, activeCustomizer]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const liveProducts = [];
        snapshot.forEach((doc) => liveProducts.push({ id: doc.id, ...doc.data() }));
        setProducts(liveProducts);
      } catch (error) { console.error(error); } finally { setIsLoading(false); }
    };
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) return prevCart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prevCart, { ...product, qty: 1 }];
    });
    setIsCartOpen(true); 
  };

  const removeFromCart = (productId) => setCart((prevCart) => prevCart.filter(item => item.id !== productId));

  // NEW: UPDATED CART CHECKOUT (Includes Image URLs and Bullet points)
  const checkoutViaWhatsApp = () => {
    if (cart.length === 0) return;
    const itemList = cart.map(item => `▪ ${item.qty}x *${item.name}*\nImage: ${item.imageUrl}`).join('\n\n');
    const msg = `Hello Ayesha! I would like to place an order from your website:\n\n${itemList}\n\nPlease let me know the total and payment details. Thank you!`;
    window.open(`https://wa.me/23272273689?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#090212] text-[#FDFBFF] font-sans overflow-x-hidden relative">
      <GlobalCanvas />
      <div className="absolute inset-0 bg-[#0A0808]/70 z-0 pointer-events-none" />

      <nav className="fixed top-0 w-full z-40 bg-transparent pointer-events-auto mix-blend-difference">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative">
          <Link href="/" className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2 z-10">
            <span>←</span> Back
          </Link>
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="font-serif font-bold text-[14px] tracking-[0.2em] text-[#FDF8F5] uppercase">Ayesha's Signature</Link>
          </div>
          <div className="w-16 hidden md:block"></div>
        </div>
      </nav>

      <button onClick={() => setIsCartOpen(true)} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        {isCartLoaded && cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#DDA7A5] text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {cart.reduce((total, item) => total + item.qty, 0)}
          </span>
        )}
      </button>

      <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-[#0A0808]/95 backdrop-blur-3xl z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col shadow-2xl border-l border-white/10 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="font-serif font-bold text-xl text-white">Your Bag</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-white/50 hover:text-white text-sm uppercase tracking-widest font-bold">Close ✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="text-[10px] uppercase tracking-[0.2em]">Your bag is empty.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-1">
                  <h3 className="text-sm font-serif font-bold text-white line-clamp-1">{item.name}</h3>
                  <p className="text-[10px] text-[#DDA7A5] tracking-widest mt-1">Qty: {item.qty}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-red-400 text-xs font-bold px-2">✕</button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-black/50">
            <button onClick={checkoutViaWhatsApp} className="w-full py-5 bg-[#FDF8F5] text-black font-bold text-[10px] uppercase tracking-[0.3em] rounded-xl hover:bg-[#DDA7A5] hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Checkout via WhatsApp
            </button>
          </div>
        )}
      </div>

      <div className="relative w-full h-screen flex flex-col items-center justify-center z-10">
        <div className="absolute top-32 text-center z-20 pointer-events-none px-4">
          <span className="text-[#DDA7A5] text-[10px] font-semibold uppercase tracking-[0.4em]">{activeItem.tag}</span>
          <h1 className="text-3xl md:text-4xl font-serif mt-4 text-[#FDF8F5] tracking-widest font-light drop-shadow-lg transition-all duration-500">{activeItem.title}</h1>
        </div>

        {!activeCustomizer && (
          <div className="absolute inset-0 w-full h-full z-10 pointer-events-none animate-in fade-in duration-700">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-[#DDA7A5] text-[10px] uppercase tracking-widest">Loading 3D Studio...</div>}>
              <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <ambientLight intensity={1.5} color="#FFF5F0" />
                <spotLight position={[5, 10, 5]} intensity={2.5} color="#DDA7A5" />
                <Environment preset="studio" />
                {customItems.map((item, index) => (
                  <CarouselItem key={item.id} file={item.file} isCurrent={currentIndex === index} config={modelConfigs[item.id]} />
                ))}
                <ContactShadows position={[0, -1.8, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#000000" />
              </Canvas>
            </Suspense>
          </div>
        )}

        <div className="absolute bottom-20 w-full flex flex-col items-center gap-6 z-20 pointer-events-none">
          <button 
            onClick={() => setActiveCustomizer({ ...activeItem, config: modelConfigs[activeItem.id] })}
            className="pointer-events-auto px-12 py-4 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-bold rounded-full hover:bg-[#DDA7A5] hover:text-white transition-colors duration-500 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          >
            Customize in 3D
          </button>
          <div className="flex items-center gap-3">
            {customItems.map((_, idx) => (
              <div key={idx} className={`h-[2px] transition-all duration-700 ease-in-out rounded-full pointer-events-auto cursor-pointer ${currentIndex === idx ? 'w-8 bg-[#DDA7A5]' : 'w-3 bg-white/20 hover:bg-white/50'}`} onClick={() => setCurrentIndex(idx)} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mt-20 relative z-10 pb-32">
        <div className="mb-12 border-b border-white/10 pb-6 flex items-end justify-between">
          <div>
            <p className="text-[#DDA7A5] text-[9px] font-bold tracking-[0.4em] uppercase mb-3">Ready to ship</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#FDF8F5]">Standard Collection</h2>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-32"><p className="opacity-40 uppercase tracking-[0.3em] text-[10px]">Curating pieces...</p></div>
        ) : products.length === 0 ? (
          <div className="text-center py-32"><p className="opacity-40 uppercase tracking-[0.3em] text-[10px]">Inventory is empty.</p></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 gap-y-12">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col pointer-events-auto">
                <div className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-[#111] mb-4">
                  <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100" />
                </div>
                <h3 className="text-xs font-serif text-white mb-1 group-hover:text-[#DDA7A5] transition-colors line-clamp-1">{product.name}</h3>
                {product.price && <p className="text-[9px] tracking-widest opacity-50 mb-4">{product.price}</p>}
                
                {/* NEW: SINGLE ITEM INSTANT BUY (WITH IMAGE URL) */}
                <div className="mt-auto flex flex-col gap-2 pt-2">
                  <button 
                    onClick={() => {
                      const msg = `Hello Ayesha! I would like to order this item:\n\n*${product.name}*\n${product.price ? `Price: ${product.price}\n` : ''}Image: ${product.imageUrl}`;
                      window.open(`https://wa.me/23272273689?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="w-full py-3 text-center bg-[#FDF8F5] text-black text-[9px] font-bold uppercase tracking-[0.2em] rounded shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-[#DDA7A5] hover:text-white transition-all duration-300"
                  >
                    Buy Now
                  </button>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-3 text-center border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    Add to Bag
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {activeCustomizer && (
        <CustomizerModal product={activeCustomizer} onClose={() => setActiveCustomizer(null)} />
      )}
    </main>
  );
}