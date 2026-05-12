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
};

module.exports = nextConfig;
