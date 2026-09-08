import type { Metadata } from "next";

import { FaqJsonLd } from "@/components/faq/faq-json-ld";
import { PublicFaqSection } from "@/components/faq/public-faq-section";
import { BrandIntro } from "@/components/marketing/brand-intro";
import {
  BrandStatementSection,
  CTAImageBandSection,
  GradientBenefitSection,
  PremiumHeroSection,
  ProcessSection,
  ReferenceProjectsSection,
  SplitFeatureSection,
} from "@/components/marketing/marketing-sections";
import { PartnerLogoCarousel } from "@/components/marketing/partner-logo-carousel";
import { HomePageJsonLd } from "@/components/seo/home-page-json-ld";
import { BatteryIcon, BoltIcon, LeafIcon, SunIcon } from "@/components/ui/icons";
import { homeContent } from "@/content";
import { regionalReferenceProjects } from "@/content/reference-projects";
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
    desktopSrc: "/images/battery-storage/battery-storage-feature-desktop.webp",
    mobileSrc: "/images/battery-storage/battery-storage-feature-mobile.webp",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    alt: "Modern installierter Stromspeicher in einem hellen Hauswirtschaftsraum",
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
  const faqs = await getPublicFaqEntriesByRoute("home");

  return (
    <>
      <HomePageJsonLd seo={homeContent.seo} />
      <FaqJsonLd faqs={faqs} />
      <BrandIntro />

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
          primaryCta={{ label: "Energieprojekt konfigurieren", href: "/konfigurator" }}
          secondaryCta={{ label: "Lösungen entdecken", href: "#photovoltaik" }}
        />

        <BrandStatementSection
          eyebrow="Energie-Kraft Süd"
          title="Energietechnik mit regionaler Nähe und einem klaren Plan"
          description="Wir betrachten nicht nur einzelne Geräte, sondern Ihr Gebäude, Ihren Verbrauch und die nächsten sinnvollen Schritte. So entsteht eine Lösung, die technisch zusammenpasst und verständlich bleibt."
          highlights={[
            { title: "Persönlich geplant", description: "Ihr Gebäude und Ihre Ziele geben die Richtung vor." },
            { title: "Systemisch gedacht", description: "Erzeugung, Speicherung, Wärme und Mobilität greifen ineinander." },
            { title: "Regional erreichbar", description: "Direkter Kontakt zu Energie-Kraft Süd in Ainring." },
          ]}
        />

        <div aria-label="Unsere Energielösungen">
          <SplitFeatureSection
            id="photovoltaik"
            eyebrow="Solarstrom produzieren"
            title="Eigener Solarstrom – sorgfältig auf Ihr Zuhause abgestimmt"
            description="Eine gute Photovoltaikanlage beginnt nicht bei der Modulzahl, sondern bei Ihrem Dach, Ihrem Verbrauch und Ihren Plänen. Wir verbinden diese Faktoren zu einer stimmigen Gesamtlösung."
            benefits={["Individuelle Dach- und Verbrauchsanalyse", "Abgestimmte Komponenten", "Fachgerechte Montage", "Erweiterbar um Speicher und Wallbox"]}
            image={productImages.photovoltaic}
            imagePosition="right"
            surface="white"
            primaryCta={{ label: "PV-Projekt konfigurieren", href: "/konfigurator/photovoltaik" }}
            secondaryCta={{ label: "Photovoltaik kennenlernen", href: "/photovoltaik" }}
          />

          <GradientBenefitSection
            eyebrow="Ein System statt Einzellösungen"
            title="Energie dort erzeugen und nutzen, wo sie gebraucht wird"
            description="Photovoltaik, Speicher, Wärme und Mobilität werden gemeinsam gedacht – ohne unnötige technische Komplexität für Sie."
            benefits={[
              { title: "Passend geplant", description: "Gebäude, Verbrauch und Zukunftspläne bestimmen die Auslegung.", icon: SunIcon },
              { title: "Flexibel nutzbar", description: "Solarstrom kann gespeichert und zeitversetzt eingesetzt werden.", icon: BatteryIcon },
              { title: "Ganzheitlich gedacht", description: "Strom, Wärme und Mobilität greifen technisch sauber ineinander.", icon: LeafIcon },
              { title: "Zukunftsfähig", description: "Erweiterungen werden bereits bei der Planung berücksichtigt.", icon: BoltIcon },
            ]}
          />

          <SplitFeatureSection
            id="stromspeicher"
            eyebrow="Solarstrom speichern"
            title="Solarenergie verfügbar machen, wenn Sie sie wirklich brauchen"
            description="Ein passend dimensionierter Speicher verschiebt Ihren Solarstrom in die Stunden, in denen Ihr Zuhause Energie benötigt. Entscheidend ist das Zusammenspiel von Kapazität, Leistung und Verbrauch."
            benefits={["Passend zum Lastprofil ausgelegt", "Transparente Anlagenüberwachung", "Optionen für Ersatzstrom mitdenken", "Intelligentes Energiemanagement"]}
            image={productImages.battery}
            imagePosition="left"
            surface="gradient"
            primaryCta={{ label: "Speicher konfigurieren", href: "/konfigurator/stromspeicher" }}
            secondaryCta={{ label: "Stromspeicher kennenlernen", href: "/stromspeicher" }}
          />

          <SplitFeatureSection
            id="waermepumpe"
            eyebrow="Mit Solarstrom heizen"
            title="Wärme neu denken – mit Blick auf das gesamte Gebäude"
            description="Gebäudehülle, Heizflächen, Wärmebedarf und elektrische Versorgung entscheiden über die richtige Lösung. Wir betrachten die Wärmepumpe als Teil Ihres gesamten Energiesystems."
            benefits={["Gebäudesituation strukturiert erfassen", "Heizsystem und Bedarf abstimmen", "Photovoltaik sinnvoll integrieren", "Betrieb langfristig mitdenken"]}
            image={productImages.heatPump}
            imagePosition="right"
            surface="soft"
            primaryCta={{ label: "Wärmepumpe konfigurieren", href: "/konfigurator/waermepumpe" }}
            secondaryCta={{ label: "Wärmepumpen kennenlernen", href: "/waermepumpen" }}
          />

          <SplitFeatureSection
            id="klimaanlage"
            eyebrow="Räume angenehm temperieren"
            title="Angenehmes Raumklima, passend zu Räumen und Alltag"
            description="Eine effiziente Klimatisierung berücksichtigt mehr als Quadratmeter: Sonneneinstrahlung, Fenster, Nutzung und Leitungswege prägen die passende Single- oder Multisplit-Lösung."
            benefits={["Individuelle Kühllastbetrachtung", "Single- und Multisplit-Lösungen", "Ruhige Gerätepositionierung", "Auf Wunsch mit PV-Strom kombinieren"]}
            image={productImages.climate}
            imagePosition="left"
            surface="navy"
            primaryCta={{ label: "Klimaanlage konfigurieren", href: "/konfigurator/klimaanlage" }}
            secondaryCta={{ label: "Klimaanlagen kennenlernen", href: "/klimaanlagen" }}
          />

          <SplitFeatureSection
            id="wallbox"
            eyebrow="Mit Solarstrom tanken"
            title="Zuhause sicher laden und mehr eigenen PV-Strom nutzen"
            description="Fahrzeug, Hausanschluss, Leitungsweg und Photovoltaikanlage bilden eine Einheit. Wir planen Ladeleistung, Schutztechnik und intelligentes Lastmanagement gemeinsam."
            benefits={["Elektroinstallation vorab prüfen", "PV-Überschussladen vorbereiten", "Lastmanagement berücksichtigen", "Erweiterbare Ladelösung planen"]}
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
          title="Verlässlichkeit endet nicht mit der Inbetriebnahme"
          description="Monitoring, Anlagencheck und Wartung helfen dabei, Auffälligkeiten früh zu erkennen und Ihre Technik dauerhaft zuverlässig zu betreiben."
          benefits={["Anlagensituation strukturiert aufnehmen", "Betriebsdaten nachvollziehbar einordnen", "Wartung passend zur Technik planen", "Persönlicher Kontakt bei Rückfragen"]}
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
          surface="blue"
          primaryCta={{ label: "Service kennenlernen", href: "/service-und-wartung" }}
          secondaryCta={{ label: "Serviceanfrage stellen", href: "/kontakt" }}
        />

        <ProcessSection
          steps={[
            { title: "Ausgangslage verstehen", description: "Wir klären Gebäude, Energiebedarf, technische Voraussetzungen und Ihre Ziele." },
            { title: "System sauber planen", description: "Komponenten, Dimensionierung und mögliche Erweiterungen werden aufeinander abgestimmt." },
            { title: "Verlässlich umsetzen", description: "Von der Montage bis zur Inbetriebnahme behalten Sie einen klaren Ansprechpartner." },
          ]}
        />

        <ReferenceProjectsSection projects={regionalReferenceProjects} />
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
