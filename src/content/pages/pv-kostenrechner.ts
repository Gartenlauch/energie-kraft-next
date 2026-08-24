import type { SeoContent } from "@/types/content";
import type {
  PvRoofOrientation,
  PvShadingLevel,
  PvSizingCalculatorInput,
  PvSizingNumericInputKey,
} from "@/types/pv-sizing-calculator";
import {
  PV_DEFAULT_BASE_SPECIFIC_YIELD_KWH_PER_KWP,
  PV_DEFAULT_TARGET_GENERATION_COVERAGE_PERCENT,
} from "@/lib/calculators/pv-model";


export interface PvSizingNumberFieldContent {
  name: PvSizingNumericInputKey;
  label: string;
  helpText: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface PvSizingOptionContent<Value extends string> {
  value: Value;
  label: string;
}

interface PvSizingCalculatorPageContent {
  seo: SeoContent;

  breadcrumbLabel: string;

  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };

  primaryFields: readonly PvSizingNumberFieldContent[];
  advancedFields: readonly PvSizingNumberFieldContent[];

  orientationOptions: readonly PvSizingOptionContent<PvRoofOrientation>[];
  shadingOptions: readonly PvSizingOptionContent<PvShadingLevel>[];

  batteryField: {
    label: string;
    helpText: string;
  };

  disclaimer: string;
  modelNotes: readonly string[];
}

export const defaultPvSizingCalculatorInput = {
  annualConsumptionKwh: 4_500,
  availableRoofAreaM2: 55,
  roofOrientation: "south",
  shadingLevel: "none",
  targetGenerationCoveragePercent: PV_DEFAULT_TARGET_GENERATION_COVERAGE_PERCENT,
  modulePowerWattPeak: 440,
  moduleAreaM2: 2,
  usableRoofAreaPercent: 80,
  baseSpecificYieldKwhPerKwp: PV_DEFAULT_BASE_SPECIFIC_YIELD_KWH_PER_KWP,
  pvCostEuroPerKwp: 1_500,
  includeBattery: true,
  batteryCostEuroPerKwh: 700,
  batteryCapacityPerKwp: 1,
  fixedAdditionalCostEuro: 2_000,
  costUncertaintyPercent: 15,
} satisfies PvSizingCalculatorInput;

const primaryFields = [
  {
    name: "annualConsumptionKwh",
    label: "Jährlicher Stromverbrauch",
    helpText:
      "Den Jahresverbrauch finden Sie auf Ihrer Stromabrechnung. Zukünftige Verbraucher können bereits hinzugerechnet werden.",
    unit: "kWh/Jahr",
    min: 500,
    max: 100_000,
    step: 100,
  },
  {
    name: "availableRoofAreaM2",
    label: "Verfügbare Dachfläche",
    helpText: "Gesamte Dachfläche, die grundsätzlich für Photovoltaik infrage kommt.",
    unit: "m²",
    min: 5,
    max: 10_000,
    step: 1,
  },
  {
    name: "targetGenerationCoveragePercent",
    label: "Gewünschte Jahreserzeugung",
    helpText:
      "Zielwert der jährlichen PV-Erzeugung im Verhältnis zum aktuellen Jahresstromverbrauch.",
    unit: "%",
    min: 50,
    max: 200,
    step: 5,
  },
  {
    name: "pvCostEuroPerKwp",
    label: "Angenommene PV-Kosten",
    helpText:
      "Veränderbare Kostenannahme je installiertem kWp ohne den separat berechneten Speicher.",
    unit: "€/kWp",
    min: 500,
    max: 5_000,
    step: 50,
  },
] satisfies readonly PvSizingNumberFieldContent[];

