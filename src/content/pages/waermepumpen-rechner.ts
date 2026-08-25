import type { SeoContent } from "@/types/content";
import type {
  HeatPumpFlowTemperatureAssessment,
  HeatPumpNumericInputKey,
} from "@/types/heat-pump-calculator";
import {
  DEFAULT_HEAT_PUMP_CALCULATOR_INPUT,
} from "@/lib/calculators/heat-pump-model";


export interface HeatPumpNumberFieldContent {
  name: HeatPumpNumericInputKey;
  label: string;
  helpText: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

interface HeatPumpAssessmentContent {
  label: string;
  description: string;
}

interface HeatPumpCalculatorPageContent {
  seo: SeoContent;

  breadcrumbLabel: string;

  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };

  primaryFields: readonly HeatPumpNumberFieldContent[];
  advancedFields: readonly HeatPumpNumberFieldContent[];

  assessmentContent: Record<
    HeatPumpFlowTemperatureAssessment,
    HeatPumpAssessmentContent
  >;

  disclaimer: string;
  modelNotes: readonly string[];
}

export const defaultHeatPumpCalculatorInput = DEFAULT_HEAT_PUMP_CALCULATOR_INPUT;

const primaryFields = [
  {
    name: "heatedAreaM2",
    label: "Beheizte Fläche",
    helpText:
      "Wohn- oder Nutzfläche, die durch die Wärmepumpe beheizt werden soll.",
    unit: "m²",
    min: 20,
    max: 5_000,
    step: 1,
  },
  {
    name: "specificSpaceHeatingDemandKwhPerM2Year",
    label: "Spezifischer Raumwärmebedarf",
    helpText:
      "Modellierter jährlicher Wärmebedarf des Gebäudes je beheiztem Quadratmeter.",
    unit: "kWh/m²",
    min: 10,
    max: 400,
    step: 5,
  },
  {
    name: "occupancyPersons",
    label: "Anzahl der Personen",
    helpText:
      "Personenzahl für die überschlägige Warmwasserberechnung.",
    unit: "Personen",
    min: 1,
    max: 100,
    step: 1,
  },
  {
    name: "requiredFlowTemperatureC",
    label: "Benötigte Vorlauftemperatur",
    helpText:
      "Höchste voraussichtlich erforderliche Vorlauftemperatur des Heizsystems an kalten Tagen.",
    unit: "°C",
    min: 25,
    max: 80,
    step: 1,
  },
  {
    name: "annualPerformanceFactor",
    label: "Erwartete Jahresarbeitszahl",
    helpText:
      "Verhältnis der erzeugten Wärmemenge zur eingesetzten elektrischen Energie.",
    unit: "JAZ",
    min: 2,
    max: 7,
    step: 0.1,
  },
  {
    name: "electricityPriceEuroPerKwh",
    label: "Wärmepumpen-Strompreis",
    helpText:
      "Angenommener Arbeitspreis für den von der Wärmepumpe verbrauchten Strom.",
    unit: "€/kWh",
    min: 0.01,
    max: 2,
    step: 0.01,
  },
] satisfies readonly HeatPumpNumberFieldContent[];

