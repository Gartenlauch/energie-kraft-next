"use client";

import { useState } from "react";

interface ClimateRoomsStepProps {
  conditionedAreaM2: number | undefined;
  roomCount: number | undefined;
  areaPrefilledFromHeatPump?: boolean;

  onConditionedAreaChange: (value: number | undefined) => void;

  onRoomCountChange: (value: number | undefined) => void;
}

function formatInputValue(value: number | undefined): string {
  return value === undefined ? "" : String(value).replace(".", ",");
}

function parseNumber(value: string): number | undefined {
  const normalized = value.trim().replace(",", ".");

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export function ClimateRoomsStep({
  conditionedAreaM2,
  roomCount,
  areaPrefilledFromHeatPump = false,
  onConditionedAreaChange,
  onRoomCountChange,
}: ClimateRoomsStepProps) {
  const [areaDraft, setAreaDraft] = useState<string | null>(null);
  const [roomDraft, setRoomDraft] = useState<string | null>(null);
  const areaText = areaDraft ?? formatInputValue(conditionedAreaM2);
  const roomText = roomDraft ?? formatInputValue(roomCount);

  const areaError =
    conditionedAreaM2 !== undefined && (conditionedAreaM2 < 10 || conditionedAreaM2 > 2_000)
      ? "Bitte gib eine Fläche zwischen 10 und 2.000 m² ein."
      : null;

  const roomError =
    roomCount !== undefined && (!Number.isInteger(roomCount) || roomCount < 1 || roomCount > 30)
      ? "Bitte gib zwischen 1 und 30 getrennte Räume oder Zonen ein."
      : null;

  return (
    <div className="min-w-0">
      <div className="grid min-w-0 gap-6 sm:grid-cols-2">
        <div className="min-w-0">
          <label
            htmlFor="climate-conditioned-area"
            className="text-brand-primary block text-sm font-semibold"
          >
            Zu klimatisierende Fläche
          </label>

          <div className="relative mt-2">
            <input
              id="climate-conditioned-area"
              aria-describedby={areaPrefilledFromHeatPump ? "climate-area-inherited" : undefined}
              type="text"
              inputMode="decimal"
              value={areaText}
              aria-invalid={Boolean(areaError)}
              onChange={(event) => {
                const value = event.currentTarget.value;

                setAreaDraft(value);

                onConditionedAreaChange(parseNumber(value));
              }}
              className={[
                "bg-background min-h-14 w-full min-w-0 rounded-xl border px-4 py-3 pr-20 text-base",
                areaError ? "border-red-600" : "border-border-default",
              ].join(" ")}
            />

            <span
              aria-hidden="true"
              className="text-foreground/60 pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm"
            >
              m²
            </span>
          </div>

          {areaError ? (
            <p className="mt-2 text-sm font-medium text-red-700">{areaError}</p>
          ) : (
            <p className="text-foreground/60 mt-2 text-sm leading-6">
              Beispiel: insgesamt 80 m² Wohn- oder Nutzfläche.
            </p>
          )}
        </div>

        <div className="min-w-0">
          <label
            htmlFor="climate-room-count"
            className="text-brand-primary block text-sm font-semibold"
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
                const value = event.currentTarget.value;

                setRoomDraft(value);

                onRoomCountChange(parseNumber(value));
              }}
              className={[
                "bg-background min-h-14 w-full min-w-0 rounded-xl border px-4 py-3 pr-24 text-base",
                roomError ? "border-red-600" : "border-border-default",
              ].join(" ")}
            />

            <span
              aria-hidden="true"
              className="text-foreground/60 pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm"
            >
              Räume
            </span>
          </div>

          {roomError ? (
            <p className="mt-2 text-sm font-medium text-red-700">{roomError}</p>
          ) : (
            <p className="text-foreground/60 mt-2 text-sm leading-6">
              Jeder separat zu klimatisierende Bereich zählt als eigener Raum bzw. eigene Zone.
            </p>
          )}
        </div>
      </div>
      {areaPrefilledFromHeatPump ? (
        <p id="climate-area-inherited" className="mt-4 text-sm font-medium text-cyan-700">
          Fläche aus deiner Wärmepumpen-Konfiguration übernommen – weiterhin frei änderbar.
        </p>
      ) : null}
    </div>
  );
}
