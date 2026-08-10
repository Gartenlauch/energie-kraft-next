"use client";

import { useState, type FormEvent } from "react";
import { defaultPvCalculatorInput, pvCalculatorContent } from "@/content/pages/pv-rechner";
import { calculatePvRoi } from "@/lib/calculators/pv-roi";
import { pvCalculatorInputSchema } from "@/lib/validation/pv-calculator";
import type { CalculatorFieldContent } from "@/types/content";
import type { PvCalculatorInput, PvCalculatorResult } from "@/types/pv-calculator";

type PvCalculatorFormValues = Record<keyof PvCalculatorInput, string>;

type PvCalculatorFieldErrors = Partial<Record<keyof PvCalculatorInput, string>>;

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function createFormValues(input: PvCalculatorInput): PvCalculatorFormValues {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, String(value)]),
  ) as PvCalculatorFormValues;
}

function createCalculatorInput(values: PvCalculatorFormValues): PvCalculatorInput {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, Number(value)]),
  ) as unknown as PvCalculatorInput;
}

function isPvCalculatorFieldName(value: unknown): value is keyof PvCalculatorInput {
  return typeof value === "string" && Object.hasOwn(defaultPvCalculatorInput, value);
}

interface CalculatorFieldProps {
  field: CalculatorFieldContent;
  value: string;
  error?: string;
  onChange: (name: keyof PvCalculatorInput, value: string) => void;
}

