import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    preloadEntriesOnStart: false,
    webpackMemoryOptimizations: true,
  },
  output: "standalone",
};

export default nextConfig;
