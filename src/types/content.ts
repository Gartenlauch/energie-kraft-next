import type { FaqRouteKey } from "@/config/routes";
import type { PvCalculatorInput } from "@/types/pv-calculator";

export interface SeoContent {
  title: string;
  description: string;
  canonicalPath: string;
}

export interface CtaContent {
  label: string;
  href: string;
}

export interface ContentLink {
  eyebrow?: string;
  label: string;
  description?: string;
  href: string;
  external?: boolean;
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
  links?: ContentLink[];
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

export interface CalculatorFieldContent {
  name: keyof PvCalculatorInput;
  label: string;
  helpText: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface PvCalculatorPageContent {
  seo: SeoContent;

  breadcrumbLabel: string;

  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };

  primaryFields: readonly CalculatorFieldContent[];
  advancedFields: readonly CalculatorFieldContent[];

  disclaimer: string;
}
