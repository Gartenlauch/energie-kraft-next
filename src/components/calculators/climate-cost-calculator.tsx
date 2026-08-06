"use client";

import { useState } from "react";

import {
  climateCalculatorContent,
  defaultClimateCalculatorInput,
  type ClimateNumberFieldContent,
} from "@/content/pages/klima-kostenrechner";
import { calculateClimateCost } from "@/lib/calculators/climate-cost";
import { climateCalculatorInputSchema } from "@/lib/validation/climate-calculator";
import type {
  ClimateCalculatorInput,
  ClimateCalculatorResult,
  ClimateInsulationLevel,
  ClimateNumericInputKey,
  ClimateSolarLoad,
  ClimateSystemRecommendation,
} from "@/types/climate-calculator";

type ClimateFormValues = {
  [Key in keyof ClimateCalculatorInput]: ClimateCalculatorInput[Key] extends number
    ? string
    : ClimateCalculatorInput[Key];
};

type ClimateFieldErrors = Partial<Record<keyof ClimateCalculatorInput, string>>;

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 2,
});

const SYSTEM_LABELS: Record<ClimateSystemRecommendation, string> = {
  singleSplit: "Single-Split-System",
  multiSplit: "Multi-Split-System",
  projectPlanning: "Individuelle Mehrzonenplanung",
};

function createFormValues(input: ClimateCalculatorInput): ClimateFormValues {
  return {
    conditionedAreaM2: String(input.conditionedAreaM2),
    roomCount: String(input.roomCount),
    ceilingHeightM: String(input.ceilingHeightM),
    insulationLevel: input.insulationLevel,
    solarLoad: input.solarLoad,
    occupancyPersons: String(input.occupancyPersons),
    internalHeatLoadWatt: String(input.internalHeatLoadWatt),
    annualEquivalentFullLoadHours: String(input.annualEquivalentFullLoadHours),
    seasonalEfficiencySeer: String(input.seasonalEfficiencySeer),
    electricityPriceEuroPerKwh: String(input.electricityPriceEuroPerKwh),
    equipmentCostEuroPerKw: String(input.equipmentCostEuroPerKw),
    indoorUnitCostEuro: String(input.indoorUnitCostEuro),
    installationBaseCostEuro: String(input.installationBaseCostEuro),
    installationCostPerIndoorUnitEuro: String(input.installationCostPerIndoorUnitEuro),
    fixedAdditionalCostEuro: String(input.fixedAdditionalCostEuro),
    costUncertaintyPercent: String(input.costUncertaintyPercent),
  };
}

function createCalculatorInput(values: ClimateFormValues): ClimateCalculatorInput {
  return {
    conditionedAreaM2: Number(values.conditionedAreaM2),
    roomCount: Number(values.roomCount),
    ceilingHeightM: Number(values.ceilingHeightM),
    insulationLevel: values.insulationLevel,
    solarLoad: values.solarLoad,
    occupancyPersons: Number(values.occupancyPersons),
    internalHeatLoadWatt: Number(values.internalHeatLoadWatt),
    annualEquivalentFullLoadHours: Number(values.annualEquivalentFullLoadHours),
    seasonalEfficiencySeer: Number(values.seasonalEfficiencySeer),
    electricityPriceEuroPerKwh: Number(values.electricityPriceEuroPerKwh),
    equipmentCostEuroPerKw: Number(values.equipmentCostEuroPerKw),
    indoorUnitCostEuro: Number(values.indoorUnitCostEuro),
    installationBaseCostEuro: Number(values.installationBaseCostEuro),
    installationCostPerIndoorUnitEuro: Number(values.installationCostPerIndoorUnitEuro),
    fixedAdditionalCostEuro: Number(values.fixedAdditionalCostEuro),
    costUncertaintyPercent: Number(values.costUncertaintyPercent),
  };
}

function isClimateFieldName(value: unknown): value is keyof ClimateCalculatorInput {
  return typeof value === "string" && Object.hasOwn(defaultClimateCalculatorInput, value);
}

