import type { MetadataRoute } from "next";

import { publicEnv } from "@/config/env/public";
import { buildCanonicalUrl } from "@/lib/seo/canonical";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicEnv.isProduction) {
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