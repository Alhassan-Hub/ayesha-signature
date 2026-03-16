"use client";
import React, { useEffect, useState, useRef, Suspense } from 'react';
import { db } from '@/utils/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, useGLTF, Center, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';
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
  
  const [quickViewProduct, setQuickViewProduct] = useState(null); 
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

  // Lock body scroll when Quick View Modal is open
  useEffect(() => {
    if (quickViewProduct || isCartOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [quickViewProduct, isCartOpen]);

  const customItems = [
    { id: 'magic-cup', title: 'The Magic Cup', tag: 'Personalized Engraving', file: '/cup.glb' },
    { id: 'prayer-mat', title: 'Premium Prayer Mat', tag: 'Custom Engraving', file: '/mat.glb' },
    { id: 'signature-hijab', title: 'Signature Hijab', tag: 'Color Selection', file: '/hijab.glb' }
  ];

  const activeItem = customItems[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      if (!quickViewProduct) setCurrentIndex((prev) => (prev + 1) % customItems.length);
    }, 8000); 
    return () => clearInterval(timer);
  }, [customItems.length, quickViewProduct]);

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
    setQuickViewProduct(null); 
    setIsCartOpen(true); 
  };

  const removeFromCart = (productId) => setCart((prevCart) => prevCart.filter(item => item.id !== productId));

  const checkoutViaWhatsApp = () => {
    if (cart.length === 0) return;
    const itemList = cart.map(item => `▪ ${item.qty}x *${item.name}*\nImage: ${item.imageUrl}`).join('\n\n');
    const msg = `Hello Ayesha! I would like to place an order from your website:\n\n${itemList}\n\nPlease let me know the total and payment details. Thank you!`;
    window.open(`https://wa.me/23272273689?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const checkoutSingleItem = (product) => {
    const msg = `Hello Ayesha! I would like to instantly order this item:\n\n*${product.name}*\n${product.price ? `Price: ${product.price}\n` : ''}Image: ${product.imageUrl}`;
    window.open(`https://wa.me/23272273689?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#FDF8F5] text-[#2C2424] font-sans overflow-x-hidden relative">
      
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 pointer-events-auto transition-all">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative">
          <Link href="/" className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors flex items-center gap-2 z-10">
            <span>←</span> Back
          </Link>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-6 w-auto" onError={(e)=>e.target.style.display='none'}/>
            <Link href="/" className="font-serif font-bold text-xs md:text-sm tracking-[0.2em] text-[#2C2424] uppercase">Ayesha's Signature</Link>
          </div>
          <div className="w-16 hidden md:block"></div>
        </div>
      </nav>

      {/* FLOATING CART BUTTON */}
      <button onClick={() => setIsCartOpen(true)} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 w-14 h-14 bg-[#2C2424] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
        {isCartLoaded && cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#DDA7A5] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
            {cart.reduce((total, item) => total + item.qty, 0)}
          </span>
        )}
      </button>

      {/* CART DRAWER */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[400px] bg-white z-[150] transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.1)] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="font-serif font-bold text-xl text-[#2C2424]">Your Bag</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-black text-sm uppercase tracking-widest font-bold">Close ✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
              <p className="text-[10px] uppercase tracking-[0.2em]">Your bag is empty.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-[#FDF8F5] p-3 rounded-xl border border-gray-100">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded shadow-sm" />
                <div className="flex-1">
                  <h3 className="text-sm font-serif font-bold text-[#2C2424] line-clamp-1">{item.name}</h3>
                  <p className="text-[10px] text-[#DDA7A5] tracking-widest mt-1">Qty: {item.qty}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 text-xs font-bold px-2">✕</button>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <button onClick={checkoutViaWhatsApp} className="w-full py-4 bg-[#2C2424] text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-[#DDA7A5] transition-all shadow-lg">
              Checkout via WhatsApp
            </button>
          </div>
        )}
      </div>

      {/* =========================================
          THE FIX: BULLETPROOF QUICK VIEW MODAL
          ========================================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          
          {/* Layer 1: The Dark Click-away Blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setQuickViewProduct(null)}></div>
          
          {/* Layer 2: The actual White Card (Now safely scrollable inside) */}
          <div className="relative z-[210] w-full sm:max-w-3xl bg-white rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-8 duration-500">
            
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-[220] w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-500 hover:text-black shadow-sm border border-gray-100">
              ✕
            </button>
            
            {/* The Scrollable Inner Container (Prevents cutoff!) */}
            <div className="overflow-y-auto w-full flex flex-col sm:flex-row rounded-t-[2rem] sm:rounded-[2rem]">
              
              {/* IMAGE: Fixed safe height on mobile so it doesn't crush the text */}
              <div className="w-full sm:w-1/2 h-[350px] sm:h-auto bg-[#FDF8F5] relative p-6 flex justify-center items-center shrink-0">
                <img src={quickViewProduct.imageUrl} alt={quickViewProduct.name} className="w-full h-full object-contain drop-shadow-md" />
              </div>
              
              {/* TEXT & BUTTONS */}
              <div className="w-full sm:w-1/2 p-6 md:p-8 flex flex-col">
                <p className="text-[#DDA7A5] text-[9px] font-bold uppercase tracking-[0.3em] mb-2">Ayesha's Signature</p>
                <h2 className="text-2xl font-serif font-bold text-[#2C2424] mb-2 leading-tight">{quickViewProduct.name}</h2>
                <p className="text-sm text-gray-500 mb-6">{quickViewProduct.price}</p>
                
                <div className="h-[1px] w-full bg-gray-100 mb-6"></div>
                
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">The Details</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 font-light">
                  {quickViewProduct.description ? quickViewProduct.description : 
                    /* SAFETY NET: Added optional chaining (?) to prevent Firebase crashes! */
                    (quickViewProduct?.name || '').toLowerCase().includes('mat') ? "A premium silk prayer mat crafted for ultimate comfort and elegance during your daily Ibadah."
                    : (quickViewProduct?.name || '').toLowerCase().includes('box') || (quickViewProduct?.name || '').toLowerCase().includes('bouquet') ? "A thoughtfully curated gift box featuring a selection of our finest essentials. The perfect intentional gift."
                    : (quickViewProduct?.name || '').toLowerCase().includes('hijab') || (quickViewProduct?.name || '').toLowerCase().includes('scarf') ? "A beautiful, high-quality hijab scarf available in a variety of stunning colors. It drapes perfectly, offering effortless everyday elegance."
                    : "A beautiful signature piece from our collection, crafted with care and perfect for your modest lifestyle."
                  }
                </p>

                <div className="bg-[#FDF8F5] p-4 rounded-xl mb-6 border border-gray-100">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-[#2C2424] mb-3">Delivery & Policies</h4>
                  <ul className="text-xs text-gray-500 flex flex-col gap-2 font-light">
                    <li className="flex items-center gap-2"><span className="text-[#DDA7A5]">✦</span> Nationwide delivery across Sierra Leone.</li>
                    <li className="flex items-center gap-2"><span className="text-[#DDA7A5]">✦</span> Standard delivery within 2-4 business days.</li>
                    <li className="flex items-center gap-2"><span className="text-[#DDA7A5]">✦</span> Secure packaging to ensure pristine condition.</li>
                  </ul>
                </div>

                <div className="mt-auto flex gap-3 pt-2 pb-4">
                  <button onClick={() => checkoutSingleItem(quickViewProduct)} className="flex-1 py-4 bg-[#2C2424] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg hover:bg-[#DDA7A5] transition-all">
                    Buy Now
                  </button>
                  <button onClick={() => addToCart(quickViewProduct)} className="px-6 py-4 border border-[#DDA7A5] text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#FDF8F5] transition-all">
                    + Bag
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* FULL SCREEN 3D EXPERIENCE */}
      <div className="relative w-full h-[85vh] flex flex-col items-center justify-center z-10 bg-[#FAF9F6] pt-16">
        <div className="absolute top-32 text-center z-20 pointer-events-none px-4">
          <span className="text-[#DDA7A5] text-[10px] font-bold uppercase tracking-[0.4em] bg-white/50 px-4 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-white">
            {activeItem.tag}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif mt-6 text-[#2C2424] tracking-widest transition-all duration-500">{activeItem.title}</h1>
        </div>

        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none animate-in fade-in duration-700 pt-16">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-[#DDA7A5] text-[10px] uppercase tracking-widest">Loading Studio...</div>}>
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
              <ambientLight intensity={1.2} color="#ffffff" />
              <spotLight position={[5, 10, 5]} intensity={1.5} color="#DDA7A5" />
              <Environment preset="city" />
              <PresentationControls global zoom={1.5} config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }}>
                {customItems.map((item, index) => (
                  <CarouselItem key={item.id} file={item.file} isCurrent={currentIndex === index} config={modelConfigs[item.id]} />
                ))}
              </PresentationControls>
              <ContactShadows position={[0, -1.8, 0]} opacity={0.3} scale={15} blur={2.5} far={4} color="#2C2424" />
            </Canvas>
          </Suspense>
        </div>

        <div className="absolute bottom-16 w-full flex flex-col items-center gap-6 z-20 pointer-events-none">
          <div className="flex items-center gap-3">
            {customItems.map((_, idx) => (
              <div key={idx} className={`h-[2px] transition-all duration-700 ease-in-out rounded-full pointer-events-auto cursor-pointer ${currentIndex === idx ? 'w-8 bg-[#DDA7A5]' : 'w-3 bg-gray-300 hover:bg-gray-400'}`} onClick={() => setCurrentIndex(idx)} />
            ))}
          </div>
        </div>
      </div>

      {/* --- BESTSELLER SPOTLIGHT --- */}
      {products.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 mt-12 mb-20 relative z-10">
          <div className="w-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row items-center">
            
            <div className="w-full md:w-1/2 h-[400px] md:h-[500px] bg-[#FDF8F5] p-8 md:p-16 flex items-center justify-center">
              <img 
                src={products.find(p => p.name.toLowerCase().includes('box') || p.name.toLowerCase().includes('bouquet'))?.imageUrl || products[0]?.imageUrl} 
                alt="Bestseller" 
                className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-700" 
              />
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col items-start text-left">
              <span className="px-4 py-1.5 bg-[#DDA7A5]/10 text-[#DDA7A5] text-[9px] font-bold uppercase tracking-[0.3em] rounded-full mb-6">
                Most Loved
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2C2424] mb-4 leading-tight">
                The Signature <br/> <span className="text-[#DDA7A5] italic">Gift Box</span>
              </h2>
              <p className="text-sm text-gray-500 font-light leading-relaxed mb-8 max-w-md">
                Our #1 best-selling package. Thoughtfully curated with our finest premium hijabs, bespoke accessories, and intentional details. The ultimate expression of modest luxury.
              </p>
              
              <button 
                onClick={() => {
                  const targetProduct = products.find(p => p.name.toLowerCase().includes('box') || p.name.toLowerCase().includes('bouquet')) || products[0];
                  addToCart(targetProduct);
                }} 
                className="px-10 py-5 bg-[#2C2424] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#DDA7A5] transition-all shadow-xl hover:shadow-[0_10px_30px_rgba(221,167,165,0.4)]"
              >
                Add Box to Bag
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FIREBASE GRID */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 relative z-10 pb-32">
        <div className="mb-12 border-b border-gray-200 pb-6 flex items-end justify-between">
          <div>
            <p className="text-[#DDA7A5] text-[9px] font-bold tracking-[0.4em] uppercase mb-3">Ready to ship</p>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2C2424]">Standard Collection</h2>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-32"><p className="text-gray-400 uppercase tracking-[0.3em] text-[10px]">Curating pieces...</p></div>
        ) : products.length === 0 ? (
          <div className="text-center py-32"><p className="text-gray-400 uppercase tracking-[0.3em] text-[10px]">Inventory is empty.</p></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 gap-y-12">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                
                <div className="cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-gray-50 mb-4">
                    <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110" />
                  </div>
                  <h3 className="text-xs font-serif text-[#2C2424] mb-1 group-hover:text-[#DDA7A5] transition-colors line-clamp-1 px-1">{product.name}</h3>
                  {product.price && <p className="text-[10px] tracking-widest text-gray-400 mb-4 px-1">{product.price}</p>}
                </div>
                
                <div className="mt-auto flex gap-2 pt-2 border-t border-gray-50">
                  <button onClick={() => checkoutSingleItem(product)} className="flex-1 py-3 text-center bg-[#FDF8F5] text-[#2C2424] text-[8px] font-bold uppercase tracking-[0.1em] rounded hover:bg-[#DDA7A5] hover:text-white transition-all">
                    Buy Now
                  </button>
                  <button onClick={() => addToCart(product)} className="w-10 flex items-center justify-center border border-gray-200 text-gray-500 rounded hover:bg-gray-50 hover:text-[#DDA7A5] transition-all">
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}