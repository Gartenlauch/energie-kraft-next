import {
    climateConditionedAreaSchema,
    climateInsulationLevelSchema,
    climateOccupancyPersonsSchema,
    climateRoomCountSchema,
    climateSolarLoadSchema,
} from "@/lib/validation/configurator/state";
import type {
    ClimateStepId,
    ConfiguratorState,
} from "@/types/configurator";

export function isClimateStepComplete(
    stepId: ClimateStepId,
    state: ConfiguratorState,
): boolean {
    const climate = state.climate;

    switch (stepId) {
        case "rooms":
            return (
                climateConditionedAreaSchema.safeParse(
                    climate.conditionedAreaM2,
                ).success &&
                climateRoomCountSchema.safeParse(
                    climate.roomCount,
                ).success
            );

        case "insulation":
            return climateInsulationLevelSchema.safeParse(
                climate.insulationLevel,
            ).success;

        case "solar_load":
            return climateSolarLoadSchema.safeParse(
                climate.solarLoad,
            ).success;

        case "occupancy":
            return climateOccupancyPersonsSchema.safeParse(
                climate.occupancyPersons,
            ).success;
    }
}