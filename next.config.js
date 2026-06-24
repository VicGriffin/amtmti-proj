/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimized for cPanel deployment - standalone output
  output: 'standalone',
  
  // Disable static generation for dynamic content
  reactStrictMode: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'localhost',
      'localhost:3000',
      process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', ''),
    ].filter(Boolean),
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // Redirects for common paths
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/page',
        permanent: false,
      },
    ]
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_NAME: 'AMTMTI',
  },

  // Webpack configuration
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    }
    return config
  },

  // Compression and optimization
  compress: true,
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Swcminify - faster builds
  swcMinify: true,
}

module.exports = nextConfig
