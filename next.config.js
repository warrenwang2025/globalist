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

    return config;
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