interface NumberFieldProps {
  field: ClimateNumberFieldContent;
  value: string;
  error?: string;
  onChange: (name: ClimateNumericInputKey, value: string) => void;
}

function NumberField({ field, value, error, onChange }: NumberFieldProps) {
  const id = `climate-calculator-${field.name}`;

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
          inputMode={field.step < 1 ? "decimal" : "numeric"}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onChange(field.name, event.currentTarget.value)}
          className={`bg-background min-h-12 min-w-0 flex-1 rounded-l-md border px-4 py-3 text-base ${
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

export function ClimateCostCalculator() {
  const [formValues, setFormValues] = useState<ClimateFormValues>(() =>
    createFormValues(defaultClimateCalculatorInput),
  );

  const [fieldErrors, setFieldErrors] = useState<ClimateFieldErrors>({});

  const [generalError, setGeneralError] = useState<string | null>(null);

  const [result, setResult] = useState<ClimateCalculatorResult>(() =>
    calculateClimateCost(defaultClimateCalculatorInput),
  );

  function clearFieldError(name: keyof ClimateCalculatorInput) {
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

  function handleNumberChange(name: ClimateNumericInputKey, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    clearFieldError(name);
  }

  function handleSubmit() {
    const input = createCalculatorInput(formValues);

    const validationResult = climateCalculatorInputSchema.safeParse(input);

    if (!validationResult.success) {
      const nextErrors: ClimateFieldErrors = {};

      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0];

        if (isClimateFieldName(fieldName) && !nextErrors[fieldName]) {
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

    setResult(calculateClimateCost(validationResult.data));
  }

  function handleReset() {
    setFormValues(createFormValues(defaultClimateCalculatorInput));

    setFieldErrors({});
    setGeneralError(null);

    setResult(calculateClimateCost(defaultClimateCalculatorInput));
  }

  return (
    <section
      id="klima-berechnung"
      className="border-foreground/10 scroll-mt-24 border-t px-6 py-20"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase">Ihre Angaben</p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Räume und Gebäudesituation erfassen
          </h2>

          <p className="text-foreground/70 mt-5 max-w-2xl text-lg leading-8">
            Die Modellrechnung verbindet Raumfläche, Gebäudezustand, Wärmeeinträge, Nutzung und
            veränderbare Kostenannahmen.
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
                {climateCalculatorContent.primaryFields.map((field) => (
                  <NumberField
                    key={field.name}
                    field={field}
                    value={formValues[field.name]}
                    error={fieldErrors[field.name]}
                    onChange={handleNumberChange}
                  />
                ))}

                <div>
                  <label htmlFor="climate-insulation-level" className="block text-sm font-semibold">
                    Gebäudezustand
                  </label>

                  <select
                    id="climate-insulation-level"
                    value={formValues.insulationLevel}
                    aria-describedby="climate-insulation-level-help"
                    onChange={(event) => {
                      const insulationLevel = event.currentTarget.value as ClimateInsulationLevel;

                      setFormValues((currentValues) => ({
                        ...currentValues,
                        insulationLevel,
                      }));

                      clearFieldError("insulationLevel");
                    }}
                    className="border-foreground/20 bg-background mt-2 min-h-12 w-full rounded-md border px-4 py-3 text-base"
                  >
                    {climateCalculatorContent.insulationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <p
                    id="climate-insulation-level-help"
                    className="text-foreground/60 mt-2 text-sm leading-6"
                  >
                    Vereinfachte Einordnung der Dämmung und des energetischen Gebäudezustands.
                  </p>
                </div>

                <div>
                  <label htmlFor="climate-solar-load" className="block text-sm font-semibold">
                    Sonneneinstrahlung
                  </label>

                  <select
                    id="climate-solar-load"
                    value={formValues.solarLoad}
                    aria-describedby="climate-solar-load-help"
                    onChange={(event) => {
                      const solarLoad = event.currentTarget.value as ClimateSolarLoad;

                      setFormValues((currentValues) => ({
                        ...currentValues,
                        solarLoad,
                      }));

                      clearFieldError("solarLoad");
                    }}
                    className="border-foreground/20 bg-background mt-2 min-h-12 w-full rounded-md border px-4 py-3 text-base"
                  >
                    {climateCalculatorContent.solarLoadOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <p
                    id="climate-solar-load-help"
                    className="text-foreground/60 mt-2 text-sm leading-6"
                  >
                    Einordnung der direkten Sonne und der Größe besonnter Fensterflächen.
                  </p>
                </div>
              </div>
            </fieldset>

            <details className="border-foreground/10 mt-8 rounded-xl border">
              <summary className="cursor-pointer px-5 py-4 font-semibold">
                Erweiterte Modellannahmen anzeigen
              </summary>

              <fieldset className="border-foreground/10 border-t p-5">
                <legend className="sr-only">Erweiterte Modellannahmen</legend>

                <div className="grid gap-7 md:grid-cols-2">
                  {climateCalculatorContent.advancedFields.map((field) => (
                    <NumberField
                      key={field.name}
                      field={field}
                      value={formValues[field.name]}
                      error={fieldErrors[field.name]}
                      onChange={handleNumberChange}
                    />
                  ))}
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
                Leistung und Kosten berechnen
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
              Unverbindliche Klima-Orientierung
            </h2>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <ResultCard
                label="Empfohlene Kühlleistung"
                value={`${numberFormatter.format(result.recommendedCoolingCapacityKw)} kW`}
                description={`Überschlägige Last von ${numberFormatter.format(
                  result.calculatedCoolingLoadKw,
                )} kW einschließlich Modellreserve.`}
              />

              <ResultCard
                label="Systemorientierung"
                value={SYSTEM_LABELS[result.systemRecommendation]}
                description={`${result.recommendedIndoorUnitCount} Innengeräte für ${result.input.roomCount} getrennte Räume oder Zonen.`}
              />

              <ResultCard
                label="Leistung je Raum"
                value={`${numberFormatter.format(result.averageCapacityPerRoomKw)} kW`}
                description="Rechnerischer Durchschnittswert. Die reale Verteilung muss für jeden Raum einzeln geplant werden."
              />

              <ResultCard
                label="Jährlicher Stromverbrauch"
                value={`${numberFormatter.format(result.annualElectricityConsumptionKwh)} kWh`}
                description={`Modelliert mit ${numberFormatter.format(
                  result.input.annualEquivalentFullLoadHours,
                )} Volllaststunden und einem SEER von ${numberFormatter.format(
                  result.input.seasonalEfficiencySeer,
                )}.`}
              />

              <ResultCard
                label="Jährliche Stromkosten"
                value={currencyFormatter.format(result.annualOperatingCostEuro)}
                description={`Berechnet mit ${numberFormatter.format(
                  result.input.electricityPriceEuroPerKwh,
                )} € je kWh.`}
              />

              <ResultCard
                label="Geschätzte Gesamtkosten"
                value={currencyFormatter.format(result.estimatedTotalCostEuro)}
                description="Technische Anlage, Innengeräte, modellierte Montage und weitere Projektkosten."
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
                label="Innengeräte"
                value={String(result.recommendedIndoorUnitCount)}
                description="Erste Annahme: ein separat regelbares Innengerät je angegebenem Raum."
              />
            </div>

            <div className="border-foreground/10 bg-background mt-6 overflow-hidden rounded-xl border">
              <div className="border-foreground/10 border-b px-5 py-4">
                <h3 className="text-lg font-semibold">Kostenaufteilung</h3>
              </div>

              <dl className="divide-foreground/10 divide-y">
                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">Anlage und Innengeräte</dt>
                  <dd className="font-semibold">
                    {currencyFormatter.format(result.equipmentCostEuro)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">Installation</dt>
                  <dd className="font-semibold">
                    {currencyFormatter.format(result.installationCostEuro)}
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
                {climateCalculatorContent.modelNotes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <span aria-hidden="true">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-foreground/60 mt-6 text-sm leading-6">
              {climateCalculatorContent.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
