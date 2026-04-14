import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 'standalone' is only needed for Docker/VPS deployment.
  // On Vercel the standard build is used so that public/ assets
  // (including videos) are correctly deployed to Vercel's CDN.
  ...(process.env.BUILD_STANDALONE === 'true' && { output: 'standalone' }),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
