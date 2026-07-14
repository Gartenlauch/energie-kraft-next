import type { MetadataRoute } from "next";

import { publicEnv } from "@/config/env/public";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!publicEnv.isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
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