import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  generateConfiguratorProjectPdf,
  getComfortPdfCopy,
  getConfiguratorReportSections,
  getSolarReturnDisplay,
  getSolarPdfCopy,
} from "../../functions/src/configurator-project-pdf";
import { configuratorLeadPayloadSchema } from "../../functions/src/configurator-lead-validation";
import { applyAuthoritativeConfiguratorModel } from "../../functions/src/configurator-server-model";
import { DEFAULT_CONFIGURATOR_SETTINGS } from "@/lib/configurator/settings-model";
import { buildBatteryStorageConfiguratorResult } from "@/lib/configurator/battery-storage";
import { buildClimateConfiguratorResult } from "@/lib/configurator/climate";
import { buildHeatPumpConfiguratorResult } from "@/lib/configurator/heat-pump";
import { buildConfiguratorLeadInput } from "@/lib/configurator/lead";
import { buildPhotovoltaicConfiguratorResult } from "@/lib/configurator/photovoltaic";
import {
  createInitialConfiguratorState,
  normalizeConfiguratorState,
} from "@/lib/configurator/state";
import { buildWallboxConfiguratorResult } from "@/lib/configurator/wallbox";
import type { ConfiguratorState } from "@/types/configurator";
import { buildForwardedLeadMail } from "../../functions/src/admin-submission-actions";
import { pvOperatingCostRows } from "../../functions/src/operating-cost-presentation";

function baseJourney(entryPoint: "photovoltaic" | "heat_pump") {
  return {
    entryPoint,
    selectedProducts: [],
    completedProducts: [],
    additionalSolutionsReviewed: true,
  };
}

function createPvOnlyProject(): ConfiguratorState {
  const state: ConfiguratorState = {
    ...createInitialConfiguratorState(),
    activeConfigurator: "photovoltaic",
    journey: baseJourney("photovoltaic"),
    household: {
      persons: 3,
      annualConsumptionKwh: 4_500,
      futureIncreasePercent: 10,
      projectedConsumptionKwh: 4_950,
    },
    building: { ownership: "owner", type: "detached_house" },
    roof: {
      pitch: 30,
      material: "roof_tile",
      orientation: "south",
      renovationPeriod: "after_1990",
    },
    notes: { hasNotes: false },
  };
  const photovoltaic = buildPhotovoltaicConfiguratorResult(state);
  if (!photovoltaic) throw new Error("PV fixture failed");
  return normalizeConfiguratorState({ ...state, results: { photovoltaic } });
}

function createHeatPumpOnlyProject(): ConfiguratorState {
  const state: ConfiguratorState = {
    ...createInitialConfiguratorState(),
    activeConfigurator: "heat_pump",
    journey: baseJourney("heat_pump"),
    heatPump: {
      existingHeatingSystem: "oil",
      annualOilConsumptionLitres: 2_000,
      heatedAreaM2: 160,
      specificSpaceHeatingDemandKwhPerM2Year: 90,
      occupancyPersons: 4,
      requiredFlowTemperatureC: 50,
      annualPerformanceFactor: 3.5,
    },
  };
  const heatPump = buildHeatPumpConfiguratorResult(state);
  if (!heatPump) throw new Error("Heat-pump fixture failed");
  return normalizeConfiguratorState({ ...state, results: { heatPump } });
}

function createPvStorageProject(): ConfiguratorState {
  const state: ConfiguratorState = {
    ...createPvOnlyProject(),
    interests: { ...createPvOnlyProject().interests, batteryStorage: true },
    batteryStorage: {
      consumptionPattern: "mixed",
      backupPreference: "selected_loads",
      goal: "balanced",
    },
  };
  const batteryStorage = buildBatteryStorageConfiguratorResult(state);
  if (!batteryStorage) throw new Error("Storage fixture failed");
  return normalizeConfiguratorState({
    ...state,
    results: { ...state.results, batteryStorage },
  });
}

