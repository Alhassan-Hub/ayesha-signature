import './globals.css';
import LoadingScreen from '@/components/LoadingScreen';

// === THIS IS THE MAGIC WHATSAPP / INSTAGRAM SEO CODE ===
export const metadata = {
  title: "Ayesha's Signature | Premium Hijabs & Custom Prayer Mats",
  description: "Discover luxury Islamic gifts, premium hijabs, personalized prayer mats, and bespoke Ramadan packages. Elegance in every thread. Order online today.",
  keywords: "premium hijab, custom prayer mat, islamic gifts, ramadan packages, luxury hijab brand, ayeshas signature",
  
  // 👉 PASTE YOUR GOOGLE CODE RIGHT HERE:
  verification: {
    google: 'uJqyy3dEAeN5EGOW9KvI1ytzqgdOMw8TZQAjv4K3x0kE', 
  },

  openGraph: {
    title: "Ayesha's Signature | Luxury Islamic Gifts",
    description: "Elegance in every thread. Explore our premium collection.",
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
      <body className="antialiased bg-[#090212] text-white">
        
        {/* The Loading Screen will now perfectly protect every page on the site! */}
        <LoadingScreen />
        
        {children}
      </body>
    </html>
  );
}