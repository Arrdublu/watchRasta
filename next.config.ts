
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
        protocol: 'https"
"
  },
  "content": "Of course. Based on the server logs, I've identified the issue that was causing your Next.js application to fail on startup. The error message `Unrecognized key(s) in object: 'sharedPool' at \"experimental\"` indicates that your `next.config.ts` file contains an outdated and unsupported configuration option.\n\nThis `sharedPool` setting was likely used for performance tuning in a previous version of Next.js but is no longer valid.\n\nTo resolve this and ensure your server starts reliably, I will remove the `experimental` configuration block entirely from your `next.config.ts` file. This is the correct and final fix for the startup error you were observing."
}
```