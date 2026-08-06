"use client";

import { useState } from "react";

import {
  defaultWallboxCalculatorInput,
  wallboxCalculatorContent,
  type WallboxNumberFieldContent,
} from "@/content/pages/wallbox-rechner";
import { calculateWallboxCost } from "@/lib/calculators/wallbox-cost";
import { wallboxCalculatorInputSchema } from "@/lib/validation/wallbox-calculator";
import type {
  WallboxCalculatorInput,
  WallboxCalculatorResult,
  WallboxNumericInputKey,
} from "@/types/wallbox-calculator";

type WallboxFormValues = {
  [Key in keyof WallboxCalculatorInput]: string;
};

type WallboxFieldErrors = Partial<
  Record<keyof WallboxCalculatorInput, string>
>;

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 2,
});

function formatChargingDuration(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const fullHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (fullHours === 0) {
    return `${minutes} Min.`;
  }

  if (minutes === 0) {
    return `${fullHours} Std.`;
  }

  return `${fullHours} Std. ${minutes} Min.`;
}

function createFormValues(
  input: WallboxCalculatorInput,
): WallboxFormValues {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [
      key,
      String(value),
    ]),
  ) as WallboxFormValues;
}

function createCalculatorInput(
  values: WallboxFormValues,
): WallboxCalculatorInput {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      Number(value),
    ]),
  ) as unknown as WallboxCalculatorInput;
}

function isWallboxFieldName(
  value: unknown,
): value is keyof WallboxCalculatorInput {
  return (
    typeof value === "string" &&
    Object.hasOwn(defaultWallboxCalculatorInput, value)
  );
}

interface NumberFieldProps {
  field: WallboxNumberFieldContent;
  value: string;
  error?: string;
  onChange: (
    name: WallboxNumericInputKey,
    value: string,
  ) => void;
}

