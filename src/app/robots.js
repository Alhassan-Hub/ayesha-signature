export default function robots() {
  const baseUrl = 'https://ayeshas-signature.vercel.app';

  return {
    rules: {
      userAgent: '*', // '*' means ALL search engines (Google, Bing, Yahoo)
      allow: '/',     // They are allowed to scan every page
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Hands them the map we just made!
  }
}