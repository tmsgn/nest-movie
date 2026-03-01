import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TMDB image CDN is blocking/timing out the local Next.js server proxy.
    // By setting this to true, the browser fetches directly from TMDB CDN,
    // which bypasses the local server timeout and fixes the loading issue!
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [390, 640, 768, 1024, 1280, 1920],
    imageSizes: [92, 185, 342, 400, 780],
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Enable DNS prefetch control globally
        source: "/(.*)",
        headers: [{ key: "X-DNS-Prefetch-Control", value: "on" }],
      },
    ];
  },
  // Tree-shake heavy packages at build time
  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion"],
  },
};

export default nextConfig;