const advancedFields = [
  {
    name: "hotWaterDemandKwhPerPersonYear",
    label: "Warmwasserbedarf je Person",
    helpText:
      "Modellierter jährlicher Wärmebedarf für Warmwasser je Person.",
    unit: "kWh/Jahr",
    min: 0,
    max: 3_000,
    step: 50,
  },
  {
    name: "equivalentFullLoadHours",
    label: "Äquivalente Volllaststunden",
    helpText:
      "Modellannahme zur überschlägigen Ableitung der erforderlichen thermischen Leistung.",
    unit: "h/Jahr",
    min: 1_000,
    max: 3_500,
    step: 50,
  },
  {
    name: "capacityReservePercent",
    label: "Leistungsreserve",
    helpText:
      "Zusätzliche Modellreserve vor der Aufrundung auf die empfohlene Leistung.",
    unit: "%",
    min: 0,
    max: 50,
    step: 1,
  },
  {
    name: "currentHeatingEnergyPriceEuroPerKwh",
    label: "Energiepreis bestehende Heizung",
    helpText:
      "Angenommener Preis je Kilowattstunde des derzeit verwendeten Energieträgers.",
    unit: "€/kWh",
    min: 0.01,
    max: 2,
    step: 0.01,
  },
  {
    name: "currentHeatingEfficiencyPercent",
    label: "Wirkungsgrad bestehende Heizung",
    helpText:
      "Modellierter Anteil der eingekauften Energie, der als nutzbare Wärme zur Verfügung steht.",
    unit: "%",
    min: 30,
    max: 100,
    step: 1,
  },
  {
    name: "heatPumpCostEuroPerKw",
    label: "Wärmepumpenkosten je kW",
    helpText:
      "Veränderbare Kostenannahme je kW empfohlener thermischer Leistung.",
    unit: "€/kW",
    min: 200,
    max: 10_000,
    step: 50,
  },
  {
    name: "installationBaseCostEuro",
    label: "Grundkosten Installation",
    helpText:
      "Modellannahme für Installation, hydraulische Einbindung und Inbetriebnahme.",
    unit: "€",
    min: 0,
    max: 1_000_000,
    step: 500,
  },
  {
    name: "fixedAdditionalCostEuro",
    label: "Weitere Projektkosten",
    helpText:
      "Zusätzliche Kosten beispielsweise für Heizkörper, Speicher, Elektroarbeiten oder Nebenarbeiten.",
    unit: "€",
    min: 0,
    max: 1_000_000,
    step: 500,
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
] satisfies readonly HeatPumpNumberFieldContent[];

export const heatPumpCalculatorContent = {
  seo: {
    title:
      "Wärmepumpen-Rechner: Leistung, Verbrauch und Kosten | Energie-Kraft Süd",
    description:
      "Wärmepumpenleistung, Stromverbrauch, Heizkostenvergleich und Investitionskosten unverbindlich anhand von Fläche, Wärmebedarf, JAZ und Vorlauftemperatur berechnen.",
    canonicalPath: "/rechner/waermepumpe-kosten",
  },

  breadcrumbLabel: "Wärmepumpen-Rechner",

  hero: {
    eyebrow: "Wärmepumpen-Eignung und Kosten",
    title:
      "Wärmepumpe dimensionieren und Betriebskosten vergleichen",
    description:
      "Ermitteln Sie anhand von beheizter Fläche, Wärmebedarf, Vorlauftemperatur und veränderbaren Kostenannahmen eine erste Orientierung für Wärmepumpenleistung, Stromverbrauch und Projektkosten.",
  },

  primaryFields,
  advancedFields,

  assessmentContent: {
    ntReady: {
      label: "Niedertemperatur-ready",
      description:
        "Die angegebene Vorlauftemperatur liegt im Modell bei höchstens 55 °C. Für eine belastbare Beurteilung müssen Heizlast und Heizflächen dennoch raumweise geprüft werden.",
    },

    individualReview: {
      label: "Individuelle Prüfung erforderlich",
      description:
        "Die angegebene Vorlauftemperatur liegt über 55 °C. Heizflächen, hydraulischer Abgleich und mögliche Maßnahmen am Gebäude oder Heizsystem sollten genauer geprüft werden.",
    },
  },

  disclaimer:
    "Die Ergebnisse sind eine unverbindliche Modellrechnung und ersetzen weder eine Heizlastberechnung nach den geltenden technischen Regeln noch eine Vor-Ort-Prüfung, Energieberatung oder ein verbindliches Angebot.",

  modelNotes: [
    "Der Raumwärmebedarf wird aus beheizter Fläche und einem veränderbaren spezifischen Jahreswert berechnet.",
    "Warmwasser wird über einen veränderbaren Wärmebedarf je Person ergänzt.",
    "Die Wärmepumpenleistung wird überschlägig aus Jahreswärmebedarf, Volllaststunden und Leistungsreserve abgeleitet.",
    "Der Heizkostenvergleich berücksichtigt nur Energiemenge und Energiepreis, nicht jedoch Wartung, Grundgebühren oder Finanzierung.",
    "Förderungen, Steuern und zukünftige Preisänderungen sind nicht Bestandteil der Berechnung.",
  ],
} satisfies HeatPumpCalculatorPageContent;