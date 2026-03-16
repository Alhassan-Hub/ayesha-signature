import './globals.css';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

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
      <body className="antialiased bg-[#FDF8F5] text-[#2C2424]">
        {children}
        {/* THIS NOW HIDES AUTOMATICALLY ON THE ADMIN PAGE! */}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}