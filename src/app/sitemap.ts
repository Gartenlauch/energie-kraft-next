import type { MetadataRoute } from "next";

import { PUBLIC_ROUTE_LIST } from "@/config/routes";
import { publicEnv } from "@/config/env/public";
import { buildCanonicalUrl } from "@/lib/seo/canonical";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicEnv.isProduction) {
    return [];
  }

  return PUBLIC_ROUTE_LIST.map((route) => ({
    url: buildCanonicalUrl(route.href),
    changeFrequency: route.sitemap.changeFrequency,
    priority: route.sitemap.priority,
  }));
}