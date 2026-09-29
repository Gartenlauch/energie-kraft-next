import { CONTACT_FORM_HREF } from "@/config/routes";
import type { PublicPageContent } from "@/types/content";

export const stromspeicherProducts = [
  {
    id: "sigenstor-neo",
    name: "SigenStor Neo",
    eyebrow: "Integriertes All-in-One-System",
    description:
      "SigenStor Neo verbindet PV-Wechselrichter, Batterieleistungselektronik, Batteriemodule und Energiemanagement in einem kompakten System für Wohngebäude. Auch das Backup-Modul ist integriert – die Versorgung bei Netzausfall wird passend zu Ihrem Gebäude geplant.",
    details: [
      {
        label: "Systemaufbau",
        text: "PV, Speicher, Energiemanagement und Backup-Modul integriert.",
      },
      {
        label: "Erweiterung",
        text: "Stapelbare Batteriemodule ermöglichen einen modularen Aufbau.",
      },
      { label: "Bedienung", text: "Überwachung und Energieplanung über mySigen." },
    ],
    image: "/images/battery-storage/products/sigenstor-neo.webp",
    width: 1277,
    height: 849,
    alt: "Offizielle Produktdarstellung des Sigenergy SigenStor Neo mit stapelbaren Batteriemodulen",
    source: "https://www.sigenergy.com/de/product/sigenstor-neo",
  },
  {
    id: "sigenstor",
    name: "SigenStor",
    eyebrow: "Modulares Energiespeichersystem",
    description:
      "SigenStor kombiniert PV-Wechselrichter, Batterieleistungselektronik, Batteriemodule und Energiemanagement in einem modularen Systemturm. Der stapelbare Aufbau lässt sich auf den Energiebedarf und geplante Erweiterungen abstimmen.",
    details: [
      {
        label: "Systemaufbau",
        text: "Integrierte Komponenten für PV, Speicherung und Energiemanagement.",
      },
      {
        label: "Erweiterung",
        text: "Modulare Batterien und zusätzliche Energiekomponenten je nach Konfiguration.",
      },
      {
        label: "Optionen",
        text: "Ein EV-DC-Lademodul kann ergänzt werden; es gehört nicht zu jeder Installation. Backup erfordert eine passende Systemkonfiguration.",
      },
    ],
    image: "/images/battery-storage/products/sigenstor.webp",
    width: 1200,
    height: 1200,
    alt: "Offizielle Produktdarstellung des modularen Sigenergy SigenStor-Systemturms",
    source: "https://www.sigenergy.com/de/products/sigenstor",
  },
] as const;

