import type {
    ClimateCalculatorInput,
} from "@/types/climate-calculator";

export const DEFAULT_CLIMATE_CALCULATOR_INPUT = {
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