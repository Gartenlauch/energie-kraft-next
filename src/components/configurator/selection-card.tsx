"use client";

import type { AriaAttributes, ReactNode } from "react";

interface SelectionCardProps extends Pick<AriaAttributes, "aria-describedby"> {
  title: string;
  description?: string;
  media?: ReactNode;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  radioName?: string;
  radioValue?: string;
}

export function SelectionCard({
  title,
  description,
  media,
  selected,
  disabled = false,
  onSelect,
  radioName,
  radioValue,
  "aria-describedby": ariaDescribedBy,
}: SelectionCardProps) {
  const className = [
    "min-h-32 w-full rounded-[var(--radius-md)] border p-5 text-left",
    "transition duration-150 hover:-translate-y-0.5",
    "disabled:cursor-not-allowed disabled:opacity-50",
    selected
      ? "border-brand-accent-strong bg-cyan-50/60 shadow-[var(--shadow-card)] ring-1 ring-brand-accent-strong"
      : "border-border-default bg-white shadow-[var(--shadow-sm)] hover:border-brand-primary hover:shadow-[var(--shadow-card)]",
  ].join(" ");

  const content = (
    <>
      {media ? <div className="mb-4 flex min-h-20 items-center justify-center">{media}</div> : null}

      <span className="text-brand-primary block text-base font-semibold">{title}</span>

      {description ? (
        <span className="mt-1.5 block text-sm leading-6 text-[var(--text-muted)]">
          {description}
        </span>
      ) : null}

      {selected ? (
        <span className="text-brand-primary mt-3 block text-sm font-semibold">Ausgewählt</span>
      ) : null}
    </>
  );

  if (radioName) {
    return (
      <label
        className={`${className} has-[:focus-visible]:outline-focus-ring relative block cursor-pointer has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3`}
      >
        <input
          type="radio"
          name={radioName}
          value={radioValue}
          checked={selected}
          disabled={disabled}
          onChange={onSelect}
          aria-describedby={ariaDescribedBy}
          className="sr-only"
        />
        {content}
      </label>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      onClick={onSelect}
      className={className}
    >
      {content}
    </button>
  );
}
