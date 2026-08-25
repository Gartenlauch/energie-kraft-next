"use client";

import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { heatPumpHeatingDemandOptions } from "@/content/configurators";

interface HeatPumpHeatingDemandStepProps {
  value: number | undefined;
  onChange: (value: number) => void;
}

export function HeatPumpHeatingDemandStep({
  value,
  onChange,
}: HeatPumpHeatingDemandStepProps) {
  return (
    <>
      <SelectionGrid columns={2}>
        {heatPumpHeatingDemandOptions.map(
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
        Wenn dir ein genauer Wert aus einem
        Energieausweis oder einer energetischen
        Berechnung vorliegt, kann er später im
        detaillierten Wärmepumpen-Rechner verwendet
        werden.
      </p>
    </>
  );
}