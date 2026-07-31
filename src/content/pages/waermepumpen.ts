import type { PublicPageContent } from "@/types/content";

export const waermepumpenContent = {
  seo: {
    title: "Wärmepumpen | Energie-Kraft Süd",
    description:
      "Wärmepumpen für effizientes Heizen und nachhaltige Energieversorgung: individuelle Planung und Umsetzung durch Energie-Kraft Süd.",
    canonicalPath: "/waermepumpen",
  },

  faqRouteKey: "waermepumpen",

  hero: {
    eyebrow: "Wärmepumpen",
    title: "Effizient heizen mit moderner Wärmepumpentechnik",
    description:
      "Wir betrachten Gebäude, Wärmebedarf und bestehende Energieversorgung gemeinsam und entwickeln eine passende Wärmepumpenlösung.",
    primaryCta: {
      label: "Beratung anfragen",
      href: "/kontakt",
    },
    secondaryCta: {
      label: "Mehr erfahren",
      href: "#waermepumpen",
    },
  },

  sections: [
    {
      id: "waermepumpen",
      eyebrow: "Nachhaltig heizen",
      title: "Wärmepumpe als Teil des Energiesystems",
      text: [
        "Wärmepumpen können Gebäude effizient mit Wärme versorgen und lassen sich besonders sinnvoll mit Photovoltaik und intelligentem Energiemanagement kombinieren.",
        "Ob eine Wärmepumpe wirtschaftlich und technisch geeignet ist, hängt unter anderem von Gebäude, Heizsystem und Wärmebedarf ab. Deshalb steht am Anfang eine individuelle Betrachtung.",
      ],
    },
  ],
} satisfies PublicPageContent;