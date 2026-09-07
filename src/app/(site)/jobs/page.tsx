import type { Metadata } from "next";

import { MarketingFeaturePage } from "@/app/(site)/_components/marketing-feature-page";
import { buildMetadata } from "@/lib/seo/metadata";

const seo = {
  title: "Jobs & Karriere | Energie-Kraft Süd",
  description:
    "Arbeiten bei Energie-Kraft Süd in Ainring: technische Energielösungen planen, umsetzen und persönlich betreuen.",
  canonicalPath: "/jobs",
};

export const metadata: Metadata = buildMetadata(seo);

const sections = [
  {
    eyebrow: "Zusammenarbeit",
    title: "Technik verstehen und Verantwortung übernehmen",
    paragraphs: [
      "Unsere Arbeit verbindet Elektrotechnik, Gebäudetechnik, sorgfältige Planung und direkten Kundenkontakt. Entscheidend sind ein hoher Qualitätsanspruch, verlässliche Abstimmung und Freude an Lösungen, die im Alltag funktionieren.",
    ],
    items: [
      "Sorgfältiges, eigenverantwortliches Arbeiten",
      "Verständliche Kommunikation im Team und mit Kunden",
      "Interesse an vernetzten Energiesystemen",
      "Qualität und Sicherheit im Blick behalten",
    ],
  },
  {
    eyebrow: "Interesse?",
    title: "Aktuelle Möglichkeiten persönlich klären",
    paragraphs: [
      "Der aktuelle Bedarf an Unterstützung kann sich ändern. Wenn Sie fachlich und menschlich zu Energie-Kraft Süd passen, freuen wir uns über eine aussagekräftige Kontaktaufnahme. Bitte nennen Sie dabei Ihren gewünschten Aufgabenbereich und Ihre relevante Erfahrung.",
      "Konkrete Konditionen und eine mögliche Position stimmen wir erst im persönlichen Austausch ab; auf dieser Seite werden bewusst keine nicht bestätigten Stellen ausgeschrieben.",
    ],
  },
] as const;

export default function JobsPage() {
  return (
    <MarketingFeaturePage
      seo={seo}
      breadcrumbLabel="Jobs"
      eyebrow="Arbeiten bei Energie-Kraft Süd"
      title="Gemeinsam Energieprojekte mit Substanz realisieren"
      description="Sie möchten technische Qualität, persönliche Beratung und moderne Energiesysteme zusammenbringen? Dann lernen wir uns gern kennen."
      desktopSrc="/images/home-premium/service-maintenance-desktop.webp"
      mobileSrc="/images/home-premium/service-maintenance-mobile.webp"
      imageAlt="Fachkraft bei der sorgfältigen Prüfung einer Energieanlage"
      sections={sections}
      ctaTitle="Sie möchten Teil unseres Teams werden?"
      ctaLabel="Kontakt aufnehmen"
      ctaHref="/kontakt"
    />
  );
}
