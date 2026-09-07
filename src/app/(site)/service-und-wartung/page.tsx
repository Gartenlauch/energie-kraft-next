import type { Metadata } from "next";

import { MarketingFeaturePage } from "@/app/(site)/_components/marketing-feature-page";
import { buildMetadata } from "@/lib/seo/metadata";

const seo = {
  title: "Service & Wartung für Energieanlagen | Energie-Kraft Süd",
  description:
    "Service, Anlagencheck und Wartung für Photovoltaik, Speicher, Klimaanlagen und weitere Energiesysteme – persönlich betreut durch Energie-Kraft Süd.",
  canonicalPath: "/service-und-wartung",
};

export const metadata: Metadata = buildMetadata(seo);

const sections = [
  {
    id: "anlagencheck",
    eyebrow: "Anlagencheck",
    title: "Auffälligkeiten erkennen, bevor sie den Betrieb beeinträchtigen",
    paragraphs: [
      "Eine strukturierte Prüfung hilft dabei, Betriebsdaten, sichtbare Komponenten und das Zusammenspiel der Anlage einzuordnen. Welche Prüfschritte sinnvoll sind, richtet sich nach der installierten Technik und dem konkreten Anliegen.",
      "Bestehen bereits Fehlermeldungen oder auffällige Ertragsabweichungen, teilen Sie uns diese am besten direkt bei der Kontaktaufnahme mit.",
    ],
    items: [
      "Anlagensituation und Anliegen aufnehmen",
      "Betriebsdaten und Meldungen einordnen",
      "Sichtbare Komponenten prüfen",
      "Nächste Schritte nachvollziehbar abstimmen",
    ],
  },
  {
    id: "wartung",
    eyebrow: "Wartung",
    title: "Pflege und Prüfung passend zum jeweiligen System",
    paragraphs: [
      "Wartungsbedarf und Intervalle unterscheiden sich je nach Produkt, Einsatzbedingungen und Herstellervorgaben. Deshalb wird nicht pauschal gearbeitet, sondern die vorhandene Anlage betrachtet.",
      "Bei Klimaanlagen gehören beispielsweise Filter, Kondensatführung und Anlagenfunktion zu den relevanten Themen. Bei Energiesystemen stehen je nach Aufbau andere Komponenten im Fokus.",
    ],
    items: [
      "Herstellervorgaben berücksichtigen",
      "Zugänglichkeit und Anlagenzustand bewerten",
      "Funktion und relevante Komponenten prüfen",
      "Ergebnisse transparent dokumentieren",
    ],
  },
  {
    id: "kontakt",
    eyebrow: "Direkter Kontakt",
    title: "Beschreiben Sie uns Ihre Anlage und Ihr Anliegen",
    paragraphs: [
      "Für eine erste Einordnung helfen Angaben zum Anlagentyp, zum Standort, zum Zeitpunkt der Inbetriebnahme und zu möglichen Fehlermeldungen. So kann der nächste sinnvolle Schritt gezielt vorbereitet werden.",
    ],
  },
] as const;

export default function ServicePage() {
  return (
    <MarketingFeaturePage
      seo={seo}
      breadcrumbLabel="Service & Wartung"
      eyebrow="Service & Wartung"
      title="Damit Ihre Energietechnik zuverlässig weiterarbeitet"
      description="Wir unterstützen Sie bei Anlagenchecks, Wartung und der Einordnung technischer Auffälligkeiten – strukturiert, persönlich und passend zur vorhandenen Technik."
      desktopSrc="/images/home-premium/service-maintenance-desktop.webp"
      mobileSrc="/images/home-premium/service-maintenance-mobile.webp"
      imageAlt="Servicetechniker prüft die Steuerung einer Energieanlage"
      sections={sections}
      ctaTitle="Sie haben eine Servicefrage zu Ihrer Anlage?"
      ctaLabel="Serviceanfrage stellen"
      ctaHref="/kontakt"
    />
  );
}
