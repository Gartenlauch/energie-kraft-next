import type { PublicPageContent } from "@/types/content";

export const photovoltaikContent = {
  seo: {
    title: "Photovoltaik | Energie-Kraft Süd",
    description:
      "Photovoltaikanlagen von Energie-Kraft Süd: individuelle Beratung, Planung und Umsetzung für eine nachhaltige eigene Stromversorgung.",
    canonicalPath: "/photovoltaik",
  },

  faqRouteKey: "photovoltaik",

  hero: {
    eyebrow: "Photovoltaik",
    title: "Eigene Sonnenenergie intelligent nutzen",
    description:
      "Wir planen Photovoltaikanlagen passend zu Gebäude, Stromverbrauch und persönlichen Anforderungen.",
    primaryCta: {
      label: "Beratung anfragen",
      href: "/kontakt",
    },
    secondaryCta: {
      label: "Mehr erfahren",
      href: "#photovoltaik",
    },
  },

  sections: [
    {
      id: "photovoltaik",
      eyebrow: "Energie vom eigenen Dach",
      title: "Photovoltaik individuell geplant",
      text: [
        "Eine leistungsfähige Photovoltaikanlage beginnt mit einer sorgfältigen Planung. Dachfläche, Ausrichtung, Verschattung und der tatsächliche Stromverbrauch bestimmen, welche Lösung wirtschaftlich und technisch sinnvoll ist.",
        "Energie-Kraft Süd begleitet Sie von der ersten Beratung über die Planung bis zur fachgerechten Umsetzung Ihrer Anlage.",
      ],
    },
  ],
} satisfies PublicPageContent;