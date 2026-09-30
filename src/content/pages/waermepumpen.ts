import { CONTACT_FORM_HREF } from "@/config/routes";
import type { PublicPageContent } from "@/types/content";

export const waermepumpenContent = {
  seo: {
    title: "Wärmepumpe mit Photovoltaik | Energie-Kraft Süd",
    description:
      "Bosch Luft-Wasser-Wärmepumpen: Beratung, Verkauf und Installation. Mit Photovoltaik und Speicher als abgestimmtes Energiesystem aus Ainring planen.",
    canonicalPath: "/waermepumpen",
  },
  faqRouteKey: "waermepumpen",
  hero: {
    eyebrow: "Luft-Wasser-Wärmepumpen für Ihr Zuhause",
    title: "Effizient heizen und eigenen Solarstrom intelligent nutzen",
    description:
      "Wir bieten Luft-Wasser-Wärmepumpen passend zu Gebäude, Wärmebedarf und bestehender Energieversorgung. Von der Beratung und Auswahl bis zur fachgerechten Installation begleiten wir Ihr Projekt – auf Wunsch gemeinsam mit Photovoltaik, Batteriespeicher und abgestimmtem Energiemanagement.",
    primaryCta: {
      label: "Projekt konfigurieren",
      href: "/konfigurator/waermepumpe",
    },
    secondaryCta: {
      label: "Wärmepumpen-Beratung anfragen",
      href: CONTACT_FORM_HREF,
    },
  },
  sections: [
    {
      id: "waermepumpen-planung",
      eyebrow: "Das Gebäude entscheidet",
      title: "Wärmepumpe individuell auf den Wärmebedarf abstimmen",
      text: [
        "Eine Wärmepumpe muss zum Gebäude, zum vorhandenen Heizsystem und zum tatsächlichen Wärmebedarf passen. Deshalb betrachten wir Gebäudesituation, Wärmeverteilung, gewünschte Temperaturen und vorhandene Energiekomponenten gemeinsam.",
        "Ob Neubau oder Modernisierung: Die Auswahl der Wärmepumpe erfolgt anhand der technischen Anforderungen. Eine Heizlastberechnung und die Prüfung vor Ort bilden die Grundlage für die Auslegung und die Abstimmung mit den Heizflächen.",
      ],
      presentation: {
        surface: "soft",
        layout: "editorial",
      },
      items: [
        "Gebäude und Wärmebedarf einordnen",
        "Heizlast und Warmwasserbedarf berücksichtigen",
        "Heizflächen und Vorlauftemperaturen prüfen",
        "Aufstellort und elektrische Versorgung klären",
        "Photovoltaik und Speicher berücksichtigen",
        "Regelung und Schnittstellen abstimmen",
      ],
    },
    {
      id: "bosch-waermepumpen",
      eyebrow: "Bosch Luft-Wasser-Wärmepumpen",
      title: "Zwei Wärmepumpenlösungen für Neubau und Modernisierung",
      text: [
        "Welche Wärmepumpe zu Ihrem Zuhause passt, hängt von Heizlast, Heizflächen, Warmwasserbedarf und den Möglichkeiten des Gebäudes ab. Wir stellen zwei Bosch-Baureihen vor und stimmen die passende Ausführung auf Ihr Projekt ab.",
      ],
      presentation: {
        surface: "white",
        layout: "editorial",
      },
      cta: {
        label: "Passende Wärmepumpe besprechen",
        href: CONTACT_FORM_HREF,
      },
    },
    {
      id: "photovoltaik-kombination",
      eyebrow: "Strom und Wärme verbinden",
      title: "Wärmepumpe mit Photovoltaik kombinieren",
      text: [
        "Eine Wärmepumpe benötigt elektrische Energie, während eine Photovoltaikanlage tagsüber eigenen Strom erzeugt. Werden beide Systeme passend geplant und verbunden, kann ein Teil des benötigten Stroms direkt vom eigenen Dach stammen.",
        "Im Winter ist der Heizbedarf häufig hoch, während die PV-Anlage weniger Strom erzeugt. Photovoltaik kann den Netzbezug der Wärmepumpe reduzieren, deckt ihn aber nicht zu jeder Zeit. Auch ein Batteriespeicher ersetzt keine saisonale Energieversorgung.",
      ],
      presentation: {
        surface: "soft",
        layout: "editorial",
      },
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
        "Ein Energiemanagement kann verfügbare Solarenergie berücksichtigen und den Betrieb einer kompatiblen Wärmepumpe innerhalb der vorgesehenen Betriebsgrenzen darauf abstimmen. Welche Möglichkeiten bestehen, hängt von Wärmepumpe, Wechselrichter, Speicher, Schnittstellen und Softwarestand ab.",
        "Wir prüfen die Verbindung der Komponenten, statt eine pauschale Kompatibilität vorauszusetzen. Auch Heizkomfort und Warmwasserbedarf bleiben Teil der Regelung – die Wärmepumpe wird nicht einfach ausschließlich nach dem verfügbaren Solarstrom betrieben.",
        "HomeCom Easy dient der Bosch-Gerätebedienung bei passender Ausstattung. Der Bosch Energiemanager übernimmt Energiemanagement innerhalb der dokumentierten Systemvoraussetzungen. mySigen stellt das Sigenergy-System dar und steuert es entsprechend freigegebener Funktionen. Diese Anwendungen erfüllen unterschiedliche Aufgaben; eine vollständige Bosch-Steuerung über mySigen setzen wir nicht voraus.",
        "Eine SG-Ready-Ansteuerung ist keine vollständige stufenlose Leistungsregelung und keine beliebige Hersteller-API. Die konkrete Verbindung prüfen wir anhand der Geräte, Schnittstellen und Systemfreigaben.",
      ],
      presentation: {
        surface: "soft",
        layout: "editorial",
      },
      items: [
        "PV-Erzeugung und Stromverbrauch berücksichtigen",
        "Geeignete Betriebsstrategien abstimmen",
        "Schnittstellen und Systemfreigaben prüfen",
        "Speicher und weitere Verbraucher einbeziehen",
      ],
    },
    {
      id: "effizienz",
      eyebrow: "Gesamtsystem statt Einzelprodukt",
      title: "Effizienter Betrieb beginnt mit der richtigen Auslegung",
      text: [
        "Die Effizienz einer Wärmepumpe hängt nicht allein vom Gerät ab. Vorlauftemperaturen, Heizflächen, Gebäudedämmung, Regelung und Nutzerverhalten beeinflussen den späteren Betrieb.",
        "Auch der Aufstellort gehört zur Planung. Platzbedarf, Luftführung, Leitungswege, Kondensatführung und Geräuschentwicklung werden passend zum Gebäude und den Herstelleranforderungen betrachtet.",
      ],
      presentation: {
        surface: "white",
        layout: "editorial",
      },
    },
    {
      id: "waermepumpen-rechner",
      eyebrow: "Unverbindliche Modellrechnung",
      title: "Wärmepumpenleistung, Stromverbrauch und Kosten vorab einordnen",
      text: [
        "Mit unserem Wärmepumpen-Rechner erhalten Sie anhand von beheizter Fläche, Wärmebedarf, Vorlauftemperatur und Jahresarbeitszahl eine erste Orientierung für die erforderliche Leistung und den möglichen Stromverbrauch.",
        "Zusätzlich vergleicht das Modell die jährlichen Energiekosten mit dem bestehenden Heizsystem und berechnet einen veränderbaren Investitionskostenkorridor. Eine Heizlastberechnung und technische Vor-Ort-Prüfung bleiben dennoch erforderlich.",
      ],
      presentation: {
        surface: "soft",
        layout: "editorial",
      },
      cta: {
        label: "Wärmepumpen-Rechner öffnen",
        href: "/rechner/waermepumpe-kosten",
      },
    },
    {
      id: "umsetzung",
      eyebrow: "Persönlich geplant und begleitet",
      title: "Beratung, Verkauf und Installation mit klaren Ansprechpartnern",
      text: [
        "Energie-Kraft Süd begleitet die Auswahl und Planung Ihrer Bosch-Wärmepumpe und koordiniert die fachgerechte Installation gemeinsam mit qualifizierten Montagepartnern. Die Abstimmung von Heizung, elektrischer Versorgung und möglichen weiteren Energiekomponenten bleibt Teil Ihres Projekts.",
        "Energie-Kraft Süd besteht seit über 20 Jahren. Von Ainring bei Freilassing aus begleiten wir Energieprojekte im Berchtesgadener Land, im Landkreis Traunstein und der angrenzenden Region. Unsere Erfahrung mit Photovoltaik und Batteriespeichern fließt in die gemeinsame Systemplanung ein.",
      ],
      presentation: {
        surface: "white",
        layout: "editorial",
      },
      cta: {
        label: "Wärmepumpenprojekt besprechen",
        href: CONTACT_FORM_HREF,
      },
    },
  ],
  finalCta: {
    title: "Welche Wärmepumpe passt zu Ihrem Zuhause?",
    primaryCta: {
      label: "Wärmepumpenprojekt besprechen",
      href: CONTACT_FORM_HREF,
    },
  },
} satisfies PublicPageContent;

