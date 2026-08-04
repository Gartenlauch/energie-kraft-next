import type { PublicPageContent } from "@/types/content";

export const photovoltaikContent = {
  seo: {
    title: "Photovoltaik kaufen: Planung & Montage | Energie-Kraft Süd",
    description:
      "Photovoltaikanlage kaufen: Energie-Kraft Süd plant und realisiert individuelle PV-Anlagen mit Speicher, Monitoring und fachgerechter Montage.",
    canonicalPath: "/photovoltaik",
  },

  faqRouteKey: "photovoltaik",

  hero: {
    eyebrow: "Photovoltaik für Ihr Zuhause",
    title: "Photovoltaik kaufen und eigenen Solarstrom erzeugen",
    description:
      "Wir planen Ihre Photovoltaikanlage passend zu Dach, Stromverbrauch und zukünftiger Energienutzung – von der ersten Analyse bis zur fachgerechten Umsetzung.",
    primaryCta: {
      label: "PV-Beratung anfragen",
      href: "/kontakt",
    },
    secondaryCta: {
      label: "Unsere Leistungen",
      href: "#pv-komplettloesung",
    },
  },

  sections: [
    {
      id: "pv-komplettloesung",
      eyebrow: "Individuell statt von der Stange",
      title: "Ihre Photovoltaikanlage als abgestimmte Komplettlösung",
      text: [
        "Eine wirtschaftliche Photovoltaikanlage entsteht nicht allein durch möglichst viele Module. Entscheidend ist, dass Leistung, Dachfläche, Wechselrichter, Stromverbrauch und mögliche Erweiterungen sinnvoll aufeinander abgestimmt sind.",
        "Energie-Kraft Süd entwickelt ein individuelles Anlagenkonzept für Ihr Gebäude. Dabei berücksichtigen wir nicht nur den heutigen Stromverbrauch, sondern auch zukünftige Verbraucher wie Stromspeicher, Wallbox oder Wärmepumpe.",
      ],
      items: [
        "Analyse von Dachfläche, Ausrichtung und möglichen Verschattungen",
        "Auslegung passend zu Stromverbrauch und Nutzungsverhalten",
        "Abstimmung von Modulen, Wechselrichter und Montagesystem",
        "Vorbereitung für Stromspeicher, Wallbox und Wärmepumpe",
        "Fachgerechte Montage und elektrische Inbetriebnahme",
        "Monitoring und langfristige Überwachung der Anlage",
      ],
    },
    {
      id: "eigenverbrauch",
      eyebrow: "Mehr Energie selbst nutzen",
      title: "Eigenverbrauch erhöhen und Stromkosten langfristig senken",
      text: [
        "Mit einer eigenen PV-Anlage erzeugen Sie einen Teil Ihres Stroms direkt auf dem eigenen Dach. Je besser Erzeugung und Verbrauch zusammenpassen, desto mehr Solarstrom können Sie selbst nutzen.",
        "Ein intelligentes Energiesystem kann überschüssige Energie speichern oder gezielt für weitere Verbraucher einsetzen. Dadurch reduziert sich der Strombezug aus dem öffentlichen Netz und Ihre Energieversorgung wird unabhängiger von zukünftigen Preisentwicklungen.",
      ],
      cta: {
        label: "Stromspeicher entdecken",
        href: "/stromspeicher",
      },
    },
    {
      id: "pv-rechner",
      eyebrow: "Unverbindliche Modellrechnungen",
      title: "PV-Anlagengröße, Kosten und Wirtschaftlichkeit vorab berechnen",
      text: [
        "Unsere beiden PV-Rechner bieten eine erste Orientierung für die mögliche Anlagengröße, den erwarteten Solarertrag, die Projektkosten sowie die langfristige Wirtschaftlichkeit.",
        "Die Ergebnisse basieren auf veränderbaren Modellannahmen. Für eine belastbare Planung müssen Dach, Standort, Verbrauchsprofil, Komponenten und projektspezifische Kosten anschließend individuell geprüft werden.",
      ],
      links: [
        {
          eyebrow: "Dimensionierung und Kosten",
          label: "PV-Größe und Kosten schätzen",
          description:
            "Dachfläche, Modulanzahl, Anlagenleistung, Speicherorientierung und Kostenkorridor berechnen.",
          href: "/rechner/photovoltaik-kosten",
        },
        {
          eyebrow: "Wirtschaftlichkeit",
          label: "PV-Rendite und Amortisation berechnen",
          description:
            "Ertrag, Eigenverbrauch, Einspeisung, Stromkostenersparnis, Rendite und Amortisation projizieren.",
          href: "/rechner/photovoltaik",
        },
      ],
    },
    {
      id: "komponenten",
      eyebrow: "Technik, die zusammenpasst",
      title: "Module, Wechselrichter und Montagesystem als Gesamtsystem",
      text: [
        "Die langfristige Leistung einer Photovoltaikanlage hängt vom Zusammenspiel aller Komponenten ab. Deshalb betrachten wir Module, Wechselrichter, Unterkonstruktion, Verkabelung und Anlagensteuerung nicht isoliert.",
        "Bei der Auswahl achten wir auf Leistungsfähigkeit, Zuverlässigkeit, technische Kompatibilität und eine Konstruktion, die zur jeweiligen Dach- und Gebäudesituation passt.",
      ],
      items: [
        "Leistungsfähige Photovoltaikmodule",
        "Passend dimensionierte Wechselrichter",
        "Montagesysteme für unterschiedliche Dachformen",
        "Sichere elektrische Komponenten und Verkabelung",
        "Anlagenüberwachung und Ertragskontrolle",
        "Erweiterbare Energie- und Speicherkonzepte",
      ],
    },
    {
      id: "monitoring",
      eyebrow: "Erträge im Blick",
      title: "PV-Monitoring für zuverlässigen Anlagenbetrieb",
      text: [
        "Eine Photovoltaikanlage soll über viele Jahre zuverlässig Strom erzeugen. Mit einem geeigneten Monitoring lassen sich Ertragsdaten, Anlagenzustand und mögliche Störungen frühzeitig erkennen.",
        "So kann schneller reagiert werden, wenn die tatsächliche Leistung von den erwarteten Werten abweicht. Gleichzeitig erhalten Sie einen transparenten Überblick über Erzeugung und Eigenverbrauch.",
      ],
    },
    {
      id: "planung-und-montage",
      eyebrow: "Von der Beratung bis zur Inbetriebnahme",
      title: "Photovoltaikplanung und Montage aus einer Hand",
      text: [
        "Wir begleiten Ihr Projekt von der technischen Aufnahme über die konkrete Anlagenplanung bis zur Installation und Inbetriebnahme. Klare Abläufe und abgestimmte Komponenten sorgen dafür, dass aus einzelnen Bauteilen ein funktionierendes Energiesystem wird.",
        "Auch nach der Inbetriebnahme bleiben Wartung, Überwachung und mögliche Erweiterungen wichtige Bestandteile einer langfristig leistungsfähigen Anlage.",
      ],
      cta: {
        label: "Photovoltaikprojekt besprechen",
        href: "/kontakt",
      },
    },
  ],
} satisfies PublicPageContent;