const advancedFields = [
  {
    name: "modulePowerWattPeak",
    label: "Modulleistung",
    helpText: "Nennleistung eines einzelnen Photovoltaikmoduls.",
    unit: "Wp",
    min: 250,
    max: 700,
    step: 5,
  },
  {
    name: "moduleAreaM2",
    label: "Modulfläche",
    helpText:
      "Ungefähre Fläche eines einzelnen Moduls einschließlich des erforderlichen Platzbedarfs.",
    unit: "m²",
    min: 1,
    max: 4,
    step: 0.1,
  },
  {
    name: "usableRoofAreaPercent",
    label: "Nutzbarer Dachflächenanteil",
    helpText: "Berücksichtigt Ränder, Abstände, Dachfenster, Kamine und sonstige Hindernisse.",
    unit: "%",
    min: 20,
    max: 100,
    step: 1,
  },
  {
    name: "baseSpecificYieldKwhPerKwp",
    label: "Basis-Jahresertrag",
    helpText:
      "Modellierter Jahresertrag je kWp vor Berücksichtigung von Ausrichtung und Verschattung.",
    unit: "kWh/kWp",
    min: 500,
    max: 2_000,
    step: 10,
  },
  {
    name: "batteryCostEuroPerKwh",
    label: "Angenommene Speicherkosten",
    helpText: "Veränderbare Kostenannahme je nutzbarer Kilowattstunde Speicherkapazität.",
    unit: "€/kWh",
    min: 100,
    max: 3_000,
    step: 50,
  },
  {
    name: "batteryCapacityPerKwp",
    label: "Speichergröße je kWp",
    helpText: "Modellannahme für die unverbindliche Speicherempfehlung.",
    unit: "kWh/kWp",
    min: 0.25,
    max: 2.5,
    step: 0.05,
  },
  {
    name: "fixedAdditionalCostEuro",
    label: "Weitere Projektkosten",
    helpText: "Zusätzliche Kostenannahme beispielsweise für projektabhängige Nebenarbeiten.",
    unit: "€",
    min: 0,
    max: 1_000_000,
    step: 100,
  },
  {
    name: "costUncertaintyPercent",
    label: "Kostenkorridor",
    helpText: "Prozentuale Abweichung oberhalb und unterhalb des errechneten Orientierungswertes.",
    unit: "%",
    min: 0,
    max: 50,
    step: 1,
  },
] satisfies readonly PvSizingNumberFieldContent[];

export const pvSizingCalculatorContent = {
  seo: {
    title: "PV-Kostenrechner: Größe und Kosten schätzen | Energie-Kraft Süd",
    description:
      "PV-Anlagengröße und Kosten online schätzen: Dachfläche, Stromverbrauch, Ausrichtung, Verschattung, Modulanzahl, Speichergröße und Kostenkorridor berechnen.",
    canonicalPath: "/rechner/photovoltaik-kosten",
  },

  breadcrumbLabel: "PV-Kostenrechner",

  hero: {
    eyebrow: "PV-Anlagengröße und Kosten",
    title: "Photovoltaikanlage dimensionieren und Kosten schätzen",
    description:
      "Ermitteln Sie anhand von Stromverbrauch, Dachfläche, Ausrichtung und veränderbaren Kostenannahmen eine erste unverbindliche Orientierung für Modulanzahl, Anlagenleistung, Jahresertrag, Speichergröße und Projektkosten.",
  },

  primaryFields,
  advancedFields,

  orientationOptions: [
    {
      value: "south",
      label: "Süd",
    },
    {
      value: "southEastSouthWest",
      label: "Südost oder Südwest",
    },
    {
      value: "eastWest",
      label: "Ost-West",
    },
    {
      value: "north",
      label: "Nordorientiert",
    },
  ],

  shadingOptions: [
    {
      value: "none",
      label: "Keine erkennbare Verschattung",
    },
    {
      value: "light",
      label: "Geringe zeitweise Verschattung",
    },
    {
      value: "medium",
      label: "Mittlere Verschattung",
    },
    {
      value: "strong",
      label: "Starke Verschattung",
    },
  ],

  batteryField: {
    label: "Stromspeicher berücksichtigen",
    helpText:
      "Aktiviert eine vereinfachte Speicherempfehlung und berücksichtigt die angenommenen Speicherkosten.",
  },

  disclaimer:
    "Die Ergebnisse sind eine unverbindliche Modellrechnung und kein Angebot. Eine belastbare Planung erfordert eine technische Dachaufnahme, eine standortbezogene Ertragsprognose, ein konkretes Verbrauchsprofil sowie die Auswahl der tatsächlich verwendeten Komponenten.",

  modelNotes: [
    "Ausrichtung und Verschattung werden mit vereinfachten Modellfaktoren berücksichtigt.",
    "Die Anlagenleistung wird auf vollständige Module aufgerundet und durch die nutzbare Dachfläche begrenzt.",
    "Die Speichergröße ist eine erste Orientierung und ersetzt keine Analyse des täglichen Lastprofils.",
    "Kosten, Förderungen, Netzanschluss, Steuern und projektspezifische Arbeiten müssen vor einer Investitionsentscheidung individuell geprüft werden.",
  ],
} satisfies PvSizingCalculatorPageContent;
