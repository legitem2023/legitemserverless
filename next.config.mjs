/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false, // Disable SWC
  experimental: {
    workerThreads: false, // Disable multi-threading
    cpus: 1, // Limit to 1 CPU core
  },
  images: {
    domains: ['motortrade.com.ph'],
  },
};

export default nextConfig;
