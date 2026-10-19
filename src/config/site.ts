import { publicEnv } from "@/config/env/public";
import { siteIdentity } from "@/config/site-identity";

export const siteConfig = {
  ...siteIdentity,
  canonicalBaseUrl: publicEnv.NEXT_PUBLIC_CANONICAL_BASE_URL,
} as const;
