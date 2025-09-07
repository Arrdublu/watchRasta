/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This is required to fix a Next.js issue with Turbopack in this environment.
    allowedDevOrigins: [
      'https://6000-firebase-studio-1757177215256.cluster-xvr5pmatm5a4gx76fmat6kxt6o.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
