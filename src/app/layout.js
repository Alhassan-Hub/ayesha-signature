import './globals.css';

// === POINT 9: UPDATED VISIBILITY KEYWORDS ===
export const metadata = {
  title: "Ayesha's Signature | Modest Fashion & Luxury Gifting",
  description: "Discover luxury Islamic gifts, premium hijabs, personalized prayer mats, and bespoke Eid packages. Elegance in every thread.",
  keywords: "Hijab Gift Box, Modest Fashion Gifts, Luxury Hijab Sets, Eid Gift Boxes, Ayesha's Signature",
  verification: { google: 'uJqyy3dEAeN5EGOW9KvI1ytzqgdOMw8TZQAjv4K3x0kE' },
  openGraph: {
    title: "Ayesha's Signature",
    description: "Modest Fashion & Luxury Gifting",
    url: 'https://ayeshas-signature.vercel.app', 
    siteName: "Ayesha's Signature",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAF9F6] text-[#2C2424]">
        
        {/* === POINT 7: OVERHEAD CONTACT DETAILS BAR === */}
        <div className="w-full bg-[#2C2424] text-[#FAF9F6] py-2 px-4 text-center z-[200] relative text-[9px] md:text-[10px] uppercase tracking-widest font-bold flex flex-col md:flex-row justify-center items-center gap-2 md:gap-8">
          <span>📞 Call/WhatsApp: +232 72 273689</span>
          <span className="hidden md:inline">|</span>
          <span>✨ Nationwide Delivery Available</span>
        </div>

        {children}

        {/* === POINT 5: GLOBAL FLOATING WHATSAPP BUTTON === */}
        {/* Sits on the bottom-left, opposite of the Shopping Bag */}
        <a 
          href="https://wa.me/23272273689?text=Hello%20Ayesha!" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[100] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
          aria-label="Chat on WhatsApp"
        >
          {/* Official WhatsApp SVG Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-8 h-8 fill-current">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 413.2c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7.1c-18.9-30.6-28.9-65.8-28.9-102.4 0-103.5 84.1-187.6 187.6-187.6 55.3 0 107.5 21.5 146.6 60.6 39.1 39.1 60.7 91.3 60.7 146.7 0 103.5-84.1 187.6-187.6 187.6zM326.4 278.2c-5.6-2.8-33.4-16.5-38.6-18.4-5.2-1.9-9-.2-12.8 5.6-3.8 5.8-14.7 18.4-18.1 22.2-3.4 3.8-6.9 4.3-12.5 1.4-5.6-2.8-23.8-8.8-45.3-24.9-16.7-12.5-28-28-31.3-33.8-3.4-5.6-.4-8.7 2.4-11.5 2.5-2.5 5.6-6.6 8.4-9.9 2.8-3.3 3.8-5.6 5.6-9.4 1.9-3.8.9-7.1-.5-9.9-1.4-2.8-12.8-30.8-17.5-42.2-4.6-11.1-9.3-9.6-12.8-9.8-3.3-.2-7.1-.2-10.8-.2-3.8 0-9.9 1.4-15 7.1-5.2 5.6-19.9 19.4-19.9 47.4 0 28 20.4 55 23.2 58.8 2.8 3.8 40.1 61.3 97.1 84.5 13.6 5.5 24.2 8.8 32.5 11.2 13.6 4.3 26 3.7 35.8 2.2 10.9-1.6 33.4-13.7 38.1-26.9 4.7-13.2 4.7-24.5 3.3-26.9-1.4-2.4-5.2-3.8-10.8-6.6z"/>
          </svg>
        </a>

      </body>
    </html>
  );
}