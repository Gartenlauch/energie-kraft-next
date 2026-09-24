import type { Metadata } from "next";
import type { SeoContent } from "@/types/content";
import { isSearchIndexingEnabled } from "@/config/search-indexing";
import { siteConfig } from "@/config/site";
import { buildCanonicalUrl } from "@/lib/seo/canonical";


export function buildMetadata({
  title,
  description,
  canonicalPath,
  noIndex = false,
}: SeoContent): Metadata {
  const canonicalUrl = buildCanonicalUrl(canonicalPath);
  const shouldNoIndex = noIndex || !isSearchIndexingEnabled();

  return {
    title: {
      absolute: title,
    },

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: shouldNoIndex
      ? {
          index: false,
          follow: false,
          noarchive: true,
          nosnippet: true,
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
