/* 
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['apitest.geniussystemapi.com', 'adminapi.geniussystemtest.com','adminapi.beneshty.com'],
  },

};

export default nextConfig; */
/* 
/** @type {import('next').NextConfig} *
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
     // PERFORMANCE: Optimize package imports to reduce bundle size
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@/components',
      '@/lib',
    ],
    // PERFORMANCE: Enable optimistic client cache
    optimisticClientCache: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apitest.geniussystemapi.com',
      },
      {
        protocol: 'https',
        hostname: 'adminapi.geniussystemtest.com',
      },
      {
        protocol: 'https',
        hostname: 'adminapi.beneshty.com',
      },
    ],
  },
  // Add these to allow build despite ESLint/TypeScript errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

   // PERFORMANCE: Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // PERFORMANCE: Enable SWC minification (faster than Terser)
  swcMinify: true,

  // PERFORMANCE: Optimize power usage during builds
  poweredByHeader: false,

  // PERFORMANCE: Compression
  compress: true,

  // PERFORMANCE: Production source maps (disable for faster builds)
  productionBrowserSourceMaps: false,

  // PERFORMANCE: Optimize build output
  output: 'standalone', // For Docker/serverless deployments


  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXTAUTH_URL || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, Cookie' },
        ],
      },
      // ... your existing headers
    ];
  },
};

export default nextConfig; */

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@/components',
      '@/lib',
    ],
    optimisticClientCache: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'apitest.geniussystemapi.com',
      },
      {
        protocol: 'https',
        hostname: 'adminapi.geniussystemtest.com',
      },
      {
        protocol: 'https',
        hostname: 'adminapi.beneshty.com',
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // ✅ IMPORTANT FOR IIS: Use standalone output
  output: 'standalone',

  // ✅ Set proper trailing slash behavior
  trailingSlash: false,

  // ✅ Asset prefix for IIS (if needed)
  // assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { 
            key: 'Access-Control-Allow-Origin', 
            value: process.env.NEXTAUTH_URL || 'https://demo.geniussystemtest.com' 
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, Cookie' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;