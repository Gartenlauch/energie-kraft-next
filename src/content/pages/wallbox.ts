import type { PublicPageContent } from "@/types/content";

export const wallboxContent = {
  seo: {
    title: "Wallbox & E-Mobilität | Energie-Kraft Süd",
    description:
      "Wallbox für Zuhause oder Unternehmen: Elektromobilität sinnvoll mit Photovoltaik und eigener Stromerzeugung verbinden.",
    canonicalPath: "/wallbox",
  },

  faqRouteKey: "wallbox",

  hero: {
    eyebrow: "Wallbox",
    title: "Elektrofahrzeuge mit eigener Energie laden",
    description:
      "Wir integrieren die passende Wallbox sinnvoll in Ihre bestehende oder geplante Energieanlage.",
    primaryCta: {
      label: "Beratung anfragen",
      href: "/kontakt",
    },
    secondaryCta: {
      label: "Mehr erfahren",
      href: "#wallbox",
    },
  },

  sections: [
    {
      id: "wallbox",
      eyebrow: "E-Mobilität",
      title: "Ladelösung passend zu Ihrem Energiesystem",
      text: [
        "Eine Wallbox ermöglicht komfortables und sicheres Laden direkt am eigenen Gebäude. Besonders interessant wird die Elektromobilität in Verbindung mit einer Photovoltaikanlage.",
        "Wir berücksichtigen Hausanschluss, Ladeleistung, vorhandene Energieanlage und zukünftige Anforderungen bei der Planung.",
      ],
    },
  ],
} satisfies PublicPageContent;