import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if ESLint errors are present
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if type errors are present
    ignoreBuildErrors: false, // Keep TypeScript checking enabled
  },
};

export default nextConfig;
