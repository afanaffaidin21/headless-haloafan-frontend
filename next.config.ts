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
        source: "/universitas-sunan-gresik",
        destination: "/projects/universitas-sunan-gresik",
        permanent: true,
      },
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
        source: "/id/universitas-sunan-gresik",
        destination: "/id/projects/universitas-sunan-gresik",
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
};

export default withNextIntl(nextConfig);