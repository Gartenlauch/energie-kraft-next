"use client";

import { useState } from "react";

import {
  defaultHeatPumpCalculatorInput,
  heatPumpCalculatorContent,
  type HeatPumpNumberFieldContent,
} from "@/content/pages/waermepumpen-rechner";
import { calculateHeatPumpCost } from "@/lib/calculators/heat-pump-cost";
import { heatPumpCalculatorInputSchema } from "@/lib/validation/heat-pump-calculator";
import type {
  HeatPumpCalculatorInput,
  HeatPumpCalculatorResult,
  HeatPumpNumericInputKey,
} from "@/types/heat-pump-calculator";

type HeatPumpFormValues = {
  [Key in keyof HeatPumpCalculatorInput]: string;
};

type HeatPumpFieldErrors = Partial<
  Record<keyof HeatPumpCalculatorInput, string>
>;

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 2,
});

function createFormValues(
  input: HeatPumpCalculatorInput,
): HeatPumpFormValues {
  return {
    heatedAreaM2: String(input.heatedAreaM2),

    specificSpaceHeatingDemandKwhPerM2Year: String(
      input.specificSpaceHeatingDemandKwhPerM2Year,
    ),

    occupancyPersons: String(input.occupancyPersons),

    hotWaterDemandKwhPerPersonYear: String(
      input.hotWaterDemandKwhPerPersonYear,
    ),

    annualPerformanceFactor: String(
      input.annualPerformanceFactor,
    ),

    equivalentFullLoadHours: String(
      input.equivalentFullLoadHours,
    ),

    capacityReservePercent: String(
      input.capacityReservePercent,
    ),

    requiredFlowTemperatureC: String(
      input.requiredFlowTemperatureC,
    ),

    electricityPriceEuroPerKwh: String(
      input.electricityPriceEuroPerKwh,
    ),

    currentHeatingEnergyPriceEuroPerKwh: String(
      input.currentHeatingEnergyPriceEuroPerKwh,
    ),

    currentHeatingEfficiencyPercent: String(
      input.currentHeatingEfficiencyPercent,
    ),

    heatPumpCostEuroPerKw: String(
      input.heatPumpCostEuroPerKw,
    ),

    installationBaseCostEuro: String(
      input.installationBaseCostEuro,
    ),

    fixedAdditionalCostEuro: String(
      input.fixedAdditionalCostEuro,
    ),

    costUncertaintyPercent: String(
      input.costUncertaintyPercent,
    ),
  };
}

function createCalculatorInput(
  values: HeatPumpFormValues,
): HeatPumpCalculatorInput {
  return {
    heatedAreaM2: Number(values.heatedAreaM2),

    specificSpaceHeatingDemandKwhPerM2Year: Number(
      values.specificSpaceHeatingDemandKwhPerM2Year,
    ),

    occupancyPersons: Number(values.occupancyPersons),

    hotWaterDemandKwhPerPersonYear: Number(
      values.hotWaterDemandKwhPerPersonYear,
    ),

    annualPerformanceFactor: Number(
      values.annualPerformanceFactor,
    ),

    equivalentFullLoadHours: Number(
      values.equivalentFullLoadHours,
    ),

    capacityReservePercent: Number(
      values.capacityReservePercent,
    ),

    requiredFlowTemperatureC: Number(
      values.requiredFlowTemperatureC,
    ),

    electricityPriceEuroPerKwh: Number(
      values.electricityPriceEuroPerKwh,
    ),

    currentHeatingEnergyPriceEuroPerKwh: Number(
      values.currentHeatingEnergyPriceEuroPerKwh,
    ),

    currentHeatingEfficiencyPercent: Number(
      values.currentHeatingEfficiencyPercent,
    ),

    heatPumpCostEuroPerKw: Number(
      values.heatPumpCostEuroPerKw,
    ),

    installationBaseCostEuro: Number(
      values.installationBaseCostEuro,
    ),

    fixedAdditionalCostEuro: Number(
      values.fixedAdditionalCostEuro,
    ),

    costUncertaintyPercent: Number(
      values.costUncertaintyPercent,
    ),
  };
}

