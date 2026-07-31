import type { PublicPageContent } from "@/types/content";

export const klimaanlagenContent = {
  seo: {
    title: "Klimaanlagen | Energie-Kraft Süd",
    description:
      "Effiziente Klimaanlagen für Wohngebäude und Unternehmen: Beratung, Planung und fachgerechte Umsetzung durch Energie-Kraft Süd.",
    canonicalPath: "/klimaanlagen",
  },

  faqRouteKey: "klimaanlagen",

  hero: {
    eyebrow: "Klimaanlagen",
    title: "Angenehmes Raumklima effizient geplant",
    description:
      "Moderne Klimasysteme sorgen zuverlässig für angenehme Temperaturen und lassen sich effizient an Gebäude und Nutzung anpassen.",
    primaryCta: {
      label: "Beratung anfragen",
      href: "/kontakt",
    },
    secondaryCta: {
      label: "Mehr erfahren",
      href: "#klimaanlagen",
    },
  },

  sections: [
    {
      id: "klimaanlagen",
      eyebrow: "Komfort und Effizienz",
      title: "Klimatisierung passend zum Gebäude",
      text: [
        "Eine gute Klimaanlage muss zur Raumgröße, Nutzung und baulichen Situation passen. Eine sorgfältige Planung ist entscheidend für Komfort, Energieeffizienz und einen zuverlässigen Betrieb.",
        "Wir unterstützen bei Auswahl, Dimensionierung und Umsetzung einer passenden Lösung für private und gewerbliche Gebäude.",
      ],
    },
  ],
} satisfies PublicPageContent;