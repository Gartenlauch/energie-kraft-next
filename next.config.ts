import type { NextConfig } from "next";

const isProduction =
  process.env.NEXT_PUBLIC_SITE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    if (isProduction) {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
