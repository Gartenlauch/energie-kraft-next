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
        "min-h-32 w-full rounded-[var(--radius-md)] border p-5 text-left",
        "transition duration-150 hover:-translate-y-0.5",
        "disabled:cursor-not-allowed disabled:opacity-50",
        selected
          ? "border-brand-accent bg-cyan-50/60 shadow-[var(--shadow-card)] ring-1 ring-brand-accent"
          : "border-border-default bg-white shadow-[var(--shadow-sm)] hover:border-brand-primary hover:shadow-[var(--shadow-card)]",
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
        <span className="mt-1.5 block text-sm leading-6 text-[var(--text-muted)]">
          {description}
        </span>
      ) : null}

      {selected ? (
        <span className="mt-3 block text-sm font-semibold text-brand-primary">
          Ausgewählt
        </span>
      ) : null}
    </button>
  );
}
