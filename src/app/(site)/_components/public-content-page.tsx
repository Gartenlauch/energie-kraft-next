import type { ReactNode } from "react";
import Link from "next/link";

import { FaqJsonLd } from "@/components/faq/faq-json-ld";
import { PublicFaqSection } from "@/components/faq/public-faq-section";
import { SecondaryPageHeading } from "@/components/marketing/secondary-page-heading";
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
    desktopSrc: "/images/battery-storage/residential-storage-hero-desktop.webp",
    mobileSrc: "/images/battery-storage/residential-storage-hero-mobile.webp",
    alt: "Sigenergy-Stromspeicher an der Terrasse eines Wohnhauses",
    desktopWidth: 2000,
    desktopHeight: 1200,
    mobileWidth: 800,
    mobileHeight: 1000,
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

const sectionVisuals: Partial<
  Record<PublicPageContent["faqRouteKey"], Record<string, PageVisual>>
> = {
  stromspeicher: {
    funktionsweise: {
      desktopSrc: "/images/battery-storage/residential-storage-function-desktop.webp",
      mobileSrc: "/images/battery-storage/residential-storage-function-mobile.webp",
      desktopWidth: 1600,
      desktopHeight: 1200,
      mobileWidth: 1024,
      mobileHeight: 1280,
      alt: "Stromspeicher und Wallbox an der Außenwand eines Wohnhauses",
    },
    ersatzstrom: {
      desktopSrc: "/images/battery-storage/residential-storage-backup-desktop.webp",
      mobileSrc: "/images/battery-storage/residential-storage-backup-mobile.webp",
      desktopWidth: 1600,
      desktopHeight: 1200,
      mobileWidth: 1200,
      mobileHeight: 1500,
      alt: "Stromspeicher an einer Hauswand neben einem Carport",
    },
  },
  photovoltaik: {
    eigenverbrauch: pageVisuals.stromspeicher!,
    komponenten: {
      desktopSrc: "/images/service/service-solar-legacy-desktop.webp",
      mobileSrc: "/images/service/service-solar-legacy-mobile.webp",
      desktopWidth: 1800,
      desktopHeight: 1000,
      mobileWidth: 1080,
      mobileHeight: 1350,
      alt: "Photovoltaikmodule im warmen Abendlicht",
    },
  },
  wallbox: {
    "pv-ueberschussladen": {
      desktopSrc: "/images/wallbox/wallbox-pv-charging-desktop.webp",
      mobileSrc: "/images/wallbox/wallbox-pv-charging-mobile.webp",
      desktopWidth: 1600,
      desktopHeight: 1000,
      mobileWidth: 800,
      mobileHeight: 1000,
      alt: "Ladestecker vor einer Photovoltaikanlage",
    },
    lastmanagement: {
      desktopSrc: "/images/wallbox/wallbox-load-management-desktop.webp",
      mobileSrc: "/images/wallbox/wallbox-load-management-mobile.webp",
      desktopWidth: 1200,
      desktopHeight: 750,
      mobileWidth: 640,
      mobileHeight: 800,
      alt: "Elektroauto und Wallbox an einem Gebäude bei Dämmerung",
    },
  },
  waermepumpen: {
    "photovoltaik-kombination": {
      desktopSrc: "/images/heat-pump/heat-pump-pv-system-desktop.webp",
      mobileSrc: "/images/heat-pump/heat-pump-pv-system-mobile.webp",
      desktopWidth: 1440,
      desktopHeight: 900,
      mobileWidth: 768,
      mobileHeight: 960,
      alt: "Wärmepumpen-Außengerät an einem Haus mit Photovoltaikanlage",
    },
    energiemanagement: {
      desktopSrc: "/images/heat-pump/heat-pump-energy-management-desktop.webp",
      mobileSrc: "/images/heat-pump/heat-pump-energy-management-mobile.webp",
      desktopWidth: 1440,
      desktopHeight: 900,
      mobileWidth: 768,
      mobileHeight: 960,
      alt: "Wärmepumpen-Außengerät neben einem modernen Wohnhaus",
    },
  },
  klimaanlagen: {
    "single-split": {
      desktopSrc: "/images/climate/climate-outdoor-unit-desktop.webp",
      mobileSrc: "/images/climate/climate-outdoor-unit-mobile.webp",
      desktopWidth: 1440,
      desktopHeight: 900,
      mobileWidth: 768,
      mobileHeight: 960,
      alt: "Klima-Außengerät auf einer Terrasse neben einem Wohnhaus",
    },
    photovoltaik: {
      desktopSrc: "/images/climate/climate-house-pv-desktop.webp",
      mobileSrc: "/images/climate/climate-house-pv-mobile.webp",
      desktopWidth: 1440,
      desktopHeight: 900,
      mobileWidth: 768,
      mobileHeight: 960,
      alt: "Wohnhaus mit Photovoltaik auf dem Dach und kleinem Klima-Außengerät",
    },
  },
};

const imageLeftSections = new Set([
  "funktionsweise",
  "eigenverbrauch",
  "single-split",
  "pv-ueberschussladen",
  "photovoltaik-kombination",
]);

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

        {content.faqRouteKey === "kontakt" ? (
          <SecondaryPageHeading
            eyebrow={content.hero.eyebrow ?? "Kontakt"}
            title={content.hero.title}
            description={content.hero.description}
            primaryCta={content.hero.primaryCta}
            secondaryCta={content.hero.secondaryCta}
          />
        ) : visual ? (
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

        {content.faqRouteKey === "kontakt" && beforeFaq}

        {content.sections.map((section, index) => {
          const sectionImage = section.id
            ? sectionVisuals[content.faqRouteKey]?.[section.id]
            : undefined;
          let layout: "image-left" | "image-right" | "statement" | "editorial" = "editorial";
          if (sectionImage) {
            layout = imageLeftSections.has(section.id ?? "") ? "image-left" : "image-right";
          } else if (content.faqRouteKey !== "kontakt" && index % 2 === 0) {
            layout = "statement";
          }

          return (
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
              layout={layout}
              image={sectionImage}
            />
          );
        })}

        {content.faqRouteKey !== "kontakt" && beforeFaq}
        <PublicFaqSection
          faqs={faqs}
          categorySlug={faqCategory?.slug}
          categoryLabel={faqCategory?.label}
        />

        {content.faqRouteKey !== "konfigurator" && content.faqRouteKey !== "kontakt" && (
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
