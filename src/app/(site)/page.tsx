import type { ComponentType, SVGProps } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { FaqJsonLd } from "@/components/faq/faq-json-ld";
import { PublicFaqSection } from "@/components/faq/public-faq-section";
import { ArtDirectedImage } from "@/components/media/art-directed-image";
import { HomePageJsonLd } from "@/components/seo/home-page-json-ld";
import {
  ArrowRightIcon,
  BatteryIcon,
  BoltIcon,
  CheckIcon,
  LeafIcon,
  SnowflakeIcon,
  SunIcon,
} from "@/components/ui/icons";
import { homeContent } from "@/content";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(homeContent.seo);

type FeatureIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface ProductFeatureProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  benefits: readonly string[];
  href: string;
  calculatorHref?: string;
  configuratorHref: string;
  desktopSrc: string;
  mobileSrc: string;
  imageAlt: string;
  icon: FeatureIcon;
  reverse?: boolean;
  dark?: boolean;
}

function ProductFeature({
  id,
  eyebrow,
  title,
  description,
  benefits,
  href,
  calculatorHref,
  configuratorHref,
  desktopSrc,
  mobileSrc,
  imageAlt,
  icon: Icon,
  reverse = false,
  dark = false,
}: ProductFeatureProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`section-space overflow-hidden ${dark ? "bg-brand-navy text-white" : "bg-background"}`}
    >
      <div className="section-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-24">
        <div className={`media-frame aspect-[4/5] md:aspect-[4/3] ${reverse ? "lg:order-2" : ""}`}>
          <ArtDirectedImage
            desktopSrc={desktopSrc}
            mobileSrc={mobileSrc}
            desktopWidth={1600}
            desktopHeight={1200}
            mobileWidth={1200}
            mobileHeight={1500}
            alt={imageAlt}
            sizes="(max-width: 1023px) calc(100vw - 2rem), 50vw"
            className="block transition-transform duration-700 hover:scale-[1.015]"
          />
        </div>

        <div className={reverse ? "lg:order-1" : ""}>
          <div
            className={`mb-6 inline-flex size-12 items-center justify-center rounded-xl ${
              dark ? "bg-white/10 text-cyan-200" : "bg-surface-soft text-brand-primary"
            }`}
          >
            <Icon className="size-6" />
          </div>
          <p className={dark ? "eyebrow text-cyan-200" : "eyebrow"}>{eyebrow}</p>
          <h2
            id={`${id}-heading`}
            className={`section-title mt-4 ${dark ? "text-white" : ""}`}
          >
            {title}
          </h2>
          <p className={`mt-6 max-w-xl text-lg leading-8 ${dark ? "text-white/72" : "text-[var(--text-muted)]"}`}>
            {description}
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className={`flex items-start gap-3 text-sm leading-6 ${dark ? "text-white/78" : "text-brand-dark"}`}
              >
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                    dark ? "bg-cyan-300/15 text-cyan-200" : "bg-cyan-50 text-brand-primary"
                  }`}
                >
                  <CheckIcon className="size-3.5" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={configuratorHref} className={dark ? "button-light" : "button-primary"}>
              Projekt konfigurieren
            </Link>
            <Link
              href={calculatorHref ?? href}
              className={
                dark
                  ? "inline-flex min-h-13 items-center justify-center rounded-[var(--radius-md)] border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/60"
                  : "button-secondary"
              }
            >
              {calculatorHref ? "Rechner öffnen" : "Mehr erfahren"}
            </Link>
          </div>
          {calculatorHref ? (
            <Link
              href={href}
              className={`group mt-6 inline-flex items-center gap-2 text-sm font-semibold ${
                dark ? "text-cyan-200" : "text-brand-primary"
              }`}
            >
              Lösung kennenlernen
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

const productFeatures: readonly ProductFeatureProps[] = [
  {
    id: "photovoltaik",
    eyebrow: "Photovoltaik",
    title: "Eigener Solarstrom – sorgfältig auf Ihr Zuhause abgestimmt",
    description:
      "Eine gute Photovoltaikanlage beginnt nicht bei der Modulzahl, sondern bei Ihrem Dach, Ihrem Verbrauch und Ihren Plänen. Wir verbinden diese Faktoren zu einer stimmigen Gesamtlösung.",
    benefits: [
      "Individuelle Dach- und Verbrauchsanalyse",
      "Abgestimmte Komponenten",
      "Fachgerechte Montage",
      "Erweiterbar um Speicher und Wallbox",
    ],
    href: "/photovoltaik",
    calculatorHref: "/rechner/photovoltaik-kosten",
    configuratorHref: "/konfigurator/photovoltaik",
    desktopSrc: "/images/photovoltaic/photovoltaic-feature-desktop.webp",
    mobileSrc: "/images/photovoltaic/photovoltaic-feature-mobile.webp",
    imageAlt: "Fachgerechte Montage einer Photovoltaikanlage auf einem Hausdach",
    icon: SunIcon,
  },
  {
    id: "stromspeicher",
    eyebrow: "Stromspeicher",
    title: "Solarenergie verfügbar machen, wenn Sie sie wirklich brauchen",
    description:
      "Ein passend dimensionierter Speicher verschiebt Ihren Solarstrom in die Stunden, in denen Ihr Zuhause Energie benötigt. Entscheidend ist das Zusammenspiel von Kapazität, Leistung und Verbrauch.",
    benefits: [
      "Passend zum Lastprofil ausgelegt",
      "Transparente Anlagenüberwachung",
      "Optionen für Ersatzstrom mitdenken",
      "Intelligentes Energiemanagement",
    ],
    href: "/stromspeicher",
    configuratorHref: "/konfigurator/stromspeicher",
    desktopSrc: "/images/battery-storage/battery-storage-feature-desktop.webp",
    mobileSrc: "/images/battery-storage/battery-storage-feature-mobile.webp",
    imageAlt: "Modern installierter Stromspeicher in einem hellen Hauswirtschaftsraum",
    icon: BatteryIcon,
    reverse: true,
    dark: true,
  },
  {
    id: "waermepumpe",
    eyebrow: "Wärmepumpe",
    title: "Wärme neu denken – mit Blick auf das gesamte Gebäude",
    description:
      "Gebäudehülle, Heizflächen, Wärmebedarf und elektrische Versorgung entscheiden über die richtige Lösung. Wir betrachten die Wärmepumpe als Teil Ihres gesamten Energiesystems.",
    benefits: [
      "Gebäudesituation strukturiert erfassen",
      "Heizsystem und Bedarf abstimmen",
      "Photovoltaik sinnvoll integrieren",
      "Betrieb langfristig mitdenken",
    ],
    href: "/waermepumpen",
    calculatorHref: "/rechner/waermepumpe-kosten",
    configuratorHref: "/konfigurator/waermepumpe",
    desktopSrc: "/images/heat-pump/heat-pump-feature-desktop.webp",
    mobileSrc: "/images/heat-pump/heat-pump-feature-mobile.webp",
    imageAlt: "Dezent in die Architektur eines Wohnhauses integrierte Wärmepumpe",
    icon: LeafIcon,
  },
  {
    id: "klimaanlage",
    eyebrow: "Klimaanlage",
    title: "Angenehmes Raumklima, passend zu Räumen und Alltag",
    description:
      "Eine effiziente Klimatisierung berücksichtigt mehr als Quadratmeter: Sonneneinstrahlung, Fenster, Nutzung und Leitungswege prägen die passende Single- oder Multisplit-Lösung.",
    benefits: [
      "Individuelle Kühllastbetrachtung",
      "Single- und Multisplit-Lösungen",
      "Ruhige Gerätepositionierung",
      "Auf Wunsch mit PV-Strom kombinieren",
    ],
    href: "/klimaanlagen",
    calculatorHref: "/rechner/klimaanlage-kosten",
    configuratorHref: "/konfigurator/klimaanlage",
    desktopSrc: "/images/climate/climate-feature-desktop.webp",
    mobileSrc: "/images/climate/climate-feature-mobile.webp",
    imageAlt: "Dezent integrierte Klimaanlage in einem hellen modernen Wohnraum",
    icon: SnowflakeIcon,
    reverse: true,
  },
  {
    id: "wallbox",
    eyebrow: "Wallbox",
    title: "Zuhause sicher laden und mehr eigenen PV-Strom nutzen",
    description:
      "Fahrzeug, Hausanschluss, Leitungsweg und Photovoltaikanlage bilden eine Einheit. Wir planen Ladeleistung, Schutztechnik und intelligentes Lastmanagement gemeinsam.",
    benefits: [
      "Elektroinstallation vorab prüfen",
      "PV-Überschussladen vorbereiten",
      "Lastmanagement berücksichtigen",
      "Erweiterbare Ladelösung planen",
    ],
    href: "/wallbox",
    calculatorHref: "/rechner/wallbox-kosten",
    configuratorHref: "/konfigurator/wallbox",
    desktopSrc: "/images/wallbox/wallbox-feature-desktop.webp",
    mobileSrc: "/images/wallbox/wallbox-feature-mobile.webp",
    imageAlt: "Elektroauto lädt an einer Wallbox unter dem Carport eines Hauses mit Photovoltaik",
    icon: BoltIcon,
  },
] as const;

export default async function HomePage() {
  const faqs = await getPublicFaqEntriesByRoute("home");

  return (
    <>
      <HomePageJsonLd seo={homeContent.seo} />
      <FaqJsonLd faqs={faqs} />

      <main id="main-content">
        <section className="relative isolate min-h-[44rem] overflow-hidden bg-surface-soft md:min-h-[46rem] lg:min-h-[calc(100svh-7rem)]">
          <div className="absolute inset-0">
            <ArtDirectedImage
              desktopSrc="/images/home-premium/hero-energy-home-desktop.webp"
              mobileSrc="/images/home-premium/hero-energy-home-mobile.webp"
              desktopWidth={2000}
              desktopHeight={1200}
              mobileWidth={1200}
              mobileHeight={1600}
              alt="Modernes Haus mit Photovoltaik, Wärmepumpe und Wallbox in den bayerischen Voralpen"
              sizes="100vw"
              fetchPriority="high"
              className="block"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,254,0.02)_16%,rgba(255,255,254,0.18)_42%,rgba(255,255,254,0.97)_72%,#fffffe_88%)] md:bg-[linear-gradient(90deg,#fffffe_0%,rgba(255,255,254,0.96)_32%,rgba(255,255,254,0.6)_51%,rgba(255,255,254,0.03)_74%)]" />

          <div className="section-shell relative flex min-h-[44rem] items-end pb-12 md:min-h-[46rem] md:items-center md:pb-0 lg:min-h-[calc(100svh-7rem)]">
            <div className="max-w-[42rem]">
              <p className="eyebrow">{homeContent.hero.eyebrow}</p>
              <h1 className="display-title mt-5">{homeContent.hero.title}</h1>
              <p className="lead-copy mt-6 max-w-[38rem]">{homeContent.hero.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/konfigurator" className="button-primary group">
                  Energieprojekt konfigurieren
                  <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="#leistungen" className="button-secondary">
                  Lösungen entdecken
                </Link>
              </div>
              <p className="mt-6 max-w-lg text-sm leading-6 text-[var(--text-muted)]">
                Persönliche Beratung, fachgerechte Planung und zuverlässige Umsetzung aus einer Hand.
              </p>
            </div>
          </div>
        </section>

        <section aria-label="Kompetenz" className="border-y border-border-default bg-background">
          <div className="section-shell grid md:grid-cols-3">
            {[
              ["Persönlich geplant", "Ihr Gebäude und Ihre Ziele geben die Richtung vor."],
              ["Systemisch gedacht", "Erzeugung, Speicherung, Wärme und Mobilität greifen ineinander."],
              ["Regional erreichbar", "Direkter Kontakt zu Energie-Kraft Süd in Ainring."],
            ].map(([title, description], index) => (
              <div
                key={title}
                className={`py-7 md:px-8 md:py-9 ${index > 0 ? "border-t border-border-default md:border-t-0 md:border-l" : ""}`}
              >
                <p className="font-semibold text-brand-navy">{title}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="leistungen" className="section-space bg-surface">
          <div className="section-shell grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="eyebrow">Energielösungen</p>
              <h2 className="section-title mt-4">Ein Zuhause. Ein Energiesystem. Viele Möglichkeiten.</h2>
            </div>
            <p className="lead-copy lg:ml-auto">
              Einzelne Technik wird dann wirklich stark, wenn sie zu Ihrem Gebäude und zu den anderen
              Komponenten passt. Deshalb planen wir Lösungen, die heute funktionieren und morgen
              erweiterbar bleiben.
            </p>
          </div>
        </section>

        {productFeatures.map((feature) => (
          <ProductFeature key={feature.id} {...feature} />
        ))}

        <section className="section-space bg-surface-soft" aria-labelledby="service-heading">
          <div className="section-shell grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
            <div className="media-frame aspect-[4/5] md:aspect-[8/5]">
              <ArtDirectedImage
                desktopSrc="/images/home-premium/service-maintenance-desktop.webp"
                mobileSrc="/images/home-premium/service-maintenance-mobile.webp"
                desktopWidth={1600}
                desktopHeight={1000}
                mobileWidth={1080}
                mobileHeight={1350}
                alt="Servicetechniker prüft fachgerecht eine Energieanlage"
                sizes="(max-width: 1023px) calc(100vw - 2rem), 54vw"
                className="block"
              />
            </div>
            <div>
              <p className="eyebrow">Service & Wartung</p>
              <h2 id="service-heading" className="section-title mt-4">
                Verlässlichkeit endet nicht mit der Inbetriebnahme
              </h2>
              <p className="lead-copy mt-6">
                Monitoring, Anlagencheck und Wartung helfen dabei, Auffälligkeiten früh zu erkennen
                und Ihre Technik dauerhaft zuverlässig zu betreiben.
              </p>
              <Link href="/service-und-wartung" className="button-primary mt-8">
                Service kennenlernen
              </Link>
            </div>
          </div>
        </section>

        <section className="section-space bg-background" aria-labelledby="trust-heading">
          <div className="section-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
            <div className="lg:order-2">
              <p className="eyebrow">Beratung & Vertrauen</p>
              <h2 id="trust-heading" className="section-title mt-4">
                Verständlich beraten. Transparent planen. Persönlich begleiten.
              </h2>
              <p className="lead-copy mt-6">
                Jede Immobilie bringt andere Voraussetzungen mit. Wir klären die Ausgangssituation,
                ordnen technische Optionen verständlich ein und entwickeln daraus den nächsten
                sinnvollen Schritt.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/pv-referenzen" className="button-primary">
                  Referenzen ansehen
                </Link>
                <Link href="/kontakt" className="button-secondary">
                  Gespräch vereinbaren
                </Link>
              </div>
            </div>
            <div className="media-frame aspect-[4/5] md:aspect-[8/5] lg:order-1">
              <ArtDirectedImage
                desktopSrc="/images/home-premium/consultation-reference-desktop.webp"
                mobileSrc="/images/home-premium/consultation-reference-mobile.webp"
                desktopWidth={1600}
                desktopHeight={1000}
                mobileWidth={1080}
                mobileHeight={1350}
                alt="Persönliche Energieberatung mit Hauseigentümern am Planungstisch"
                sizes="(max-width: 1023px) calc(100vw - 2rem), 50vw"
                className="block"
              />
            </div>
          </div>
        </section>

        <PublicFaqSection
          faqs={faqs}
          eyebrow="Fragen & Antworten"
          title="Gut informiert ins Energieprojekt starten"
          description="Antworten auf häufige Fragen zu unseren Lösungen, zur Planung und zur Umsetzung."
        />

        <section className="bg-brand-primary py-16 text-white md:py-20" aria-labelledby="home-cta-heading">
          <div className="section-shell grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-cyan-100 uppercase">
                Der nächste Schritt
              </p>
              <h2 id="home-cta-heading" className="mt-3 max-w-3xl text-3xl text-white md:text-4xl">
                Bringen Sie Ihr Energieprojekt ins Rollen.
              </h2>
              <p className="mt-4 max-w-2xl text-white/78">
                Starten Sie direkt im Konfigurator oder sprechen Sie persönlich mit uns.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/konfigurator" className="button-light">
                Jetzt konfigurieren
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex min-h-13 items-center justify-center rounded-[var(--radius-md)] border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
