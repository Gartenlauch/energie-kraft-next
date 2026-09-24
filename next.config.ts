import type { NextConfig } from "next";

import {
  isSearchIndexingEnabled,
  SEARCH_NO_INDEX_DIRECTIVE,
} from "./src/config/search-indexing";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: false,

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 84],
  },

  async redirects() {
    return [
      { source: "/pv-referenzen", destination: "/referenzen", permanent: true },
      { source: "/pv-referenzen/:location", destination: "/referenzen/:location", permanent: true },
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
    if (isSearchIndexingEnabled()) {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: SEARCH_NO_INDEX_DIRECTIVE,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
