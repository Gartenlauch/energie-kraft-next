import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { NumericInputField } from "@/components/configurator/numeric-input-field";
import { SelectionCard } from "@/components/configurator/selection-card";
import { SelectionGrid } from "@/components/configurator/selection-grid";
import { photovoltaicFutureIncreaseOptions } from "@/content/configurators";
import { calculateAdditionalConsumptionKwh } from "@/lib/configurator/photovoltaic";
import { getFutureIncreaseValidationMessage } from "@/lib/validation/configurator/photovoltaic";

interface FutureConsumptionStepProps {
  annualConsumptionKwh: number | undefined;
  futureIncreasePercent: number;
  projectedConsumptionKwh: number | undefined;
  onChange: (value: number) => void;
}

function formatKwh(value: number | undefined): string {
  if (value === undefined) {
    return "–";
  }

  return `${new Intl.NumberFormat("de-DE").format(value)} kWh`;
}

export function FutureConsumptionStep({
  annualConsumptionKwh,
  futureIncreasePercent,
  projectedConsumptionKwh,
  onChange,
}: FutureConsumptionStepProps) {
  const additionalConsumptionKwh =
    calculateAdditionalConsumptionKwh(
      annualConsumptionKwh,
      futureIncreasePercent,
    );

  const error =
    getFutureIncreaseValidationMessage(
      futureIncreasePercent,
    );

  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-future-consumption-heading"
      eyebrow="Photovoltaik-Konfigurator"
      title="Wird sich dein Stromverbrauch künftig erhöhen?"
      description="Ein höherer Verbrauch kann zum Beispiel durch Elektroauto, Wärmepumpe oder Klimaanlage entstehen."
    >
      <SelectionGrid columns={4}>
        {photovoltaicFutureIncreaseOptions.map(
          (option) => (
            <SelectionCard
              key={option.value}
              title={option.title}
              description={option.description}
              selected={
                futureIncreasePercent === option.value
              }
              onSelect={() => onChange(option.value)}
            />
          ),
        )}
      </SelectionGrid>

      <div className="mt-8 max-w-md">
        <NumericInputField
          id="future-increase-percent"
          label="Eigene Angabe"
          value={futureIncreasePercent}
          onChange={(value) => {
            if (value !== undefined) {
              onChange(value);
            }
          }}
          min={0}
          max={200}
          step={1}
          unit="%"
          helpText="Du kannst statt der Vorauswahl auch einen eigenen Prozentwert eingeben."
          error={error}
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border-default">
        <dl className="divide-y divide-border-default">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-foreground/70">
              Aktueller Verbrauch
            </dt>
            <dd className="font-semibold text-brand-primary">
              {formatKwh(annualConsumptionKwh)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-foreground/70">
              Erhöhung
            </dt>
            <dd className="font-semibold text-brand-primary">
              {futureIncreasePercent} %
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-foreground/70">
              Zusätzlicher Verbrauch
            </dt>
            <dd className="font-semibold text-brand-primary">
              {formatKwh(additionalConsumptionKwh)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-4 bg-surface px-5 py-4">
            <dt className="font-semibold text-brand-primary">
              Künftig berücksichtigt
            </dt>
            <dd className="font-semibold text-brand-primary">
              {formatKwh(projectedConsumptionKwh)}
            </dd>
          </div>
        </dl>
      </div>
    </ConfiguratorStepSection>
  );
}