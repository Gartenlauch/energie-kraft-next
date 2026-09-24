import type { MetadataRoute } from "next";

import { isSearchIndexingEnabled } from "@/config/search-indexing";
import { siteConfig } from "@/config/site";

export function buildRobots(
  searchIndexingEnabled: boolean,
): MetadataRoute.Robots {
  if (!searchIndexingEnabled) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/"],
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/"],
    },

    sitemap: `${siteConfig.canonicalBaseUrl}/sitemap.xml`,
    host: siteConfig.canonicalBaseUrl,
  };
}

export default function robots(): MetadataRoute.Robots {
  return buildRobots(isSearchIndexingEnabled());
}
