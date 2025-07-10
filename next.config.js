/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Disable Terser for server-side builds to avoid AWS SDK issues
    if (isServer) {
      config.optimization.minimize = false;
    }

    // Handle AWS SDK v3 ES modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
  images: { unoptimized: true },
  swcMinify: false,
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
