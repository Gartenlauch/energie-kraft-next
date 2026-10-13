import { describe, expect, it } from "vitest";
import { buildHeatPumpConfiguratorResult } from "@/lib/configurator/heat-pump";
import { calculateProjectEconomics } from "@/lib/configurator/project-economics";
import { configuratorSettingsSchema, DEFAULT_CONFIGURATOR_SETTINGS, resolveConfiguratorSettingsOrDefaults } from "@/lib/configurator/settings-model";
import { createInitialConfiguratorState } from "@/lib/configurator/state";
import { projectEconomicsSchema } from "@/lib/validation/configurator/economics";

function heatingProject(system: "gas" | "oil" | "new_build" | "other_unknown", gasRate = 3, oilRate = 3, electricityRate = 2) {
  const settings = structuredClone(DEFAULT_CONFIGURATOR_SETTINGS);
  Object.assign(settings.economics, {
    gasPriceDevelopmentPercent: gasRate, oilPriceDevelopmentPercent: oilRate,
    electricityPriceDevelopmentPercent: electricityRate,
  });
  const state = createInitialConfiguratorState(settings);
  state.heatPump = {
    existingHeatingSystem: system, annualGasConsumptionKwh: 30000, annualOilConsumptionLitres: 3000,
    heatedAreaM2: 160, specificSpaceHeatingDemandKwhPerM2Year: 90,
    occupancyPersons: 4, requiredFlowTemperatureC: 50, annualPerformanceFactor: 3.5,
  };
  state.results.heatPump = buildHeatPumpConfiguratorResult(state)!;
  return state;
}

describe("heating price development settings and compatibility", () => {
  it("defaults only missing fields and retains all legacy settings", () => {
    const { gasPriceDevelopmentPercent: _gas, oilPriceDevelopmentPercent: _oil, ...economics } = DEFAULT_CONFIGURATOR_SETTINGS.economics;
    const legacy = { ...DEFAULT_CONFIGURATOR_SETTINGS, version: 17, economics: { ...economics, gridElectricityPriceEuroPerKwh: 0.44 } };
    expect(resolveConfiguratorSettingsOrDefaults(legacy)).toEqual({
      ...legacy, economics: { ...legacy.economics, gasPriceDevelopmentPercent: 3, oilPriceDevelopmentPercent: 3 },
    });
  });

  it.each(["gasPriceDevelopmentPercent", "oilPriceDevelopmentPercent"] as const)("validates %s independently", (field) => {
    for (const invalid of [-10.01, 20.01, NaN, Infinity, "3", null]) {
      const settings = { ...DEFAULT_CONFIGURATOR_SETTINGS, economics: { ...DEFAULT_CONFIGURATOR_SETTINGS.economics, [field]: invalid } };
      expect(configuratorSettingsSchema.safeParse(settings).success).toBe(false);
    }
    for (const valid of [-10, 0, 3.25, 20]) {
      expect(configuratorSettingsSchema.parse({ ...DEFAULT_CONFIGURATOR_SETTINGS,
        economics: { ...DEFAULT_CONFIGURATOR_SETTINGS.economics, [field]: valid },
      }).economics[field]).toBe(valid);
    }
  });
});

describe("canonical compounded heating costs", () => {
  const cents = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

  it.each(["gas", "oil"] as const)("keeps %s prices constant at zero percent", (system) => {
    const state = heatingProject(system, 0, 0, 0);
    const heating = calculateProjectEconomics(state).heating!;
    expect(heating.annualProjections!.every((row) => row.currentAnnualEuro === heating.currentAnnualEuro && row.heatPumpAnnualEuro === heating.heatPumpAnnualEuro)).toBe(true);
    expect(heating.saving10YearsEuro).toBe(cents(heating.annualSavingEuro! * 10));
    expect(heating.saving20YearsEuro).toBe(cents(heating.annualSavingEuro! * 20));
  });

  it.each([
    ["gas", 3, 7, 3], ["oil", 7, 3, 3],
    ["gas", 0, 7, 0], ["oil", 7, 0, 0],
    ["gas", 1.5, 6.25, 1.5], ["oil", 1.5, 6.25, 6.25],
    ["new_build", 1.5, 6.25, 6.25],
  ] as const)("compounds only the appropriate reference fuel for %s (%s / %s)", (system, gas, oil, rate) => {
    const state = heatingProject(system, gas, oil, 2);
    const economics = calculateProjectEconomics(state);
    const heating = economics.heating!;
    expect(projectEconomicsSchema.safeParse(economics).success).toBe(true);
    expect(heating.annualSavingEuro).toBe(state.results.heatPump!.annualOperatingCostDifferenceEuro);
    for (const year of [1, 2, 3, 10, 20]) {
      const row = heating.annualProjections![year - 1]!;
      expect(row.currentAnnualEuro).toBe(cents(heating.currentAnnualEuro! * (1 + rate / 100) ** (year - 1)));
      expect(row.heatPumpAnnualEuro).toBe(cents(heating.heatPumpAnnualEuro * 1.02 ** (year - 1)));
      const prior = heating.annualProjections!.slice(0, year);
      expect(row.cumulativeCurrentEuro).toBe(cents(prior.reduce((sum, entry) => sum + entry.currentAnnualEuro!, 0)));
      expect(row.cumulativeHeatPumpEuro).toBe(cents(prior.reduce((sum, entry) => sum + entry.heatPumpAnnualEuro, 0)));
      expect(row.cumulativeSavingEuro).toBe(cents(prior.reduce((sum, entry) => sum + entry.annualSavingEuro!, 0)));
    }
    expect(heating.saving10YearsEuro).toBe(heating.annualProjections![9]!.cumulativeSavingEuro);
    expect(heating.saving20YearsEuro).toBe(heating.annualProjections![19]!.cumulativeSavingEuro);
    expect(economics.investmentBaseEuro).toBe(state.results.heatPump!.estimatedTotalCostEuro);
  });

  it("preserves unavailable comparisons and reads historical results without annual projections", () => {
    const economics = calculateProjectEconomics(heatingProject("other_unknown"));
    expect(economics.heating!.saving20YearsEuro).toBeNull();
    expect(economics.heating!.annualProjections!.every((row) => row.currentAnnualEuro === null && row.cumulativeSavingEuro === null)).toBe(true);
    const legacy = calculateProjectEconomics(heatingProject("gas"));
    delete legacy.heating!.annualProjections;
    expect(projectEconomicsSchema.parse(legacy).heating).toEqual(legacy.heating);
  });
});
