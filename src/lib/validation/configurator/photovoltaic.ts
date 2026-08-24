import {
  annualConsumptionKwhSchema,
  buildingOwnershipSchema,
  buildingTypeSchema,
  householdPersonsSchema,
  roofMaterialSchema,
  roofOrientationSchema,
  roofPitchSchema,
  roofRenovationPeriodSchema,
} from "@/lib/validation/configurator/state";
import type {
  ConfiguratorState,
  PhotovoltaicStepId,
} from "@/types/configurator";

export function isPhotovoltaicStepComplete(
  stepId: PhotovoltaicStepId,
  state: ConfiguratorState,
): boolean {
  switch (stepId) {
    case "household_persons":
      return householdPersonsSchema.safeParse(
        state.household.persons,
      ).success;

    case "ownership":
      return buildingOwnershipSchema.safeParse(
        state.building.ownership,
      ).success;

    case "building_type":
      return buildingTypeSchema.safeParse(
        state.building.type,
      ).success;

    case "annual_consumption":
      return annualConsumptionKwhSchema.safeParse(
        state.household.annualConsumptionKwh,
      ).success;

    case "roof_pitch":
      return roofPitchSchema.safeParse(
        state.roof.pitch,
      ).success;

    case "roof_material":
      return roofMaterialSchema.safeParse(
        state.roof.material,
      ).success;

    case "roof_orientation":
      return roofOrientationSchema.safeParse(
        state.roof.orientation,
      ).success;

    case "roof_renovation":
      return roofRenovationPeriodSchema.safeParse(
        state.roof.renovationPeriod,
      ).success;

    default: {
      const exhaustiveCheck: never = stepId;
      return exhaustiveCheck;
    }
  }
}

export function getAnnualConsumptionValidationMessage(
  value: number | undefined,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!annualConsumptionKwhSchema.safeParse(value).success) {
    return "Bitte gib einen Jahresverbrauch zwischen 500 und 100.000 kWh ein.";
  }

  return undefined;
}