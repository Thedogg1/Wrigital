import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  serverExternalPackages: ['resend'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/usa',
        destination: '/us',
        permanent: true,
      },
      {
        source: '/usa/:path*',
        destination: '/us/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
