"use client";

import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { climateInsulationOptions } from "@/content/configurators";
import type {
    ClimateInsulationLevel,
} from "@/types/climate-calculator";

interface ClimateInsulationStepProps {
    value: ClimateInsulationLevel | undefined;

    onChange: (
        value: ClimateInsulationLevel,
    ) => void;
}

export function ClimateInsulationStep({
    value,
    onChange,
}: ClimateInsulationStepProps) {
    return (
        <SelectionGrid columns={3}>
            {climateInsulationOptions.map(
                (option) => (
                    <SelectionCard
                        key={option.value}
                        title={option.title}
                        description={option.description}
                        selected={value === option.value}
                        onSelect={() =>
                            onChange(option.value)
                        }
                    />
                ),
            )}
        </SelectionGrid>
    );
}