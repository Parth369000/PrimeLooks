import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.31.79', 'localhost'],
  images: {
    qualities: [25, 50, 70, 75, 90, 100],
  },
};

export default nextConfig;
