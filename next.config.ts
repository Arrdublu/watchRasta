
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
      {
        protocol: 'https',
        hostname: 'www.watchrasta.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/gcs/:path*',
        destination: 'https://firebasestorage.googleapis.com/v0/b/watchrasta.appspot.com/o/:path*',
      },
    ]
  },
  webpack: (config: any) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /handlebars\/lib\/index\.js$/,
        message: /require\.extensions is not supported by webpack/,
      },
    ];
    return config;
  },
};

export default nextConfig;
