import type { HomePageContent } from "@/types/content";
import { CONTACT_FORM_HREF, PUBLIC_ROUTES } from "@/config/routes";

export const homeContent = {
  seo: {
    title: "Ihr PV Anbieter aus Bayern | Energie-Kraft Süd",
    description:
      "Ihr PV Anbieter aus Bayern: Photovoltaik und Batteriespeicher für Privatkunden und Unternehmen. Über 20 Jahre Erfahrung. Alles aus einer Hand.",
    canonicalPath: "/",
  },

  hero: {
    eyebrow: "Ihr PV Anbieter aus Bayern",
    title: "Energie intelligent planen und nachhaltig nutzen",
    description:
      "Photovoltaik und Batteriespeicher sind unsere Stärke. Von Ainring bei Freilassing aus planen und realisieren wir passende Lösungen für private Haushalte und Unternehmen im Berchtesgadener Land, im Landkreis Traunstein und der angrenzenden Region – persönlich beraten und aus einer Hand umgesetzt.",

    primaryCta: {
      label: "Energieprojekt konfigurieren",
      href: "/konfigurator",
    },

    secondaryCta: {
      label: "Photovoltaik entdecken",
      href: "#photovoltaik",
    },
  },
} satisfies HomePageContent;

export const homeSections = {
  intro: {
    eyebrow: "Energie-Kraft Süd",
    title: "Photovoltaik und Batteriespeicher. Alles aus einer Hand.",
    description:
      "Seit über 20 Jahren ist Energie-Kraft Süd Ihr PV Anbieter aus Bayern. Unser Schwerpunkt liegt auf Photovoltaikanlagen und Batteriespeichern, die zu Ihrem Gebäude und Ihrem Energiebedarf passen. Von der persönlichen Beratung über die Planung und Installation bis zur Inbetriebnahme und anschließenden Betreuung begleiten wir Ihr Projekt. Auf Wunsch ergänzen wir Ihr System um Wärmepumpe, Klimaanlage oder Wallbox.",
    highlights: [
      {
        title: "Über 20 Jahre Energie-Kraft Süd",
        description:
          "Seit über 20 Jahren für unsere Kunden da – mit Erfahrung in der Photovoltaik und persönlicher Beratung.",
      },
      {
        title: "Alles aus einer Hand",
        description: "Beratung, Planung, Installation und Betreuung mit klaren Ansprechpartnern.",
      },
      {
        title: "Regional für Sie da",
        description:
          "Persönlicher Kontakt in Ainring bei Freilassing – für Privatkunden und Unternehmen in der Region.",
      },
    ],
  },
  photovoltaic: {
    id: "photovoltaik",
    eyebrow: "Photovoltaik für Ihr Zuhause",
    title: "Ihr Dach. Ihr eigener Solarstrom.",
    description:
      "Wir planen und installieren Ihre Photovoltaikanlage passend zu Dachfläche, Stromverbrauch und den Möglichkeiten Ihres Gebäudes. Einen Batteriespeicher berücksichtigen wir auf Wunsch direkt bei der Planung. So entsteht eine aufeinander abgestimmte Lösung für die Erzeugung und Nutzung Ihres eigenen Solarstroms.",
    benefits: ["Individuell geplant", "Fachgerecht installiert"],
    primaryCta: { label: "PV-Projekt konfigurieren", href: "/konfigurator/photovoltaik" },
    secondaryCta: { label: "Photovoltaik kennenlernen", href: PUBLIC_ROUTES.photovoltaik.href },
  },
  battery: {
    id: "stromspeicher",
    eyebrow: "Batteriespeicher für Ihren Solarstrom",
    title: "Sonne speichern. Abends nutzen.",
    description:
      "Ein Batteriespeicher hält überschüssigen Solarstrom für die Stunden bereit, in denen Ihre Photovoltaikanlage wenig oder keinen Strom erzeugt. Wir stimmen Speicherkapazität und Steuerung auf Ihre Anlage und Ihren Verbrauch ab – bei einem neuen PV-Projekt ebenso wie bei der Prüfung einer Nachrüstung.",
    benefits: ["Passend zu PV-Anlage und Verbrauch", "Intelligentes Energiemanagement"],
    primaryCta: { label: "Speicher konfigurieren", href: "/konfigurator/stromspeicher" },
    secondaryCta: {
      label: "Batteriespeicher kennenlernen",
      href: PUBLIC_ROUTES.stromspeicher.href,
    },
  },
  commercial: {
    id: "gewerbe",
    eyebrow: "Photovoltaik für Unternehmen",
    title: "Solarenergie für Gewerbe & Unternehmen",
    brandLine: "mehr energiekraft",
    description:
      "Aus Erfahrung wissen wir als PV Anbieter in Bayern, wie wichtig eine wirtschaftliche Energieversorgung für Unternehmen ist. Wir analysieren Ihren Energiebedarf und planen ein individuelles Photovoltaik-System, das zu Ihren Betriebsabläufen und verfügbaren Flächen passt. Ziel ist, möglichst viel selbst erzeugten Solarstrom im Unternehmen zu nutzen. Bei Bedarf ergänzen wir einen passenden Batteriespeicher – für Gewerbebetriebe ebenso wie für Industrie, Landwirtschaft oder Kommunen.",
    primaryCta: { label: "Nehmen Sie jetzt mit uns Kontakt auf", href: CONTACT_FORM_HREF },
    secondaryCta: {
      label: "Photovoltaik für Unternehmen kennenlernen",
      href: PUBLIC_ROUTES["photovoltaik-fuer-unternehmen"].href,
    },
  },
  supplementary: {
    title: "Ihr Energiesystem sinnvoll ergänzen",
    description:
      "Photovoltaik und Batteriespeicher bilden den Kern. Mit einer passenden Wärmepumpe, Klimaanlage oder Wallbox erweitern wir Ihr System um Wärme, Raumkomfort und Elektromobilitätät. Wir prüfen, welche Ergänzungen für Ihr Gebäude sinnvoll sind, und stimmen die Komponenten aufeinander ab – alles aus einer Hand.",
  },
  tariff: {
    description: "Auch der ergänzende Strombezug gehört zur Planung Ihres Energiesystems.",
    link: {
      label: "Stromtarife für Photovoltaik kennenlernen",
      href: PUBLIC_ROUTES["stromtarife-pv"].href,
    },
  },
} as const;
