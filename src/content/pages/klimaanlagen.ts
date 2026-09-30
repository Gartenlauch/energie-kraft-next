import { CONTACT_FORM_HREF } from "@/config/routes";
import type { PublicPageContent } from "@/types/content";

export const klimaanlagenContent = {
  seo: {
    title: "Klimaanlage kaufen & installieren | Energie-Kraft Süd",
    description:
      "Bosch Klimaanlage kaufen: Single- und Multisplit-Lösungen für Haus, Wohnung und Gewerbe. Beratung und Planung durch Energie-Kraft Süd aus Ainring.",
    canonicalPath: "/klimaanlagen",
  },

  faqRouteKey: "klimaanlagen",

  hero: {
    eyebrow: "Klimaanlagen für Zuhause und Gewerbe",
    title: "Angenehme Raumtemperaturen – individuell und effizient geplant",
    description:
      "Wir planen Klimaanlagen passend zu Raumgröße, Gebäudesituation und gewünschtem Komfort und begleiten Ihr Projekt von der Auswahl des passenden Bosch-Systems bis zur fachgerechten Installation mit qualifizierten Partnern.",
    primaryCta: {
      label: "Klimaanlagen-Beratung anfragen",
      href: CONTACT_FORM_HREF,
    },
    secondaryCta: {
      label: "Projekt konfigurieren",
      href: "/konfigurator/klimaanlage",
    },
  },

  sections: [
    {
      id: "klimaanlagen-planung",
      eyebrow: "Individuelle Auslegung",
      title: "Die passende Klimaanlage beginnt mit einer sorgfältigen Planung",
      text: [
        "Eine Klimaanlage sollte nicht ausschließlich nach der Raumfläche ausgewählt werden. Fensterflächen, Sonneneinstrahlung, Dämmung, Raumhöhe, Nutzung und vorhandene Wärmequellen beeinflussen die erforderliche Leistung.",
        "Ein sonniges Dachgeschoss benötigt eine andere Auslegung als ein gut verschattetes Schlafzimmer. Neben Kühlleistung und gewünschtem Komfort berücksichtigen wir Luftverteilung, Schall, Kondensatableitung und geeignete Montagepositionen.",
      ],
      items: [
        "Erfassung der Räume und ihrer Nutzung",
        "Berücksichtigung von Raumgröße und Raumhöhe",
        "Bewertung von Fensterflächen und Sonneneinstrahlung",
        "Betrachtung von Dämmung und baulicher Situation",
        "Auswahl geeigneter Innen- und Außengeräte",
        "Planung von Leitungswegen und Montagepositionen",
      ],
    },
    {
      id: "single-split",
      eyebrow: "Gezielte Raumklimatisierung",
      title: "Single-Split-Klimaanlage für einen einzelnen Raum",
      text: [
        "Eine Single-Split-Klimaanlage besteht aus einem Innengerät und einem dazugehörigen Außengerät. Sie eignet sich für die gezielte Klimatisierung eines einzelnen Bereichs, beispielsweise eines Schlafzimmers, Wohnraums, Büros oder Dachgeschosses.",
        "Durch die Trennung von Innen- und Außeneinheit befindet sich der für den Kältemittelkreislauf wichtige Verdichter außerhalb des Raumes. Mit Climate 3200i und Climate 6000iP stehen unterschiedliche Bosch-Single-Split-Lösungen zur Verfügung.",
      ],
      items: [
        "Geeignet für einzelne Wohn- oder Arbeitsräume",
        "Individuelle Regelung der gewünschten Temperatur",
        "Feste und platzsparende Installation",
        "Effizientere Lösung als mobile Monoblockgeräte",
        "Kühlbetrieb für warme Sommertage",
        "Je nach System zusätzliche Heizfunktion",
      ],
    },
    {
      id: "bosch-klimaanlagen",
      eyebrow: "Bosch Klimaanlagen",
      title: "Single- und Multisplit-Lösungen passend zu Ihrem Gebäude",
      text: [
        "Energie-Kraft Süd bietet ausgewählte Bosch-Klimasysteme für einzelne Räume und Mehrraumlösungen an. Welches System passt, hängt von Raumanzahl, Kühl- und Heizbedarf, baulicher Situation und den gewünschten Komfortfunktionen ab.",
      ],
    },
    {
      id: "multi-split",
      eyebrow: "Mehrere Räume individuell regeln",
      title: "Multisplit-Klimaanlage für Haus, Wohnung oder Gewerbe",
      text: [
        "Bei einer Multisplit-Klimaanlage werden mehrere Innengeräte mit einem gemeinsamen Außengerät verbunden. Dadurch können mehrere Räume klimatisiert werden, ohne für jedes Innengerät eine separate Außeneinheit installieren zu müssen.",
        "Die Temperatur kann in den angeschlossenen Räumen bedarfsgerecht eingestellt werden. Das macht Multisplit-Systeme besonders interessant für Einfamilienhäuser, größere Wohnungen, Büros und kleinere Gewerbeeinheiten. Mit der Bosch Climate 5000 M lässt sich je nach Systemausführung eine gemeinsame Außeneinheit mit mehreren Innengeräten kombinieren.",
      ],
      items: [
        "Mehrere Räume mit einem Außengerät klimatisieren",
        "Separate Temperatureinstellung je Raum",
        "Unterschiedliche Innengeräte passend zur Raumnutzung",
        "Reduzierte Anzahl sichtbarer Außeneinheiten",
        "Schrittweise und bedarfsgerechte Planung",
        "Geeignet für private und gewerbliche Gebäude",
      ],
    },
    {
      id: "kuehlen-und-heizen",
      eyebrow: "Komfort über den Sommer hinaus",
      title: "Mit der Klimaanlage kühlen und bei Bedarf heizen",
      text: [
        "Viele moderne Split-Klimaanlagen können den Kältemittelkreislauf umkehren und dadurch nicht nur kühlen, sondern auch Wärme an den Raum abgeben. Im Heizmodus arbeiten sie technisch als Luft-Luft-Wärmepumpen.",
        "Die Heizfunktion kann insbesondere in Übergangszeiten eine flexible Ergänzung sein. Ob sie für das jeweilige Gebäude und den vorgesehenen Einsatzzweck sinnvoll ist, wird im Rahmen der Planung betrachtet.",
      ],
      items: [
        "Angenehme Kühlung an heißen Tagen",
        "Zusätzliche Heizfunktion je nach System",
        "Schnelle Temperaturanpassung einzelner Räume",
        "Flexible Nutzung in Frühling und Herbst",
        "Individuelle Regelung nach tatsächlichem Bedarf",
        "Ergänzung zum bestehenden Heizsystem",
      ],
    },
    {
      id: "photovoltaik",
      eyebrow: "Kühlung mit eigener Energie",
      title: "Klimaanlage und Photovoltaik sinnvoll kombinieren",
      text: [
        "Der Kühlbedarf ist häufig dann besonders hoch, wenn auch eine Photovoltaikanlage viel Solarstrom erzeugt. Dadurch kann ein Teil der für die Klimatisierung benötigten elektrischen Energie direkt vom eigenen Dach stammen.",
        "Werden Photovoltaik, Klimagerät und weitere Verbraucher gemeinsam betrachtet, lässt sich der selbst erzeugte Strom gezielter nutzen. Ein Batteriespeicher kann das Energiesystem ergänzen, ist für den Betrieb der Klimaanlage aber keine Voraussetzung.",
      ],
      items: [
        "Nutzung eigener Solarenergie für die Kühlung",
        "Hohe zeitliche Übereinstimmung von Sonne und Kühlbedarf",
        "Einbindung in bestehende Photovoltaikanlagen",
        "Abstimmung mit Stromspeicher und Energiemanagement",
        "Transparente Betrachtung zusätzlicher Stromverbräuche",
        "Erweiterung eines bestehenden Energiesystems",
      ],
      cta: {
        label: "Photovoltaik entdecken",
        href: "/photovoltaik",
      },
    },
    {
      id: "komfort-und-betrieb",
      eyebrow: "Komfort im Alltag",
      title: "Leiser Betrieb und bedarfsgerechte Temperaturregelung",
      text: [
        "Die Positionierung des Innengeräts beeinflusst, wie sich die gekühlte oder erwärmte Luft im Raum verteilt. Dabei sollte ein angenehmer Luftstrom erreicht werden, ohne Aufenthaltsbereiche unnötig direkt anzublasen.",
        "Auch die Platzierung des Außengeräts muss sorgfältig geplant werden. Zugänglichkeit, Luftführung, Schall, Befestigung und der Abstand zu angrenzenden Bereichen spielen dabei eine wichtige Rolle.",
      ],
      items: [
        "Sinnvolle Positionierung der Innengeräte",
        "Möglichst gleichmäßige Luftverteilung",
        "Berücksichtigung empfindlicher Aufenthaltsbereiche",
        "Geeigneter Standort für das Außengerät",
        "Betrachtung von Schall und Gebäudesituation",
        "Zugänglichkeit für Wartung und Service",
      ],
    },
    {
      id: "installation",
      eyebrow: "Fachgerecht umgesetzt",
      title: "Fachgerechte Installation und Inbetriebnahme",
      text: [
        "Fest installierte Split-Klimaanlagen benötigen eine sorgfältige Verbindung zwischen Innen- und Außengerät. Dazu gehören Kältemittelleitungen, elektrische Anschlüsse und eine kontrollierte Ableitung des anfallenden Kondensats.",
        "Energie-Kraft Süd berücksichtigt die technischen und baulichen Anforderungen bereits bei der Planung und koordiniert die fachgerechte Installation und Inbetriebnahme gemeinsam mit qualifizierten Montagepartnern.",
      ],
      items: [
        "Montagepositionen vorab planen",
        "Leitungswege abstimmen",
        "Elektrische Einbindung berücksichtigen",
        "Kondensatableitung planen",
        "Installation mit Fachpartnern koordinieren",
        "Inbetriebnahme und Bedienung abstimmen",
      ],
      afterItems: {
        text: "Auch nach der Inbetriebnahme unterstützen wir bei Fragen zu Betrieb, Pflege und Service. Regelmäßige Filterpflege und eine bedarfsgerechte Wartung unterstützen einen zuverlässigen Anlagenbetrieb.",
        link: { label: "Service & Wartung kennenlernen", href: "/service-und-wartung" },
      },
      cta: {
        label: "Klimaanlage anfragen",
        href: CONTACT_FORM_HREF,
      },
    },
    {
      id: "beratung",
      eyebrow: "Ihre individuelle Lösung",
      title: "Klimaanlage für Ihr Gebäude planen lassen",
      text: [
        "Ob ein einzelner Raum oder mehrere Bereiche klimatisiert werden sollen: Die geeignete Lösung hängt von der konkreten Gebäudesituation und Nutzung ab. Pauschale Gerätegrößen oder Standardpakete berücksichtigen diese Unterschiede nur unzureichend.",
        "Energie-Kraft Süd besteht seit über 20 Jahren. Von Ainring bei Freilassing aus beraten wir private und gewerbliche Kunden im Berchtesgadener Land, im Landkreis Traunstein und der angrenzenden Region. Planung und Produktauswahl erfolgen durch Energie-Kraft Süd; die fachgerechte Installation koordinieren wir gemeinsam mit qualifizierten Montagepartnern.",
      ],
      cta: {
        label: "Beratungstermin anfragen",
        href: CONTACT_FORM_HREF,
      },
    },
  ],
  finalCta: {
    title: "Welche Klimaanlage passt zu Ihren Räumen?",
    primaryCta: { label: "Klimaprojekt konfigurieren", href: "/konfigurator/klimaanlage" },
    secondaryCta: { label: "Persönliche Beratung", href: CONTACT_FORM_HREF },
  },
} satisfies PublicPageContent;

