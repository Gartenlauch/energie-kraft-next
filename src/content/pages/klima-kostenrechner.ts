import type { SeoContent } from "@/types/content";
import type {
  ClimateCalculatorInput,
  ClimateInsulationLevel,
  ClimateNumericInputKey,
  ClimateSolarLoad,
} from "@/types/climate-calculator";

export interface ClimateNumberFieldContent {
  name: ClimateNumericInputKey;
  label: string;
  helpText: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface ClimateOptionContent<Value extends string> {
  value: Value;
  label: string;
}

interface ClimateCalculatorPageContent {
  seo: SeoContent;

  breadcrumbLabel: string;

  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };

  primaryFields: readonly ClimateNumberFieldContent[];
  advancedFields: readonly ClimateNumberFieldContent[];

  insulationOptions: readonly ClimateOptionContent<ClimateInsulationLevel>[];
  solarLoadOptions: readonly ClimateOptionContent<ClimateSolarLoad>[];

  disclaimer: string;
  modelNotes: readonly string[];
}

export const defaultClimateCalculatorInput = {
  conditionedAreaM2: 80,
  roomCount: 4,
  ceilingHeightM: 2.5,
  insulationLevel: "average",
  solarLoad: "medium",
  occupancyPersons: 4,
  internalHeatLoadWatt: 500,
  annualEquivalentFullLoadHours: 500,
  seasonalEfficiencySeer: 6.5,
  electricityPriceEuroPerKwh: 0.32,
  equipmentCostEuroPerKw: 800,
  indoorUnitCostEuro: 800,
  installationBaseCostEuro: 2_500,
  installationCostPerIndoorUnitEuro: 700,
  fixedAdditionalCostEuro: 500,
  costUncertaintyPercent: 15,
} satisfies ClimateCalculatorInput;

const primaryFields = [
  {
    name: "conditionedAreaM2",
    label: "Zu klimatisierende Fläche",
    helpText: "Gesamte Fläche der Räume, die durch das Klimasystem gekühlt werden sollen.",
    unit: "m²",
    min: 10,
    max: 2_000,
    step: 1,
  },
  {
    name: "roomCount",
    label: "Anzahl der Räume",
    helpText: "Anzahl der getrennten Räume oder Zonen, die klimatisiert werden sollen.",
    unit: "Räume",
    min: 1,
    max: 30,
    step: 1,
  },
  {
    name: "ceilingHeightM",
    label: "Mittlere Raumhöhe",
    helpText: "Durchschnittliche lichte Höhe der zu klimatisierenden Räume.",
    unit: "m",
    min: 2,
    max: 5,
    step: 0.1,
  },
  {
    name: "occupancyPersons",
    label: "Üblicherweise anwesende Personen",
    helpText:
      "Durchschnittliche Anzahl der Personen, die sich gleichzeitig in den Räumen aufhalten.",
    unit: "Personen",
    min: 1,
    max: 200,
    step: 1,
  },
] satisfies readonly ClimateNumberFieldContent[];

