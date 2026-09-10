import type { MetadataRoute } from "next";

import { PUBLIC_ROUTE_LIST } from "@/config/routes";
import { publicEnv } from "@/config/env/public";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { referenceLocations } from "@/content/reference-projects";
import { getPublicFaqCatalog } from "@/lib/faq/public-repository";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const { entries, categories } = await getPublicFaqCatalog();
  const faqPaths = [
    "/faq",
    ...categories
      .filter((category) => entries.some((faq) => faq.categoryId === category.id))
      .map((category) => `/faq/${category.slug}`),
    ...entries.map((faq) => faq.href),
  ];
  return [
    ...publicRoutes,
    ...referenceLocationRoutes,
    ...faqPaths.map((path) => ({
      url: buildCanonicalUrl(path),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
