import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 's2.loli.net',
      port: '',
      pathname: '/**'
    }]
  },
};

export default nextConfig;
