"use client";

import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { wallboxHomeChargingOptions } from "@/content/configurators";

interface WallboxHomeChargingStepProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

export function WallboxHomeChargingStep({
  value,
  onChange,
}: WallboxHomeChargingStepProps) {
  return (
    <SelectionGrid columns={2}>
      {wallboxHomeChargingOptions.map(
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