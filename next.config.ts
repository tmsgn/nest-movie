import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve TMDB images directly from their CDN — avoids proxy timeouts
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
