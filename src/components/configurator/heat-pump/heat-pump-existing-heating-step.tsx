"use client";

import { NumericInputField } from "@/components/configurator/numeric-input-field";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import type { ExistingHeatingSystem } from "@/types/configurator";

const OPTIONS: readonly {
  value: ExistingHeatingSystem;
  title: string;
  description: string;
}[] = [
  { value: "gas", title: "Gasheizung", description: "Vergleich mit deinem heutigen Gasverbrauch oder dem Wärmemodell." },
  { value: "oil", title: "Ölheizung", description: "Vergleich mit deinem Heizölverbrauch oder dem Wärmemodell." },
  { value: "new_build", title: "Neubau / keine bestehende Heizung", description: "Kein bisheriges System; wir kennzeichnen ein Öl-Referenzszenario ausdrücklich." },
  { value: "other_unknown", title: "Andere / weiß nicht", description: "Wir zeigen die Wärmepumpenkosten ohne erfundenen Altanlagenvergleich." },
];

interface HeatPumpExistingHeatingStepProps {
  selected: ExistingHeatingSystem | undefined;
  annualGasConsumptionKwh: number | undefined;
  annualOilConsumptionLitres: number | undefined;
  onSelect: (value: ExistingHeatingSystem) => void;
  onGasConsumptionChange: (value: number | undefined) => void;
  onOilConsumptionChange: (value: number | undefined) => void;
}

export function HeatPumpExistingHeatingStep({
  selected,
  annualGasConsumptionKwh,
  annualOilConsumptionLitres,
  onSelect,
  onGasConsumptionChange,
  onOilConsumptionChange,
}: HeatPumpExistingHeatingStepProps) {
  return (
    <div>
      <SelectionGrid columns={2}>
        {OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            title={option.title}
            description={option.description}
            selected={selected === option.value}
            onSelect={() => onSelect(option.value)}
          />
        ))}
      </SelectionGrid>

      {selected === "gas" ? (
        <div className="border-border-default bg-surface mt-6 rounded-2xl border p-5 sm:p-6">
          <NumericInputField
            id="heat-pump-gas-consumption"
            label="Jährlicher Gasverbrauch (optional)"
            value={annualGasConsumptionKwh}
            onChange={onGasConsumptionChange}
            min={500}
            max={200000}
            unit="kWh/Jahr"
            helpText="Den Wert findest du meist auf deiner letzten Gasabrechnung. Ohne Angabe rechnen wir transparent mit dem modellierten Wärmebedarf."
          />
        </div>
      ) : null}

      {selected === "oil" ? (
        <div className="border-border-default bg-surface mt-6 rounded-2xl border p-5 sm:p-6">
          <NumericInputField
            id="heat-pump-oil-consumption"
            label="Jährlicher Heizölverbrauch (optional)"
            value={annualOilConsumptionLitres}
            onChange={onOilConsumptionChange}
            min={50}
            max={20000}
            unit="Liter/Jahr"
            helpText="Den Wert findest du meist auf deiner letzten Heizölabrechnung. Die Umrechnung in Energie wird später in den PDF-Annahmen offengelegt."
          />
        </div>
      ) : null}
    </div>
  );
}
