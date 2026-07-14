import { siteConfig } from "@/config/site";

export function buildCanonicalUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalizedPath, siteConfig.canonicalBaseUrl).toString();
}