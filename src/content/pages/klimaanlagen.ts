import type { PublicPageContent } from "@/types/content";

export const klimaanlagenContent = {
  seo: {
    title: "Klimaanlage kaufen & installieren | Energie-Kraft Süd",
    description:
      "Klimaanlage für Haus, Wohnung oder Gewerbe: individuelle Planung, Split- und Multisplit-Systeme sowie fachgerechte Installation.",
    canonicalPath: "/klimaanlagen",
  },

  faqRouteKey: "klimaanlagen",

  hero: {
    eyebrow: "Klimaanlagen für Zuhause und Gewerbe",
    title: "Angenehme Raumtemperaturen – individuell und effizient geplant",
    description:
      "Wir planen und installieren fest eingebaute Klimaanlagen passend zu Raumgröße, Gebäudesituation und gewünschtem Komfort – vom einzelnen Raum bis zur individuellen Mehrraumlösung.",
    primaryCta: {
      label: "Klimaanlagen-Beratung anfragen",
      href: "/kontakt",
    },
    secondaryCta: {
      label: "Lösungen kennenlernen",
      href: "#klimaanlagen-planung",
    },
  },

  sections: [
    {
      id: "klimaanlagen-planung",
      eyebrow: "Individuelle Auslegung",
      title: "Die passende Klimaanlage beginnt mit einer sorgfältigen Planung",
      text: [
        "Eine Klimaanlage sollte nicht ausschließlich nach der Raumfläche ausgewählt werden. Fensterflächen, Sonneneinstrahlung, Dämmung, Raumhöhe, Nutzung und vorhandene Wärmequellen beeinflussen die erforderliche Leistung.",
        "Wir betrachten deshalb die tatsächliche Gebäudesituation und entwickeln eine Lösung, die zum gewünschten Komfort und zum späteren Betrieb passt.",
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
        "Durch die Trennung von Innen- und Außeneinheit befindet sich der für den Kältemittelkreislauf wichtige Verdichter außerhalb des Raumes. Das ermöglicht einen effizienteren und in Innenräumen vergleichsweise leisen Betrieb.",
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
      id: "multi-split",
      eyebrow: "Mehrere Räume individuell regeln",
      title: "Multisplit-Klimaanlage für Haus, Wohnung oder Gewerbe",
      text: [
        "Bei einer Multisplit-Klimaanlage werden mehrere Innengeräte mit einem gemeinsamen Außengerät verbunden. Dadurch können mehrere Räume klimatisiert werden, ohne für jedes Innengerät eine separate Außeneinheit installieren zu müssen.",
        "Die Temperatur kann in den angeschlossenen Räumen bedarfsgerecht eingestellt werden. Das macht Multisplit-Systeme besonders interessant für Einfamilienhäuser, größere Wohnungen, Büros und kleinere Gewerbeeinheiten.",
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
        "Viele moderne Split-Klimaanlagen können den Kältemittelkreislauf umkehren und dadurch nicht nur kühlen, sondern auch Wärme an den Raum abgeben.",
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
        "Der Kühlbedarf ist häufig dann besonders hoch, wenn auch eine Photovoltaikanlage viel Solarstrom erzeugt. Dadurch kann ein Teil der für die Klimatisierung benötigten Energie direkt vom eigenen Dach stammen.",
        "Eine abgestimmte Planung von Photovoltaikanlage, Klimagerät und weiteren Verbrauchern kann den Eigenverbrauch erhöhen und das gesamte Energiesystem besser nutzen.",
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
      title: "Installation und Inbetriebnahme der Klimaanlage",
      text: [
        "Fest installierte Split-Klimaanlagen benötigen eine sorgfältige Verbindung zwischen Innen- und Außengerät. Dazu gehören Kältemittelleitungen, elektrische Anschlüsse und eine kontrollierte Ableitung des anfallenden Kondensats.",
        "Wir berücksichtigen die technischen und baulichen Anforderungen bereits bei der Planung und setzen das System fachgerecht in Betrieb.",
      ],
      items: [
        "Montage von Innen- und Außengeräten",
        "Planung und Verlegung der Verbindungsleitungen",
        "Elektrischer Anschluss der Anlage",
        "Sichere Ableitung von Kondenswasser",
        "Technische Prüfung und Inbetriebnahme",
        "Einweisung in Bedienung und Regelung",
      ],
      cta: {
        label: "Klimaanlage anfragen",
        href: "/kontakt",
      },
    },
    {
      id: "wartung",
      eyebrow: "Zuverlässiger Betrieb",
      title: "Pflege und Wartung für Leistung und Raumkomfort",
      text: [
        "Filter und luftführende Komponenten sollten regelmäßig kontrolliert und entsprechend den Herstellerangaben gereinigt oder gewartet werden. Das unterstützt einen hygienischen und zuverlässigen Anlagenbetrieb.",
        "Eine fachgerechte Wartung hilft außerdem dabei, Verschmutzungen, ungewöhnliche Betriebsgeräusche oder nachlassende Leistung frühzeitig zu erkennen.",
      ],
      items: [
        "Kontrolle und Reinigung der Filter",
        "Prüfung der Innen- und Außeneinheiten",
        "Kontrolle des Kondensatablaufs",
        "Überprüfung der Anlagenfunktion",
        "Frühzeitiges Erkennen möglicher Störungen",
        "Werterhalt und zuverlässiger Langzeitbetrieb",
      ],
    },
    {
      id: "beratung",
      eyebrow: "Ihre individuelle Lösung",
      title: "Klimaanlage für Ihr Gebäude planen lassen",
      text: [
        "Ob ein einzelner Raum oder mehrere Bereiche klimatisiert werden sollen: Die geeignete Lösung hängt immer von der konkreten Situation ab. Pauschale Gerätegrößen oder Standardpakete berücksichtigen diese Unterschiede nur unzureichend.",
        "Wir besprechen Ihre Anforderungen, prüfen die räumlichen Voraussetzungen und erstellen darauf aufbauend ein individuelles Konzept und Angebot.",
      ],
      cta: {
        label: "Beratungstermin anfragen",
        href: "/kontakt",
      },
    },
  ],
} satisfies PublicPageContent;
