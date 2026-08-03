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

  async redirects() {
    return [
      {
        source: "/energieloesungen/photovoltaik-kaufen",
        destination: "/photovoltaik",
        permanent: true,
      },
      {
        source: "/energieloesungen/batteriespeicher-photovoltaik",
        destination: "/stromspeicher",
        permanent: true,
      },
      {
        source: "/energieloesungen/wallbox-kaufen",
        destination: "/wallbox",
        permanent: true,
      },
      {
        source: "/energieloesungen/waermepumpe-mit-pv",
        destination: "/waermepumpen",
        permanent: true,
      },
      {
        source: "/kontakt-photovoltaik",
        destination: "/kontakt",
        permanent: true,
      },
      {
        source: "/datenschutzerklaerung",
        destination: "/datenschutz",
        permanent: true,
      }
    ];
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