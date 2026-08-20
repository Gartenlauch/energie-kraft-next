"use client";

import type { ReactNode } from "react";

interface SelectionCardProps {
  title: string;
  description?: string;
  media?: ReactNode;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

export function SelectionCard({
  title,
  description,
  media,
  selected,
  disabled = false,
  onSelect,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      className={[
        "min-h-28 w-full rounded-2xl border p-4 text-left",
        "transition duration-150",
        "disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "border-brand-accent bg-surface shadow-sm ring-2 ring-brand-accent"
          : "border-border-default bg-white hover:border-brand-secondary",
      ].join(" ")}
    >
      {media ? (
        <div className="mb-4 flex min-h-20 items-center justify-center">
          {media}
        </div>
      ) : null}

      <span className="block text-base font-semibold text-brand-primary">
        {title}
      </span>

      {description ? (
        <span className="mt-1 block text-sm leading-6 text-brand-secondary">
          {description}
        </span>
      ) : null}

      {selected ? (
        <span className="mt-3 block text-sm font-medium text-brand-primary">
          Ausgewählt
        </span>
      ) : null}
    </button>
  );
}