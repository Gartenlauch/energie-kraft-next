import type { ReactNode } from "react";

import type { ProjectEconomicsResult } from "@/types/configurator/economics";

const euroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function euro(value: number): string {
  return euroFormatter.format(value);
}

export function number(value: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits }).format(value);
}

export function percent(value: number, maximumFractionDigits = 1): string {
  return `${number(value, maximumFractionDigits)} %`;
}

export function investment(
  economics: ProjectEconomicsResult,
  component: ProjectEconomicsResult["components"][number]["component"],
): number | null {
  return (
    economics.components.find((item) => item.component === component)?.investmentBaseEuro ?? null
  );
}

export function ResultMetric({
  label,
  value,
  note,
  className = "",
}: {
  label: string;
  value: ReactNode;
  note?: string;
  className?: string;
}) {
  return (
    <div className={`border-brand-primary/15 min-w-0 border-t pt-4 ${className}`}>
      <dt className="text-brand-secondary text-xs font-semibold tracking-[0.12em] uppercase">
        {label}
      </dt>
      <dd className="text-brand-navy mt-2 text-xl font-semibold tracking-tight break-words sm:text-2xl">
        {value}
      </dd>
      {note ? <dd className="text-foreground/65 mt-2 text-sm leading-6">{note}</dd> : null}
    </div>
  );
}

export function ResultIntro({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description: string;
  id: string;
}) {
  return (
    <header>
      <p className="text-brand-secondary text-sm font-semibold tracking-[0.15em] uppercase">
        {eyebrow}
      </p>
      <h1
        id={id}
        className="text-brand-primary mt-3 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        {title}
      </h1>
      <p className="text-foreground/70 mt-4 max-w-3xl text-base leading-7 sm:text-lg">
        {description}
      </p>
    </header>
  );
}
