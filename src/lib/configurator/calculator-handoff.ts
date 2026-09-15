import { z } from "zod";
import { normalizeConfiguratorState } from "@/lib/configurator/state";
import type { CalculatorHandoff, ConfiguratorState, ConfiguratorType } from "@/types/configurator";

export const CALCULATOR_HANDOFF_STORAGE_KEY = "energie-kraft:calculator-handoff:v1";

const common = { version: z.literal(1), createdAt: z.number().int().positive() };
const handoffSchema = z.discriminatedUnion("source", [
  z
    .object({
      ...common,
      source: z.literal("pv_sizing"),
      values: z
        .object({
          annualConsumptionKwh: z.number().positive(),
          roofOrientation: z.enum(["south", "southEastSouthWest", "eastWest", "north"]),
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      ...common,
      source: z.literal("pv_roi"),
      values: z.object({ annualConsumptionKwh: z.number().positive() }).strict(),
    })
    .strict(),
  z
    .object({
      ...common,
      source: z.literal("heat_pump"),
      values: z
        .object({
          heatedAreaM2: z.number().positive(),
          specificSpaceHeatingDemandKwhPerM2Year: z.number().positive(),
          occupancyPersons: z.number().int().positive(),
          requiredFlowTemperatureC: z.number().positive(),
          annualPerformanceFactor: z.number().positive(),
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      ...common,
      source: z.literal("climate"),
      values: z
        .object({
          conditionedAreaM2: z.number().positive(),
          roomCount: z.number().int().positive(),
          insulationLevel: z.enum(["good", "average", "weak"]),
          solarLoad: z.enum(["low", "medium", "high"]),
          occupancyPersons: z.number().int().positive(),
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      ...common,
      source: z.literal("wallbox"),
      values: z
        .object({
          annualDrivingKm: z.number().positive(),
          vehicleConsumptionKwhPer100Km: z.number().positive(),
          batteryCapacityKwh: z.number().positive(),
          homeChargingSharePercent: z.number().min(0).max(100),
          chargingPowerKw: z.union([z.literal(3.7), z.literal(11), z.literal(22)]),
          pvChargingSharePercent: z.number().min(0).max(100),
        })
        .strict(),
    })
    .strict(),
]);

export function writeCalculatorHandoff(storage: Storage, handoff: CalculatorHandoff): void {
  storage.setItem(CALCULATOR_HANDOFF_STORAGE_KEY, JSON.stringify(handoffSchema.parse(handoff)));
}

export function clearCalculatorHandoff(storage: Storage): void {
  storage.removeItem(CALCULATOR_HANDOFF_STORAGE_KEY);
}

export function readCalculatorHandoff(storage: Storage): CalculatorHandoff | null {
  try {
    const serialized = storage.getItem(CALCULATOR_HANDOFF_STORAGE_KEY);
    if (!serialized) return null;
    const parsed = handoffSchema.safeParse(JSON.parse(serialized));
    if (!parsed.success || Date.now() - parsed.data.createdAt > 30 * 60 * 1_000) {
      clearCalculatorHandoff(storage);
      return null;
    }
    return parsed.data;
  } catch {
    clearCalculatorHandoff(storage);
    return null;
  }
}

const ORIENTATION_MAP = {
  south: "south",
  southEastSouthWest: "south_east_south_west",
  eastWest: "east_west",
  north: "north",
} as const;

function sourceProduct(source: CalculatorHandoff["source"]): ConfiguratorType {
  if (source === "pv_sizing" || source === "pv_roi") return "photovoltaic";
  return source;
}

export function applyCalculatorHandoff(
  current: ConfiguratorState,
  handoff: CalculatorHandoff,
): ConfiguratorState {
  const state: ConfiguratorState = {
    ...current,
    activeConfigurator: sourceProduct(handoff.source),
    journey: {
      ...current.journey,
      entryPoint: current.journey.entryPoint ?? sourceProduct(handoff.source),
    },
  };

  switch (handoff.source) {
    case "pv_sizing":
      state.household = {
        ...state.household,
        annualConsumptionKwh:
          state.household.annualConsumptionKwh ?? handoff.values.annualConsumptionKwh,
      };
      state.roof = {
        ...state.roof,
        orientation: state.roof.orientation ?? ORIENTATION_MAP[handoff.values.roofOrientation],
      };
      break;
    case "pv_roi":
      state.household = {
        ...state.household,
        annualConsumptionKwh:
          state.household.annualConsumptionKwh ?? handoff.values.annualConsumptionKwh,
      };
      break;
    case "heat_pump":
      state.heatPump = {
        heatedAreaM2: state.heatPump.heatedAreaM2 ?? handoff.values.heatedAreaM2,
        specificSpaceHeatingDemandKwhPerM2Year:
          state.heatPump.specificSpaceHeatingDemandKwhPerM2Year ??
          handoff.values.specificSpaceHeatingDemandKwhPerM2Year,
        occupancyPersons: state.heatPump.occupancyPersons ?? handoff.values.occupancyPersons,
        requiredFlowTemperatureC:
          state.heatPump.requiredFlowTemperatureC ?? handoff.values.requiredFlowTemperatureC,
        annualPerformanceFactor:
          state.heatPump.annualPerformanceFactor ?? handoff.values.annualPerformanceFactor,
      };
      break;
    case "climate":
      state.climate = {
        conditionedAreaM2: state.climate.conditionedAreaM2 ?? handoff.values.conditionedAreaM2,
        roomCount: state.climate.roomCount ?? handoff.values.roomCount,
        insulationLevel: state.climate.insulationLevel ?? handoff.values.insulationLevel,
        solarLoad: state.climate.solarLoad ?? handoff.values.solarLoad,
        occupancyPersons: state.climate.occupancyPersons ?? handoff.values.occupancyPersons,
      };
      break;
    case "wallbox":
      state.wallbox = {
        annualDrivingKm: state.wallbox.annualDrivingKm ?? handoff.values.annualDrivingKm,
        vehicleConsumptionKwhPer100Km:
          state.wallbox.vehicleConsumptionKwhPer100Km ??
          handoff.values.vehicleConsumptionKwhPer100Km,
        batteryCapacityKwh: state.wallbox.batteryCapacityKwh ?? handoff.values.batteryCapacityKwh,
        homeChargingSharePercent:
          state.wallbox.homeChargingSharePercent ?? handoff.values.homeChargingSharePercent,
        chargingPowerKw: state.wallbox.chargingPowerKw ?? handoff.values.chargingPowerKw,
        pvChargingSharePercent:
          state.wallbox.pvChargingSharePercent ?? handoff.values.pvChargingSharePercent,
      };
      break;
  }

  return normalizeConfiguratorState(state);
}
