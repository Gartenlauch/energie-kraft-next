import type { Metadata } from "next";
import Link from "next/link";

import { FaqJsonLd } from "@/components/faq/faq-json-ld";
import { PublicFaqSection } from "@/components/faq/public-faq-section";
import { BrandIntro } from "@/components/marketing/brand-intro";
import { CustomerReviewsSection } from "@/components/marketing/customer-reviews-section";
import { getCustomerReviews } from "@/lib/reviews";
import {
  BrandStatementSection,
  CTAImageBandSection,
  PremiumHeroSection,
  ProcessSection,
  ReferenceProjectsSection,
  SplitFeatureSection,
} from "@/components/marketing/marketing-sections";
import { PartnerLogoCarousel } from "@/components/marketing/partner-logo-carousel";
import { HomePageJsonLd } from "@/components/seo/home-page-json-ld";
import { EnergyFlow } from "@/components/marketing/energy-flow";
import { homeContent, homeSections } from "@/content/pages/home";
import { referenceGroups } from "@/content/reference-projects";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(homeContent.seo);

const productImages = {
  photovoltaic: {
    desktopSrc: "/images/photovoltaic/photovoltaic-feature-desktop.webp",
    mobileSrc: "/images/photovoltaic/photovoltaic-feature-mobile.webp",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    alt: "Fachgerechte Montage einer Photovoltaikanlage auf einem Hausdach",
  },
  battery: {
    desktopSrc: "/images/battery-storage/residential-storage-feature-desktop.webp",
    mobileSrc: "/images/battery-storage/residential-storage-feature-mobile.webp",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    alt: "Sigenergy-Stromspeicher an der Terrasse eines Wohnhauses",
  },
  commercial: {
    desktopSrc: "/images/commercial-photovoltaic/commercial-photovoltaic-hero-desktop.webp",
    mobileSrc: "/images/commercial-photovoltaic/commercial-photovoltaic-hero-mobile.webp",
    desktopWidth: 1600,
    desktopHeight: 1000,
    mobileWidth: 812,
    mobileHeight: 1015,
    alt: "Zwei Fachkr?fte auf einer Photovoltaikanlage auf einem Gewerbedach",
  },
  heatPump: {
    desktopSrc: "/images/heat-pump/heat-pump-feature-desktop.webp",
    mobileSrc: "/images/heat-pump/heat-pump-feature-mobile.webp",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    alt: "Dezent in die Architektur eines Wohnhauses integrierte Wärmepumpe",
  },
  climate: {
    desktopSrc: "/images/climate/climate-feature-desktop.webp",
    mobileSrc: "/images/climate/climate-feature-mobile.webp",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    alt: "Dezent integrierte Klimaanlage in einem hellen modernen Wohnraum",
  },
  wallbox: {
    desktopSrc: "/images/wallbox/wallbox-feature-desktop.webp",
    mobileSrc: "/images/wallbox/wallbox-feature-mobile.webp",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    alt: "Elektroauto lädt an einer Wallbox unter dem Carport eines Hauses mit Photovoltaik",
  },
} as const;

