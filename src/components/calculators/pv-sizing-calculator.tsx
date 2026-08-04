"use client";

import { useState } from "react";

import {
  defaultPvSizingCalculatorInput,
  pvSizingCalculatorContent,
  type PvSizingNumberFieldContent,
} from "@/content/pages/pv-kostenrechner";
import { calculatePvSizing } from "@/lib/calculators/pv-sizing";
import { pvSizingCalculatorInputSchema } from "@/lib/validation/pv-sizing-calculator";
import type {
  PvRoofOrientation,
  PvShadingLevel,
  PvSizingCalculatorInput,
  PvSizingCalculatorResult,
  PvSizingNumericInputKey,
} from "@/types/pv-sizing-calculator";

type PvSizingFormValues = {
  [Key in keyof PvSizingCalculatorInput]: PvSizingCalculatorInput[Key] extends number
    ? string
    : PvSizingCalculatorInput[Key];
};

type PvSizingFieldErrors = Partial<Record<keyof PvSizingCalculatorInput, string>>;

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function createFormValues(input: PvSizingCalculatorInput): PvSizingFormValues {
  return {
    annualConsumptionKwh: String(input.annualConsumptionKwh),

    availableRoofAreaM2: String(input.availableRoofAreaM2),

    roofOrientation: input.roofOrientation,
    shadingLevel: input.shadingLevel,

    targetGenerationCoveragePercent: String(input.targetGenerationCoveragePercent),

    modulePowerWattPeak: String(input.modulePowerWattPeak),

    moduleAreaM2: String(input.moduleAreaM2),

    usableRoofAreaPercent: String(input.usableRoofAreaPercent),

    baseSpecificYieldKwhPerKwp: String(input.baseSpecificYieldKwhPerKwp),

    pvCostEuroPerKwp: String(input.pvCostEuroPerKwp),

    includeBattery: input.includeBattery,

    batteryCostEuroPerKwh: String(input.batteryCostEuroPerKwh),

    batteryCapacityPerKwp: String(input.batteryCapacityPerKwp),

    fixedAdditionalCostEuro: String(input.fixedAdditionalCostEuro),

    costUncertaintyPercent: String(input.costUncertaintyPercent),
  };
}

function createCalculatorInput(values: PvSizingFormValues): PvSizingCalculatorInput {
  return {
    annualConsumptionKwh: Number(values.annualConsumptionKwh),

    availableRoofAreaM2: Number(values.availableRoofAreaM2),

    roofOrientation: values.roofOrientation,
    shadingLevel: values.shadingLevel,

    targetGenerationCoveragePercent: Number(values.targetGenerationCoveragePercent),

    modulePowerWattPeak: Number(values.modulePowerWattPeak),

    moduleAreaM2: Number(values.moduleAreaM2),

    usableRoofAreaPercent: Number(values.usableRoofAreaPercent),

    baseSpecificYieldKwhPerKwp: Number(values.baseSpecificYieldKwhPerKwp),

    pvCostEuroPerKwp: Number(values.pvCostEuroPerKwp),

    includeBattery: values.includeBattery,

    batteryCostEuroPerKwh: Number(values.batteryCostEuroPerKwh),

    batteryCapacityPerKwp: Number(values.batteryCapacityPerKwp),

    fixedAdditionalCostEuro: Number(values.fixedAdditionalCostEuro),

    costUncertaintyPercent: Number(values.costUncertaintyPercent),
  };
}

function isPvSizingFieldName(value: unknown): value is keyof PvSizingCalculatorInput {
  return typeof value === "string" && Object.hasOwn(defaultPvSizingCalculatorInput, value);
}

interface NumberFieldProps {
  field: PvSizingNumberFieldContent;
  value: string;
  error?: string;
  disabled?: boolean;
  onChange: (name: PvSizingNumericInputKey, value: string) => void;
}

