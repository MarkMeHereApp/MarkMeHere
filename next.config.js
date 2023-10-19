/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.cache = {
        type: 'filesystem'
      };
    }
    return config;
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh']
  }
};

// Define the bundle-analyzer as a separate plugin
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer(nextConfig);

if (!process.env.NEXT_PUBLIC_BASE_URL || !process.env.NEXTAUTH_URL) {
  module.exports = {
    env: {
      NEXTAUTH_URL: `https://${process.env.VERCEL_URL}`,
      NEXT_PUBLIC_BASE_URL: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    }
  };
}
