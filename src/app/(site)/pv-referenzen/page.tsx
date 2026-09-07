import type { Metadata } from "next";

import { MarketingFeaturePage } from "@/app/(site)/_components/marketing-feature-page";
import { buildMetadata } from "@/lib/seo/metadata";

const seo = {
  title: "Referenzen & Projektplanung | Energie-Kraft Süd",
  description:
    "Einblicke in die Planung individueller Energielösungen von Energie-Kraft Süd – von der Ausgangssituation bis zum abgestimmten Gesamtsystem.",
  canonicalPath: "/pv-referenzen",
};

export const metadata: Metadata = buildMetadata(seo);

const sections = [
  {
    eyebrow: "Individuelle Ausgangslagen",
    title: "Jedes Projekt beginnt mit anderen Voraussetzungen",
    paragraphs: [
      "Dachflächen, Verbrauch, Gebäudetechnik und zukünftige Anforderungen unterscheiden sich von Objekt zu Objekt. Deshalb sind gute Referenzprojekte keine Blaupause, sondern zeigen, wie konsequent eine Lösung auf die jeweilige Situation abgestimmt wird.",
      "Konkrete Projektangaben veröffentlichen wir nur, wenn sie freigegeben und fachlich belastbar dokumentiert sind. Unbelegte Kennzahlen oder pauschale Erfolgsversprechen finden Sie hier bewusst nicht.",
    ],
    items: [
      "Gebäude und Energiebedarf betrachten",
      "Komponenten aufeinander abstimmen",
      "Leitungswege und Umsetzung mitdenken",
      "Erweiterbarkeit früh berücksichtigen",
    ],
  },
  {
    eyebrow: "Gesamtsystem",
    title: "Von Photovoltaik bis Wärme und Mobilität",
    paragraphs: [
      "Viele Projekte entwickeln sich schrittweise. Eine Photovoltaikanlage kann später um Stromspeicher, Wallbox oder Wärmepumpe ergänzt werden. Eine vorausschauende Planung schafft dafür die technische Grundlage.",
      "Im persönlichen Gespräch zeigen wir Ihnen gern Projektsituationen, die zu Ihren Anforderungen passen und für eine konkrete Einordnung geeignet sind.",
    ],
  },
] as const;

export default function ReferencesPage() {
  return (
    <MarketingFeaturePage
      seo={seo}
      breadcrumbLabel="Referenzen"
      eyebrow="Planung mit Praxisbezug"
      title="Energielösungen, die zum Gebäude und zum Alltag passen"
      description="Gute Projekte entstehen durch eine saubere Bestandsaufnahme, verständliche Entscheidungen und ein abgestimmtes Gesamtsystem."
      desktopSrc="/images/home-premium/consultation-reference-desktop.webp"
      mobileSrc="/images/home-premium/consultation-reference-mobile.webp"
      imageAlt="Persönliche Besprechung einer Energieplanung mit Hauseigentümern"
      sections={sections}
      ctaTitle="Welche Lösung passt zu Ihrer Ausgangssituation?"
      ctaLabel="Projekt besprechen"
      ctaHref="/kontakt"
    />
  );
}
