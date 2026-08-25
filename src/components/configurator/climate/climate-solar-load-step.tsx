"use client";

import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { climateSolarLoadOptions } from "@/content/configurators";
import type {
    ClimateSolarLoad,
} from "@/types/climate-calculator";

interface ClimateSolarLoadStepProps {
    value: ClimateSolarLoad | undefined;

    onChange: (
        value: ClimateSolarLoad,
    ) => void;
}

export function ClimateSolarLoadStep({
    value,
    onChange,
}: ClimateSolarLoadStepProps) {
    return (
        <SelectionGrid columns={3}>
            {climateSolarLoadOptions.map(
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