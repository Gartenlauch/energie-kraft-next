import type { MetadataRoute } from "next";

import { env } from "@/config/env";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!env.isProduction) {
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