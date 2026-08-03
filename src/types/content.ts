import type { FaqRouteKey } from "@/config/routes";

export interface SeoContent {
  title: string;
  description: string;
  canonicalPath: string;
}

export interface CtaContent {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta: CtaContent;
  secondaryCta?: CtaContent;
}

export interface ContentSection {
  id?: string;
  eyebrow?: string;
  title: string;
  text: string[];
  items?: string[];
  cta?: CtaContent;
}

export interface HomePageContent {
  seo: SeoContent;
  hero: HeroContent;
}

export interface PublicPageContent {
  seo: SeoContent;
  faqRouteKey: FaqRouteKey;
  hero: HeroContent;
  sections: ContentSection[];
}
