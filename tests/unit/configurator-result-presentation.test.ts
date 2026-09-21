import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { BatteryStorageResult } from "@/components/configurator/battery-storage/battery-storage-result";
import { ClimateRoomsStep } from "@/components/configurator/climate/climate-rooms-step";
import { ClimateResult } from "@/components/configurator/climate/climate-result";
import { HeatPumpResult } from "@/components/configurator/heat-pump/heat-pump-result";
import { PhotovoltaicResult } from "@/components/configurator/photovoltaic/photovoltaic-result";
import { ProjectAnalysisPreview } from "@/components/configurator/project-analysis-preview";
import { WallboxResult } from "@/components/configurator/wallbox/wallbox-result";
import { buildBatteryStorageConfiguratorResult } from "@/lib/configurator/battery-storage";
import { buildClimateConfiguratorResult } from "@/lib/configurator/climate";
import { buildHeatPumpConfiguratorResult } from "@/lib/configurator/heat-pump";
import { buildPhotovoltaicConfiguratorResult } from "@/lib/configurator/photovoltaic";
import { calculateProjectEconomics } from "@/lib/configurator/project-economics";
import { createInitialConfiguratorState } from "@/lib/configurator/state";
import { buildWallboxConfiguratorResult } from "@/lib/configurator/wallbox";
import type { ConfiguratorState } from "@/types/configurator";

const mockedSiteConfig = vi.hoisted(() => ({
  name: "Test Energie-Kraft",
  contact: {
    phoneHref: "tel:+4900000000",
    phoneDisplay: "+49 000 0000",
    emailHref: "mailto:test@example.invalid",
    email: "test@example.invalid",
  },
}));

vi.mock("@/config/site", () => ({ siteConfig: mockedSiteConfig }));

let activeState: ConfiguratorState;
vi.mock("@/lib/configurator/configurator-context", () => ({
  useConfigurator: () => ({ state: activeState, dispatch: vi.fn() }),
}));
vi.mock("@/components/configurator/configurator-journey-actions", () => ({
  ConfiguratorJourneyActions: () => null,
}));
vi.mock("@/components/configurator/configurator-phase-indicator", () => ({
  ConfiguratorPhaseIndicator: () => null,
}));