export const waermepumpenProducts = [
  {
    id: "compress-6800i-aw",
    name: "Bosch Compress 6800i AW",
    eyebrow: "Für Modernisierung und Neubau",
    description:
      "Bosch positioniert die Compress 6800i AW für Sanierungen und Neubauten. Wir prüfen, welche Ausführung zu Ihrem Wärmebedarf und vorhandenen Heizsystem passt und wie sie in die Wärmeversorgung Ihres Gebäudes eingebunden werden kann.",
    features: [
      "Luft-Wasser-System für Heizung und Warmwasser",
      "Kältemittel R290",
      "Schalloptimierter Aufbau",
      "Unterschiedliche Geräte- und Systemausführungen",
      "Bedienung über HomeCom Easy bei passender Ausstattung",
    ],
    image: "/images/heat-pump/products/bosch-compress-6800i-aw.webp",
    width: 770,
    height: 561,
    alt: "Bosch Compress Außeneinheit in Frontansicht, von Bosch für 5800i AW und 6800i AW verwendet",
    source:
      "https://www.bosch-homecomfort.com/de/de/ocs/wohngebaeude/compress-6800i-aw-19312695-p/",
  },
  {
    id: "compress-5800i-aw",
    name: "Bosch Compress 5800i AW",
    eyebrow: "Für Neubau und abgestimmte Wohngebäudetechnik",
    description:
      "Die Compress 5800i AW wird von Bosch besonders für Neubauten positioniert. Außen- und Inneneinheit werden passend zum Gebäude und zur Wärmeversorgung kombiniert. Die konkrete Ausführung richtet sich nach Heizlast, Warmwasserbedarf und den geplanten Funktionen.",
    features: [
      "Heizung und Warmwasserbereitung",
      "Kältemittel R290",
      "Schalloptimierter Aufbau",
      "Unterschiedliche Innen- und Außeneinheiten",
      "Bedienung über HomeCom Easy bei passender Ausstattung",
    ],
    image: "/images/heat-pump/products/bosch-compress-5800i-aw.webp",
    width: 770,
    height: 378,
    alt: "Bosch Compress 5800i AW Produktfamilie mit zwei Außengeräten und drei Inneneinheiten",
    source:
      "https://www.bosch-homecomfort.com/de/de/ocs/wohngebaeude/compress-5800i-aw-19312694-p/",
  },
] as const;