function NumberField({
  field,
  value,
  error,
  onChange,
}: NumberFieldProps) {
  const id = `wallbox-calculator-${field.name}`;

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

export function WallboxCostCalculator() {
  const [formValues, setFormValues] =
    useState<WallboxFormValues>(() =>
      createFormValues(defaultWallboxCalculatorInput),
    );

  const [fieldErrors, setFieldErrors] =
    useState<WallboxFieldErrors>({});

  const [generalError, setGeneralError] = useState<
    string | null
  >(null);

  const [result, setResult] =
    useState<WallboxCalculatorResult>(() =>
      calculateWallboxCost(
        defaultWallboxCalculatorInput,
      ),
    );

  function clearFieldError(
    name: keyof WallboxCalculatorInput,
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
    name: WallboxNumericInputKey,
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
      wallboxCalculatorInputSchema.safeParse(input);

    if (!validationResult.success) {
      const nextErrors: WallboxFieldErrors = {};

      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0];

        if (
          isWallboxFieldName(fieldName) &&
          !nextErrors[fieldName]
        ) {
          nextErrors[fieldName] =
            issue.message ||
            "Bitte geben Sie einen gültigen Wert ein.";
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
      calculateWallboxCost(validationResult.data),
    );
  }

  function handleReset() {
    setFormValues(
      createFormValues(defaultWallboxCalculatorInput),
    );

    setFieldErrors({});
    setGeneralError(null);

    setResult(
      calculateWallboxCost(
        defaultWallboxCalculatorInput,
      ),
    );
  }

  const recommendation =
    wallboxCalculatorContent.recommendationContent[
      result.systemRecommendation
    ];

  const hasChargingCostAdvantage =
    result.annualChargingCostDifferenceEuro >= 0;

  const chargingDifferenceValue =
    currencyFormatter.format(
      Math.abs(result.annualChargingCostDifferenceEuro),
    );

  return (
    <section
      id="wallbox-berechnung"
      className="border-foreground/10 scroll-mt-24 border-t px-6 py-20"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase">
            Ihre Angaben
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Fahrzeug- und Ladedaten erfassen
          </h2>

          <p className="text-foreground/70 mt-5 max-w-2xl text-lg leading-8">
            Die Modellrechnung verbindet Fahrleistung,
            Fahrzeugverbrauch, Ladefenster, Ladeleistung,
            Stromkosten und einen möglichen PV-Anteil.
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
                {wallboxCalculatorContent.primaryFields.map(
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
                  {wallboxCalculatorContent.advancedFields.map(
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
                Ladezeit und Kosten berechnen
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
              Unverbindliche Wallbox-Orientierung
            </h2>

            <div className="border-foreground/15 bg-background mt-6 rounded-xl border p-5">
              <p className="font-semibold">
                {recommendation.label}
              </p>

              <p className="text-foreground/70 mt-2 text-sm leading-6">
                {recommendation.description}
              </p>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <ResultCard
                label="Typische Ladedauer"
                value={formatChargingDuration(
                  result.typicalChargingTimeHours,
                )}
                description={`${numberFormatter.format(
                  result.typicalBatteryEnergyAddedKwh,
                )} kWh werden im Modell zwischen ${numberFormatter.format(
                  result.input.startStateOfChargePercent,
                )} % und ${numberFormatter.format(
                  result.input.targetStateOfChargePercent,
                )} % in die Batterie geladen.`}
              />

              <ResultCard
                label="Wallbox-Leistung"
                value={`${numberFormatter.format(
                  result.input.chargingPowerKw,
                )} kW`}
                description="Die tatsächlich nutzbare Leistung kann durch Fahrzeug und Elektroinstallation begrenzt werden."
              />

              <ResultCard
                label="Jährlicher Fahrstrombedarf"
                value={`${numberFormatter.format(
                  result.annualVehicleEnergyDemandKwh,
                )} kWh`}
                description={`Berechnet aus ${numberFormatter.format(
                  result.input.annualDrivingKm,
                )} km Fahrleistung und ${numberFormatter.format(
                  result.input.vehicleConsumptionKwhPer100Km,
                )} kWh je 100 km.`}
              />

              <ResultCard
                label="Jährliche Heimladeenergie"
                value={`${numberFormatter.format(
                  result.annualHomeChargingInputEnergyKwh,
                )} kWh`}
                description={`Beinhaltet den angenommenen Ladewirkungsgrad von ${numberFormatter.format(
                  result.input.chargingEfficiencyPercent,
                )} %.`}
              />

              <ResultCard
                label="Jährliche Heimladekosten"
                value={currencyFormatter.format(
                  result.annualHomeChargingCostEuro,
                )}
                description={`${currencyFormatter.format(
                  result.monthlyHomeChargingCostEuro,
                )} durchschnittliche Modellkosten pro Monat.`}
              />

              <ResultCard
                label={
                  hasChargingCostAdvantage
                    ? "Kostenvorteil gegenüber öffentlichem Laden"
                    : "Mehrkosten gegenüber öffentlichem Laden"
                }
                value={chargingDifferenceValue}
                description={
                  hasChargingCostAdvantage
                    ? "Das Heimladen ist mit den eingegebenen Modellwerten jährlich günstiger."
                    : "Das Heimladen ist mit den eingegebenen Modellwerten jährlich teurer."
                }
              />

              <ResultCard
                label="Geschätzte Projektkosten"
                value={currencyFormatter.format(
                  result.estimatedTotalCostEuro,
                )}
                description="Wallbox, modellierte Installation und weitere eingegebene Projektkosten."
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
                  Aufteilung der Heimladeenergie
                </h3>
              </div>

              <dl className="divide-foreground/10 divide-y">
                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">
                    Strom aus Photovoltaik
                  </dt>

                  <dd className="font-semibold">
                    {numberFormatter.format(
                      result.annualPvChargingEnergyKwh,
                    )}{" "}
                    kWh
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">
                    Netzstrom
                  </dt>

                  <dd className="font-semibold">
                    {numberFormatter.format(
                      result.annualGridChargingEnergyKwh,
                    )}{" "}
                    kWh
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">
                    Vergleich öffentliches Laden
                  </dt>

                  <dd className="font-semibold">
                    {currencyFormatter.format(
                      result.comparablePublicChargingCostEuro,
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-foreground/10 bg-background mt-6 overflow-hidden rounded-xl border">
              <div className="border-foreground/10 border-b px-5 py-4">
                <h3 className="text-lg font-semibold">
                  Projektkosten
                </h3>
              </div>

              <dl className="divide-foreground/10 divide-y">
                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">
                    Wallbox
                  </dt>

                  <dd className="font-semibold">
                    {currencyFormatter.format(
                      result.wallboxCostEuro,
                    )}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-5 px-5 py-4">
                  <dt className="text-foreground/70">
                    Installation
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
                {wallboxCalculatorContent.modelNotes.map(
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
              {wallboxCalculatorContent.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}