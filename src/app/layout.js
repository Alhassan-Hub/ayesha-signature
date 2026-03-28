import './globals.css';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export const metadata = {
  title: "Ayesha's Signature | Premium Hijabs & Custom Gifts Sierra Leone",
  description: "Boutique Modest Fashion Brand by Isata Barrie. Discover premium luxury hijabs, magic cups, and intentional gift packages in Freetown, Sierra Leone.",
  verification: { google: 'uJqyy3dEAeN5EGOW9KvI1ytzqgdOMw8TZQAjv4K3x0kE' },
  openGraph: {
    title: "Ayesha's Signature",
    description: "Premium Modest Fashion & Luxury Gifting in Sierra Leone",
    url: 'https://ayeshas-signature.vercel.app/', // Added the slash here too
    siteName: "Ayesha's Signature",
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  // This is the "Secret Map" for Google's Robot
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Boutique", // 'Boutique' is a stronger local signal than 'Brand'
    "name": "Ayesha's Signature",
    "url": "https://ayeshas-signature.vercel.app/", // MATCHES YOUR GOOGLE SETTINGS EXACTLY
    "logo": "https://ayeshas-signature.vercel.app/logo.png",
    "description": "Premium modest fashion and luxury gifting brand based in Freetown, Sierra Leone.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Freetown",
      "addressCountry": "SL"
    },
    "founder": {
      "@type": "Person",
      "name": "Isata Barrie"
    },
    // THIS IS THE SECRET WEAPON: Links all her identities together
    "sameAs": [
      "https://www.tiktok.com/@ayeshassignature1",
      "https://www.instagram.com/ayeshas_signature" // Make sure this link is exact!
    ]
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