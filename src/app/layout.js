import './globals.css';
import LoadingScreen from '@/components/LoadingScreen';

// === THIS IS THE MAGIC WHATSAPP / INSTAGRAM SEO CODE ===
export const metadata = {
  title: "Ayesha's Signature | Luxury Islamic Gifts",
  description: "Premium hijabs, bespoke prayer mats, and intentional Muslim packages. Elegance in every thread.",
  openGraph: {
    title: "Ayesha's Signature",
    description: "Elegance in every thread. Explore our premium collection.",
    url: 'https://ayeshas-signature.com', // We will update this later when you buy her domain!
    siteName: "Ayesha's Signature",
    images: [
      {
        url: '/og-image.jpg', // IMPORTANT: See instructions below!
        width: 1200,
        height: 630,
        alt: "Ayesha's Signature Preview",
      },
    ],
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