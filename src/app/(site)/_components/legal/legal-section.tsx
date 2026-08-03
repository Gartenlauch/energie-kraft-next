import type { ReactNode } from "react";

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export function LegalSection({
  title,
  children,
}: LegalSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>

      <div className="space-y-4 text-foreground/75">
        {children}
      </div>
    </section>
  );
}