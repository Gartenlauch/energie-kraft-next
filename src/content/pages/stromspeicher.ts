import type { PublicPageContent } from "@/types/content";

export const stromspeicherContent = {
  seo: {
    title: "Stromspeicher für Photovoltaik | Energie-Kraft Süd",
    description:
      "Stromspeicher für Photovoltaik: Eigenverbrauch erhöhen, Solarstrom flexibel nutzen und PV-Anlage intelligent erweitern.",
    canonicalPath: "/stromspeicher",
  },

  faqRouteKey: "stromspeicher",

  hero: {
    eyebrow: "Stromspeicher für Photovoltaik",
    title: "Solarstrom speichern und dann nutzen, wenn Sie ihn brauchen",
    description:
      "Ein passend dimensionierter Stromspeicher erhöht den Eigenverbrauch Ihrer Photovoltaikanlage und macht selbst erzeugte Energie auch abends oder nachts verfügbar.",
    primaryCta: {
      label: "Speicherberatung anfragen",
      href: "/kontakt",
    },
    secondaryCta: {
      label: "Funktionsweise entdecken",
      href: "#funktionsweise",
    },
  },

  sections: [
    {
      id: "speicherloesung",
      eyebrow: "Passend zum Energiebedarf",
      title: "Der richtige Stromspeicher für Ihre Photovoltaikanlage",
      text: [
        "Ein Stromspeicher sollte weder pauschal möglichst groß noch ausschließlich nach der Leistung der PV-Anlage ausgewählt werden. Entscheidend sind Stromverbrauch, Verbrauchszeiten, PV-Erzeugung und geplante zusätzliche Verbraucher.",
        "Wir betrachten das gesamte Energiesystem und legen den Speicher so aus, dass Kapazität, Ladeleistung und Steuerung zu Ihrem tatsächlichen Bedarf passen.",
      ],
      items: [
        "Analyse von Stromverbrauch und Lastprofil",
        "Abstimmung auf bestehende oder neue Photovoltaikanlage",
        "Passende Speicher- und Ladeleistung",
        "Berücksichtigung von Wallbox und Wärmepumpe",
        "Möglichkeiten für Ersatz- oder Notstrom",
        "Intelligente Steuerung und Anlagenüberwachung",
      ],
    },
    {
      id: "funktionsweise",
      eyebrow: "Energie zeitlich verschieben",
      title: "So nutzt ein Batteriespeicher überschüssigen PV-Strom",
      text: [
        "Produziert die Photovoltaikanlage mehr Strom, als im Gebäude gerade benötigt wird, lädt der überschüssige Solarstrom zunächst den Batteriespeicher. Erst wenn dessen verfügbare Kapazität ausgeschöpft ist, wird weitere Energie in das öffentliche Netz eingespeist.",
        "Sinkt die Solarstromproduktion später unter den aktuellen Verbrauch, stellt der Speicher die zuvor gespeicherte Energie bereit. So kann Solarstrom auch in den Abendstunden und während Zeiten geringer Erzeugung genutzt werden.",
      ],
    },
    {
      id: "eigenverbrauch",
      eyebrow: "Mehr vom eigenen Solarstrom",
      title: "Eigenverbrauch und Energieunabhängigkeit erhöhen",
      text: [
        "Ohne Speicher fällt ein großer Teil der Stromerzeugung häufig in Tageszeiten, in denen der Verbrauch im Gebäude vergleichsweise niedrig ist. Gleichzeitig steigt der Verbrauch oft morgens und abends.",
        "Ein Stromspeicher gleicht diese zeitliche Verschiebung teilweise aus. Wie stark der Eigenverbrauch steigt, hängt von Anlagenleistung, Speicherkapazität und individuellem Verbrauchsverhalten ab.",
      ],
      cta: {
        label: "Photovoltaikanlage planen",
        href: "/photovoltaik",
      },
    },
    {
      id: "ersatzstrom",
      eyebrow: "Versorgung sinnvoll planen",
      title: "Ersatzstrom und Notstrom frühzeitig berücksichtigen",
      text: [
        "Nicht jeder Stromspeicher kann ein Gebäude bei einem Netzausfall automatisch weiter versorgen. Ersatzstrom- oder Notstromfunktionen müssen technisch vorgesehen und passend zur gewünschten Versorgung ausgelegt werden.",
        "Wir klären im Rahmen der Planung, welche Verbraucher im Fall eines Stromausfalls versorgt werden sollen und welche technische Lösung dafür geeignet ist.",
      ],
    },
    {
      id: "energiemanagement",
      eyebrow: "Energie intelligent steuern",
      title: "Stromspeicher als Teil eines vernetzten Energiesystems",
      text: [
        "Moderne Speichersysteme können Erzeugung, Verbrauch, Ladezustand und weitere Energieverbraucher gemeinsam betrachten. Dadurch lässt sich selbst erzeugter Strom gezielter einsetzen.",
        "Besonders wichtig ist die Abstimmung, wenn zusätzlich ein Elektrofahrzeug geladen oder eine Wärmepumpe betrieben werden soll. Ein durchdachtes Energiemanagement priorisiert Verbraucher und nutzt verfügbare Solarenergie möglichst effizient.",
      ],
      items: [
        "Transparente Anzeige von Erzeugung und Verbrauch",
        "Überwachung des Speicher-Ladezustands",
        "Steuerung über App oder Weboberfläche",
        "Abstimmung mit Wallbox und Wärmepumpe",
        "Optimierung des Eigenverbrauchs",
        "Erweiterbarkeit für zukünftige Anforderungen",
      ],
      cta: {
        label: "Stromspeicher anfragen",
        href: "/kontakt",
      },
    },
  ],
} satisfies PublicPageContent;
