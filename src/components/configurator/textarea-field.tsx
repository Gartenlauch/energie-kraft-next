"use client";

interface TextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
  helpText?: string;
  error?: string;
}

export function TextareaField({
  id,
  label,
  value,
  onChange,
  rows = 6,
  maxLength = 2_000,
  helpText,
  error,
}: TextareaFieldProps) {
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

      <textarea
        id={id}
        rows={rows}
        maxLength={maxLength}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        onChange={(event) =>
          onChange(event.currentTarget.value)
        }
        className={[
          "mt-2 w-full min-w-0 resize-y rounded-xl border bg-background px-4 py-3",
          "leading-7",
          error
            ? "border-red-600"
            : "border-border-default",
        ].join(" ")}
      />

      <div className="mt-2 flex flex-wrap justify-between gap-2">
        {helpText ? (
          <p
            id={helpId}
            className="text-sm leading-6 text-foreground/65"
          >
            {helpText}
          </p>
        ) : (
          <span />
        )}

        <span className="text-xs text-foreground/50">
          {value.length} / {maxLength}
        </span>
      </div>

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