export const klimaanlagenProducts = [
  {
    id: "climate-3200i",
    name: "Bosch Climate 3200i",
    eyebrow: "Single-Split · ein Raum",
    description:
      "Die Bosch Climate 3200i ist eine Single-Split-Lösung für die gezielte Klimatisierung einzelner Räume. Verschiedene Leistungsgrößen ermöglichen die Anpassung an unterschiedliche Raum- und Nutzungssituationen. Das System kann sowohl kühlen als auch heizen.",
    features: [
      "Vier Nennleistungen von 2,6 bis 7,0 kW im Single-Split-Bereich",
      "3D-Swing und Ionisatortechnologie",
      "WLAN mit separat erhältlichem Gateway möglich",
    ],
    image: "/images/climate/products/bosch-climate-3200i.webp",
    width: 770,
    height: 650,
    alt: "Bosch Climate 3200i Inneneinheit, Produktdarstellung von Bosch",
    source: "https://www.bosch-homecomfort.com/de/de/ocs/wohngebaeude/climate-3200i-21911805-p/",
  },
  {
    id: "climate-6000ip",
    name: "Bosch Climate 6000iP",
    eyebrow: "Single-Split · Kältemittel R290",
    description:
      "Die Bosch Climate 6000iP ist für die Klimatisierung eines einzelnen Raums ausgelegt und verwendet das natürliche Kältemittel R290. Sie verbindet Kühl- und Heizbetrieb mit moderner Geräte- und Regelungstechnik.",
    features: [
      "Zwei Nennkühlleistungen von 2,6 bis 3,5 kW",
      "3D-Swing und Ionisator",
      "WLAN-Konnektivität als Zubehör erhältlich",
    ],
    image: "/images/climate/products/bosch-climate-6000ip.webp",
    width: 770,
    height: 638,
    alt: "Bosch Climate 6000iP Inneneinheit, Produktdarstellung von Bosch",
    source: "https://www.bosch-homecomfort.com/de/de/ocs/wohngebaeude/climate-6000ip-22243767-p/",
  },
  {
    id: "climate-5000m",
    name: "Bosch Climate 5000 M",
    eyebrow: "Multi-Split · mehrere Räume",
    description:
      "Die Bosch Climate 5000 M ermöglicht die Klimatisierung mehrerer Räume mit einer gemeinsamen Außeneinheit. Je nach Ausführung können mehrere Innengeräte eingebunden und die Räume individuell geregelt werden.",
    features: [
      "Je nach Außeneinheit Anschlüsse für zwei bis fünf Innengeräte",
      "Kühlen und Heizen",
      "Wand-, Kassetten- und Konsolengeräte kombinierbar",
    ],
    image: "/images/climate/products/bosch-climate-5000m.webp",
    width: 770,
    height: 625,
    alt: "Bosch Climate 5000 M Außeneinheit, Produktdarstellung von Bosch",
    source:
      "https://www.bosch-homecomfort.com/de/de/ocs/wohngebaeude/climate-5000-m-ausseneinheit-19653490-p/",
  },
] as const;
