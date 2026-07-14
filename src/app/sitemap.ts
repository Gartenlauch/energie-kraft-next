import type { MetadataRoute } from "next";

import { env } from "@/config/env";
import { buildCanonicalUrl } from "@/lib/seo/canonical";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!env.isProduction) {
    return [];
  }

  return [
    {
      url: buildCanonicalUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}