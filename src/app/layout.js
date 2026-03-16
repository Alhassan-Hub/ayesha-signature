import './globals.css';

export const metadata = {
  title: "Ayesha's Signature | Modest Fashion & Luxury Gifting",
  description: "Discover luxury Islamic gifts, premium hijabs, personalized prayer mats, and bespoke packages. Elegance in every thread.",
  keywords: "premium hijab, custom prayer mat, islamic gifts, luxury hijab brand, ayeshas signature",
  verification: { google: 'uJqyy3dEAeN5EGOW9KvI1ytzqgdOMw8TZQAjv4K3x0kE' },
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
      {/* CHANGED TO LIGHT MODE: Cream background, dark elegant text */}
      <body className="antialiased bg-[#FAF9F6] text-[#2C2424]">
        {children}
      </body>
    </html>
  );
}