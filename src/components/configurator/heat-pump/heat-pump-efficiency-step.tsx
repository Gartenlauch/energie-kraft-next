"use client";

import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { heatPumpEfficiencyOptions } from "@/content/configurators";

interface HeatPumpEfficiencyStepProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

export function HeatPumpEfficiencyStep({
  value,
  onChange,
}: HeatPumpEfficiencyStepProps) {
  return (
    <>
      <SelectionGrid columns={2}>
        {heatPumpEfficiencyOptions.map(
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

      <p className="mt-5 text-sm leading-6 text-foreground/60">
        Wenn du unsicher bist, ist eine JAZ von
        3,5 die bisherige Standardannahme unseres
        Wärmepumpen-Modells.
      </p>
    </>
  );
}