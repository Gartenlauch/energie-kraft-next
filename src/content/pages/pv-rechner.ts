import type { CalculatorFieldContent, PvCalculatorPageContent } from "@/types/content";
import type { PvCalculatorInput } from "@/types/pv-calculator";

export const defaultPvCalculatorInput = {
  annualConsumptionKwh: 4_500,
  systemSizeKwp: 10,
  specificYieldKwhPerKwp: 1_000,
  selfConsumptionRatePercent: 35,
  electricityPriceEuroPerKwh: 0.32,
  feedInTariffEuroPerKwh: 0.08,
  netInvestmentCostEuro: 18_000,
  annualOperatingCostEuro: 200,
  annualDegradationPercent: 0.5,
  electricityPriceIncreasePercent: 2,
  calculationYears: 20,
} satisfies PvCalculatorInput;

const primaryFields = [
  {
    name: "annualConsumptionKwh",
    label: "Jährlicher Stromverbrauch",
    helpText: "Den bisherigen Jahresverbrauch finden Sie auf Ihrer letzten Stromabrechnung.",
    unit: "kWh/Jahr",
    min: 500,
    max: 100_000,
    step: 100,
  },
  {
    name: "systemSizeKwp",
    label: "Geplante Anlagenleistung",
    helpText: "Die Nennleistung der geplanten Photovoltaikanlage in Kilowatt-Peak.",
    unit: "kWp",
    min: 1,
    max: 1_000,
    step: 0.1,
  },
  {
    name: "selfConsumptionRatePercent",
    label: "Erwarteter Eigenverbrauch",
    helpText: "Anteil des erzeugten Solarstroms, der direkt im Gebäude genutzt wird.",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    name: "electricityPriceEuroPerKwh",
    label: "Aktueller Strompreis",
    helpText: "Arbeitspreis des Stromtarifs ohne feste Grundgebühren.",
    unit: "€/kWh",
    min: 0.01,
    max: 5,
    step: 0.01,
  },
  {
    name: "feedInTariffEuroPerKwh",
    label: "Einspeisevergütung",
    helpText: "Vergütung für Solarstrom, der in das öffentliche Netz eingespeist wird.",
    unit: "€/kWh",
    min: 0,
    max: 5,
    step: 0.01,
  },
  {
    name: "netInvestmentCostEuro",
    label: "Investitionskosten",
    helpText: "Voraussichtliche Kosten der Anlage nach bereits berücksichtigten Förderungen.",
    unit: "€",
    min: 1,
    max: 10_000_000,
    step: 100,
  },
] satisfies readonly CalculatorFieldContent[];

const advancedFields = [
  {
    name: "specificYieldKwhPerKwp",
    label: "Spezifischer Jahresertrag",
    helpText: "Erwartete Stromerzeugung je installiertem kWp im ersten Betriebsjahr.",
    unit: "kWh/kWp",
    min: 1,
    max: 2_500,
    step: 10,
  },
  {
    name: "annualOperatingCostEuro",
    label: "Jährliche Betriebskosten",
    helpText: "Geschätzte Kosten für Wartung, Versicherung und laufenden Betrieb.",
    unit: "€/Jahr",
    min: 0,
    max: 1_000_000,
    step: 10,
  },
  {
    name: "annualDegradationPercent",
    label: "Jährlicher Leistungsverlust",
    helpText: "Angenommener jährlicher Rückgang des erzeugten Solarstroms.",
    unit: "%",
    min: 0,
    max: 10,
    step: 0.1,
  },
  {
    name: "electricityPriceIncreasePercent",
    label: "Jährliche Strompreisänderung",
    helpText: "Angenommene jährliche Veränderung des Netzstrompreises.",
    unit: "%",
    min: -10,
    max: 20,
    step: 0.1,
  },
  {
    name: "calculationYears",
    label: "Betrachtungszeitraum",
    helpText: "Zeitraum, über den Erträge, Einsparungen und Kosten berechnet werden.",
    unit: "Jahre",
    min: 1,
    max: 35,
    step: 1,
  },
] satisfies readonly CalculatorFieldContent[];

export const pvCalculatorContent = {
  seo: {
    title: "PV-Rechner: Rendite und Amortisation berechnen | Energie-Kraft Süd",
    description:
      "PV-Rechner für Photovoltaikanlagen: Ertrag, Eigenverbrauch, Stromkostenersparnis, Einspeiseerlöse, Rendite und Amortisationszeit unverbindlich berechnen.",
    canonicalPath: "/rechner/photovoltaik",
  },

  breadcrumbLabel: "PV-Rechner",

  hero: {
    eyebrow: "Photovoltaik-Wirtschaftlichkeit",
    title: "PV-Rendite und Amortisation online berechnen",
    description:
      "Ermitteln Sie anhand Ihrer Verbrauchs-, Anlagen- und Kostendaten eine erste unverbindliche Projektion für Solarertrag, Stromkostenersparnis und wirtschaftliche Amortisation.",
  },

  primaryFields,
  advancedFields,

  disclaimer:
    "Die Berechnung ist eine unverbindliche Modellrechnung und ersetzt keine individuelle Planung oder Wirtschaftlichkeitsberatung. Tatsächliche Erträge und Kosten hängen unter anderem von Dachausrichtung, Verschattung, Anlagenkomponenten, Verbrauchsprofil, Tarifentwicklung, steuerlicher Behandlung und technischen Verlusten ab.",
} satisfies PvCalculatorPageContent;
