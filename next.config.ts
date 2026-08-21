import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "haloafan.com",
        pathname: "/wp-content/**",
      },
    ],
  },
  async redirects() {
    // Redirect lama (WordPress) → baru. Ditambahkan saat launch (Fase 6).
    return [];
  },
};

export default withNextIntl(nextConfig);