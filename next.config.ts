// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/propfolio",
        destination: "/propfolio.html",
      },
    ];
  },
};

export default nextConfig;
