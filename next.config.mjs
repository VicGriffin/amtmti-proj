/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for cPanel Node.js deployment
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amtmti.africa',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
      ],
    },
  ],
  productionBrowserSourceMaps: false,
  compress: true,
}

export default nextConfig
