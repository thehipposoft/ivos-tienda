import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tienda.ivos.com.ar",
      },
    ],
  },
};

export default nextConfig;
