import type { PublicPageContent } from "@/types/content";

export const kontaktContent = {
  seo: {
    title: "Kontakt | Energie-Kraft Süd",
    description:
      "Kontaktieren Sie Energie-Kraft Süd für Beratung zu Photovoltaik, Stromspeichern, Wallboxen, Klimaanlagen und Wärmepumpen.",
    canonicalPath: "/kontakt",
  },

  faqRouteKey: "kontakt",

  hero: {
    eyebrow: "Kontakt",
    title: "Gemeinsam die passende Energielösung finden",
    description:
      "Sprechen Sie mit uns über Ihr Vorhaben. Wir beraten Sie individuell und entwickeln gemeinsam die passende Lösung.",
    primaryCta: {
      label: "Kontakt aufnehmen",
      href: "#kontakt",
    },
  },

  sections: [
    {
      id: "kontakt",
      eyebrow: "Persönliche Beratung",
      title: "Wir beraten Sie zu Ihrem Projekt",
      text: [
        "Ob Photovoltaikanlage, Stromspeicher, Wallbox, Klimaanlage oder Wärmepumpe: Am Anfang steht die Frage, welche Lösung zu Ihrem Gebäude und Ihren Anforderungen passt.",
        "Die eigentliche Kontaktformular- und Lead-Funktion wird in einem späteren Umsetzungsschritt ergänzt.",
      ],
    },
  ],
} satisfies PublicPageContent;