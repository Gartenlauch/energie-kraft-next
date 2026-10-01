import { CONTACT_FORM_HREF } from "@/config/routes";
import type { PublicPageContent } from "@/types/content";

export const photovoltaikContent = {
  seo: {
    title: "Photovoltaik kaufen: Planung & Montage | Energie-Kraft Süd",
    description:
      "Photovoltaik kaufen in Bayern: PV-Anlagen mit Speicher, Beratung, Planung und Montage aus einer Hand. Energie-Kraft Süd aus Ainring.",
    canonicalPath: "/photovoltaik",
  },

  faqRouteKey: "photovoltaik",

  hero: {
    eyebrow: "Photovoltaik für Ihr Zuhause",
    title: "Photovoltaik kaufen und eigenen Solarstrom erzeugen",
    description:
      "Als PV-Anbieter aus Bayern planen und realisieren wir Ihre Photovoltaikanlage passend zu Dach, Stromverbrauch und zukünftiger Energienutzung. Von Ainring bei Freilassing aus begleiten wir Ihr Projekt im Berchtesgadener Land, im Landkreis Traunstein und der angrenzenden Region – mit Batteriespeicher auf Wunsch und alles aus einer Hand.",
    primaryCta: {
      label: "PV-Beratung anfragen",
      href: CONTACT_FORM_HREF,
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
        "Eine wirtschaftliche Photovoltaikanlage entsteht nicht allein durch möglichst viele Module. Entscheidend ist, dass Anlagenleistung, Dachfläche, Wechselrichter, Stromverbrauch und mögliche Erweiterungen sinnvoll aufeinander abgestimmt sind.",
        "Energie-Kraft Süd entwickelt ein individuelles Anlagenkonzept für Ihr Gebäude. Dabei berücksichtigen wir Ihren heutigen Stromverbrauch ebenso wie einen möglichen Batteriespeicher und zusätzliche Verbraucher wie Wallbox oder Wärmepumpe.",
      ],
      items: [
        "Dachfläche, Ausrichtung und mögliche Verschattungen analysieren",
        "Anlagenleistung auf Stromverbrauch und Nutzungsverhalten abstimmen",
        "Module, Wechselrichter und Montagesystem gemeinsam planen",
        "Batteriespeicher und weitere Verbraucher berücksichtigen",
        "Montage und elektrische Inbetriebnahme fachgerecht umsetzen",
        "Monitoring und spätere Betreuung mitplanen",
      ],
      presentation: {
        surface: "soft",
        layout: "editorial",
      },
    },
    {
      id: "eigenverbrauch",
      eyebrow: "Mehr Solarstrom selbst nutzen",
      title: "Eigenverbrauch erhöhen – mit passendem Batteriespeicher",
      text: [
        "Mit einer eigenen PV-Anlage erzeugen Sie einen Teil Ihres Stroms direkt auf dem eigenen Dach. Je besser Erzeugung und Verbrauch zusammenpassen, desto mehr Solarstrom können Sie unmittelbar selbst nutzen.",
        "Ein Batteriespeicher kann überschüssigen Solarstrom für Zeiten bereitstellen, in denen die Photovoltaikanlage wenig oder keinen Strom erzeugt. Wir stimmen Speicherkapazität, Wechselrichter und Energiemanagement auf Ihre Anlage und Ihren Verbrauch ab.",
        "Ob und in welcher Größe ein Speicher sinnvoll ist, prüfen wir anhand Ihres Nutzungsverhaltens. Auch eine Wallbox oder Wärmepumpe kann in die gemeinsame Planung einbezogen werden.",
      ],
      cta: {
        label: "Stromspeicher entdecken",
        href: "/stromspeicher",
      },
      presentation: {
        surface: "white",
        layout: "image-left",
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
      presentation: {
        surface: "blue",
        layout: "editorial",
      },
    },
    {
      id: "komponenten",
      eyebrow: "Technik, die zusammenpasst",
      title: "Module, Wechselrichter und Anlagensteuerung gemeinsam planen",
      text: [
        "Die langfristige Leistung einer Photovoltaikanlage hängt vom Zusammenspiel ihrer Komponenten ab. Deshalb betrachten wir Module, Wechselrichter, Unterkonstruktion, Verkabelung und Anlagensteuerung nicht isoliert.",
        "Die Module erzeugen Gleichstrom; der Wechselrichter wandelt ihn in nutzbaren Wechselstrom um. Die Anlagenleistung wird in Kilowattpeak (kWp) angegeben, die erzeugte elektrische Energie in Kilowattstunden (kWh). Der Ertrag hängt unter anderem von Standort, Ausrichtung, Verschattung und Jahreszeit ab.",
      ],
      items: [
        "PV-Module passend zu Dachfläche und Anlagenkonzept",
        "Wechselrichter passend zur elektrischen Auslegung",
        "Montagesystem und Befestigung passend zum Dach",
        "Abgestimmte Verkabelung und elektrische Komponenten",
        "Anlagensteuerung und Ertragskontrolle",
        "Schnittstellen für Speicher und mögliche Erweiterungen",
      ],
      presentation: {
        surface: "white",
        layout: "editorial",
      },
    },
    {
      id: "montagesysteme",
      eyebrow: "Montage auf dem Dach",
      title: "Montagesystem und Schneefang passend zum Gebäude planen",
      text: [
        "Das Montagesystem verbindet die Photovoltaikmodule mit dem Dach. Bei der Planung berücksichtigen wir Dachform und Dachaufbau, die Befestigungspunkte sowie die Anforderungen an Unterkonstruktion und Leitungsführung.",
        "Auch die Schneefangplanung gehört zur Betrachtung des Dachs. Wie Montagesystem, Modulbelegung und Schneefang zusammenpassen, wird für das jeweilige Gebäude geprüft – nicht pauschal für jede Dachfläche gleich gelöst.",
      ],
      items: [
        "Dachform und Dachaufbau berücksichtigen",
        "Befestigung und Unterkonstruktion abstimmen",
        "Wind- und Schneelasten in der Planung berücksichtigen",
        "Modulbelegung und Schneefang gemeinsam betrachten",
        "Leitungsführung und Montagezugänglichkeit mitplanen",
      ],
      presentation: {
        surface: "soft",
        layout: "image-right",
      },
    },
    {
      id: "monitoring",
      eyebrow: "Erträge im Blick",
      title: "PV-Monitoring für zuverlässigen Anlagenbetrieb",
      text: [
        "Mit einem geeigneten Monitoring lassen sich Ertragsdaten, Anlagenzustand und mögliche Störungen im Blick behalten. Auffällige Abweichungen können so früher erkannt und gezielt geprüft werden.",
        "Welche Informationen zu Erzeugung, Verbrauch und Speicher verfügbar sind, hängt vom eingesetzten System und der Messausstattung ab. Den Umfang von Überwachung, Wartung und technischer Betreuung stimmen wir passend zu Ihrer Anlage ab.",
      ],
      links: [
        {
          label: "Service & Wartung kennenlernen",
          href: "/service-und-wartung",
        },
      ],
      presentation: {
        surface: "white",
        layout: "editorial",
      },
    },
    {
      id: "finanzierung-und-foerderung",
      eyebrow: "Projektkosten und Rahmenbedingungen",
      title: "Investition, Finanzierung und Fördermöglichkeiten einordnen",
      text: [
        "Die Kosten einer Photovoltaikanlage hängen nicht nur von der Modulanzahl ab. Dach- und Montagesituation, elektrische Einbindung, gewählte Komponenten und ein möglicher Batteriespeicher beeinflussen den Projektumfang.",
        "Finanzierungsangebote, Fördermöglichkeiten und weitere Rahmenbedingungen können sich ändern. Welche Möglichkeiten für Ihr Vorhaben infrage kommen, muss zum jeweiligen Projektzeitpunkt geprüft werden.",
        "Auch der verbleibende Strombezug gehört zur Planung Ihres Energiesystems.",
      ],
      links: [
        {
          label: "Finanzierung & Förderung",
          href: "/service-und-wartung/finanzierung-und-foerderung",
        },
        {
          label: "Stromtarife für Photovoltaik kennenlernen",
          href: "/stromtarife-pv",
        },
      ],
      presentation: {
        surface: "soft",
        layout: "editorial",
      },
    },
    {
      id: "regionale-referenzen",
      eyebrow: "Ihr PV-Anbieter aus Bayern",
      title: "Photovoltaik aus Ainring – mit Referenzen aus der Region",
      text: [
        "Energie-Kraft Süd besteht seit über 20 Jahren. Von Ainring bei Freilassing aus begleiten wir Photovoltaikprojekte im Berchtesgadener Land, im Landkreis Traunstein und der angrenzenden Region.",
        "Unsere Referenzen zeigen private und gewerbliche Anlagen an unterschiedlichen Gebäuden und Standorten. Sie geben einen Einblick in bereits realisierte Projekte und die örtlichen Gegebenheiten.",
      ],
      links: [
        {
          label: "Alle PV-Referenzen",
          description: "Projektübersicht mit privaten und gewerblichen Anlagen.",
          href: "/referenzen",
        },
        {
          label: "Referenzen in Ainring",
          description: "Lokale Projekte rund um unseren Unternehmensstandort.",
          href: "/referenzen/ainring",
        },
      ],
      presentation: {
        surface: "blue",
        layout: "image-left",
      },
    },
    {
      id: "planung-und-montage",
      eyebrow: "Von der Beratung bis zur Inbetriebnahme",
      title: "Photovoltaikplanung und Montage aus einer Hand",
      text: [
        "Wir begleiten Ihr Projekt von der technischen Aufnahme über die konkrete Anlagenplanung bis zur Installation und Inbetriebnahme. Klare Abläufe und abgestimmte Komponenten verbinden die einzelnen Arbeitsschritte zu einer durchdachten Umsetzung.",
        "Zur Montageplanung gehören auch sichere Zugänge zum Dach, geeignete Arbeitsbereiche und die Abstimmung der beteiligten Gewerke. Die elektrische Einbindung und Inbetriebnahme werden fachgerecht durchgeführt.",
        "Auch nach der Inbetriebnahme bleiben Wartung, Überwachung und mögliche Erweiterungen wichtige Themen. Den dafür passenden Serviceumfang besprechen wir mit Ihnen.",
      ],
      cta: {
        label: "Photovoltaikprojekt besprechen",
        href: CONTACT_FORM_HREF,
      },
      presentation: {
        surface: "white",
        layout: "statement",
      },
    },
  ],
} satisfies PublicPageContent;
