"use client";

interface NumericInputFieldProps {
  id: string;
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: string;
  error?: string;
}

export function NumericInputField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  helpText,
  error,
}: NumericInputFieldProps) {
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const describedBy = [helpId, errorId]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-w-0">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-brand-primary"
      >
        {label}
      </label>

      <div className="relative mt-2 min-w-0">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={value ?? ""}
          min={min}
          max={max}
          step={step}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          onChange={(event) => {
            const rawValue = event.currentTarget.value;

            if (rawValue === "") {
              onChange(undefined);
              return;
            }

            const parsedValue = Number(rawValue);

            onChange(
              Number.isFinite(parsedValue)
                ? parsedValue
                : undefined,
            );
          }}
          className={[
            "min-h-14 w-full min-w-0 rounded-xl border bg-background px-4 py-3",
            unit ? "pr-28" : "",
            error
              ? "border-red-600"
              : "border-border-default",
          ].join(" ")}
        />

        {unit ? (
          <span
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-foreground/60"
            aria-hidden="true"
          >
            {unit}
          </span>
        ) : null}
      </div>

      {helpText ? (
        <p
          id={helpId}
          className="mt-3 text-sm leading-6 text-foreground/65"
        >
          {helpText}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          className="mt-2 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}