function CalculatorField({ field, value, error, onChange }: CalculatorFieldProps) {
  const id = `pv-calculator-${field.name}`;

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
          className={`bg-background min-h-12 min-w-0 flex-1 rounded-l-md border px-4 py-3 text-base ${error ? "border-red-600" : "border-foreground/20"
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

export function PvRoiCalculator() {
  const [formValues, setFormValues] = useState<PvCalculatorFormValues>(() =>
    createFormValues(defaultPvCalculatorInput),
  );

  const [fieldErrors, setFieldErrors] = useState<PvCalculatorFieldErrors>({});

  const [generalError, setGeneralError] = useState<string | null>(null);

  const [result, setResult] = useState<PvCalculatorResult>(() =>
    calculatePvRoi(defaultPvCalculatorInput),
  );

  function handleFieldChange(name: keyof PvCalculatorInput, value: string) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = createCalculatorInput(formValues);
    const validationResult = pvCalculatorInputSchema.safeParse(input);

    if (!validationResult.success) {
      const nextErrors: PvCalculatorFieldErrors = {};

      for (const issue of validationResult.error.issues) {
        const fieldName = issue.path[0];

        if (isPvCalculatorFieldName(fieldName) && !nextErrors[fieldName]) {
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
    setResult(calculatePvRoi(validationResult.data));
  }

  function handleReset() {
    setFormValues(createFormValues(defaultPvCalculatorInput));
    setFieldErrors({});
    setGeneralError(null);
    setResult(calculatePvRoi(defaultPvCalculatorInput));
  }

  const selfConsumptionSharePercent =
    result.firstYear.generationKwh > 0
      ? (result.firstYear.selfConsumedKwh / result.firstYear.generationKwh) * 100
      : 0;

  const paybackValue =
    result.paybackYears === null
      ? "Nicht erreicht"
      : `${numberFormatter.format(result.paybackYears)} Jahre`;

  return (
    <section id="pv-berechnung" className="border-foreground/10 border-t px-6 py-20">
      <div className="mx-auto grid min-w-0 w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-widest uppercase">Ihre Angaben</p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Photovoltaikanlage berechnen
          </h2>

          <p className="text-foreground/70 mt-5 max-w-2xl text-lg leading-8">
            Passen Sie die Werte an Ihre geplante Anlage und Ihren Stromverbrauch an. Die Ergebnisse
            werden nach dem Absenden neu berechnet.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-10">
            <fieldset>
              <legend className="text-xl font-semibold">Grunddaten</legend>

              <div className="mt-6 grid gap-7 md:grid-cols-2">
                {pvCalculatorContent.primaryFields.map((field) => (
                  <CalculatorField
                    key={field.name}
                    field={field}
                    value={formValues[field.name]}
                    error={fieldErrors[field.name]}
                    onChange={handleFieldChange}
                  />
                ))}
              </div>
            </fieldset>

            <details className="border-foreground/10 mt-8 rounded-xl border">
              <summary className="cursor-pointer px-5 py-4 font-semibold">
                Erweiterte Annahmen anzeigen
              </summary>

              <fieldset className="border-foreground/10 border-t p-5">
                <legend className="sr-only">Erweiterte Annahmen</legend>

                <div className="grid gap-7 md:grid-cols-2">
                  {pvCalculatorContent.advancedFields.map((field) => (
                    <CalculatorField
                      key={field.name}
                      field={field}
                      value={formValues[field.name]}
                      error={fieldErrors[field.name]}
                      onChange={handleFieldChange}
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
                Berechnung aktualisieren
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
          className="min-w-0 lg:sticky lg:top-28 lg:self-start"
        >
          <div className="bg-foreground/[0.035] rounded-2xl p-5 md:p-7">
            <p className="text-sm font-semibold tracking-widest uppercase">Berechnungsergebnis</p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Wirtschaftlichkeit über {result.input.calculationYears} Jahre
            </h2>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <ResultCard
                label="Amortisation"
                value={paybackValue}
                description="Zeitpunkt, an dem die kumulierten Nettoerträge die Investitionskosten ausgleichen."
              />

              <ResultCard
                label="Gesamtrendite"
                value={`${percentFormatter.format(result.roiPercent)} %`}
                description="Gesamtergebnis nach Investition, bezogen auf die anfänglichen Anlagenkosten."
              />

              <ResultCard
                label="Vorteil im ersten Jahr"
                value={currencyFormatter.format(result.firstYear.grossBenefitEuro)}
                description="Stromkostenersparnis und Einspeiseerlöse vor Abzug der jährlichen Betriebskosten."
              />

              <ResultCard
                label="Nettoergebnis"
                value={currencyFormatter.format(result.totalNetBenefitEuro)}
                description={`Wirtschaftliches Gesamtergebnis nach Investition und Betriebskosten über ${result.input.calculationYears} Jahre.`}
              />

              <ResultCard
                label="Erzeugung im ersten Jahr"
                value={`${numberFormatter.format(result.firstYear.generationKwh)} kWh`}
                description="Prognostizierter Solarertrag auf Grundlage der Anlagenleistung und des spezifischen Ertrags."
              />

              <ResultCard
                label="Eigenverbrauch"
                value={`${percentFormatter.format(selfConsumptionSharePercent)} %`}
                description={`${numberFormatter.format(
                  result.firstYear.selfConsumedKwh,
                )} kWh des erzeugten Stroms werden im ersten Jahr selbst genutzt.`}
              />
            </div>

            <div className="border-foreground/10 bg-background mt-6 overflow-hidden rounded-xl border">
              <div className="border-foreground/10 border-b px-5 py-4">
                <h3 className="text-lg font-semibold">Jahresprojektion</h3>

                <p className="text-foreground/65 mt-1 text-sm leading-6">
                  Entwicklung von Ertrag, Nutzen und kumuliertem Cashflow.
                </p>
              </div>

              <div className="max-w-full overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-foreground/[0.04]">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        Jahr
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Erzeugung
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Eigenverbrauch
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Einspeisung
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Ersparnis
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Einspeiseerlös
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Netto-Cashflow
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Kumuliert
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-foreground/10 divide-y">
                    {result.projections.map((projection) => (
                      <tr key={projection.year}>
                        <th scope="row" className="px-4 py-3 font-semibold">
                          {projection.year}
                        </th>

                        <td className="px-4 py-3">
                          {numberFormatter.format(projection.generationKwh)} kWh
                        </td>

                        <td className="px-4 py-3">
                          {numberFormatter.format(projection.selfConsumedKwh)} kWh
                        </td>

                        <td className="px-4 py-3">
                          {numberFormatter.format(projection.exportedKwh)} kWh
                        </td>

                        <td className="px-4 py-3">
                          {currencyFormatter.format(projection.savingsEuro)}
                        </td>

                        <td className="px-4 py-3">
                          {currencyFormatter.format(projection.feedInRevenueEuro)}
                        </td>

                        <td className="px-4 py-3">
                          {currencyFormatter.format(projection.netCashFlowEuro)}
                        </td>

                        <td className="px-4 py-3 font-medium">
                          {currencyFormatter.format(projection.cumulativeCashFlowEuro)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-foreground/60 mt-6 text-sm leading-6">
              {pvCalculatorContent.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
