import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kriteshtimsina.com.np',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
