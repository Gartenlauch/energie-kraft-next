"use client";

import { useState } from "react";

interface ClimateOccupancyStepProps {
    value: number | undefined;

    onChange: (
        value: number | undefined,
    ) => void;
}

function parseNumber(
    value: string,
): number | undefined {
    const normalized = value.trim();

    if (!normalized) {
        return undefined;
    }

    const parsed = Number(normalized);

    return Number.isFinite(parsed)
        ? parsed
        : undefined;
}

export function ClimateOccupancyStep({
    value,
    onChange,
}: ClimateOccupancyStepProps) {
    const [textValue, setTextValue] =
        useState(() =>
            value === undefined
                ? ""
                : String(value),
        );

    const error =
        value !== undefined &&
            (!Number.isInteger(value) ||
                value < 1 ||
                value > 200)
            ? "Bitte gib eine Personenzahl zwischen 1 und 200 ein."
            : null;

    return (
        <div className="max-w-xl">
            <label
                htmlFor="climate-occupancy"
                className="block text-sm font-semibold text-brand-primary"
            >
                Üblicherweise anwesende Personen
            </label>

            <div className="relative mt-2">
                <input
                    id="climate-occupancy"
                    type="text"
                    inputMode="numeric"
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
                    Personen
                </span>
            </div>

            {error ? (
                <p className="mt-2 text-sm font-medium text-red-700">
                    {error}
                </p>
            ) : (
                <p className="mt-2 text-sm leading-6 text-foreground/60">
                    Gib die typische gleichzeitige Belegung
                    der zu klimatisierenden Räume an.
                </p>
            )}
        </div>
    );
}