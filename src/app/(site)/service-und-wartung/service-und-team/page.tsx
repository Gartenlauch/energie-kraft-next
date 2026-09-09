import type { Metadata } from "next";

import { MarketingFeaturePage } from "@/app/(site)/_components/marketing-feature-page";
import { TeamOverview } from "@/components/company/team-overview";
import { CONTACT_FORM_HREF } from "@/config/routes";
import { buildMetadata } from "@/lib/seo/metadata";

const seo = {
  title: "Service & Team für Energieanlagen | Energie-Kraft Süd",
  description:
    "Ansprechpartner, Serviceorganisation und technische Betreuung von Energie-Kraft Süd: Unterstützung für Photovoltaik und vernetzte Energiesysteme.",
  canonicalPath: "/service-und-wartung/service-und-team",
};

export const metadata: Metadata = buildMetadata(seo);

const sections = [
  {
    eyebrow: "Serviceorganisation",
    title: "Ihr Anliegen kommt in den passenden Fachbereich",
    paragraphs: [
      "Technische Fragen, Wartungsbedarf und organisatorische Anliegen benötigen unterschiedliche Kompetenzen. Unser Team ordnet Anfragen strukturiert ein und stimmt die nächsten Schritte mit den zuständigen Bereichen ab.",
    ],
    items: [
      "Technische Betreuung bestehender Anlagen",
      "Koordination von Prüfung und Wartung",
      "Unterstützung bei erkennbaren Störungen",
      "Abstimmung mit Verwaltung und Vertrieb",
    ],
  },
  {
    eyebrow: "Nach der Installation",
    title: "Betreuung endet nicht mit der Inbetriebnahme",
    paragraphs: [
      "Energieanlagen verändern sich mit Nutzung, Gebäude und technischen Komponenten. Bei konkreten Fragen prüfen wir zunächst die Ausgangslage und klären, welche Unterstützung fachlich sinnvoll ist.",
      "Umfang und Termin einer Leistung werden individuell abgestimmt. Pauschale Reaktionszeiten oder Ergebnisse versprechen wir deshalb nicht auf der Website.",
    ],
  },
] as const;

export default function ServiceTeamPage() {
  return (
    <MarketingFeaturePage
      seo={seo}
      breadcrumbLabel="Service & Team"
      breadcrumbItems={[{ label: "Service & Wartung", href: "/service-und-wartung" }]}
      eyebrow="Ansprechpartner & technische Betreuung"
      title="Ein Team für den verlässlichen Betrieb Ihrer Energieanlage"
      description="Service, Montage, Vertrieb und Verwaltung arbeiten zusammen, damit technische und organisatorische Anliegen gezielt betreut werden."
      desktopSrc="/images/team/company-service-hero-desktop.webp"
      mobileSrc="/images/team/company-service-hero-mobile.webp"
      imageAlt="Mitarbeiter von Energie-Kraft Süd auf einem Dach vor dem Alpenpanorama"
      desktopWidth={1800}
      desktopHeight={1039}
      sections={sections}
      afterHero={<TeamOverview mode="service" />}
      ctaTitle="Sie benötigen Unterstützung für Ihre Anlage?"
      ctaLabel="Serviceanfrage stellen"
      ctaHref={CONTACT_FORM_HREF}
    />
  );
}
