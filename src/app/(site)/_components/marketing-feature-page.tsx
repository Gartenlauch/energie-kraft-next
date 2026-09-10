import type { ReactNode } from "react";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  EditorialFeatureSection,
  PremiumHeroSection,
} from "@/components/marketing/marketing-sections";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";
import type { SeoContent } from "@/types/content";

export interface MarketingFeatureSection {
  id?: string;
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  items?: readonly string[];
  links?: readonly {
    eyebrow?: string;
    label: string;
    description?: string;
    href: string;
  }[];
}

interface MarketingFeaturePageProps {
  seo: SeoContent;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  desktopSrc: string;
  mobileSrc: string;
  imageAlt: string;
  desktopWidth?: number;
  desktopHeight?: number;
  mobileWidth?: number;
  mobileHeight?: number;
  sections: readonly MarketingFeatureSection[];
  afterHero?: ReactNode;
  afterSections?: ReactNode;
  ctaTitle: string;
  ctaLabel: string;
  ctaHref: string;
  breadcrumbItems?: readonly { label: string; href: string }[];
}

export function MarketingFeaturePage({
  seo,
  breadcrumbLabel,
  eyebrow,
  title,
  description,
  desktopSrc,
  mobileSrc,
  imageAlt,
  desktopWidth = 1600,
  desktopHeight = 1000,
  mobileWidth = 1080,
  mobileHeight = 1350,
  sections,
  afterHero,
  afterSections,
  ctaTitle,
  ctaLabel,
  ctaHref,
  breadcrumbItems = [],
}: MarketingFeaturePageProps) {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: breadcrumbLabel,
          currentPath: seo.canonicalPath,
          items: breadcrumbItems.map((item) => ({ label: item.label, path: item.href })),
        })}
      />
      <main id="main-content">
        <Breadcrumbs currentLabel={breadcrumbLabel} items={breadcrumbItems} />
        <PremiumHeroSection
          eyebrow={eyebrow}
          title={title}
          description={description}
          image={{
            desktopSrc,
            mobileSrc,
            desktopWidth,
            desktopHeight,
            mobileWidth,
            mobileHeight,
            alt: imageAlt,
          }}
          primaryCta={{ label: ctaLabel, href: ctaHref }}
        />

        {afterHero}

        {sections.map((section, index) => (
          <EditorialFeatureSection
            key={section.title}
            id={section.id}
            eyebrow={section.eyebrow}
            title={section.title}
            paragraphs={section.paragraphs}
            items={section.items}
            links={section.links}
            surface={index === 0 ? "soft" : "white"}
            layout={index % 3 === 0 ? "statement" : index % 3 === 1 ? "image-right" : "editorial"}
            image={{
              desktopSrc,
              mobileSrc,
              desktopWidth,
              desktopHeight,
              mobileWidth,
              mobileHeight,
              alt: imageAlt,
            }}
          />
        ))}

        {afterSections}
        <section className="brand-gradient py-16 text-white md:py-20">
          <div className="section-shell flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="max-w-3xl text-3xl text-white md:text-4xl">{ctaTitle}</h2>
            <Link href={ctaHref} className="button-light shrink-0">
              {ctaLabel}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
