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
			{
				protocol: "https",
				hostname: "picsum.photos",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "fastly.picsum.photos",
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
