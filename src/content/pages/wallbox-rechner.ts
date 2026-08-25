import type { SeoContent } from "@/types/content";
import {
  DEFAULT_WALLBOX_CALCULATOR_INPUT,
} from "@/lib/calculators/wallbox-model";


import type {
  WallboxNumericInputKey,
  WallboxSystemRecommendation,
} from "@/types/wallbox-calculator";

export interface WallboxNumberFieldContent {
  name: WallboxNumericInputKey;
  label: string;
  helpText: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

interface WallboxRecommendationContent {
  label: string;
  description: string;
}

interface WallboxCalculatorPageContent {
  seo: SeoContent;

  breadcrumbLabel: string;

  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };

  primaryFields: readonly WallboxNumberFieldContent[];
  advancedFields: readonly WallboxNumberFieldContent[];

  recommendationContent: Record<
    WallboxSystemRecommendation,
    WallboxRecommendationContent
  >;

  disclaimer: string;
  modelNotes: readonly string[];
}

export const defaultWallboxCalculatorInput = DEFAULT_WALLBOX_CALCULATOR_INPUT;

const primaryFields = [
  {
    name: "annualDrivingKm",
    label: "Jährliche Fahrleistung",
    helpText:
      "Erwartete Fahrleistung des Elektrofahrzeugs innerhalb eines Jahres.",
    unit: "km/Jahr",
    min: 1_000,
    max: 100_000,
    step: 500,
  },
  {
    name: "vehicleConsumptionKwhPer100Km",
    label: "Fahrzeugverbrauch",
    helpText:
      "Durchschnittlicher Stromverbrauch des Fahrzeugs einschließlich Ihrer üblichen Fahrbedingungen.",
    unit: "kWh/100 km",
    min: 8,
    max: 50,
    step: 0.5,
  },
  {
    name: "homeChargingSharePercent",
    label: "Anteil Laden zu Hause",
    helpText:
      "Anteil des jährlichen Fahrstrombedarfs, der voraussichtlich an der eigenen Wallbox geladen wird.",
    unit: "%",
    min: 0,
    max: 100,
    step: 5,
  },
  {
    name: "batteryCapacityKwh",
    label: "Batteriekapazität",
    helpText:
      "Nutzbare oder für die Modellrechnung verwendete Kapazität der Fahrzeugbatterie.",
    unit: "kWh",
    min: 10,
    max: 250,
    step: 1,
  },
  {
    name: "startStateOfChargePercent",
    label: "Typischer Ladebeginn",
    helpText:
      "Batteriestand, bei dem das Fahrzeug üblicherweise an die Wallbox angeschlossen wird.",
    unit: "%",
    min: 0,
    max: 99,
    step: 5,
  },
  {
    name: "targetStateOfChargePercent",
    label: "Typisches Ladeziel",
    helpText:
      "Batteriestand, bis zu dem das Fahrzeug üblicherweise geladen werden soll.",
    unit: "%",
    min: 1,
    max: 100,
    step: 5,
  },
  {
    name: "chargingPowerKw",
    label: "Wallbox-Ladeleistung",
    helpText:
      "Für die Modellrechnung angesetzte Ladeleistung. Fahrzeug, Hausanschluss und Installation können die nutzbare Leistung begrenzen.",
    unit: "kW",
    min: 2.3,
    max: 22,
    step: 0.1,
  },
  {
    name: "electricityPriceEuroPerKwh",
    label: "Netzstrompreis",
    helpText:
      "Angenommener Arbeitspreis des zu Hause bezogenen Netzstroms.",
    unit: "€/kWh",
    min: 0.01,
    max: 2,
    step: 0.01,
  },
] satisfies readonly WallboxNumberFieldContent[];

