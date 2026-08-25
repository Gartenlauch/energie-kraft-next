"use client";

import {
  batteryStorageBackupOptions,
} from "@/content/configurators";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import type {
  BatteryStorageBackupPreference,
} from "@/types/configurator";

interface BatteryStorageBackupStepProps {
  value:
    | BatteryStorageBackupPreference
    | undefined;

  onChange: (
    value: BatteryStorageBackupPreference,
  ) => void;
}

export function BatteryStorageBackupStep({
  value,
  onChange,
}: BatteryStorageBackupStepProps) {
  return (
    <SelectionGrid columns={2}>
      {batteryStorageBackupOptions.map(
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