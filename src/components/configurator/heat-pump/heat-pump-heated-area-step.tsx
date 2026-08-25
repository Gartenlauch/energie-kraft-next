"use client";

import { useState } from "react";

interface HeatPumpHeatedAreaStepProps {
  value: number | undefined;
  onChange: (
    value: number | undefined,
  ) => void;
}

function parseNumber(
  value: string,
): number | undefined {
  const normalized = value
    .trim()
    .replace(",", ".");

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
}

export function HeatPumpHeatedAreaStep({
  value,
  onChange,
}: HeatPumpHeatedAreaStepProps) {
  const [textValue, setTextValue] =
    useState(() =>
      value === undefined
        ? ""
        : String(value).replace(".", ","),
    );

  const error =
    value !== undefined &&
    (value < 20 || value > 5_000)
      ? "Bitte gib eine beheizte Fläche zwischen 20 und 5.000 m² ein."
      : null;

  return (
    <div className="max-w-xl">
      <label
        htmlFor="heat-pump-heated-area"
        className="block text-sm font-semibold text-brand-primary"
      >
        Beheizte Fläche
      </label>

      <div className="relative mt-2">
        <input
          id="heat-pump-heated-area"
          type="text"
          inputMode="decimal"
          value={textValue}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            const nextValue =
              event.currentTarget.value;

            setTextValue(nextValue);

            onChange(
              parseNumber(nextValue),
            );
          }}
          className={[
            "min-h-14 w-full min-w-0 rounded-xl border bg-background px-4 py-3 pr-20 text-base",
            error
              ? "border-red-600"
              : "border-border-default",
          ].join(" ")}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-foreground/60"
        >
          m²
        </span>
      </div>

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-sm leading-6 text-foreground/60">
          Beispiel: 160 m² beheizte Wohnfläche.
        </p>
      )}
    </div>
  );
}