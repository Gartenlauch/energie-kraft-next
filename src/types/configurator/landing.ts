import type { SeoContent } from "@/types/content";

import type { ConfiguratorType } from "./state";

export type ConfiguratorAvailability = "next" | "planned";

export interface ConfiguratorLandingProduct {
  type: ConfiguratorType;
  title: string;
  shortLabel: string;
  description: string;
  href: `/konfigurator/${string}`;
  serviceHref: `/${string}`;
  availability: ConfiguratorAvailability;
  statusLabel: string;
  seo: SeoContent;
}