export const stromspeicherContent = {
  seo: {
    title: "Stromspeicher für Photovoltaik | Energie-Kraft Süd",
    description:
      "Stromspeicher für Photovoltaik: SigenStor Neo und SigenStor passend zu PV-Anlage und Verbrauch planen. Beratung, Installation und Energiemanagement aus einer Hand.",
    canonicalPath: "/stromspeicher",
  },
  faqRouteKey: "stromspeicher",
  hero: {
    eyebrow: "Stromspeicher für Photovoltaik",
    title: "Solarstrom speichern und dann nutzen, wenn Sie ihn brauchen",
    description:
      "Mit einem passend dimensionierten Batteriespeicher nutzen Sie mehr von Ihrem eigenen Solarstrom – auch dann, wenn die Photovoltaikanlage wenig oder keinen Strom erzeugt. Energie-Kraft Süd plant Speicher, Photovoltaik und Energiemanagement als abgestimmtes System für Ihr Zuhause.",
    primaryCta: { label: "Projekt konfigurieren", href: "/konfigurator/stromspeicher" },
    secondaryCta: { label: "Speicherberatung anfragen", href: CONTACT_FORM_HREF },
  },
  sections: [
    {
      id: "speicherloesung",
      eyebrow: "Passend zum Energiebedarf",
      title: "Der richtige Stromspeicher für Ihre Photovoltaikanlage",
      text: [
        "Ein Stromspeicher sollte weder pauschal möglichst groß noch ausschließlich nach der Leistung der Photovoltaikanlage ausgewählt werden. Entscheidend sind Stromverbrauch, Verbrauchszeiten, PV-Erzeugung und geplante zusätzliche Verbraucher.",
        "Die nutzbare Kapazität in Kilowattstunden (kWh) beschreibt die verfügbare Energiemenge. Die Lade- und Entladeleistung in Kilowatt (kW) bestimmt, wie viel Leistung ein System gleichzeitig aufnehmen oder bereitstellen kann. Beide Größen müssen zum tatsächlichen Energiebedarf passen.",
      ],
      items: [
        "Stromverbrauch und Verbrauchszeiten analysieren",
        "Speicher auf bestehende oder neue PV-Anlage abstimmen",
        "Nutzbare Speicherkapazität passend dimensionieren",
        "Lade- und Entladeleistung berücksichtigen",
        "Wallbox und Wärmepumpe mitdenken",
        "Backup-Anforderungen frühzeitig klären",
      ],
      presentation: { surface: "soft", layout: "editorial" },
    },
    {
      id: "funktionsweise",
      eyebrow: "Energie zeitlich verschieben",
      title: "So nutzt ein Batteriespeicher überschüssigen PV-Strom",
      text: [
        "Produziert die Photovoltaikanlage mehr Strom, als im Gebäude gerade benötigt wird, kann der Batteriespeicher einen Teil dieses Überschusses aufnehmen. Wie viel Energie gespeichert oder eingespeist wird, hängt unter anderem von Ladezustand, Speicherleistung und Steuerung ab.",
        "Sinkt die Solarstromproduktion später unter den aktuellen Verbrauch, kann der zuvor gespeicherte Solarstrom wieder im Gebäude genutzt werden. Dadurch lässt sich eigener PV-Strom stärker in die Morgen-, Abend- und Nachtstunden verschieben.",
      ],
      presentation: { surface: "white" },
    },
    {
      id: "speicherprodukte",
      eyebrow: "Speicherlösungen für Ihr Zuhause",
      title: "SigenStor Neo oder SigenStor – passend zum Energiesystem auswählen",
      text: [
        "Welche Variante geeignet ist, hängt unter anderem von Gebäude, PV-Anlage, Verbrauch, gewünschter Speichergröße, Erweiterungen und Backup-Anforderungen ab.",
      ],
      cta: { label: "Speicherprojekt besprechen", href: CONTACT_FORM_HREF },
    },
    {
      id: "eigenverbrauch",
      eyebrow: "Mehr vom eigenen Solarstrom",
      title: "Eigenverbrauch mit Batteriespeicher gezielt erhöhen",
      text: [
        "Ohne Speicher fällt ein großer Teil der Solarstromerzeugung häufig in Tageszeiten, in denen im Gebäude weniger Energie benötigt wird. Gleichzeitig steigt der Verbrauch bei vielen Haushalten morgens und abends.",
        "Ein Batteriespeicher kann einen Teil dieser zeitlichen Verschiebung ausgleichen. Wie stark sich Eigenverbrauch und Netzbezug verändern, hängt von Photovoltaikanlage, Speichergröße und individuellem Verbrauchsverhalten ab.",
      ],
      cta: { label: "Photovoltaikanlage planen", href: "/photovoltaik" },
      presentation: { surface: "blue", layout: "statement" },
    },
    {
      id: "ersatzstrom",
      eyebrow: "Versorgung sinnvoll planen",
      title: "Backup und Ersatzstrom frühzeitig berücksichtigen",
      text: [
        "Nicht jede Speicherinstallation versorgt ein Gebäude bei einem Netzausfall automatisch weiter. Die gewünschte Backup- oder Ersatzstromfunktion muss technisch vorgesehen und passend zur Anlage ausgelegt werden.",
        "Wir klären deshalb bereits in der Planung, welche Verbraucher bei einem Stromausfall weiter versorgt werden sollen und welche Systemkonfiguration dafür notwendig ist.",
      ],
      presentation: { surface: "white" },
    },
    {
      id: "energiemanagement",
      eyebrow: "Energie intelligent steuern",
      title: "Photovoltaik, Speicher und Verbraucher mit mySigen im Blick behalten",
      text: [
        "Mit mySigen lassen sich Erzeugung, Stromverbrauch, Speicherzustand und weitere eingebundene Energiekomponenten übersichtlich darstellen. Dadurch wird sichtbar, wie Energie im Gebäude erzeugt, gespeichert und genutzt wird.",
        "Je nach Systemkonfiguration können Energieströme und Betriebsstrategien intelligent gesteuert und an das eigene Energiesystem angepasst werden. Welche Funktionen tatsächlich zur Verfügung stehen, hängt von den installierten Komponenten und der jeweiligen Konfiguration ab.",
      ],
      items: [
        "Energiefluss und Energiedaten nachvollziehen",
        "Speicherstatus und Energiequellen anzeigen",
        "App und Webzugang nutzen",
        "Betriebsstrategie und Energieplanung einsehen",
      ],
      presentation: { surface: "soft", layout: "editorial" },
    },
    {
      id: "energiesystem",
      eyebrow: "Alles sinnvoll verbinden",
      title: "Photovoltaik, Speicher, Wallbox und Wärmepumpe gemeinsam planen",
      text: [
        "Ein Stromspeicher ist Teil eines größeren Energiesystems. Besonders sinnvoll wird die Planung, wenn Photovoltaikanlage, Speicher und weitere elektrische Verbraucher gemeinsam betrachtet werden.",
        "Wallbox und Wärmepumpe verändern das Verbrauchsprofil eines Gebäudes. Werden diese Verbraucher frühzeitig berücksichtigt, lassen sich Anlagenleistung, Speicher und Energiemanagement besser aufeinander abstimmen.",
      ],
      links: [
        { label: "Photovoltaik", href: "/photovoltaik" },
        { label: "Wallbox", href: "/wallbox" },
        { label: "Wärmepumpe", href: "/waermepumpen" },
      ],
      presentation: { surface: "white", layout: "editorial" },
    },
    {
      id: "region",
      eyebrow: "Energie-Kraft Süd",
      title: "Stromspeicher aus Ainring – passend zu Ihrer Photovoltaikanlage",
      text: [
        "Energie-Kraft Süd besteht seit über 20 Jahren. Von Ainring bei Freilassing aus planen und realisieren wir Photovoltaik- und Speicherlösungen im Berchtesgadener Land, im Landkreis Traunstein und der angrenzenden Region.",
        "Beratung, technische Planung, Installation und Inbetriebnahme werden aufeinander abgestimmt. Auch spätere Erweiterungen und Servicefragen können so im Zusammenhang mit dem bestehenden Energiesystem betrachtet werden.",
      ],
      items: [
        "Persönliche Beratung",
        "Photovoltaik und Speicher gemeinsam planen",
        "Fachgerechte Installation",
        "Energiemanagement einrichten",
        "Erweiterungen berücksichtigen",
        "Service als langfristiger Ansprechpartner",
      ],
      presentation: { surface: "soft", layout: "statement" },
    },
  ],
  finalCta: {
    title: "Welcher Stromspeicher passt zu Ihrem Zuhause?",
    primaryCta: { label: "Speicherprojekt konfigurieren", href: "/konfigurator/stromspeicher" },
    secondaryCta: { label: "Persönliche Beratung", href: CONTACT_FORM_HREF },
  },
} satisfies PublicPageContent;
