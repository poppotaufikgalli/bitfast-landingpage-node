import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mysql2", "bcryptjs"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
