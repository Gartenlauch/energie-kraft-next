import type { ReactNode } from "react";
import Link from "next/link";

import { FaqJsonLd } from "@/components/faq/faq-json-ld";
import { PublicFaqSection } from "@/components/faq/public-faq-section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  EditorialFeatureSection,
  PremiumHeroSection,
} from "@/components/marketing/marketing-sections";
import { Reveal } from "@/components/marketing/reveal";
import { PublicPageJsonLd } from "@/components/seo/public-page-json-ld";
import { ArrowRightIcon } from "@/components/ui/icons";
import { CONTACT_FORM_HREF } from "@/config/routes";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";
import type { PublicPageContent } from "@/types/content";

interface PublicContentPageProps {
  content: PublicPageContent;
  beforeFaq?: ReactNode;
}

interface PageVisual {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  desktopWidth: number;
  desktopHeight: number;
  mobileWidth: number;
  mobileHeight: number;
  configuratorHref?: string;
}

const pageVisuals: Partial<Record<PublicPageContent["faqRouteKey"], PageVisual>> = {
  photovoltaik: {
    desktopSrc: "/images/photovoltaic/photovoltaic-feature-desktop.webp",
    mobileSrc: "/images/photovoltaic/photovoltaic-feature-mobile.webp",
    alt: "Fachgerechte Montage einer Photovoltaikanlage auf einem Hausdach",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    configuratorHref: "/konfigurator/photovoltaik",
  },
  stromspeicher: {
    desktopSrc: "/images/battery-storage/battery-storage-feature-desktop.webp",
    mobileSrc: "/images/battery-storage/battery-storage-feature-mobile.webp",
    alt: "Modern installierter Stromspeicher in einem hellen Hauswirtschaftsraum",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    configuratorHref: "/konfigurator/stromspeicher",
  },
  waermepumpen: {
    desktopSrc: "/images/heat-pump/heat-pump-feature-desktop.webp",
    mobileSrc: "/images/heat-pump/heat-pump-feature-mobile.webp",
    alt: "Dezent an einem Wohnhaus installierte Luft-Wasser-Wärmepumpe",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    configuratorHref: "/konfigurator/waermepumpe",
  },
  klimaanlagen: {
    desktopSrc: "/images/climate/climate-feature-desktop.webp",
    mobileSrc: "/images/climate/climate-feature-mobile.webp",
    alt: "Dezent integrierte Klimaanlage in einem modernen Wohnraum",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    configuratorHref: "/konfigurator/klimaanlage",
  },
  wallbox: {
    desktopSrc: "/images/wallbox/wallbox-feature-desktop.webp",
    mobileSrc: "/images/wallbox/wallbox-feature-mobile.webp",
    alt: "Elektroauto lädt an einer Wallbox neben einem Haus mit Photovoltaik",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    configuratorHref: "/konfigurator/wallbox",
  },
  kontakt: {
    desktopSrc: "/images/home-premium/consultation-reference-desktop.webp",
    mobileSrc: "/images/home-premium/consultation-reference-mobile.webp",
    alt: "Persönliche Energieberatung mit Hauseigentümern am Planungstisch",
    desktopWidth: 1600,
    desktopHeight: 1000,
    mobileWidth: 1080,
    mobileHeight: 1350,
  },
};

export async function PublicContentPage({ content, beforeFaq }: PublicContentPageProps) {
  const faqs = await getPublicFaqEntriesByRoute(content.faqRouteKey);
  const faqCategory = (
    {
      photovoltaik: { slug: "photovoltaik", label: "Photovoltaik" },
      stromspeicher: { slug: "stromspeicher", label: "Stromspeicher" },
      waermepumpen: { slug: "waermepumpe", label: "Wärmepumpe" },
      klimaanlagen: { slug: "klimaanlage", label: "Klimaanlage" },
      wallbox: { slug: "wallbox", label: "Wallbox" },
    } as Partial<Record<PublicPageContent["faqRouteKey"], { slug: string; label: string }>>
  )[content.faqRouteKey];
  const breadcrumbLabel = content.hero.eyebrow ?? content.hero.title;
  const visual = pageVisuals[content.faqRouteKey];

  return (
    <>
      <PublicPageJsonLd content={content} />
      <FaqJsonLd faqs={faqs} />

      <main id="main-content">
        <Breadcrumbs currentLabel={breadcrumbLabel} />

        {visual ? (
          <PremiumHeroSection
            eyebrow={content.hero.eyebrow}
            title={content.hero.title}
            description={content.hero.description}
            image={visual}
            primaryCta={
              visual.configuratorHref
                ? { label: "Projekt konfigurieren", href: visual.configuratorHref }
                : content.hero.primaryCta
            }
            secondaryCta={
              visual.configuratorHref ? content.hero.primaryCta : content.hero.secondaryCta
            }
          />
        ) : null}

        {content.sections.map((section, index) => (
          <EditorialFeatureSection
            key={`${section.title}-${index}`}
            id={section.id}
            eyebrow={section.eyebrow}
            title={section.title}
            paragraphs={section.text}
            items={section.items}
            links={section.links}
            linkLayout={
              content.faqRouteKey === "kontakt" && section.id === "leistungen"
                ? "topics"
                : "editorial"
            }
            cta={section.cta}
            surface={index === 0 ? "soft" : index === 2 ? "blue" : index === 4 ? "soft" : "white"}
            layout={
              index === 1
                ? "image-left"
                : index === 3
                  ? "image-right"
                  : index % 2 === 0
                    ? "statement"
                    : "editorial"
            }
            image={
              content.faqRouteKey === "photovoltaik" && index === 1
                ? pageVisuals.stromspeicher
                : content.faqRouteKey === "photovoltaik" && index === 3
                  ? {
                      desktopSrc: "/images/service/service-solar-legacy-desktop.webp",
                      mobileSrc: "/images/service/service-solar-legacy-mobile.webp",
                      desktopWidth: 1800,
                      desktopHeight: 1000,
                      mobileWidth: 1080,
                      mobileHeight: 1350,
                      alt: "Photovoltaikmodule im warmen Abendlicht",
                    }
                  : visual
            }
          />
        ))}

        {beforeFaq}
        <PublicFaqSection
          faqs={faqs}
          categorySlug={faqCategory?.slug}
          categoryLabel={faqCategory?.label}
        />

        {content.faqRouteKey !== "konfigurator" && (
          <section className="brand-gradient relative overflow-hidden py-16 text-white md:py-20">
            <div className="section-shell">
              <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="eyebrow eyebrow-on-dark">Persönliche Beratung</p>
                  <h2 className="mt-4 max-w-3xl text-3xl text-white md:text-4xl">
                    Ihr Projekt verdient eine Lösung, die wirklich passt.
                  </h2>
                </div>
                <Link href={CONTACT_FORM_HREF} className="button-light group shrink-0">
                  Beratung anfragen
                  <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
