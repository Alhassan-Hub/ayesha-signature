export default function sitemap() {
  const baseUrl = 'https://ayeshas-signature.vercel.app'; // Your live link!

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0, // Tells Google the Homepage is the most important
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily', // Tells Google the shop updates often
      priority: 0.8,
    },
  ]
}