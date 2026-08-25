import { buildBatteryStoragePhotovoltaicHandoff } from "@/lib/configurator/battery-storage";
import {
    batteryStorageAnnualConsumptionKwhSchema,
    batteryStorageBackupPreferenceSchema,
    batteryStorageConsumptionPatternSchema,
    batteryStorageGoalSchema,
    batteryStoragePvPowerKwpSchema,
} from "@/lib/validation/configurator/state";
import type {
    BatteryStorageStepId,
    ConfiguratorState,
} from "@/types/configurator";

export function isBatteryStorageStepComplete(
    stepId: BatteryStorageStepId,
    state: ConfiguratorState,
): boolean {
    switch (stepId) {
        case "system_data": {
            const handoff =
                buildBatteryStoragePhotovoltaicHandoff(
                    state,
                );

            if (handoff) {
                return true;
            }

            return (
                batteryStorageAnnualConsumptionKwhSchema.safeParse(
                    state.batteryStorage
                        .annualConsumptionKwh,
                ).success &&
                batteryStoragePvPowerKwpSchema.safeParse(
                    state.batteryStorage.pvPowerKwp,
                ).success
            );
        }

        case "consumption_pattern":
            return batteryStorageConsumptionPatternSchema.safeParse(
                state.batteryStorage
                    .consumptionPattern,
            ).success;

        case "backup_preference":
            return batteryStorageBackupPreferenceSchema.safeParse(
                state.batteryStorage.backupPreference,
            ).success;

        case "goal":
            return batteryStorageGoalSchema.safeParse(
                state.batteryStorage.goal,
            ).success;
    }
}