import type { ReactNode } from "react";

interface ConfiguratorStepSectionProps {
  headingId: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function ConfiguratorStepSection({
  headingId,
  eyebrow,
  title,
  description,
  children,
}: ConfiguratorStepSectionProps) {
  return (
    <section aria-labelledby={headingId}>
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-widest text-brand-secondary uppercase">
          {eyebrow}
        </p>
      ) : null}

      <h1
        id={headingId}
        className="mt-3 text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl"
      >
        {title}
      </h1>

      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
          {description}
        </p>
      ) : null}

      <div className="mt-8">{children}</div>
    </section>
  );
}