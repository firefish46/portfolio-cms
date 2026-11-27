/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Smaller modern formats; Cloudinary URLs are versioned, so cache long
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400, // 31 days
  },
  reactCompiler: true,
  async redirects() {
    return [
      // Old standalone projects page (uncached DB queries) → new Works page
      { source: '/projects', destination: '/works', permanent: true },
    ];
  },
};

export default nextConfig;
