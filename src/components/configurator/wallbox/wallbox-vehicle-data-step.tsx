"use client";

import { useState } from "react";

interface WallboxVehicleDataStepProps {
  annualDrivingKm: number | undefined;
  vehicleConsumptionKwhPer100Km: number | undefined;
  batteryCapacityKwh: number | undefined;

  onAnnualDrivingKmChange: (
    value: number | undefined,
  ) => void;

  onVehicleConsumptionChange: (
    value: number | undefined,
  ) => void;

  onBatteryCapacityChange: (
    value: number | undefined,
  ) => void;
}

function formatInputValue(
  value: number | undefined,
): string {
  return value === undefined
    ? ""
    : String(value).replace(".", ",");
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

interface FieldProps {
  id: string;
  label: string;
  unit: string;
  helpText: string;
  value: string;
  inputMode: "numeric" | "decimal";
  error: string | null;
  onChange: (value: string) => void;
}

function Field({
  id,
  label,
  unit,
  helpText,
  value,
  inputMode,
  error,
  onChange,
}: FieldProps) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-brand-primary"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <input
          id={id}
          type="text"
          inputMode={inputMode}
          value={value}
          aria-invalid={Boolean(error)}
          onChange={(event) =>
            onChange(event.currentTarget.value)
          }
          className={[
            "min-h-14 w-full min-w-0 rounded-xl border bg-background px-4 py-3 pr-28 text-base",
            error
              ? "border-red-600"
              : "border-border-default",
          ].join(" ")}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-foreground/60"
        >
          {unit}
        </span>
      </div>

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-sm leading-6 text-foreground/60">
          {helpText}
        </p>
      )}
    </div>
  );
}

export function WallboxVehicleDataStep({
  annualDrivingKm,
  vehicleConsumptionKwhPer100Km,
  batteryCapacityKwh,
  onAnnualDrivingKmChange,
  onVehicleConsumptionChange,
  onBatteryCapacityChange,
}: WallboxVehicleDataStepProps) {
  const [annualDrivingText, setAnnualDrivingText] =
    useState(() =>
      formatInputValue(annualDrivingKm),
    );

  const [consumptionText, setConsumptionText] =
    useState(() =>
      formatInputValue(
        vehicleConsumptionKwhPer100Km,
      ),
    );

  const [batteryText, setBatteryText] =
    useState(() =>
      formatInputValue(batteryCapacityKwh),
    );

  const annualDrivingError =
    annualDrivingKm !== undefined &&
    (annualDrivingKm < 1_000 ||
      annualDrivingKm > 100_000)
      ? "Bitte gib eine Fahrleistung zwischen 1.000 und 100.000 km/Jahr ein."
      : null;

  const consumptionError =
    vehicleConsumptionKwhPer100Km !== undefined &&
    (vehicleConsumptionKwhPer100Km < 8 ||
      vehicleConsumptionKwhPer100Km > 50)
      ? "Bitte gib einen Fahrzeugverbrauch zwischen 8 und 50 kWh/100 km ein."
      : null;

  const batteryError =
    batteryCapacityKwh !== undefined &&
    (batteryCapacityKwh < 10 ||
      batteryCapacityKwh > 250)
      ? "Bitte gib eine Batteriekapazität zwischen 10 und 250 kWh ein."
      : null;

  return (
    <div className="grid min-w-0 gap-6 sm:grid-cols-2">
      <Field
        id="wallbox-annual-driving"
        label="Jährliche Fahrleistung"
        unit="km/Jahr"
        helpText="Zum Beispiel 15.000 km pro Jahr."
        value={annualDrivingText}
        inputMode="numeric"
        error={annualDrivingError}
        onChange={(value) => {
          setAnnualDrivingText(value);

          onAnnualDrivingKmChange(
            parseNumber(value),
          );
        }}
      />

      <Field
        id="wallbox-vehicle-consumption"
        label="Fahrzeugverbrauch"
        unit="kWh/100 km"
        helpText="Zum Beispiel 18 kWh/100 km. Den Wert findest du häufig in den Fahrzeugdaten."
        value={consumptionText}
        inputMode="decimal"
        error={consumptionError}
        onChange={(value) => {
          setConsumptionText(value);

          onVehicleConsumptionChange(
            parseNumber(value),
          );
        }}
      />

      <Field
        id="wallbox-battery-capacity"
        label="Batteriekapazität"
        unit="kWh"
        helpText="Zum Beispiel 60 kWh nutzbare bzw. für die Orientierung verwendete Kapazität."
        value={batteryText}
        inputMode="decimal"
        error={batteryError}
        onChange={(value) => {
          setBatteryText(value);

          onBatteryCapacityChange(
            parseNumber(value),
          );
        }}
      />
    </div>
  );
}