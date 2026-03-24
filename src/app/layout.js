import './globals.css';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Script from 'next/script'; // Import Script for SEO

export const metadata = {
  title: "Ayesha's Signature | Modest Fashion & Luxury Gifting Sierra Leone",
  description: "Experience premium luxury with Ayesha's Signature. Specializing in high-quality hijabs, magic cups, and intentional gift packages in Freetown, Sierra Leone.",
  keywords: "Ayesha's Signature, Hijab Sierra Leone, Modest Fashion Freetown, Islamic Gifts, Isata Barrie",
  verification: { google: 'uJqyy3dEAeN5EGOW9KvI1ytzqgdOMw8TZQAjv4K3x0kE' },
  openGraph: {
    title: "Ayesha's Signature",
    description: "Modest Fashion & Luxury Gifting in Sierra Leone",
    url: 'https://ayeshas-signature.vercel.app', 
    siteName: "Ayesha's Signature",
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  // This JSON-LD tells Google exactly what the brand name is
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ayesha's Signature",
    "alternateName": "Ayesha Signature",
    "url": "https://ayeshas-signature.vercel.app",
    "logo": "https://ayeshas-signature.vercel.app/logo.png",
    "founder": {
      "@type": "Person",
      "name": "Isata Barrie"
    },
    "description": "Premium modest fashion and luxury gifting brand based in Sierra Leone."
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#FDF8F5] text-[#2C2424]">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}