export const waermepumpenProductNotes = {
  caption: "Produktdarstellung von Bosch. Ausstattung abhängig von der gewählten Ausführung.",
  sourceLabel: "Produktinformationen bei Bosch",
  selection:
    "Die Baureihen können ähnliche Merkmale und gemeinsame Außeneinheiten besitzen. Entscheidend bleibt die projektbezogene Auslegung. Vorhandene Heizkörper prüfen wir individuell; eine hohe mögliche Vorlauftemperatur allein garantiert keinen wirtschaftlichen Betrieb.",
};

export const waermepumpenSystemNote = {
  label: "übrigens",
  title: "Wärmepumpe, Photovoltaik und Speicher: gemeinsam mehr aus eigener Energie machen.",
  text: "Mit Photovoltaik kann Ihre Wärmepumpe einen Teil ihres Strombedarfs vom eigenen Dach decken. Ein passend dimensionierter Batteriespeicher macht überschüssigen Solarstrom auch später nutzbar. Wir planen die Komponenten gemeinsam und stimmen sie auf Ihr Gebäude und Ihren Verbrauch ab – alles aus einer Hand.",
  primaryCta: {
    label: "Energieprojekt konfigurieren",
    href: "/konfigurator",
  },
  secondaryCta: {
    label: "Zu den Stromspeichern",
    href: "/stromspeicher",
  },
};
