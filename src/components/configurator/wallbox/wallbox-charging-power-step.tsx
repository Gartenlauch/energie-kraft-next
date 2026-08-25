"use client";

import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { wallboxChargingPowerOptions } from "@/content/configurators";
import type {
  WallboxChargingPowerKw,
} from "@/types/configurator";

interface WallboxChargingPowerStepProps {
  value: WallboxChargingPowerKw | undefined;

  onChange: (
    value: WallboxChargingPowerKw,
  ) => void;
}

export function WallboxChargingPowerStep({
  value,
  onChange,
}: WallboxChargingPowerStepProps) {
  return (
    <SelectionGrid columns={3}>
      {wallboxChargingPowerOptions.map(
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