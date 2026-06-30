/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // Strip all console.log calls in production builds; keep console.error for error tracking
    removeConsole: { exclude: ['error'] },
  },
  images: {
    // Serve AVIF first (best compression), fall back to WebP — both ~30-50% smaller than JPEG/PNG
    formats: ['image/avif', 'image/webp'],
    // Match common device widths to reduce unnecessary resizing
    deviceSizes: [390, 640, 750, 1080, 1920],
  },
  async redirects() {
    return [
      // Permanent www → non-www redirect so Google never sees duplicate content
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.kenesis.ai' }],
        destination: 'https://kenesis.ai/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Tell Google the canonical host on every response
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'index, follow' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
