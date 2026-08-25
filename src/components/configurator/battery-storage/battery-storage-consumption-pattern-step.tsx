"use client";

import {
  batteryStorageConsumptionPatternOptions,
} from "@/content/configurators";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import type {
  BatteryStorageConsumptionPattern,
} from "@/types/configurator";

interface BatteryStorageConsumptionPatternStepProps {
  value:
    | BatteryStorageConsumptionPattern
    | undefined;

  onChange: (
    value: BatteryStorageConsumptionPattern,
  ) => void;
}

export function BatteryStorageConsumptionPatternStep({
  value,
  onChange,
}: BatteryStorageConsumptionPatternStepProps) {
  return (
    <SelectionGrid columns={2}>
      {batteryStorageConsumptionPatternOptions.map(
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