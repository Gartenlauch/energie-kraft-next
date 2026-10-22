export interface WallboxProduct {
  id: string;
  brand: string;
  name: string;
  positioning: string;
  description: string;
  benefits: readonly string[];
  image: { src: string; alt: string; width: number; height: number };
  detail?: string;
  note?: { title: string; text: string };
  availabilityNote?: string;
  navigationLabel?: string;
  specifications?: readonly { label: string; value: string }[];
  sources?: readonly { label: string; href: string }[];
}

// Verified manufacturer sources and client-approved images: docs/wallbox-product-assets.md.
export const wallboxProducts: readonly WallboxProduct[] = [
  {
    id: "alfen-eve-single-plus-de",
    brand: "Alfen / sonnen",
    name: "Alfen Eve Single Plus DE",
    positioning: "Intelligente Ladelösung für das sonnenSystem",
    description:
      "Sie suchen eine sonnen Wallbox, die Ihre Photovoltaik und sonnenBatterie einbezieht? Der Alfen Eve Single Plus DE verbindet AC-Laden mit einer auf das sonnenSystem abgestimmten Steuerung.",
    benefits: [
      "Bis zu 22 kW AC-Ladeleistung über Typ 2",
      "Automatische 1-/3-Phasenumschaltung",
      "Eco-, Smart- und Power-Lademodus",
      "Eichrechtskonformer Zähler und RFID",
    ],
    detail:
      "Eco nutzt Solarstrom, Smart plant zur Abfahrtszeit und Power priorisiert schnelles Laden. Die Phasenumschaltung nutzt kleinere PV-Überschüsse; RFID ordnet Ladevorgänge für die Dienstwagenabrechnung zu. Die Ladeleistung hängt von Fahrzeug und Anschluss ab.",
    image: {
      src: "/images/wallbox/products/alfen-eve-single-plus-de.webp",
      alt: "Alfen Eve Single Plus DE Wallbox",
      width: 1200,
      height: 758,
    },
    availabilityNote:
      "Ob die Integration und Steuerung über die sonnen App für Ihre Anlage verfügbar und freigegeben ist, prüfen wir im Einzelfall. Eine dauerhafte Softwareunterstützung oder künftige Freigaben können wir derzeit nicht zusagen. Auch Lieferbarkeit und Kompatibilität Ihrer sonnenBatterie klären wir vor einem Angebot.",
    note: {
      title: "Hinweis zum sonnenHome Charger 2",
      text: "Der sonnenHome Charger 2 ist nicht mehr erhältlich. Wenn Sie nach einem Preis oder einer Kaufmöglichkeit für den sonnen Charger 2 suchen: Ob der Alfen Eve Single Plus DE für Ihr sonnenSystem infrage kommt, prüfen wir anhand der Lieferbarkeit, des Freigabe- und Softwarestands sowie der passenden Systemkonfiguration und Installation.",
    },
  },
  {
    id: "sigen-ev-dc",
    brand: "Sigenergy",
    name: "Sigen EV DC",
    navigationLabel: "Sigenergy DC",
    positioning: "Bidirektionales Laden im SigenStor Energiesystem",
    description:
      "Das Sigen EV DC Charging Module verbindet das Elektroauto über Gleichstrom mit SigenStor. Es wird zusammen mit dem Sigen Energy Controller geplant und bindet Fahrzeug, Photovoltaik und Speicher in ein gemeinsames Energiesystem ein.",
    benefits: [
      "DC-Laden bis zu 25 kW",
      "Für Vehicle-to-Home (V2H) und Vehicle-to-Grid (V2G) ausgelegt",
      "CCS2-Anschluss der europäischen Variante",
      "PV- und Speicherintegration mit der mySigen App",
    ],
    detail: "Die Ladeleistung richtet sich nach Variante, Fahrzeug und Systemauslegung.",
    image: {
      src: "/images/wallbox/products/sigen-ev-dc.webp",
      alt: "Sigenergy Sigen EV DC Lademodul",
      width: 1200,
      height: 600,
    },
    note: {
      title: "V2X braucht eine freigegebene Kombination",
      text: "Ob Energie aus dem Fahrzeug nutzbar ist, hängt von Fahrzeugmodell, Fahrzeugfreigabe, Software, Ladehardware und regulatorischen Voraussetzungen ab. Herstellerseitige Tests einzelner Fahrzeuge sind keine pauschale Freigabe für jedes Fahrzeug oder jeden Einsatzort.",
    },
  },
  {
    id: "sigen-ev-ac",
    brand: "Sigenergy",
    name: "Sigen EV AC Charger",
    navigationLabel: "Sigenergy AC",
    positioning: "Intelligentes AC-Laden mit Solarstrom",
    description:
      "Der Sigen EV AC Charger verbindet tägliches Laden mit der Solarenergie Ihres Hauses. Im SigenStor-System lässt sich das Elektroauto gezielt mit verfügbarem PV-Überschuss laden; Ladezeiten und Betriebsmodi steuern Sie über die mySigen App.",
    benefits: [
      "PV-Überschussladen im SigenStor-System",
      "Ladeplanung und Steuerung über die mySigen App",
      "Dynamisches Lastmanagement mit passender Messtechnik",
      "Für Innen- und Außeninstallation geeignet",
    ],
    specifications: [
      { label: "Nominale Ladeleistung", value: "7 / 11 / 22 kW, je nach Ausführung" },
      {
        label: "Nominale Ausgangsspannung",
        value: "7 kW: 220–240 V, einphasig; 11 / 22 kW: 220–240 V / 380–415 V, dreiphasig",
      },
      { label: "Fahrzeuganbindung", value: "Typ 2 Stecker oder Typ 2 Buchse mit Shutter" },
      { label: "Kommunikation", value: "4G / WLAN / Ethernet, je nach Ausführung" },
      {
        label: "Dynamisches Lastmanagement",
        value: "Unterstützt; Sigen Power Sensor erforderlich",
      },
      { label: "Schutzart", value: "IP65" },
      { label: "Schlagfestigkeit", value: "IK10" },
      { label: "Gewicht", value: "4,5 kg / 6,4 kg, je nach Ausführung" },
      { label: "Kühlung", value: "Natürliche Konvektion" },
    ],
    detail:
      "Die tatsächlich nutzbare Ladeleistung richtet sich nach Variante, Fahrzeug und elektrischem Anschluss. PV-Laden erfordert eine passende SigenStor-Konfiguration; dynamisches Lastmanagement setzt den Sigen Power Sensor voraus.",
    image: {
      src: "/images/wallbox/products/sigen-ev-ac-charger.webp",
      alt: "Sigenergy Sigen EV AC Charger an einer Garagenwand neben einem ladenden Elektroauto",
      width: 1920,
      height: 900,
    },
    // Manufacturer product page and original EVAC 7/11/22 datasheet, checked 2026-10-13.
    sources: [
      {
        label: "Produktinformationen bei Sigenergy",
        href: "https://www.sigenergy.com/de/products/ac-charger",
      },
      {
        label: "Sigen EV AC Datenblatt",
        href: "https://www.sigenergy.com/uploads/en_download/1693469297981431.pdf",
      },
    ],
  },
  {
    id: "fronius-wattpilot-home-22-j",
    brand: "Fronius",
    name: "Fronius Wattpilot Home 22 J",
    positioning: "PV-optimiertes Laden im Fronius-System",
    description:
      "Der Wattpilot Home ist die fest installierte Ladelösung für zu Hause. Besonders in einer passenden Fronius-PV-Anlage lässt sich das Laden auf den verfügbaren Solarstrom abstimmen.",
    benefits: [
      "Bis zu 22 kW AC-Ladeleistung",
      "PV-Überschussladen",
      "Automatische 1-/3-Phasenumschaltung",
      "Steuerung über die Solar.wattpilot App",
    ],
    detail:
      "PV-Laden setzt passende Mess- und Systemtechnik voraus. Fahrzeug und Anschluss bestimmen die tatsächlich nutzbare Ladeleistung.",
    image: {
      src: "/images/wallbox/products/fronius-wattpilot-home-22-j.webp",
      alt: "Fronius Wattpilot Home 22 J",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "abl-pulsar",
    brand: "ABL",
    name: "ABL Pulsar",
    positioning: "Flexible Wallbox für Zuhause",
    description:
      "Die ABL Pulsar eignet sich für das tägliche Laden zu Hause. Wir stimmen die Ausführung und das erforderliche Zubehör darauf ab, ob Sie einfach laden, Solarstrom nutzen oder die Anschlussleistung dynamisch verteilen möchten.",
    benefits: [
      "Als 11 kW oder 22 kW Variante erhältlich",
      "Fest integriertes Ladekabel",
      "App-Steuerung über die Wallbox App",
      "PV-Überschussladen und dynamisches Lastmanagement",
    ],
    detail:
      "PV-Laden und dynamisches Lastmanagement erfordern den Energy Meter Pulsar und eine passende Systemkonfiguration.",
    image: {
      src: "/images/wallbox/products/abl-pulsar.webp",
      alt: "ABL Pulsar Wallbox",
      width: 1200,
      height: 800,
    },
  },
];