const advancedFields = [
  {
    name: "chargingEfficiencyPercent",
    label: "Ladewirkungsgrad",
    helpText:
      "Modellierter Anteil der bezogenen Energie, der in der Fahrzeugbatterie ankommt.",
    unit: "%",
    min: 70,
    max: 100,
    step: 1,
  },
  {
    name: "publicChargingPriceEuroPerKwh",
    label: "Vergleichspreis öffentliches Laden",
    helpText:
      "Veränderbarer Preiswert für den Vergleich mit derselben Energiemenge an einer öffentlichen Ladestation.",
    unit: "€/kWh",
    min: 0.01,
    max: 3,
    step: 0.01,
  },
  {
    name: "pvChargingSharePercent",
    label: "PV-Anteil beim Heimladen",
    helpText:
      "Geschätzter Anteil der Heimladeenergie, der direkt oder rechnerisch aus der eigenen Photovoltaikanlage stammt.",
    unit: "%",
    min: 0,
    max: 100,
    step: 5,
  },
  {
    name: "pvElectricityValueEuroPerKwh",
    label: "Wirtschaftlicher Wert des PV-Stroms",
    helpText:
      "Modellierter Wert des zum Laden verwendeten Solarstroms, beispielsweise als entgangener Einspeiseerlös.",
    unit: "€/kWh",
    min: 0,
    max: 2,
    step: 0.01,
  },
  {
    name: "wallboxCostEuro",
    label: "Wallbox-Kosten",
    helpText:
      "Veränderbare Kostenannahme für Wallbox und unmittelbar zugehörige Komponenten.",
    unit: "€",
    min: 0,
    max: 20_000,
    step: 100,
  },
  {
    name: "installationBaseCostEuro",
    label: "Grundkosten Installation",
    helpText:
      "Modellannahme für Montage, Leitungsweg, Absicherung, Prüfung und Inbetriebnahme.",
    unit: "€",
    min: 0,
    max: 100_000,
    step: 100,
  },
  {
    name: "fixedAdditionalCostEuro",
    label: "Weitere Projektkosten",
    helpText:
      "Zusätzliche Kostenannahme beispielsweise für Erdarbeiten, Lastmanagement oder Anpassungen der Elektroverteilung.",
    unit: "€",
    min: 0,
    max: 1_000_000,
    step: 100,
  },
  {
    name: "costUncertaintyPercent",
    label: "Kostenkorridor",
    helpText:
      "Prozentuale Abweichung oberhalb und unterhalb des errechneten Orientierungswertes.",
    unit: "%",
    min: 0,
    max: 50,
    step: 1,
  },
] satisfies readonly WallboxNumberFieldContent[];

export const wallboxCalculatorContent = {
  seo: {
    title:
      "Wallbox-Rechner: Ladezeit, Stromkosten und Installation | Energie-Kraft Süd",
    description:
      "Wallbox-Ladezeit, jährlichen Fahrstrombedarf, Heimladekosten, PV-Anteil und Installationskosten unverbindlich berechnen.",
    canonicalPath: "/rechner/wallbox-kosten",
  },

  breadcrumbLabel: "Wallbox-Rechner",

  hero: {
    eyebrow: "Ladezeit und Kosten",
    title:
      "Wallbox-Ladezeit und Heimladekosten berechnen",
    description:
      "Ermitteln Sie anhand von Fahrleistung, Fahrzeugverbrauch, Batterie, Ladeleistung und Strompreis eine erste Orientierung für Ladezeit, Energiebedarf und Projektkosten.",
  },

  primaryFields,
  advancedFields,

  recommendationContent: {
    basicCharging: {
      label: "Reduzierte Ladeleistung",
      description:
        "Die gewählte Leistung eignet sich im Modell für längere Standzeiten und einen vergleichsweise geringen täglichen Ladebedarf.",
    },

    standard11Kw: {
      label: "Wallbox bis 11 kW",
      description:
        "Die gewählte Leistung liegt im üblichen Modellbereich für regelmäßiges Laden zu Hause. Fahrzeug und Elektroinstallation müssen dazu passen.",
    },

    highPowerReview: {
      label: "Erhöhte Ladeleistung",
      description:
        "Die gewählte Leistung liegt über 11 kW. Hausanschluss, Lastmanagement, Fahrzeug und technische Voraussetzungen sollten besonders genau geprüft werden.",
    },
  },

  disclaimer:
    "Die Ergebnisse sind eine unverbindliche Modellrechnung. Tatsächliche Ladeleistung, Ladedauer und Kosten hängen unter anderem von Fahrzeug, Batterietemperatur, Ladezustand, Hausanschluss, Leitungsweg, Elektroverteilung, Lastmanagement, Stromtarif und Nutzerverhalten ab.",

  modelNotes: [
    "Der Fahrstrombedarf wird aus Jahresfahrleistung und durchschnittlichem Fahrzeugverbrauch berechnet.",
    "Ladeverluste werden über einen veränderbaren Wirkungsgrad berücksichtigt.",
    "PV- und Netzstrom werden über einen frei wählbaren PV-Anteil aufgeteilt.",
    "Die Ladedauer berücksichtigt keine fahrzeugseitige Leistungsreduzierung gegen Ende des Ladevorgangs.",
    "Förderungen, laufende Grundgebühren und zukünftige Strompreisänderungen sind nicht Bestandteil der Berechnung.",
  ],
} satisfies WallboxCalculatorPageContent;