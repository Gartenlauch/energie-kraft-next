import type { PublicPageContent } from "@/types/content";

export const waermepumpenContent = {
  seo: {
    title: "Wärmepumpe mit Photovoltaik | Energie-Kraft Süd",
    description:
      "Wärmepumpe planen und mit Photovoltaik kombinieren: abgestimmte Lösung für effizientes Heizen, Eigenverbrauch und Energiemanagement.",
    canonicalPath: "/waermepumpen",
  },

  faqRouteKey: "waermepumpen",

  hero: {
    eyebrow: "Wärmepumpen und Photovoltaik",
    title: "Effizient heizen und eigenen Solarstrom intelligent nutzen",
    description:
      "Wir entwickeln eine Wärmepumpenlösung passend zu Gebäude, Wärmebedarf und bestehender Energieversorgung – auf Wunsch abgestimmt mit Photovoltaik und Stromspeicher.",
    primaryCta: {
      label: "Wärmepumpen-Beratung anfragen",
      href: "/kontakt",
    },
    secondaryCta: {
      label: "Planung kennenlernen",
      href: "#waermepumpen-planung",
    },
  },

  sections: [
    {
      id: "waermepumpen-planung",
      eyebrow: "Das Gebäude entscheidet",
      title: "Wärmepumpe individuell auf den Wärmebedarf abstimmen",
      text: [
        "Eine Wärmepumpe muss zum Gebäude, zum vorhandenen Heizsystem und zum tatsächlichen Wärmebedarf passen. Eine pauschale Lösung ohne technische Betrachtung kann zu unnötig hohem Stromverbrauch oder eingeschränktem Komfort führen.",
        "Deshalb betrachten wir Gebäudesituation, Wärmeverteilung, gewünschte Temperaturen und vorhandene Energiekomponenten gemeinsam.",
      ],
      items: [
        "Bewertung der baulichen und technischen Ausgangssituation",
        "Betrachtung von Wärmebedarf und Heizflächen",
        "Abstimmung auf bestehendes oder geplantes Heizsystem",
        "Berücksichtigung der elektrischen Anschlussleistung",
        "Integration von Photovoltaik und Stromspeicher",
        "Planung von Steuerung und Energiemanagement",
      ],
    },
    {
      id: "waermepumpen-rechner",
      eyebrow: "Unverbindliche Modellrechnung",
      title:
        "Wärmepumpenleistung, Stromverbrauch und Kosten vorab einordnen",
      text: [
        "Mit unserem Wärmepumpen-Rechner erhalten Sie anhand von beheizter Fläche, Wärmebedarf, Vorlauftemperatur und Jahresarbeitszahl eine erste Orientierung für die erforderliche Leistung und den möglichen Stromverbrauch.",
        "Zusätzlich vergleicht das Modell die jährlichen Energiekosten mit dem bestehenden Heizsystem und berechnet einen veränderbaren Investitionskostenkorridor. Eine Heizlastberechnung und technische Vor-Ort-Prüfung bleiben dennoch erforderlich.",
      ],
      cta: {
        label: "Wärmepumpen-Rechner öffnen",
        href: "/rechner/waermepumpe-kosten",
      },
    },
    {
      id: "photovoltaik-kombination",
      eyebrow: "Strom und Wärme verbinden",
      title: "Wärmepumpe mit Photovoltaik kombinieren",
      text: [
        "Eine Wärmepumpe benötigt elektrische Energie, während eine Photovoltaikanlage tagsüber eigenen Strom erzeugt. Werden beide Systeme intelligent miteinander verbunden, kann ein Teil des benötigten Stroms direkt vom eigenen Dach stammen.",
        "Da Wärmebedarf und Solarstromproduktion zeitlich nicht immer übereinstimmen, sind eine passende Anlagenplanung und eine intelligente Steuerung entscheidend.",
      ],
      cta: {
        label: "Photovoltaik entdecken",
        href: "/photovoltaik",
      },
    },
    {
      id: "energiemanagement",
      eyebrow: "Verbrauch intelligent steuern",
      title: "Energiemanagement für Wärmepumpe, PV und Speicher",
      text: [
        "Ein Energiemanagement kann verfügbare Solarenergie erkennen und den Betrieb der Wärmepumpe innerhalb sinnvoller Grenzen darauf abstimmen. Dadurch lässt sich der Eigenverbrauch der Photovoltaikanlage erhöhen.",
        "Auch ein Stromspeicher kann Teil des Gesamtsystems sein. Ob und wie stark er den Betrieb unterstützt, hängt von Speicherleistung, Verbrauchsprofil und technischer Konfiguration ab.",
      ],
      items: [
        "Abstimmung von Wärmepumpe und PV-Erzeugung",
        "Nutzung steuerbarer Betriebszeiten",
        "Einbindung eines Stromspeichers",
        "Transparenz über Erzeugung und Verbrauch",
        "Priorisierung verschiedener Energieverbraucher",
        "Vorbereitung auf zukünftige Erweiterungen",
      ],
      cta: {
        label: "Stromspeicher kennenlernen",
        href: "/stromspeicher",
      },
    },
    {
      id: "effizienz",
      eyebrow: "Gesamtsystem statt Einzelprodukt",
      title: "Effizienter Betrieb beginnt mit der richtigen Auslegung",
      text: [
        "Die Effizienz einer Wärmepumpe hängt nicht allein vom Gerät ab. Auch Vorlauftemperaturen, Heizflächen, Gebäudedämmung, Regelung und Nutzerverhalten beeinflussen den späteren Betrieb.",
        "Unser Ansatz betrachtet deshalb nicht nur einzelne Komponenten, sondern das Zusammenspiel von Wärmeversorgung, Stromerzeugung und Energieverbrauch.",
      ],
    },
    {
      id: "umsetzung",
      eyebrow: "Schritt für Schritt zur Lösung",
      title: "Von der Bestandsaufnahme bis zum abgestimmten Energiesystem",
      text: [
        "Am Anfang stehen die Erfassung der vorhandenen Technik und die Klärung Ihrer Anforderungen. Darauf folgt eine technische Planung, die Wärmepumpe, elektrische Versorgung und mögliche weitere Energiekomponenten berücksichtigt.",
        "So entsteht eine Lösung, die nicht nur installiert wird, sondern langfristig zum Gebäude und zur geplanten Energienutzung passt.",
      ],
      cta: {
        label: "Wärmepumpenprojekt besprechen",
        href: "/kontakt",
      },
    },
  ],
} satisfies PublicPageContent;