function createCompleteProject(): ConfiguratorState {
  let state: ConfiguratorState = {
    ...createPvOnlyProject(),
    interests: {
      photovoltaic: false,
      batteryStorage: true,
      wallbox: true,
      heatPump: true,
      climate: true,
    },
    batteryStorage: {
      consumptionPattern: "mixed",
      backupPreference: "selected_loads",
      goal: "balanced",
    },
    heatPump: {
      existingHeatingSystem: "gas",
      heatedAreaM2: 160,
      specificSpaceHeatingDemandKwhPerM2Year: 90,
      occupancyPersons: 4,
      requiredFlowTemperatureC: 50,
      annualPerformanceFactor: 3.5,
    },
    climate: {
      conditionedAreaM2: 80,
      roomCount: 4,
      insulationLevel: "average",
      solarLoad: "medium",
      occupancyPersons: 4,
    },
    wallbox: {
      annualDrivingKm: 15_000,
      vehicleConsumptionKwhPer100Km: 18,
      batteryCapacityKwh: 60,
      homeChargingSharePercent: 80,
      chargingPowerKw: 11,
      pvChargingSharePercent: 30,
    },
  };
  const photovoltaic = state.results.photovoltaic;
  if (!photovoltaic) throw new Error("PV result missing");
  const batteryStorage = buildBatteryStorageConfiguratorResult(state);
  const heatPump = buildHeatPumpConfiguratorResult(state);
  const climate = buildClimateConfiguratorResult(state);
  const wallbox = buildWallboxConfiguratorResult(state);
  if (!batteryStorage || !heatPump || !climate || !wallbox) {
    throw new Error("Project fixture failed");
  }
  state = {
    ...state,
    results: { photovoltaic, batteryStorage, heatPump, climate, wallbox },
  };
  return normalizeConfiguratorState(state);
}

function createUnpricedPvProject(): ConfiguratorState {
  const state = createPvOnlyProject();
  const photovoltaic = state.results.photovoltaic!;
  return {
    ...state,
    results: {
      ...state.results,
      photovoltaic: {
        ...photovoltaic,
        pricingMode: "individual_quote_required",
        estimatedTotalCostEuro: null,
        estimatedMinimumCostEuro: null,
        estimatedMaximumCostEuro: null,
      },
    },
  };
}

function createComfortOnlyProject(): ConfiguratorState {
  const full = createCompleteProject();
  return normalizeConfiguratorState({
    ...full,
    activeConfigurator: "climate",
    interests: {
      photovoltaic: false,
      batteryStorage: false,
      wallbox: true,
      heatPump: false,
      climate: true,
    },
    journey: {
      entryPoint: "climate",
      selectedProducts: ["climate", "wallbox"],
      completedProducts: ["climate", "wallbox"],
      additionalSolutionsReviewed: true,
    },
    results: { climate: full.results.climate, wallbox: full.results.wallbox },
  });
}

function buildPdfLead(state: ConfiguratorState) {
  const input = buildConfiguratorLeadInput(
    { ...state, submission: {
      ...state.submission, id: "ec36c0e2-166f-4ea0-8738-cbe44e695bc5",
    } },
    {
      firstName: "Max",
      lastName: "Mustermann",
      email: "max@example.de",
      phone: "",
      installationAtResidence: true,
      street: "Musterstraße 1",
      postalCode: "83395",
      city: "Freilassing",
      privacyAccepted: true,
      website: "",
    },
    Date.now() - 10_000,
  );
  if (!input) throw new Error("Lead fixture failed");
  return configuratorLeadPayloadSchema.parse(input);
}

