"use client";

import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { wallboxPvChargingOptions } from "@/content/configurators";

interface WallboxPhotovoltaicStepProps {
  value: number | undefined;
  hasPhotovoltaicContext: boolean;
  onChange: (value: number) => void;
}

export function WallboxPhotovoltaicStep({
  value,
  hasPhotovoltaicContext,
  onChange,
}: WallboxPhotovoltaicStepProps) {
  return (
    <>
      {hasPhotovoltaicContext ? (
        <div className="mb-6 rounded-2xl border border-border-default bg-surface p-5">
          <p className="font-semibold text-brand-primary">
            Photovoltaik bereits berücksichtigt
          </p>

          <p className="mt-2 text-sm leading-6 text-foreground/70">
            Aus deiner vorherigen Konfiguration wissen wir,
            dass eine Photovoltaikanlage berücksichtigt
            werden soll. Wie viel davon tatsächlich zum
            Laden genutzt werden kann, hängt aber stark vom
            Ladezeitpunkt ab. Deshalb wählen wir den
            erwarteten Anteil hier separat.
          </p>
        </div>
      ) : null}

      <SelectionGrid columns={2}>
        {wallboxPvChargingOptions.map(
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
    </>
  );
}