import type { HomePageContent } from "@/types/content";

export const homeContent = {
  seo: {
    title: "Energie-Kraft Süd",
    description:
      "Individuelle Energielösungen für Wohngebäude und Unternehmen.",
    canonicalPath: "/",
  },

  hero: {
    eyebrow: "Energie-Kraft Süd",
    title: "Energie intelligent planen und nachhaltig nutzen",
    description:
      "Individuelle Beratung, fachgerechte Planung und zuverlässige Umsetzung aus einer Hand.",

    primaryCta: {
      label: "Beratung anfragen",
      href: "/kontakt",
    },

    secondaryCta: {
      label: "Leistungen entdecken",
      href: "#leistungen",
    },
  },
} satisfies HomePageContent;