describe("premium configurator project PDF", () => {
  it.each([0, 240])("filters financial and assumption PDF rows for %s operating costs", (cost) => {
    expect(pvOperatingCostRows(cost).some((row) => row.label === "Betriebskosten")).toBe(cost > 0);
    expect(pvOperatingCostRows(cost, true).some((row) => row.label === "PV-Betriebskosten")).toBe(cost > 0);
  });

  it("forwards all five configured products with readable answers and persisted economics, not internals", () => {
    const lead = buildPdfLead(createCompleteProject());
    const mail = buildForwardedLeadMail({ ...lead, publicReference: "PV-12345", fingerprint: "DO-NOT-INCLUDE", mail: { messageId: "SECRET-MAIL-ID" }, createdAt: { toDate: () => new Date("2026-09-20T12:00:00Z") } }, "internal-id");
    for (const label of ["Max", "Mustermann", "Musterstraße 1", "Freilassing", "Modellversion", "Abgeschlossene Konfiguratoren", "Dachmaterial", "Verbrauchsprofil", "Bisheriges Heizsystem", "Angegebener Gasverbrauch", "Zu klimatisierende Fläche", "Jährliche Fahrleistung", "Solar-Amortisation", "Modellierte Solarrendite", "Heizkostenvergleich", "PV-12345"]) {
      expect(mail.text).toContain(label); expect(mail.html).toContain(label);
    }
    for (const secret of ["DO-NOT-INCLUDE", "SECRET-MAIL-ID", "internal-id", "submissionId", "schemaVersion"]) { expect(mail.text).not.toContain(secret); expect(mail.html).not.toContain(secret); }
  });

  it("forwards contact fields with escaped HTML and no implementation metadata", () => {
    const mail = buildForwardedLeadMail({ type: "contact", contact: { firstName: "Max", lastName: "Muster", company: "Firma <b>", email: "max@example.test", phone: "12345" }, location: { postalCode: "83395", city: "Freilassing" }, project: { interests: ["photovoltaik"], buildingType: "einfamilienhaus", ownership: "eigentuemer" }, preferredContact: "telefon", message: "Rückruf <script>alert(1)</script>" }, "kontakt-1");
    for (const label of ["Firma", "12345", "Freilassing", "Photovoltaik", "Einfamilienhaus", "Eigentümer", "Telefon", "Rückruf", "Eingegangen"]) expect(mail.text).toContain(label);
    expect(mail.html).toContain("&lt;script&gt;"); expect(mail.html).not.toContain("<script>");
  });
  it("keeps storage copy and assumptions out of PV-only pages", () => {
    const pvOnly = getSolarPdfCopy(false);
    const combined = getSolarPdfCopy(true);
    expect(pvOnly.investmentDetail).toBe("Photovoltaik");
    expect(pvOnly.technicalIntro).not.toContain("Speicher");
    expect(pvOnly.flowIntro).not.toContain("Speicher");
    expect(pvOnly.assumptionKeys).not.toContain("storage_efficiency");
    expect(combined.investmentDetail).toBe("Photovoltaik + Stromspeicher");
    expect(combined.technicalIntro).toContain("Speicher");
    expect(combined.flowIntro).toContain("Speicher");
    expect(combined.assumptionKeys).toContain("storage_efficiency");
  });
  it("keeps the submitted and authoritative project economics aligned", () => {
    const lead = buildPdfLead(createCompleteProject());
    const authoritative = applyAuthoritativeConfiguratorModel(lead, DEFAULT_CONFIGURATOR_SETTINGS);

    expect(authoritative.economics.investmentBaseEuro).toBe(lead.economics.investmentBaseEuro);
    expect(authoritative.economics.firstYearQuantifiedEffectEuro)
      .toBe(lead.economics.firstYearQuantifiedEffectEuro);
    expect(authoritative.economics.projections).toEqual(lead.economics.projections);
    expect(authoritative.economics.scenarios).toEqual(lead.economics.scenarios);
  });

  it("recomputes manipulated client pricing and economics from the authoritative snapshot", () => {
    const lead = buildPdfLead(createPvOnlyProject());
    const photovoltaic = lead.configurators[0];
    if (!photovoltaic || photovoltaic.type !== "photovoltaic") throw new Error("PV fixture missing");
    photovoltaic.result.estimatedTotalCostEuro = 1;
    photovoltaic.result.estimatedMinimumCostEuro = 1;
    photovoltaic.result.estimatedMaximumCostEuro = 1;
    lead.economics.firstYearQuantifiedEffectEuro = 999_999;
    lead.economics.projections = [
      { year: 0, quantifiedEconomicEffectEuro: 999_999, cumulativeCashFlowEuro: 999_999 },
    ];

    const authoritative = applyAuthoritativeConfiguratorModel(lead, DEFAULT_CONFIGURATOR_SETTINGS);
    const authoritativePv = authoritative.configurators[0];
    expect(authoritativePv?.result.estimatedTotalCostEuro).not.toBe(1);
    expect(authoritative.economics.firstYearQuantifiedEffectEuro).not.toBe(999_999);
    expect(authoritative.economics.projections).toHaveLength(21);
  });

  it("derives PV and storage sizing from answers, not manipulated client results", () => {
    const lead = buildPdfLead(createPvStorageProject());
    const photovoltaic = lead.configurators.find((item) => item.type === "photovoltaic");
    const storage = lead.configurators.find((item) => item.type === "battery_storage");
    if (!photovoltaic || !storage) throw new Error("PV/storage fixture missing");
    photovoltaic.answers.household.projectedConsumptionKwh = 100_000;
    photovoltaic.result.recommendedPowerKwpMin = 1;
    photovoltaic.result.recommendedPowerKwpMax = 1;
    photovoltaic.result.estimatedAnnualYieldKwhMax = 100_000;
    storage.result.recommendedUsableCapacityKwhMin = 0.5;
    storage.result.recommendedUsableCapacityKwhMax = 0.5;

    const authoritative = applyAuthoritativeConfiguratorModel(lead, DEFAULT_CONFIGURATOR_SETTINGS);
    const authoritativePv = authoritative.configurators.find((item) => item.type === "photovoltaic");
    const authoritativeStorage = authoritative.configurators.find((item) => item.type === "battery_storage");
    if (!authoritativePv || !authoritativeStorage) throw new Error("Canonical result missing");
    expect(authoritativePv.result.projectedAnnualConsumptionKwh).toBe(4_950);
    expect(authoritativePv.answers.household.projectedConsumptionKwh).toBe(4_950);
    expect(authoritativePv.result.recommendedPowerKwpMin).toBeGreaterThan(1);
    expect(authoritativeStorage.result.recommendedUsableCapacityKwhMin).toBeGreaterThan(0.5);
    expect(authoritativeStorage.result.pvPowerKwpMin).toBe(authoritativePv.result.recommendedPowerKwpMin);
  });

  it("derives heating, cooling and charging from answers instead of browser results", () => {
    const lead = buildPdfLead(createCompleteProject());
    const heatPump = lead.configurators.find((item) => item.type === "heat_pump");
    const climate = lead.configurators.find((item) => item.type === "climate");
    const wallbox = lead.configurators.find((item) => item.type === "wallbox");
    if (!heatPump || !climate || !wallbox) throw new Error("Complete fixture missing");
    heatPump.result.recommendedHeatPumpCapacityKw = 0.1;
    heatPump.result.annualHeatPumpElectricityConsumptionKwh = 0;
    climate.result.recommendedCoolingCapacityKw = 0.1;
    climate.result.annualElectricityConsumptionKwh = 0;
    wallbox.result.annualHomeChargingInputEnergyKwh = 0;
    wallbox.result.annualGridChargingEnergyKwh = 0;
    lead.economics.limitations = [];

    const authoritative = applyAuthoritativeConfiguratorModel(lead, DEFAULT_CONFIGURATOR_SETTINGS);
    const canonicalHeatPump = authoritative.configurators.find((item) => item.type === "heat_pump");
    const canonicalClimate = authoritative.configurators.find((item) => item.type === "climate");
    const canonicalWallbox = authoritative.configurators.find((item) => item.type === "wallbox");
    expect(canonicalHeatPump?.result.recommendedHeatPumpCapacityKw).toBeGreaterThan(0.1);
    expect(canonicalHeatPump?.result.annualHeatPumpElectricityConsumptionKwh).toBeGreaterThan(0);
    expect(canonicalClimate?.result.recommendedCoolingCapacityKw).toBeGreaterThan(0.1);
    expect(canonicalClimate?.result.annualElectricityConsumptionKwh).toBeGreaterThan(0);
    expect(canonicalWallbox?.result.annualHomeChargingInputEnergyKwh).toBeGreaterThan(0);
    expect(canonicalWallbox?.result.annualGridChargingEnergyKwh).toBeGreaterThan(0);
    expect(authoritative.economics.limitations).toHaveLength(3);
  });

  it("renders a valid complete-project dossier and creates the visual-QA file", async () => {
    const lead = buildPdfLead(createCompleteProject());
    expect(getConfiguratorReportSections(lead)).toEqual([
      "cover", "project", "flow", "solar_system", "solar_economics", "cashflow",
      "storage", "heating", "comfort", "investment", "assumptions", "closing",
    ]);
    expect(lead.economics.components.map((item) => item.investmentBaseEuro)).toEqual([
      9_200, 6_500, 27_600, 15_800, 3_000,
    ]);
    expect(lead.economics.solar?.investmentEuro).toBe(15_700);
    expect(lead.economics.investmentBaseEuro).toBe(62_100);
    expect(lead.economics.solar?.firstYearNetBenefitEuro).toBe(1_081.44);
    expect(lead.economics.solar?.paybackYears).toBe(13.18);
    expect(lead.economics.solar?.annualizedReturnPercent).toBe(3.95);
    expect(lead.economics.solar?.netSurplus20YearsEuro).toBe(7_182.24);
    expect(getSolarReturnDisplay(lead.economics)).toMatchObject({
      investment: "15.700 €",
      irr: "3,95 %",
      horizonResult: "7.182 €",
    });
    const pdf = await generateConfiguratorProjectPdf({
      leadId: "PV-BS-WP-KA-WB-00005",
      lead,
      settings: DEFAULT_CONFIGURATOR_SETTINGS,
    });
    const output = path.join(tmpdir(), `energie-kraft-recovery5-${process.pid}.pdf`);
    writeFileSync(output, pdf);
    console.info("RECOVERY5_REPRESENTATIVE_PDF", output);

    expect(pdf.length).toBeGreaterThan(30_000);
    expect(pdf.subarray(0, 4).toString("ascii")).toBe("%PDF");
    expect(pdf.toString("latin1").match(/\/Type \/Page\b/g)?.length ?? 0).toBe(12);
  });

  it("recomputes changed minimums and oversized quotes for persisted server results", () => {
    const settings = structuredClone(DEFAULT_CONFIGURATOR_SETTINGS);
    settings.photovoltaic.pricing.tiers[0]!.from = 5;
    settings.batteryStorage.pricing.tiers[0]!.from = 6;
    const lowLead = buildPdfLead(createPvStorageProject());
    const lowPv = lowLead.configurators.find((item) => item.type === "photovoltaic");
    if (!lowPv) throw new Error("PV fixture missing");
    lowPv.answers.household.annualConsumptionKwh = 500;
    const low = applyAuthoritativeConfiguratorModel(lowLead, settings);
    const lowResult = low.configurators.find((item) => item.type === "photovoltaic");
    const lowStorage = low.configurators.find((item) => item.type === "battery_storage");
    expect(lowResult?.result.recommendedPowerKwpMin).toBe(5);
    expect(lowStorage?.result.recommendedUsableCapacityKwhMin).toBe(6);
    expect(low.economics.pricingMode).toBe("modeled");
    expect(low.economics.solar?.investmentEuro).toBeGreaterThan(0);

    settings.photovoltaic.pricing.maxModeledSize = 40;
    settings.batteryStorage.pricing.maxModeledSize = 40;
    const largeLead = buildPdfLead(createPvStorageProject());
    const largePv = largeLead.configurators.find((item) => item.type === "photovoltaic");
    if (!largePv) throw new Error("PV fixture missing");
    largePv.answers.household.annualConsumptionKwh = 60_000;
    const large = applyAuthoritativeConfiguratorModel(largeLead, settings);
    const largeResult = large.configurators.find((item) => item.type === "photovoltaic");
    const largeStorage = large.configurators.find((item) => item.type === "battery_storage");
    expect(largeResult?.result.recommendedPowerKwpMax).toBeGreaterThan(40);
    expect(largeResult?.result.pricingMode).toBe("individual_quote_required");
    expect(largeStorage?.result.pricingMode).toBe("individual_quote_required");
    expect(large.economics.pricingMode).toBe("individual_quote_required");
    expect(large.economics.investmentBaseEuro).toBeNull();
    expect(large.economics.solar).toBeNull();
    expect(large.economics.paybackYears).toBeNull();
    expect(large.economics.annualizedReturnPercent).toBeNull();
    expect(large.economics.finalCumulativeCashFlowEuro).toBeNull();
    expect(getConfiguratorReportSections(large)).not.toContain("solar_economics");
    expect(getConfiguratorReportSections(large)).not.toContain("cashflow");
  });

  it.each([
    ["PV only", createPvOnlyProject],
    ["PV and storage", createPvStorageProject],
    ["heat pump only", createHeatPumpOnlyProject],
  ])("renders a valid %s dossier", async (_label, createProject) => {
    const lead = buildPdfLead(createProject());
    const sections = getConfiguratorReportSections(lead);
    if (_label === "PV only") {
      expect(sections).not.toContain("storage");
      expect(sections).toContain("solar_economics");
    }
    if (_label === "PV and storage") {
      expect(sections).toContain("solar_system");
      expect(sections).toContain("storage");
    }
    if (_label === "heat pump only") {
      expect(sections).not.toContain("solar_economics");
      expect(sections).not.toContain("cashflow");
      expect(lead.economics.heating?.annualSavingEuro).not.toBeNull();
      expect(lead.economics.paybackStatus).toBe("not_applicable");
    }
    const pdf = await generateConfiguratorProjectPdf({
      leadId: "must-not-be-visible",
      lead,
      settings: DEFAULT_CONFIGURATOR_SETTINGS,
    });
    expect(pdf.length).toBeGreaterThan(25_000);
    expect(pdf.subarray(0, 4).toString("ascii")).toBe("%PDF");
  });

  it("explains missing solar price without a false return conclusion or cashflow page", async () => {
    const lead = buildPdfLead(createUnpricedPvProject());
    const display = getSolarReturnDisplay(lead.economics);
    expect(lead.economics.missingInvestmentSources).toContain("photovoltaic.pricing");
    expect(lead.economics.pricingMode).toBe("individual_quote_required");
    expect(display).toBeNull();
    expect(getConfiguratorReportSections(lead)).not.toContain("cashflow");
    expect(getConfiguratorReportSections(lead)).not.toContain("solar_economics");
    const pdf = await generateConfiguratorProjectPdf({
      leadId: "unpriced-pv", lead, settings: DEFAULT_CONFIGURATOR_SETTINGS,
    });
    expect(pdf.subarray(0, 4).toString("ascii")).toBe("%PDF");
  });

  it("treats climate and wallbox as comfort investments without a return section", async () => {
    const lead = buildPdfLead(createComfortOnlyProject());
    const sections = getConfiguratorReportSections(lead);
    expect(sections).toContain("comfort");
    expect(sections).not.toContain("solar_economics");
    expect(sections).not.toContain("cashflow");
    expect(lead.economics.investmentBaseEuro).toBe(
      lead.economics.components.reduce((sum, item) => sum + item.investmentBaseEuro!, 0),
    );
    expect(lead.economics.components.every((item) => item.analysisKind === "investment_only")).toBe(true);
    const pdf = await generateConfiguratorProjectPdf({
      leadId: "comfort-only", lead, settings: DEFAULT_CONFIGURATOR_SETTINGS,
    });
    expect(pdf.subarray(0, 4).toString("ascii")).toBe("%PDF");
    const output = path.join(tmpdir(), `energie-kraft-comfort-combined-${process.pid}.pdf`);
    writeFileSync(output, pdf);
    console.info("COMFORT_COMBINED_PDF", output);
  });

  it("uses only the selected comfort products in overview and closing copy", () => {
    const climate = getComfortPdfCopy(true, false);
    expect(climate.overviewLabel).toBe("Klimaanlage");
    expect(climate.closing).toContain("Klimaanlage");
    expect(climate.intro).toContain("Klimaanlage");
    expect(JSON.stringify(climate)).not.toContain("Wallbox");
    const wallbox = getComfortPdfCopy(false, true);
    expect(wallbox.overviewLabel).toBe("Wallbox");
    expect(wallbox.closing).toContain("Wallbox");
    expect(wallbox.intro).toContain("Wallbox");
    expect(JSON.stringify(wallbox)).not.toContain("Klimaanlage");
    const combined = getComfortPdfCopy(true, true);
    expect(combined.overviewLabel).toBe("Klimaanlage + Wallbox");
    expect(combined.closing).toContain("Klimaanlage und Wallbox ergänzen dein Energieprojekt");
  });

  it.each(["climate", "wallbox"] as const)("renders the %s-only comfort PDF", async (type) => {
    const full = createComfortOnlyProject();
    const state = normalizeConfiguratorState({
      ...full,
      activeConfigurator: type,
      interests: { ...full.interests, climate: type === "climate", wallbox: type === "wallbox" },
      journey: {
        ...full.journey, entryPoint: type,
        selectedProducts: [type], completedProducts: [type],
      },
      results: type === "climate"
        ? { climate: full.results.climate }
        : { wallbox: full.results.wallbox },
    });
    const lead = buildPdfLead(state);
    expect(getConfiguratorReportSections(lead)).toContain("comfort");
    expect(lead.configurators.map((item) => item.type)).toEqual([type]);
    const pdf = await generateConfiguratorProjectPdf({
      leadId: `${type}-only`, lead, settings: DEFAULT_CONFIGURATOR_SETTINGS,
    });
    expect(pdf.subarray(0, 4).toString("ascii")).toBe("%PDF");
    expect(pdf.toString("latin1").match(/\/Type \/Page\b/g)?.length ?? 0).toBe(6);
    const output = path.join(tmpdir(), `energie-kraft-comfort-${type}-${process.pid}.pdf`);
    writeFileSync(output, pdf);
    console.info("COMFORT_SINGLE_PDF", output);
  });
});
