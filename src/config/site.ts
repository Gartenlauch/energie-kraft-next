import { publicEnv } from "@/config/env/public";

export const siteConfig = {
  name: "Energie-Kraft Süd",
  canonicalBaseUrl: publicEnv.NEXT_PUBLIC_CANONICAL_BASE_URL,
  language: "de",
  locale: "de_DE",
} as const;