/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh']
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@tremor/react']
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/signin',
        permanent: false,
      },
    ]
  }
};

module.exports = nextConfig;
