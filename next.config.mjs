/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.coinstats.app',
      },
      {
        protocol: 'https',
        hostname: 'static.debank.com',
      },
    ],
  },
};

export default nextConfig;
