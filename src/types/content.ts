export interface SeoContent {
  title: string;
  description: string;
  canonicalPath: string;
}

export interface HeroContent {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

export interface HomePageContent {
  seo: SeoContent;
  hero: HeroContent;
}