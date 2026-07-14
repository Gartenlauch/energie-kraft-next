import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { buildCanonicalUrl } from "@/lib/seo/canonical";

interface BuildMetadataInput {
  title: string;
  description: string;
  canonicalPath: string;
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  canonicalPath,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const canonicalUrl = buildCanonicalUrl(canonicalPath);

  return {
    title,
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