"use client";

import {
    batteryStorageGoalOptions,
} from "@/content/configurators";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import type {
    BatteryStorageGoal,
} from "@/types/configurator";

interface BatteryStorageGoalStepProps {
    value: BatteryStorageGoal | undefined;

    onChange: (
        value: BatteryStorageGoal,
    ) => void;
}

export function BatteryStorageGoalStep({
    value,
    onChange,
}: BatteryStorageGoalStepProps) {
    return (
        <SelectionGrid columns={2}>
            {batteryStorageGoalOptions.map(
                (option) => (
                    <SelectionCard
                        key={option.value}
                        title={option.title}
                        description={option.description}
                        selected={
                            value === option.value
                        }
                        onSelect={() =>
                            onChange(option.value)
                        }
                    />
                ),
            )}
        </SelectionGrid>
    );
}