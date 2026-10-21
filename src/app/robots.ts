import type { MetadataRoute } from "next";
import { headers } from "next/headers";

import { isSearchIndexingEnabledForRequest } from "@/config/search-indexing";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export function buildRobots(searchIndexingEnabled: boolean): MetadataRoute.Robots {
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

export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers();
  return buildRobots(isSearchIndexingEnabledForRequest(requestHeaders));
}
