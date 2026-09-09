import type { Metadata } from "next";
import Link from "next/link";

import { TeamOverview } from "@/components/company/team-overview";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  BrandStatementSection,
  EditorialFeatureSection,
  PremiumHeroSection,
  ReferenceProjectsSection,
} from "@/components/marketing/marketing-sections";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { CONTACT_FORM_HREF } from "@/config/routes";
import { regionalReferenceProjects } from "@/content/reference-projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildAboutPageJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const seo = {
  title: "Über Energie-Kraft Süd | Energie aus Ainring",
  description:
    "Lernen Sie Energie-Kraft Süd kennen: ein regional verankerter Fachbetrieb für Photovoltaik, Speicher und vernetzte Energielösungen aus Ainring.",
  canonicalPath: "/ueber-uns",
};

export const metadata: Metadata = buildMetadata(seo);

const heroImage = {
  desktopSrc: "/images/team/company-service-hero-desktop.webp",
  mobileSrc: "/images/team/company-service-hero-mobile.webp",
  desktopWidth: 1800,
  desktopHeight: 1039,
  mobileWidth: 1080,
  mobileHeight: 1350,
  alt: "Mitarbeiter von Energie-Kraft Süd auf einem Dach vor dem Alpenpanorama",
};

export default function AboutPage() {
  return (
    <>
      <JsonLdScript data={buildAboutPageJsonLd(seo)} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({ currentLabel: "Über uns", currentPath: seo.canonicalPath })}
      />
      <main id="main-content">
        <Breadcrumbs currentLabel="Über uns" />
        <PremiumHeroSection
          eyebrow="Energie-Kraft Süd"
          title="Energieprojekte entstehen durch Nähe, Erfahrung und saubere Arbeit."
          description="Von Ainring aus verbinden wir Beratung, Planung, Installation und Service zu Lösungen, die zum Gebäude und zum tatsächlichen Energiebedarf passen."
          image={heroImage}
          primaryCta={{ label: "Projekt besprechen", href: CONTACT_FORM_HREF }}
          secondaryCta={{ label: "Referenzen entdecken", href: "/pv-referenzen" }}
        />

        <EditorialFeatureSection
          eyebrow="Wer wir sind"
          title="Ein regionaler Fachbetrieb mit Blick auf das ganze System"
          paragraphs={[
            "Energie-Kraft Süd begleitet private und gewerbliche Energieprojekte von der ersten Einordnung bis über die Inbetriebnahme hinaus. Photovoltaik und Stromspeicher bilden dabei den Schwerpunkt; Wärme, Klima und Elektromobilität werden dort einbezogen, wo sie das Gesamtsystem sinnvoll ergänzen.",
            "Unser Standort in Ainring und die dokumentierten Projekte in der Umgebung prägen eine Arbeitsweise mit kurzen Wegen, persönlicher Abstimmung und einem klaren Bezug zur Region.",
          ]}
          links={[
            {
              eyebrow: "Schwerpunkt",
              label: "Photovoltaik & Speicher",
              description: "Erzeugung, Speicherung und Verbrauch gemeinsam planen.",
              href: "/energieloesungen",
            },
            {
              eyebrow: "Für Betriebe",
              label: "Energie für Unternehmen",
              description: "Technische Lösungen für Hallen, Gewerbe und betriebliche Nutzung.",
              href: "/energieloesungen/photovoltaik-fuer-unternehmen",
            },
          ]}
          surface="soft"
          layout="editorial"
        />

        <BrandStatementSection
          eyebrow="Unsere Haltung"
          title="Gute Technik beginnt mit den richtigen Fragen."
          description="Wir betrachten Gebäude, Verbrauch und Ziele, bevor Komponenten ausgewählt werden. So bleibt die Planung nachvollziehbar und die Lösung auf den konkreten Einsatz ausgerichtet."
          highlights={[
            {
              title: "Persönlich",
              description:
                "Anforderungen und Entscheidungen werden verständlich und direkt abgestimmt.",
            },
            {
              title: "Systemisch",
              description:
                "Erzeugung, Speicherung und weitere Verbraucher werden zusammen betrachtet.",
            },
            {
              title: "Langfristig",
              description:
                "Service und technische Betreuung gehören zum Lebenszyklus einer Anlage.",
            },
          ]}
        />

        <EditorialFeatureSection
          eyebrow="Entwicklung"
          title="Aus praktischer Energiearbeit gewachsen"
          paragraphs={[
            "Das Unternehmen hat sein Leistungsspektrum über viele Jahre entlang realer Kundenprojekte entwickelt. Aus der Photovoltaikplanung ist so die vernetzte Betrachtung von Speicher, Wärme, Klima, Ladeinfrastruktur und Service entstanden.",
            "Konkrete historische Jahreszahlen oder Größenangaben veröffentlichen wir erst nach erneuter interner Bestätigung. Entscheidend bleibt der belegbare Projektbestand aus der Region.",
          ]}
          surface="white"
          layout="statement"
        />

        <TeamOverview mode="company" />

        <EditorialFeatureSection
          eyebrow="Kompetenz & Qualität"
          title="Verantwortung vom Konzept bis zum Betrieb"
          paragraphs={[
            "Planung, Montage, Inbetriebnahme und Service sind keine losen Einzelschritte. Die beteiligten Bereiche stimmen sich entlang des Projekts ab und setzen auf ausgewählte System- und Herstellerpartner.",
            "Der bereits dokumentierte DGS-Nachweis bleibt als Vertrauenselement im Website-Footer erhalten. Weitere Zertifizierungs- oder Partnerclaims werden erst nach aktueller fachlicher Bestätigung konkret benannt.",
          ]}
          items={[
            "Technische Planung für Gebäude und Verbrauch",
            "Koordination der beteiligten Gewerke",
            "Installation und strukturierte Inbetriebnahme",
            "Service als eigener Verantwortungsbereich",
          ]}
          links={[
            {
              label: "Service & Team",
              description: "Ansprechpartner und Betreuung nach der Installation.",
              href: "/service-und-wartung/service-und-team",
            },
            {
              label: "Serviceleistungen",
              description: "Prüfung, Wartung und Unterstützung für Energieanlagen.",
              href: "/service-und-wartung",
            },
          ]}
          surface="soft"
          layout="editorial"
        />

        <ReferenceProjectsSection
          projects={regionalReferenceProjects}
          title="Arbeit, die in der Region sichtbar ist"
          description="Die Referenzen zeigen reale private und gewerbliche Photovoltaikprojekte aus Orten rund um unseren Standort."
        />

        <section className="brand-gradient py-16 text-white md:py-20">
          <div className="section-shell grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-3xl text-white md:text-4xl">
              Sprechen wir über Ihr Energieprojekt.
            </h2>
            <Link href={CONTACT_FORM_HREF} className="button-light">
              Kontakt aufnehmen
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
