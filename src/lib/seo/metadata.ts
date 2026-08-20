import type { Metadata } from "next";
import type { SeoContent } from "@/types/content";
import { siteConfig } from "@/config/site";
import { buildCanonicalUrl } from "@/lib/seo/canonical";


export function buildMetadata({
  title,
  description,
  canonicalPath,
  noIndex = false,
}: SeoContent): Metadata {
  const canonicalUrl = buildCanonicalUrl(canonicalPath);

  return {
    title: {
      absolute: title,
    },

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: noIndex
      ? {
          index: false,
          follow: false,
          noarchive: true,
        }
      : undefined,

    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title,
      description,
      url: canonicalUrl,
    },
  };
}
