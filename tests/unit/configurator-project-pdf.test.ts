import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { generateConfiguratorProjectPdf } from "../../functions/src/configurator-project-pdf";
import { configuratorLeadPayloadSchema } from "../../functions/src/configurator-lead-validation";
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

function createCompleteProject(): ConfiguratorState {
  let state: ConfiguratorState = {
    ...createInitialConfiguratorState(),
    activeConfigurator: "photovoltaic",
    journey: { entryPoint: "photovoltaic", selectedProducts: [], completedProducts: [] },
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
    interests: {
      photovoltaic: false,
      batteryStorage: true,
      wallbox: true,
      heatPump: true,
      climate: true,
    },
    notes: { hasNotes: false },
    batteryStorage: {
      consumptionPattern: "mixed",
      backupPreference: "selected_loads",
      goal: "balanced",
    },
    heatPump: {
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

  const photovoltaic = buildPhotovoltaicConfiguratorResult(state);
  if (!photovoltaic) throw new Error("PV fixture failed");
  state = { ...state, results: { photovoltaic } };
  const batteryStorage = buildBatteryStorageConfiguratorResult(state);
  const heatPump = buildHeatPumpConfiguratorResult(state);
  const climate = buildClimateConfiguratorResult(state);
  const wallbox = buildWallboxConfiguratorResult(state);
  if (!batteryStorage || !heatPump || !climate || !wallbox)
    throw new Error("Project fixture failed");

  return normalizeConfiguratorState({
    ...state,
    results: { photovoltaic, batteryStorage, heatPump, climate, wallbox },
  });
}

describe("premium configurator project PDF", () => {
  it("renders a valid complete-project dossier and tolerates dynamic chapters", async () => {
    const input = buildConfiguratorLeadInput(
      createCompleteProject(),
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

    const lead = configuratorLeadPayloadSchema.parse(input);
    const pdf = await generateConfiguratorProjectPdf({ leadId: "test-analysis", lead });
    writeFileSync(path.join(tmpdir(), "energie-kraft-sprint9-project-analysis.pdf"), pdf);

    expect(pdf.length).toBeGreaterThan(30_000);
    expect(pdf.subarray(0, 4).toString("ascii")).toBe("%PDF");
    expect(pdf.toString("latin1").match(/\/Type \/Page\b/g)?.length ?? 0).toBeGreaterThan(8);
  });
});
