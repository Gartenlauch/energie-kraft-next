"use client";

import { useState } from "react";

interface ClimateRoomsStepProps {
  conditionedAreaM2: number | undefined;
  roomCount: number | undefined;

  onConditionedAreaChange: (
    value: number | undefined,
  ) => void;

  onRoomCountChange: (
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

export function ClimateRoomsStep({
  conditionedAreaM2,
  roomCount,
  onConditionedAreaChange,
  onRoomCountChange,
}: ClimateRoomsStepProps) {
  const [areaText, setAreaText] =
    useState(() =>
      formatInputValue(conditionedAreaM2),
    );

  const [roomText, setRoomText] =
    useState(() =>
      formatInputValue(roomCount),
    );

  const areaError =
    conditionedAreaM2 !== undefined &&
    (conditionedAreaM2 < 10 ||
      conditionedAreaM2 > 2_000)
      ? "Bitte gib eine Fläche zwischen 10 und 2.000 m² ein."
      : null;

  const roomError =
    roomCount !== undefined &&
    (!Number.isInteger(roomCount) ||
      roomCount < 1 ||
      roomCount > 30)
      ? "Bitte gib zwischen 1 und 30 getrennte Räume oder Zonen ein."
      : null;

  return (
    <div className="grid min-w-0 gap-6 sm:grid-cols-2">
      <div className="min-w-0">
        <label
          htmlFor="climate-conditioned-area"
          className="block text-sm font-semibold text-brand-primary"
        >
          Zu klimatisierende Fläche
        </label>

        <div className="relative mt-2">
          <input
            id="climate-conditioned-area"
            type="text"
            inputMode="decimal"
            value={areaText}
            aria-invalid={Boolean(areaError)}
            onChange={(event) => {
              const value =
                event.currentTarget.value;

              setAreaText(value);

              onConditionedAreaChange(
                parseNumber(value),
              );
            }}
            className={[
              "min-h-14 w-full min-w-0 rounded-xl border bg-background px-4 py-3 pr-20 text-base",
              areaError
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

        {areaError ? (
          <p className="mt-2 text-sm font-medium text-red-700">
            {areaError}
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            Beispiel: insgesamt 80 m² Wohn- oder
            Nutzfläche.
          </p>
        )}
      </div>

      <div className="min-w-0">
        <label
          htmlFor="climate-room-count"
          className="block text-sm font-semibold text-brand-primary"
        >
          Anzahl Räume oder Zonen
        </label>

        <div className="relative mt-2">
          <input
            id="climate-room-count"
            type="text"
            inputMode="numeric"
            value={roomText}
            aria-invalid={Boolean(roomError)}
            onChange={(event) => {
              const value =
                event.currentTarget.value;

              setRoomText(value);

              onRoomCountChange(
                parseNumber(value),
              );
            }}
            className={[
              "min-h-14 w-full min-w-0 rounded-xl border bg-background px-4 py-3 pr-24 text-base",
              roomError
                ? "border-red-600"
                : "border-border-default",
            ].join(" ")}
          />

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-foreground/60"
          >
            Räume
          </span>
        </div>

        {roomError ? (
          <p className="mt-2 text-sm font-medium text-red-700">
            {roomError}
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-foreground/60">
            Jeder separat zu klimatisierende Bereich
            zählt als eigener Raum bzw. eigene Zone.
          </p>
        )}
      </div>
    </div>
  );
}