export default async function HomePage() {
  const [faqs, reviews] = await Promise.all([
    getPublicFaqEntriesByRoute("home"),
    getCustomerReviews(),
  ]);

  return (
    <>
      <HomePageJsonLd seo={homeContent.seo} />
      <FaqJsonLd faqs={faqs} />

      <main id="main-content">
        <PremiumHeroSection
          eyebrow={homeContent.hero.eyebrow}
          title={homeContent.hero.title}
          description={homeContent.hero.description}
          image={{
            desktopSrc: "/images/home-premium/hero-energy-home-desktop.webp",
            mobileSrc: "/images/home-premium/hero-energy-home-mobile.webp",
            desktopWidth: 2000,
            desktopHeight: 1200,
            mobileWidth: 1200,
            mobileHeight: 1600,
            alt: "Modernes Haus mit Photovoltaik, Wärmepumpe und Wallbox in den bayerischen Voralpen",
          }}
          primaryCta={homeContent.hero.primaryCta}
          secondaryCta={homeContent.hero.secondaryCta}
        />

        <BrandIntro />
        <BrandStatementSection {...homeSections.intro} />

        <div aria-label="Unsere Energielösungen">
          <SplitFeatureSection
            {...homeSections.photovoltaic}
            image={productImages.photovoltaic}
            imagePosition="right"
            proportion="image-wide"
            surface="white"
          />

          <SplitFeatureSection
            {...homeSections.battery}
            image={productImages.battery}
            imagePosition="left"
            surface="white"
          />

          <EnergyFlow />
          <div className="bg-surface-soft pb-8 md:pb-10">
            <div className="section-shell border-border-default border-t pt-6 text-sm leading-7">
              <p>{homeSections.tariff.description}</p>
              <Link
                href={homeSections.tariff.link.href}
                className="text-brand-primary inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
              >
                {homeSections.tariff.link.label}
              </Link>
            </div>
          </div>

          <SplitFeatureSection
            {...homeSections.commercial}
            image={productImages.commercial}
            imagePosition="right"
            imageObjectPosition="right"
            imageReveal="none"
            surface="soft"
            secondaryCtaStyle="text"
          />

          <section
            className="bg-background py-6 md:py-7"
            aria-labelledby="supplementary-heading"
          >
            <div className="section-shell grid gap-4 lg:grid-cols-[0.8fr_1.6fr] lg:items-center lg:gap-12">
              <h2 id="supplementary-heading" className="max-w-[25ch] text-2xl leading-snug">
                {homeSections.supplementary.title}
              </h2>
              <p className="max-w-4xl text-[0.9375rem] leading-6 text-[var(--text-muted)]">
                {homeSections.supplementary.description}
              </p>
            </div>
          </section>

          <SplitFeatureSection
            id="waermepumpe"
            eyebrow="Mit Solarstrom heizen"
            title="Wärme, die zu Ihrem Haus passt."
            description="Wir betrachten Ihr Gebäude und Ihr Heizsystem gemeinsam. So wird die Wärmepumpe zu einem sinnvoll abgestimmten Teil Ihrer Energieversorgung."
            image={productImages.heatPump}
            proportion="image-dominant"
            imagePosition="right"
            surface="soft"
            primaryCta={{ label: "Wärmepumpe konfigurieren", href: "/konfigurator/waermepumpe" }}
            secondaryCta={{ label: "Wärmepumpen kennenlernen", href: "/waermepumpen" }}
          />

          <SplitFeatureSection
            id="klimaanlage"
            eyebrow="Räume angenehm temperieren"
            title="Ankommen. Durchatmen. Wohlfühlen."
            description="Angenehme Temperaturen, leiser Betrieb und eine dezente Installation: Wir planen Ihre Klimaanlage passend zu Räumen und Nutzung."
            image={productImages.climate}
            imagePosition="left"
            proportion="image-wide"
            surface="blue"
            primaryCta={{ label: "Klimaanlage konfigurieren", href: "/konfigurator/klimaanlage" }}
            secondaryCta={{ label: "Klimaanlagen kennenlernen", href: "/klimaanlagen" }}
          />

          <SplitFeatureSection
            id="wallbox"
            eyebrow="Mit Solarstrom tanken"
            title="Zuhause laden. Mit eigener Energie."
            description="Wir verbinden Ihre Wallbox mit Hausanschluss und Photovoltaik. Sicher installiert und vorbereitet für intelligentes Laden mit Solarstrom."
            image={productImages.wallbox}
            imagePosition="right"
            surface="white"
            primaryCta={{ label: "Wallbox konfigurieren", href: "/konfigurator/wallbox" }}
            secondaryCta={{ label: "Wallbox kennenlernen", href: "/wallbox" }}
          />
        </div>

        <SplitFeatureSection
          id="service"
          eyebrow="Service & Wartung"
          title="Auch danach für Sie da."
          description="Monitoring, Anlagencheck und Wartung helfen dabei, Auffälligkeiten früh zu erkennen und Ihre Technik dauerhaft zuverlässig zu betreiben."
          image={{
            desktopSrc: "/images/home-premium/service-maintenance-desktop.webp",
            mobileSrc: "/images/home-premium/service-maintenance-mobile.webp",
            desktopWidth: 1600,
            desktopHeight: 1000,
            mobileWidth: 1080,
            mobileHeight: 1350,
            alt: "Servicetechniker prüft fachgerecht eine Energieanlage",
          }}
          imagePosition="left"
          proportion="image-wide"
          surface="soft"
          primaryCta={{ label: "Service kennenlernen", href: "/service-und-wartung" }}
          secondaryCta={{ label: "Serviceanfrage stellen", href: "/kontakt" }}
        />

        <ProcessSection
          steps={[
            {
              title: "Ausgangslage verstehen",
              description:
                "Wir klären Gebäude, Energiebedarf, technische Voraussetzungen und Ihre Ziele.",
            },
            {
              title: "System sauber planen",
              description:
                "Komponenten, Dimensionierung und mögliche Erweiterungen werden aufeinander abgestimmt.",
            },
            {
              title: "Verlässlich umsetzen",
              description:
                "Von der Montage bis zur Inbetriebnahme behalten Sie einen klaren Ansprechpartner.",
            },
          ]}
        />

        <ReferenceProjectsSection projects={referenceGroups} />
        <CustomerReviewsSection {...reviews} />
        <PartnerLogoCarousel />

        <PublicFaqSection
          faqs={faqs}
          eyebrow="Fragen & Antworten"
          title="Gut informiert ins Energieprojekt starten"
          description="Antworten auf häufige Fragen zu unseren Lösungen, zur Planung und zur Umsetzung."
        />

        <CTAImageBandSection
          eyebrow="Persönliche Beratung"
          title="Bringen Sie Ihr Energieprojekt ins Rollen"
          description="Starten Sie direkt im Konfigurator oder klären Sie Ihre Ausgangssituation persönlich mit unserem Team."
          image={{
            desktopSrc: "/images/home-premium/contact-legacy-desktop.webp",
            mobileSrc: "/images/home-premium/contact-legacy-mobile.webp",
            desktopWidth: 2000,
            desktopHeight: 804,
            mobileWidth: 800,
            mobileHeight: 1200,
            alt: "Persönliche Beratung einer Familie zu einer Energielösung",
          }}
          primaryCta={{ label: "Jetzt konfigurieren", href: "/konfigurator" }}
          secondaryCta={{ label: "Kontakt aufnehmen", href: "/kontakt" }}
        />
      </main>
    </>
  );
}
