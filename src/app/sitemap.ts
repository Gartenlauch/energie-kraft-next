import type { MetadataRoute } from "next";

import { PUBLIC_ROUTE_LIST } from "@/config/routes";
import { publicEnv } from "@/config/env/public";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { referenceLocations } from "@/content/reference-projects";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicEnv.isProduction) {
    return [];
  }

  const publicRoutes = PUBLIC_ROUTE_LIST.map((route) => ({
    url: buildCanonicalUrl(route.href),
    changeFrequency: route.sitemap.changeFrequency,
    priority: route.sitemap.priority,
  }));

  const referenceLocationRoutes: MetadataRoute.Sitemap = referenceLocations.map((location) => ({
    url: buildCanonicalUrl(`/pv-referenzen/${location.slug}`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...publicRoutes, ...referenceLocationRoutes];
}