const advancedFields = [
  {
    name: "internalHeatLoadWatt",
    label: "Zusätzliche interne Wärmelast",
    helpText:
      "Wärmeeintrag durch Computer, Maschinen, Beleuchtung und sonstige elektrische Geräte.",
    unit: "W",
    min: 0,
    max: 50_000,
    step: 100,
  },
  {
    name: "annualEquivalentFullLoadHours",
    label: "Jährliche Kühl-Volllaststunden",
    helpText: "Modellannahme für die jährliche Nutzung im Kühlbetrieb.",
    unit: "h/Jahr",
    min: 100,
    max: 3_000,
    step: 50,
  },
  {
    name: "seasonalEfficiencySeer",
    label: "Saisonale Effizienz",
    helpText:
      "Modellierter SEER-Wert für das Verhältnis von Kühlenergie zu eingesetzter elektrischer Energie.",
    unit: "SEER",
    min: 3,
    max: 12,
    step: 0.1,
  },
  {
    name: "electricityPriceEuroPerKwh",
    label: "Strompreis",
    helpText: "Angenommener Arbeitspreis des Stromtarifs ohne feste Grundgebühren.",
    unit: "€/kWh",
    min: 0.05,
    max: 2,
    step: 0.01,
  },
  {
    name: "equipmentCostEuroPerKw",
    label: "Anlagenkosten je kW",
    helpText: "Veränderbare Modellannahme für die technische Anlage je kW Kühlleistung.",
    unit: "€/kW",
    min: 200,
    max: 5_000,
    step: 50,
  },
  {
    name: "indoorUnitCostEuro",
    label: "Kosten je Innengerät",
    helpText: "Zusätzliche Kostenannahme für jedes erforderliche Innengerät.",
    unit: "€/Gerät",
    min: 0,
    max: 5_000,
    step: 50,
  },
  {
    name: "installationBaseCostEuro",
    label: "Grundkosten Installation",
    helpText:
      "Modellannahme für Planung, Außengerät, Inbetriebnahme und grundlegende Montagearbeiten.",
    unit: "€",
    min: 0,
    max: 100_000,
    step: 100,
  },
  {
    name: "installationCostPerIndoorUnitEuro",
    label: "Montagekosten je Innengerät",
    helpText: "Zusätzliche Kostenannahme für Leitungen, Montage und Anschluss je Innengerät.",
    unit: "€/Gerät",
    min: 0,
    max: 10_000,
    step: 50,
  },
  {
    name: "fixedAdditionalCostEuro",
    label: "Weitere Projektkosten",
    helpText: "Zusätzliche Kostenannahme für projektspezifische Nebenarbeiten.",
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
] satisfies readonly ClimateNumberFieldContent[];

export const climateCalculatorContent = {
  seo: {
    title: "Klimaanlagen-Kostenrechner: Leistung und Kosten schätzen | Energie-Kraft Süd",
    description:
      "Kühlleistung und Kosten einer Klimaanlage unverbindlich schätzen: Fläche, Räume, Dämmung, Sonneneinstrahlung, Stromverbrauch und Kostenkorridor berechnen.",
    canonicalPath: "/rechner/klimaanlage-kosten",
  },

  breadcrumbLabel: "Klimaanlagen-Kostenrechner",

  hero: {
    eyebrow: "Kühlleistung und Kosten",
    title: "Klimaanlage dimensionieren und Kosten unverbindlich schätzen",
    description:
      "Ermitteln Sie anhand von Raumfläche, Gebäudezustand, Sonneneinstrahlung und veränderbaren Kostenannahmen eine erste Orientierung für Kühlleistung, Systemaufbau, Stromverbrauch und Projektkosten.",
  },

  primaryFields,
  advancedFields,

  insulationOptions: [
    {
      value: "good",
      label: "Gute Dämmung oder moderner Gebäudezustand",
    },
    {
      value: "average",
      label: "Durchschnittlicher Gebäudezustand",
    },
    {
      value: "weak",
      label: "Schwache Dämmung oder hoher Wärmeeintrag",
    },
  ],

  solarLoadOptions: [
    {
      value: "low",
      label: "Gering – wenig direkte Sonne",
    },
    {
      value: "medium",
      label: "Mittel – zeitweise direkte Sonne",
    },
    {
      value: "high",
      label: "Hoch – große oder stark besonnte Fensterflächen",
    },
  ],

  disclaimer:
    "Die Ergebnisse sind eine unverbindliche Modellrechnung und keine technische Kühllastberechnung oder ein Angebot. Für eine belastbare Dimensionierung müssen Raumaufteilung, Fensterflächen, Himmelsrichtung, Verschattung, Bauweise, Leitungswege, Nutzungszeiten und konkrete Geräte vor Ort geprüft werden.",

  modelNotes: [
    "Der Gebäudezustand wird über vereinfachte flächenbezogene Lastwerte berücksichtigt.",
    "Raumhöhe, Sonneneinstrahlung, Personen und elektrische Geräte erhöhen oder reduzieren die Modelllast.",
    "Die empfohlene Kühlleistung enthält eine Modellreserve und wird auf 0,5 kW aufgerundet.",
    "Die Anzahl der Innengeräte entspricht zunächst der angegebenen Anzahl getrennter Räume.",
    "Stromverbrauch und Kosten hängen in der Praxis stark von Nutzung, Solltemperatur, Wetter und Geräteeffizienz ab.",
  ],
} satisfies ClimateCalculatorPageContent;
