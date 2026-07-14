import { env } from "@/config/env";

export const siteConfig = {
  name: "Energie-Kraft Süd",
  canonicalBaseUrl: env.NEXT_PUBLIC_CANONICAL_BASE_URL,
  language: "de",
  locale: "de_DE",
} as const;