import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Reintenta páginas que fallan por lentitud puntual de WooCommerce
    staticGenerationRetryCount: 2,
  },
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