const callbacks = { onBack: () => {}, onContinue: () => {} };
const euro = (value: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
const number = (value: number, decimals = 1) =>
  new Intl.NumberFormat("de-DE", { maximumFractionDigits: decimals }).format(value);

function withPv(state = createInitialConfiguratorState()): ConfiguratorState {
  const configured: ConfiguratorState = {
    ...state,
    household: {
      persons: 3,
      annualConsumptionKwh: 4500,
      futureIncreasePercent: 10,
      projectedConsumptionKwh: 4950,
    },
    roof: {
      orientation: "south",
      pitch: 30,
      material: "roof_tile",
      renovationPeriod: "after_1990",
    },
  };
  const photovoltaic = buildPhotovoltaicConfiguratorResult(configured);
  if (!photovoltaic) throw new Error("Missing PV fixture");
  return { ...configured, results: { ...configured.results, photovoltaic } };
}

function withStorage(state: ConfiguratorState): ConfiguratorState {
  const configured: ConfiguratorState = {
    ...state,
    interests: { ...state.interests, batteryStorage: true },
    batteryStorage: { consumptionPattern: "mixed", backupPreference: "none", goal: "balanced" },
  };
  const batteryStorage = buildBatteryStorageConfiguratorResult(configured);
  if (!batteryStorage) throw new Error("Missing storage fixture");
  return { ...configured, results: { ...configured.results, batteryStorage } };
}

function withHeatPump(state = createInitialConfiguratorState()): ConfiguratorState {
  const configured: ConfiguratorState = {
    ...state,
    heatPump: {
      existingHeatingSystem: "gas",
      heatedAreaM2: 160,
      specificSpaceHeatingDemandKwhPerM2Year: 90,
      occupancyPersons: 4,
      requiredFlowTemperatureC: 50,
      annualPerformanceFactor: 3.5,
    },
  };
  const heatPump = buildHeatPumpConfiguratorResult(configured);
  if (!heatPump) throw new Error("Missing heat pump fixture");
  return { ...configured, results: { ...configured.results, heatPump } };
}

function withClimate(state = createInitialConfiguratorState()): ConfiguratorState {
  const configured: ConfiguratorState = {
    ...state,
    climate: {
      conditionedAreaM2: 80,
      roomCount: 4,
      insulationLevel: "average",
      solarLoad: "medium",
      occupancyPersons: 4,
    },
  };
  const climate = buildClimateConfiguratorResult(configured);
  if (!climate) throw new Error("Missing climate fixture");
  return { ...configured, results: { ...configured.results, climate } };
}

function withWallbox(state = createInitialConfiguratorState()): ConfiguratorState {
  const configured: ConfiguratorState = {
    ...state,
    wallbox: {
      annualDrivingKm: 15000,
      vehicleConsumptionKwhPer100Km: 18,
      batteryCapacityKwh: 60,
      homeChargingSharePercent: 80,
      chargingPowerKw: 11,
      pvChargingSharePercent: 30,
    },
  };
  const wallbox = buildWallboxConfiguratorResult(configured);
  if (!wallbox) throw new Error("Missing wallbox fixture");
  return { ...configured, results: { ...configured.results, wallbox } };
}

describe("customer-facing configurator results", () => {
  it("shows configured contact details for an oversized PV recommendation", () => {
    const state = withPv();
    const oversizedState: ConfiguratorState = {
      ...state,
      household: {
        ...state.household,
        annualConsumptionKwh: 60_000,
        projectedConsumptionKwh: 66_000,
      },
    };
    const photovoltaic = buildPhotovoltaicConfiguratorResult(oversizedState);
    if (!photovoltaic) throw new Error("Missing oversized PV fixture");
    expect(photovoltaic.pricingMode).toBe("individual_quote_required");
    activeState = { ...oversizedState, results: { photovoltaic } };

    const html = renderToStaticMarkup(
      createElement(PhotovoltaicResult, {
        result: photovoltaic,
        nextConfigurator: null,
        ...callbacks,
      }),
    );
    expect(html).toContain(mockedSiteConfig.name);
    expect(html).toContain(mockedSiteConfig.contact.phoneDisplay);
    expect(html).toContain(`href="${mockedSiteConfig.contact.phoneHref}"`);
    expect(html).toContain(mockedSiteConfig.contact.email);
    expect(html).toContain(`href="${mockedSiteConfig.contact.emailHref}"`);
    expect(html).toContain("Individuelles Angebot erforderlich");
    expect(html).not.toContain("Amortisation");
    expect(html).not.toContain("Modellierte Rendite p. a.");
  });

  it("shows canonical PV investment, generation and year-one benefit with valid return values", () => {
    activeState = withPv();
    const solar = calculateProjectEconomics(activeState).solar!;
    const html = renderToStaticMarkup(
      createElement(PhotovoltaicResult, {
        result: activeState.results.photovoltaic!,
        nextConfigurator: null,
        ...callbacks,
      }),
    );
    expect(html).toContain("Empfohlene Anlage");
    expect(html).toContain(euro(solar.investmentEuro!));
    expect(html).toContain(number(solar.withoutStorage.generationKwh, 0));
    expect(html).toContain(euro(solar.firstYearNetBenefitEuro));
    expect(html).toContain("Amortisation");
    expect(html).toContain("Modellierte Rendite p. a.");
  });

  it("keeps unknown PV investment unknown and hides dependent payback and return", () => {
    const state = withPv();
    activeState = {
      ...state,
      results: {
        ...state.results,
        photovoltaic: {
          ...state.results.photovoltaic!,
          estimatedTotalCostEuro: null,
          estimatedMinimumCostEuro: null,
          estimatedMaximumCostEuro: null,
        },
      },
    };
    const html = renderToStaticMarkup(
      createElement(PhotovoltaicResult, {
        result: activeState.results.photovoltaic!,
        nextConfigurator: null,
        ...callbacks,
      }),
    );
    expect(html).toContain("Nach technischer Prüfung");
    expect(html).not.toContain("Amortisation");
    expect(html).not.toContain("Modellierte Rendite p. a.");
    expect(html).not.toContain("0 €");
  });

  it("compares canonical storage energy flows and keeps the extra financial benefit secondary", () => {
    activeState = withStorage(withPv());
    const solar = calculateProjectEconomics(activeState).solar!;
    const html = renderToStaticMarkup(
      createElement(BatteryStorageResult, {
        result: activeState.results.batteryStorage!,
        nextConfigurator: null,
        ...callbacks,
      }),
    );
    expect(html).toContain("Ohne Speicher");
    expect(html).toContain("Mit Speicher");
    expect(html).toContain(number(solar.withoutStorage.selfConsumptionPercent));
    expect(html).toContain(number(solar.withStorage.autarkyPercent));
    expect(html).toContain(number(solar.withStorage.gridPurchaseKwh, 0));
    expect(html).toContain(number(solar.withoutStorage.feedInKwh, 0));
    expect(html).toContain(number(solar.withStorage.feedInKwh, 0));
    expect(html).toContain(euro(solar.storageAdditionalAnnualBenefitEuro));
    expect(html).not.toContain("Amortisation");
  });

  it("shows heating costs, saving and funding exclusion without heating ROI", () => {
    activeState = withHeatPump();
    const heating = calculateProjectEconomics(activeState).heating!;
    const html = renderToStaticMarkup(
      createElement(HeatPumpResult, {
        result: activeState.results.heatPump!,
        nextConfigurator: null,
        reviewAdditionalSolutions: false,
        onAdditionalSolutionsReviewed: () => {},
        ...callbacks,
      }),
    );
    expect(html).toContain(euro(heating.currentAnnualEuro!));
    expect(html).toContain(euro(heating.heatPumpAnnualEuro));
    expect(html).toContain(euro(heating.annualSavingEuro!));
    expect(html).toContain(number(heating.savingPercent!));
    expect(html).toContain("Förderung nicht berücksichtigt");
    expect(html).not.toContain("Amortisation");
    expect(html).not.toContain("Rendite");
  });

  it("presents climate and Wallbox as comfort and charging infrastructure", () => {
    activeState = withWallbox(withClimate());
    const climate = renderToStaticMarkup(
      createElement(ClimateResult, {
        result: activeState.results.climate!,
        nextConfigurator: null,
        reviewAdditionalSolutions: false,
        onAdditionalSolutionsReviewed: () => {},
        ...callbacks,
      }),
    );
    const wallbox = renderToStaticMarkup(
      createElement(WallboxResult, {
        result: activeState.results.wallbox!,
        nextConfigurator: null,
        ...callbacks,
      }),
    );
    expect(climate).toContain("Angenehme Temperaturen");
    expect(climate).toContain("Modellierte Investition");
    expect(climate).toContain("Passende Systemart");
    expect(climate).toContain("Separat regelbare Inneneinheiten");
    expect(wallbox).toContain("Bequem zu Hause laden");
    expect(wallbox).toContain("Heimladebedarf im Jahr");
    for (const html of [climate, wallbox]) {
      expect(html).not.toMatch(/Amortisation|Rendite|Wirtschaftlichkeit|ROI/);
    }
  });

  it("keeps inherited climate area visible and editable alongside the room count", () => {
    const html = renderToStaticMarkup(
      createElement(ClimateRoomsStep, {
        conditionedAreaM2: 160,
        roomCount: 4,
        areaPrefilledFromHeatPump: true,
        onConditionedAreaChange: () => {},
        onRoomCountChange: () => {},
      }),
    );
    expect(html).toContain('id="climate-conditioned-area"');
    expect(html).toContain('value="160"');
    expect(html).toContain('id="climate-room-count"');
    expect(html).toContain('value="4"');
    expect(html).toContain("weiterhin frei änderbar");
    expect(html).toContain('aria-describedby="climate-area-inherited"');
    expect(html).not.toContain("disabled");
  });

  it("separates the full project investment from Solar, heating and comfort", () => {
    activeState = withWallbox(withClimate(withHeatPump(withStorage(withPv()))));
    const economics = calculateProjectEconomics(activeState);
    const html = renderToStaticMarkup(createElement(ProjectAnalysisPreview));
    expect(html).toContain(euro(economics.investmentBaseEuro!));
    expect(html).toContain("Solarinvestition");
    expect(html).toContain("Heizkosten im Vergleich");
    expect(html).toContain("Komfort &amp; Lebensqualität");
    expect(html).toContain("KOSTENLOSE PERSÖNLICHE PROJEKTANALYSE");
    expect(html).toContain("Hier im Browser erhältst du bereits eine kompakte Auswertung");
    expect(html).toContain("PDF-Projektanalyse mit detaillierter Wirtschaftlichkeitsberechnung");
    expect(html).toContain("Energiefluss, Annahmen und den nächsten Planungsschritten");
    expect(html).toContain(
      "Unverbindliche Orientierung – keine technische Planung und kein Angebot.",
    );
    expect(html).not.toContain("Projektrendite");
    expect(html).not.toContain("Projektamortisation");
  });

  it("does not show a false complete project total when one component is unpriced", () => {
    const state = withWallbox(withPv());
    activeState = {
      ...state,
      results: {
        ...state.results,
        photovoltaic: {
          ...state.results.photovoltaic!,
          estimatedTotalCostEuro: null,
          estimatedMinimumCostEuro: null,
          estimatedMaximumCostEuro: null,
        },
      },
    };
    const html = renderToStaticMarkup(createElement(ProjectAnalysisPreview));
    expect(html).toContain("Noch nicht vollständig bezifferbar");
    expect(html).toContain("Photovoltaik");
  });
});
