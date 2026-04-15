// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/propfolio",
        destination: "/propfolio.html",
      },
      {
        source: "/mentorship",
        destination: "/mentorship.html",
      },
    ];
  },
};

export default nextConfig;