function isHeatPumpFieldName(
  value: unknown,
): value is keyof HeatPumpCalculatorInput {
  return (
    typeof value === "string" &&
    Object.hasOwn(defaultHeatPumpCalculatorInput, value)
  );
}

interface NumberFieldProps {
  field: HeatPumpNumberFieldContent;
  value: string;
  error?: string;
  onChange: (
    name: HeatPumpNumericInputKey,
    value: string,
  ) => void;
}

function NumberField({
  field,
  value,
  error,
  onChange,
}: NumberFieldProps) {
  const id = `heat-pump-calculator-${field.name}`;

  const describedBy = error
    ? `${id}-help ${id}-error`
    : `${id}-help`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold"
      >
        {field.label}
      </label>

      <div className="mt-2 flex rounded-md shadow-sm">
        <input
          id={id}
          name={field.name}
          type="number"
          value={value}
          min={field.min}
          max={field.max}
          step={field.step}
          inputMode={field.step < 1 ? "decimal" : "numeric"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) =>
            onChange(
              field.name,
              event.currentTarget.value,
            )
          }
          className={`bg-background min-h-12 min-w-0 flex-1 rounded-l-md border px-4 py-3 text-base ${
            error
              ? "border-red-600"
              : "border-foreground/20"
          }`}
        />

        <span className="border-foreground/20 bg-foreground/[0.04] text-foreground/70 inline-flex min-w-24 items-center justify-center rounded-r-md border border-l-0 px-3 text-sm">
          {field.unit}
        </span>
      </div>

      <p
        id={`${id}-help`}
        className="text-foreground/60 mt-2 text-sm leading-6"
      >
        {field.helpText}
      </p>

      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface ResultCardProps {
  label: string;
  value: string;
  description: string;
}

function ResultCard({
  label,
  value,
  description,
}: ResultCardProps) {
  return (
    <article className="border-foreground/10 bg-background rounded-xl border p-6">
      <p className="text-foreground/60 text-sm font-semibold tracking-wide uppercase">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="text-foreground/65 mt-3 text-sm leading-6">
        {description}
      </p>
    </article>
  );
}

