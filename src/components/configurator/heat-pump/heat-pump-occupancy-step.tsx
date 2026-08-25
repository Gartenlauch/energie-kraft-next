"use client";

import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { heatPumpOccupancyOptions } from "@/content/configurators";

interface HeatPumpOccupancyStepProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

export function HeatPumpOccupancyStep({
  value,
  onChange,
}: HeatPumpOccupancyStepProps) {
  return (
    <SelectionGrid columns={2}>
      {heatPumpOccupancyOptions.map(
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