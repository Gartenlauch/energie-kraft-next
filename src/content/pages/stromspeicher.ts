import type { PublicPageContent } from "@/types/content";

export const stromspeicherContent = {
  seo: {
    title: "Stromspeicher | Energie-Kraft Süd",
    description:
      "Stromspeicher für Photovoltaikanlagen: Eigenverbrauch erhöhen und Solarstrom auch dann nutzen, wenn die Sonne nicht scheint.",
    canonicalPath: "/stromspeicher",
  },

  faqRouteKey: "stromspeicher",

  hero: {
    eyebrow: "Stromspeicher",
    title: "Solarstrom speichern und flexibel nutzen",
    description:
      "Mit einem passend dimensionierten Stromspeicher nutzen Sie einen größeren Anteil Ihrer selbst erzeugten Energie im eigenen Gebäude.",
    primaryCta: {
      label: "Beratung anfragen",
      href: "/kontakt",
    },
    secondaryCta: {
      label: "Mehr erfahren",
      href: "#stromspeicher",
    },
  },

  sections: [
    {
      id: "stromspeicher",
      eyebrow: "Mehr Eigenverbrauch",
      title: "Speicher passend zur Photovoltaikanlage",
      text: [
        "Ein Stromspeicher verschiebt selbst erzeugte Energie in die Zeiten, in denen sie tatsächlich benötigt wird. Dadurch kann der Eigenverbrauch einer Photovoltaikanlage deutlich erhöht werden.",
        "Entscheidend sind eine sinnvolle Dimensionierung sowie die Abstimmung von Photovoltaikanlage, Speicher und individuellem Verbrauchsprofil.",
      ],
    },
  ],
} satisfies PublicPageContent;