export function HeatPumpCostCalculator() {
  const [formValues, setFormValues] =
    useState<HeatPumpFormValues>(() =>
      createFormValues(defaultHeatPumpCalculatorInput),
    );

  const [fieldErrors, setFieldErrors] =
    useState<HeatPumpFieldErrors>({});

  const [generalError, setGeneralError] = useState<
    string | null
  >(null);

  const [result, setResult] =
    useState<HeatPumpCalculatorResult>(() =>
      calculateHeatPumpCost(
        defaultHeatPumpCalculatorInput,
      ),
    );

  function clearFieldError(
    name: keyof HeatPumpCalculatorInput,
  ) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];

      return nextErrors;
    });

    setGeneralError(null);
  }

  function handleNumberChange(
    name: HeatPumpNumericInputKey,
    value: string,
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    clearFieldError(name);
  }

  function handleSubmit() {
    const input = createCalculatorInput(formValues);

    const validationResult =
      heatPumpCalculatorInputSchema.safeParse(input);

    if (!validationResult.success) {
      const nextErrors: HeatPumpFieldErrors = {};

      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0];

        if (
          isHeatPumpFieldName(fieldName) &&
          !nextErrors[fieldName]
        ) {
          nextErrors[fieldName] =
            "Bitte geben Sie einen gültigen Wert innerhalb des zulässigen Bereichs ein.";
        }
      }

      setFieldErrors(nextErrors);

      setGeneralError(
        "Die Berechnung konnte noch nicht aktualisiert werden. Bitte prüfen Sie die markierten Eingaben.",
      );

      return;
    }

    setFieldErrors({});
    setGeneralError(null);

    setResult(
      calculateHeatPumpCost(validationResult.data),
    );
  }

  function handleReset() {
    setFormValues(
      createFormValues(defaultHeatPumpCalculatorInput),
    );

    setFieldErrors({});
    setGeneralError(null);

    setResult(
      calculateHeatPumpCost(
        defaultHeatPumpCalculatorInput,
      ),
    );
  }

  const assessment =
    heatPumpCalculatorContent.assessmentContent[
      result.flowTemperatureAssessment
    ];

  const hasOperatingCostAdvantage =
    result.annualOperatingCostDifferenceEuro >= 0;

  const operatingCostDifferenceValue =
    currencyFormatter.format(
      Math.abs(result.annualOperatingCostDifferenceEuro),
    );

  return (
    <section
      id="waermepumpen-berechnung"
      className="border-foreground/10 scroll-mt-24 border-t px-6 py-20"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase">
            Ihre Angaben
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Gebäude- und Heizungsdaten erfassen
          </h2>

          <p className="text-foreground/70 mt-5 max-w-2xl text-lg leading-8">
            Die Modellrechnung verbindet Wärmebedarf,
            Warmwasser, Vorlauftemperatur, Effizienz,
            Energiepreise und veränderbare Kostenannahmen.
          </p>

          <form
            noValidate
            className="mt-10"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <fieldset>
              <legend className="text-xl font-semibold">
                Grunddaten
              </legend>

              <div className="mt-6 grid gap-7 md:grid-cols-2">
                {heatPumpCalculatorContent.primaryFields.map(
                  (field) => (
                    <NumberField
                      key={field.name}
                      field={field}
                      value={formValues[field.name]}
                      error={fieldErrors[field.name]}
                      onChange={handleNumberChange}
                    />
                  ),
                )}
              </div>
            </fieldset>

            <details className="border-foreground/10 mt-8 rounded-xl border">
              <summary className="cursor-pointer px-5 py-4 font-semibold">
                Erweiterte Modellannahmen anzeigen
              </summary>

              <fieldset className="border-foreground/10 border-t p-5">
                <legend className="sr-only">
                  Erweiterte Modellannahmen
                </legend>

                <div className="grid gap-7 md:grid-cols-2">
                  {heatPumpCalculatorContent.advancedFields.map(
                    (field) => (
                      <NumberField
                        key={field.name}
                        field={field}
                        value={formValues[field.name]}
                        error={fieldErrors[field.name]}
                        onChange={handleNumberChange}
                      />
                    ),
                  )}
                </div>
              </fieldset>
            </details>

            {generalError ? (
              <p
                role="alert"
                className="mt-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
              >
                {generalError}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="submit"
                className="bg-foreground text-background inline-flex min-h-12 items-center justify-center rounded-md px-6 py-3 text-sm font-semibold"
              >
                Wärmepumpe berechnen
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="border-foreground/20 inline-flex min-h-12 items-center justify-center rounded-md border px-6 py-3 text-sm font-semibold"
              >
                Ausgangswerte wiederherstellen
              </button>
            </div>
          </form>
        </div>

        <div
          aria-live="polite"
          aria-atomic="false"
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <div className="bg-foreground/[0.035] rounded-2xl p-5 md:p-7">
            <p className="text-sm font-semibold tracking-widest uppercase">
              Ergebnis
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Unverbindliche Wärmepumpen-Orientierung
            </h2>

            <div
              className={`mt-6 rounded-xl border p-5 ${
                result.ntReady
                  ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                  : "border-amber-400 bg-amber-50 text-amber-950"
              }`}
            >
              <p className="font-semibold">
                {assessment.label}
              </p>

              <p className="mt-2 text-sm leading-6">
                {assessment.description}
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <ResultCard
                label="Empfohlene Wärmepumpenleistung"
                value={`${numberFormatter.format(
                  result.recommendedHeatPumpCapacityKw,
                )} kW`}
                description={`Überschlägiger Bedarf von ${numberFormatter.format(
                  result.requiredCapacityBeforeReserveKw,
                )} kW zuzüglich ${numberFormatter.format(
                  result.input.capacityReservePercent,
                )} % Modellreserve.`}
              />

              <ResultCard
                label="Jährlicher Wärmebedarf"
                value={`${numberFormatter.format(
                  result.totalAnnualHeatDemandKwh,
                )} kWh`}
                description={`${numberFormatter.format(
                  result.spaceHeatingDemandKwh,
                )} kWh Raumwärme und ${numberFormatter.format(
                  result.hotWaterDemandKwh,
                )} kWh Warmwasser.`}
              />

              <ResultCard
                label="Wärmepumpen-Stromverbrauch"
                value={`${numberFormatter.format(
                  result.annualHeatPumpElectricityConsumptionKwh,
                )} kWh`}
                description={`Berechnet mit einer Jahresarbeitszahl von ${numberFormatter.format(
                  result.input.annualPerformanceFactor,
                )}.`}
              />

              <ResultCard
                label="Wärmepumpen-Stromkosten"
                value={currencyFormatter.format(
                  result.annualHeatPumpOperatingCostEuro,
                )}
                description={`Jährliche Modellkosten bei ${numberFormatter.format(
                  result.input.electricityPriceEuroPerKwh,
                )} € je kWh Strom.`}
              />

              <ResultCard
                label="Kosten bestehende Heizung"
                value={currencyFormatter.format(
                  result.currentHeatingOperatingCostEuro,
                )}
                description={`Jährliche Modellkosten bei ${numberFormatter.format(
                  result.input.currentHeatingEfficiencyPercent,
                )} % Wirkungsgrad.`}
              />

              <ResultCard
                label={
                  hasOperatingCostAdvantage
                    ? "Jährlicher Kostenvorteil"
                    : "Jährliche Mehrkosten"
                }
                value={operatingCostDifferenceValue}
                description={
                  hasOperatingCostAdvantage
                    ? "Die Wärmepumpe besitzt im Modell niedrigere jährliche Energiekosten."
                    : "Die Wärmepumpe besitzt mit den eingegebenen Annahmen höhere jährliche Energiekosten."
                }
              />

              <ResultCard
                label="Geschätzte Gesamtkosten"
                value={currencyFormatter.format(
                  result.estimatedTotalCostEuro,
                )}
                description="Wärmepumpe, modellierte Installation und weitere eingegebene Projektkosten."
              />

              <ResultCard
                label="Kostenkorridor"
                value={`${currencyFormatter.format(
                  result.estimatedMinimumCostEuro,
                )} – ${currencyFormatter.format(
                  result.estimatedMaximumCostEuro,
                )}`}
                description={`Orientierungsbereich mit ± ${numberFormatter.format(
                  result.input.costUncertaintyPercent,
                )} % Abweichung.`}
              />
            </div>

            <div className="border-foreground/10 bg-background mt-6 overflow-hidden rounded-xl border">
              <div className="border-foreground/10 border-b px-5 py-4">
                <h3 className="text-lg font-semibold">
                  Kostenaufteilung
                </h3>
              </div>

              <dl className="divide-foreground/10 divide-y">
                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">
                    Wärmepumpe
                  </dt>

                  <dd className="font-semibold">
                    {currencyFormatter.format(
                      result.heatPumpEquipmentCostEuro,
                    )}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">
                    Installation und Einbindung
                  </dt>

                  <dd className="font-semibold">
                    {currencyFormatter.format(
                      result.installationBaseCostEuro,
                    )}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">
                    Weitere Projektkosten
                  </dt>

                  <dd className="font-semibold">
                    {currencyFormatter.format(
                      result.fixedAdditionalCostEuro,
                    )}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="font-semibold">
                    Orientierungswert gesamt
                  </dt>

                  <dd className="text-lg font-semibold">
                    {currencyFormatter.format(
                      result.estimatedTotalCostEuro,
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">
                Modellannahmen
              </h3>

              <ul className="text-foreground/65 mt-4 space-y-3 text-sm leading-6">
                {heatPumpCalculatorContent.modelNotes.map(
                  (note) => (
                    <li key={note} className="flex gap-3">
                      <span aria-hidden="true">•</span>
                      <span>{note}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <p className="text-foreground/60 mt-6 text-sm leading-6">
              {heatPumpCalculatorContent.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}