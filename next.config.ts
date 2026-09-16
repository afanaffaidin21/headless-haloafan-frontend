import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "haloafan.com",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "cms.haloafan.com",
        pathname: "/wp-content/**",
      },
    ],
  },
  async redirects() {
    // Redirect lama (WordPress) → baru
    return [
      {
        source: "/menulis-id",
        destination: "/projects/menulis-id",
        permanent: true,
      },
      {
        source: "/karyapratama-packaging",
        destination: "/projects/karyapratama-packaging",
        permanent: true,
      },
      {
        source: "/id/menulis-id",
        destination: "/id/projects/menulis-id",
        permanent: true,
      },
      {
        source: "/id/karyapratama-packaging",
        destination: "/id/projects/karyapratama-packaging",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
