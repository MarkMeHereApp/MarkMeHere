/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.cache = {
        type: 'filesystem',
      };
    }
    return config;
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh'],
  },
};

module.exports = nextConfig;
