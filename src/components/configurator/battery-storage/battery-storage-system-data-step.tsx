"use client";

interface BatteryStorageSystemDataStepProps {
  annualConsumptionKwh: number | undefined;
  pvPowerKwp: number | undefined;

  onAnnualConsumptionChange: (
    value: number | undefined,
  ) => void;

  onPvPowerChange: (
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

function getAnnualConsumptionError(
  value: number | undefined,
): string | null {
  if (value === undefined) {
    return null;
  }

  if (value < 500) {
    return "Bitte gib mindestens 500 kWh/Jahr ein.";
  }

  if (value > 100_000) {
    return "Bitte gib höchstens 100.000 kWh/Jahr ein.";
  }

  return null;
}

function getPvPowerError(
  value: number | undefined,
): string | null {
  if (value === undefined) {
    return null;
  }

  if (value < 1) {
    return "Bitte gib mindestens 1 kWp ein.";
  }

  if (value > 100) {
    return "Bitte gib die Anlagenleistung in kWp ein, z. B. 4,5 oder 8,0 kWp – nicht in Watt.";
  }

  return null;
}

const inputClassName =
  "mt-2 min-h-14 w-full min-w-0 rounded-xl border bg-background px-4 py-3 text-base";

export function BatteryStorageSystemDataStep({
  annualConsumptionKwh,
  pvPowerKwp,
  onAnnualConsumptionChange,
  onPvPowerChange,
}: BatteryStorageSystemDataStepProps) {
  const annualConsumptionError =
    getAnnualConsumptionError(
      annualConsumptionKwh,
    );

  const pvPowerError =
    getPvPowerError(pvPowerKwp);

  return (
    <div className="grid min-w-0 gap-6 sm:grid-cols-2">
      <div className="min-w-0">
        <label
          htmlFor="battery-annual-consumption"
          className="block text-sm font-semibold text-brand-primary"
        >
          Jahresstromverbrauch
        </label>

        <div className="relative">
          <input
            id="battery-annual-consumption"
            type="text"
            inputMode="numeric"
            value={
              annualConsumptionKwh ?? ""
            }
            aria-invalid={
              Boolean(
                annualConsumptionError,
              )
            }
            onChange={(event) =>
              onAnnualConsumptionChange(
                parseNumber(
                  event.currentTarget.value,
                ),
              )
            }
            className={[
              inputClassName,
              "pr-28",
              annualConsumptionError
                ? "border-red-600"
                : "border-border-default",
            ].join(" ")}
          />

          <span
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-foreground/60"
            aria-hidden="true"
          >
            kWh/Jahr
          </span>
        </div>

        {annualConsumptionError ? (
          <p className="mt-2 text-sm font-medium text-red-700">
            {annualConsumptionError}
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            Zum Beispiel 3.500 kWh/Jahr.
            Am besten verwendest du den Wert
            aus deiner letzten Stromabrechnung.
          </p>
        )}
      </div>

      <div className="min-w-0">
        <label
          htmlFor="battery-pv-power"
          className="block text-sm font-semibold text-brand-primary"
        >
          PV-Anlagenleistung
        </label>

        <div className="relative">
          <input
            id="battery-pv-power"
            type="text"
            inputMode="decimal"
            defaultValue={
              pvPowerKwp !== undefined
                ? String(pvPowerKwp).replace(".", ",")
                : ""
            }
            aria-invalid={Boolean(pvPowerError)}
            onChange={(event) =>
              onPvPowerChange(
                parseNumber(
                  event.currentTarget.value,
                ),
              )
            }
            className={[
              inputClassName,
              "pr-20",
              pvPowerError
                ? "border-red-600"
                : "border-border-default",
            ].join(" ")}
          />

          <span
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-foreground/60"
            aria-hidden="true"
          >
            kWp
          </span>
        </div>

        {pvPowerError ? (
          <p className="mt-2 text-sm font-medium text-red-700">
            {pvPowerError}
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            Bitte in kWp angeben, z. B.
            4,5 kWp oder 8 kWp. Bei einer
            bestehenden Anlage findest du den
            Wert meist in den Anlagenunterlagen.
          </p>
        )}
      </div>
    </div>
  );
}