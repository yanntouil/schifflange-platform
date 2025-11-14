import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    })

    // Optimize cache for large strings
    if (config.cache && typeof config.cache !== "boolean") {
      config.cache.maxMemoryGenerations = 1
    }

    return config
  },
  typescript: {
    ignoreBuildErrors: true, // ⛔️ disable TypeScript errors at build
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: [],
  },
  turbopack: {
    resolveAlias: {
      canvas: "./empty-module.ts",
    },
  },
  transpilePackages: [],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3140", // Port de ton API backend
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3140",
        pathname: "/storage/**",
      },
      // for production
      {
        protocol: "https",
        hostname: "schifflange.api.101.lu",
      },
    ],
  },
}

export default nextConfig
