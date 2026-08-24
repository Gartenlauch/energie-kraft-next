import { ConfiguratorStepSection } from "@/components/configurator/configurator-step-section";
import { NumericInputField } from "@/components/configurator/numeric-input-field";
import { photovoltaicConfiguratorContent } from "@/content/configurators";
import {
  PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MAX_KWH,
  PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MIN_KWH,
} from "@/lib/configurator/photovoltaic";
import { getAnnualConsumptionValidationMessage } from "@/lib/validation/configurator/photovoltaic";

interface AnnualConsumptionStepProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function AnnualConsumptionStep({
  value,
  onChange,
}: AnnualConsumptionStepProps) {
  const error =
    getAnnualConsumptionValidationMessage(value);

  return (
    <ConfiguratorStepSection
      headingId="photovoltaic-consumption-heading"
      eyebrow={photovoltaicConfiguratorContent.eyebrow}
      title="Wie hoch ist dein Jahresstromverbrauch?"
      description="Wir haben anhand deiner Haushaltsgröße bereits einen Richtwert vorausgewählt. Du kannst ihn jederzeit ändern."
    >
      <div className="max-w-xl">
        <NumericInputField
          id="annual-consumption-kwh"
          label="Jahresstromverbrauch"
          value={value}
          onChange={onChange}
          min={PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MIN_KWH}
          max={PHOTOVOLTAIC_ANNUAL_CONSUMPTION_MAX_KWH}
          step={100}
          unit="kWh/Jahr"
          helpText={
            photovoltaicConfiguratorContent.consumptionHelp
          }
          error={error}
        />

        <div className="mt-6 rounded-2xl border border-border-default bg-surface p-5">
          <p className="text-sm leading-6 text-foreground/70">
            Dieser Wert dient zunächst als Grundlage für die
            weitere Konfiguration. Im nächsten Abschnitt erfassen
            wir die Angaben zu deinem Dach.
          </p>
        </div>
      </div>
    </ConfiguratorStepSection>
  );
}