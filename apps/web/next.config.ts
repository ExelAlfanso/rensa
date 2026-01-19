import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 90, 100],
    unoptimized: process.env.NODE_ENV === "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
    proxyClientMaxBodySize: "30mb",
  },
};

export default nextConfig;