function NumberField({ field, value, error, disabled = false, onChange }: NumberFieldProps) {
  const id = `pv-sizing-${field.name}`;

  const describedBy = error ? `${id}-help ${id}-error` : `${id}-help`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
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
          disabled={disabled}
          inputMode={field.step < 1 ? "decimal" : "numeric"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(field.name, event.currentTarget.value)}
          className={`bg-background min-h-12 min-w-0 flex-1 rounded-l-md border px-4 py-3 text-base disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-red-600" : "border-foreground/20"
          }`}
        />

        <span className="border-foreground/20 bg-foreground/[0.04] text-foreground/70 inline-flex min-w-24 items-center justify-center rounded-r-md border border-l-0 px-3 text-sm">
          {field.unit}
        </span>
      </div>

      <p id={`${id}-help`} className="text-foreground/60 mt-2 text-sm leading-6">
        {field.helpText}
      </p>

      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-red-700">
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

function ResultCard({ label, value, description }: ResultCardProps) {
  return (
    <article className="border-foreground/10 bg-background rounded-xl border p-6">
      <p className="text-foreground/60 text-sm font-semibold tracking-wide uppercase">{label}</p>

      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>

      <p className="text-foreground/65 mt-3 text-sm leading-6">{description}</p>
    </article>
  );
}

export function PvSizingCalculator() {
  const [formValues, setFormValues] = useState<PvSizingFormValues>(() =>
    createFormValues(defaultPvSizingCalculatorInput),
  );

  const [fieldErrors, setFieldErrors] = useState<PvSizingFieldErrors>({});

  const [generalError, setGeneralError] = useState<string | null>(null);

  const [result, setResult] = useState<PvSizingCalculatorResult>(() =>
    calculatePvSizing(defaultPvSizingCalculatorInput),
  );

  function clearFieldError(name: keyof PvSizingCalculatorInput) {
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

  function handleNumberChange(name: PvSizingNumericInputKey, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    clearFieldError(name);
  }
  function handleBatteryChange(includeBattery: boolean) {
    setFormValues((currentValues) => ({
      ...currentValues,
      includeBattery,
    }));

    clearFieldError("includeBattery");
  }

  function handleSubmit() {
    const input = createCalculatorInput(formValues);

    const validationResult = pvSizingCalculatorInputSchema.safeParse(input);

    if (!validationResult.success) {
      const nextErrors: PvSizingFieldErrors = {};

      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0];

        if (isPvSizingFieldName(fieldName) && !nextErrors[fieldName]) {
          nextErrors[fieldName] = issue.message || "Bitte geben Sie einen gültigen Wert ein.";
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
    setResult(calculatePvSizing(validationResult.data));
  }

  function handleReset() {
    setFormValues(createFormValues(defaultPvSizingCalculatorInput));

    setFieldErrors({});
    setGeneralError(null);

    setResult(calculatePvSizing(defaultPvSizingCalculatorInput));
  }

  return (
    <section
      id="pv-kosten-berechnung"
      className="border-foreground/10 scroll-mt-24 border-t px-6 py-20"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase">Ihre Angaben</p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Dachfläche und Strombedarf erfassen
          </h2>

          <p className="text-foreground/70 mt-5 max-w-2xl text-lg leading-8">
            Die Berechnung verwendet Ihre Angaben zusammen mit transparenten und veränderbaren
            Modellannahmen.
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
              <legend className="text-xl font-semibold">Grunddaten</legend>

              <div className="mt-6 grid gap-7 md:grid-cols-2">
                {pvSizingCalculatorContent.primaryFields.map((field) => (
                  <NumberField
                    key={field.name}
                    field={field}
                    value={formValues[field.name]}
                    error={fieldErrors[field.name]}
                    onChange={handleNumberChange}
                  />
                ))}

                <div>
                  <label
                    htmlFor="pv-sizing-roof-orientation"
                    className="block text-sm font-semibold"
                  >
                    Dachausrichtung
                  </label>

                  <select
                    id="pv-sizing-roof-orientation"
                    value={formValues.roofOrientation}
                    aria-describedby="pv-sizing-roof-orientation-help"
                    onChange={(event) => {
                      const value = event.currentTarget.value as PvRoofOrientation;

                      setFormValues((currentValues) => ({
                        ...currentValues,
                        roofOrientation: value,
                      }));

                      clearFieldError("roofOrientation");
                    }}
                    className="border-foreground/20 bg-background mt-2 min-h-12 w-full rounded-md border px-4 py-3 text-base"
                  >
                    {pvSizingCalculatorContent.orientationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <p
                    id="pv-sizing-roof-orientation-help"
                    className="text-foreground/60 mt-2 text-sm leading-6"
                  >
                    Vereinfachte Hauptrichtung der nutzbaren Modulfläche.
                  </p>
                </div>

                <div>
                  <label htmlFor="pv-sizing-shading" className="block text-sm font-semibold">
                    Verschattung
                  </label>

                  <select
                    id="pv-sizing-shading"
                    value={formValues.shadingLevel}
                    aria-describedby="pv-sizing-shading-help"
                    onChange={(event) => {
                      const value = event.currentTarget.value as PvShadingLevel;

                      setFormValues((currentValues) => ({
                        ...currentValues,
                        shadingLevel: value,
                      }));

                      clearFieldError("shadingLevel");
                    }}
                    className="border-foreground/20 bg-background mt-2 min-h-12 w-full rounded-md border px-4 py-3 text-base"
                  >
                    {pvSizingCalculatorContent.shadingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <p
                    id="pv-sizing-shading-help"
                    className="text-foreground/60 mt-2 text-sm leading-6"
                  >
                    Erste Einordnung für Bäume, Gebäude, Gauben, Kamine oder andere Hindernisse.
                  </p>
                </div>
              </div>

              <div className="border-foreground/10 mt-8 rounded-xl border p-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formValues.includeBattery}
                    onChange={(event) => {
                      handleBatteryChange(event.target.checked);
                    }}
                    className="mt-1 size-5"
                  />
                  <span>
                    <span className="block font-semibold">
                      {pvSizingCalculatorContent.batteryField.label}
                    </span>

                    <span className="text-foreground/65 mt-1 block text-sm leading-6">
                      {pvSizingCalculatorContent.batteryField.helpText}
                    </span>
                  </span>
                </label>
              </div>
            </fieldset>

            <details className="border-foreground/10 mt-8 rounded-xl border">
              <summary className="cursor-pointer px-5 py-4 font-semibold">
                Erweiterte Modellannahmen anzeigen
              </summary>

              <fieldset className="border-foreground/10 border-t p-5">
                <legend className="sr-only">Erweiterte Modellannahmen</legend>

                <div className="grid gap-7 md:grid-cols-2">
                  {pvSizingCalculatorContent.advancedFields.map((field) => {
                    const isBatteryField =
                      field.name === "batteryCostEuroPerKwh" ||
                      field.name === "batteryCapacityPerKwp";

                    return (
                      <NumberField
                        key={field.name}
                        field={field}
                        value={formValues[field.name]}
                        error={fieldErrors[field.name]}
                        disabled={isBatteryField && !formValues.includeBattery}
                        onChange={handleNumberChange}
                      />
                    );
                  })}
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
                Größe und Kosten berechnen
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

        <div aria-live="polite" aria-atomic="false" className="lg:sticky lg:top-28 lg:self-start">
          <div className="bg-foreground/[0.035] rounded-2xl p-5 md:p-7">
            <p className="text-sm font-semibold tracking-widest uppercase">Ergebnis</p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Unverbindliche PV-Orientierung
            </h2>

            {result.roofLimited ? (
              <div className="mt-6 rounded-xl border border-amber-400 bg-amber-50 p-5 text-amber-950">
                <p className="font-semibold">
                  Die Dachfläche begrenzt die gewünschte Anlagenleistung.
                </p>

                <p className="mt-2 text-sm leading-6">
                  Für das gewählte Erzeugungsziel wären {result.requiredModuleCount} Module
                  erforderlich. Auf der nutzbaren Dachfläche können im Modell höchstens{" "}
                  {result.maximumModuleCount} Module berücksichtigt werden.
                </p>
              </div>
            ) : null}

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <ResultCard
                label="Empfohlene Anlagenleistung"
                value={`${numberFormatter.format(result.recommendedSystemSizeKwp)} kWp`}
                description={`${result.recommendedModuleCount} Module mit jeweils ${numberFormatter.format(
                  result.input.modulePowerWattPeak,
                )} Wp.`}
              />

              <ResultCard
                label="Jahreserzeugung"
                value={`${numberFormatter.format(result.expectedAnnualGenerationKwh)} kWh`}
                description={`Modellierter Ertrag von ${numberFormatter.format(
                  result.adjustedSpecificYieldKwhPerKwp,
                )} kWh je kWp.`}
              />

              <ResultCard
                label="Verbrauchsdeckung"
                value={`${percentFormatter.format(result.generationCoveragePercent)} %`}
                description="Jährliche PV-Erzeugung im Verhältnis zum angegebenen Jahresstromverbrauch."
              />

              <ResultCard
                label="Speicherorientierung"
                value={
                  result.recommendedBatteryCapacityKwh > 0
                    ? `${numberFormatter.format(result.recommendedBatteryCapacityKwh)} kWh`
                    : "Ohne Speicher"
                }
                description="Vereinfachte Orientierung ohne zeitlich aufgelöstes Verbrauchs- und Erzeugungsprofil."
              />

              <ResultCard
                label="Geschätzte Gesamtkosten"
                value={currencyFormatter.format(result.estimatedTotalCostEuro)}
                description="PV-Anlage, optionaler Speicher und eingegebene zusätzliche Projektkosten."
              />

              <ResultCard
                label="Kostenkorridor"
                value={`${currencyFormatter.format(
                  result.estimatedMinimumCostEuro,
                )} – ${currencyFormatter.format(result.estimatedMaximumCostEuro)}`}
                description={`Orientierungsbereich mit ± ${numberFormatter.format(
                  result.input.costUncertaintyPercent,
                )} % Abweichung.`}
              />

              <ResultCard
                label="Maximale Dachkapazität"
                value={`${numberFormatter.format(result.maximumSystemSizeKwp)} kWp`}
                description={`${result.maximumModuleCount} Module auf ${numberFormatter.format(
                  result.usableRoofAreaM2,
                )} m² modellierter Nutzfläche.`}
              />

              <ResultCard
                label="Belegte Dachfläche"
                value={`${numberFormatter.format(result.usedRoofAreaM2)} m²`}
                description={`${percentFormatter.format(
                  result.roofUtilizationPercent,
                )} % der insgesamt angegebenen Dachfläche.`}
              />
            </div>

            <div className="border-foreground/10 bg-background mt-6 overflow-hidden rounded-xl border">
              <div className="border-foreground/10 border-b px-5 py-4">
                <h3 className="text-lg font-semibold">Kostenaufteilung</h3>
              </div>

              <dl className="divide-foreground/10 divide-y">
                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">Photovoltaikanlage</dt>
                  <dd className="font-semibold">
                    {currencyFormatter.format(result.pvSystemCostEuro)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">Stromspeicher</dt>
                  <dd className="font-semibold">
                    {currencyFormatter.format(result.batteryCostEuro)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">Weitere Projektkosten</dt>
                  <dd className="font-semibold">
                    {currencyFormatter.format(result.fixedAdditionalCostEuro)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="font-semibold">Orientierungswert gesamt</dt>
                  <dd className="text-lg font-semibold">
                    {currencyFormatter.format(result.estimatedTotalCostEuro)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">Modellannahmen</h3>

              <ul className="text-foreground/65 mt-4 space-y-3 text-sm leading-6">
                {pvSizingCalculatorContent.modelNotes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <span aria-hidden="true">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-foreground/60 mt-6 text-sm leading-6">
              {pvSizingCalculatorContent.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
