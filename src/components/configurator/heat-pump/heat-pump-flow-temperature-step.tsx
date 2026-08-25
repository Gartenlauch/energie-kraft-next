"use client";

import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { heatPumpFlowTemperatureOptions } from "@/content/configurators";

interface HeatPumpFlowTemperatureStepProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

export function HeatPumpFlowTemperatureStep({
  value,
  onChange,
}: HeatPumpFlowTemperatureStepProps) {
  return (
    <>
      <SelectionGrid columns={2}>
        {heatPumpFlowTemperatureOptions.map(
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
        Wenn du die Vorlauftemperatur nicht genau
        kennst, kann sie häufig an kalten Tagen an
        der bestehenden Heizungsregelung abgelesen
        werden.
      </p>
    </>
  );
}