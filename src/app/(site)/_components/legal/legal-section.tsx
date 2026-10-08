import type { ReactNode } from "react";

interface LegalSectionProps {
  title: string;
  children: ReactNode;
  documentLayout?: boolean;
}

export function LegalSection({ title, children, documentLayout = false }: LegalSectionProps) {
  const numberedTitle = documentLayout ? title.match(/^(\d+\.\s+)(.*)$/) : null;
  return (
    <section
      className={
        documentLayout
          ? "border-border-default grid gap-6 border-t pt-8 md:gap-8 md:pt-10 xl:grid-cols-[minmax(0,0.6fr)_minmax(0,2fr)] xl:gap-12"
          : "space-y-4"
      }
    >
      <h2
        className={
          documentLayout
            ? "text-brand-navy text-xl leading-snug font-semibold tracking-tight sm:text-2xl"
            : "text-2xl font-semibold tracking-tight md:text-3xl"
        }
      >
        {documentLayout ? (
          numberedTitle ? (
            <>
              <span>{numberedTitle[1]}</span>
              <span className="block first-letter:uppercase">{numberedTitle[2]}</span>
            </>
          ) : (
            <span className="block first-letter:uppercase">{title}</span>
          )
        ) : (
          title
        )}
      </h2>

      <div
        className={
          documentLayout
            ? "text-brand-dark min-w-0 space-y-5 text-base leading-[1.85] md:text-[1.0625rem] [&>h3]:pt-5 [&>h3]:leading-snug [&>h3:first-child]:pt-0"
            : "text-foreground/75 space-y-4"
        }
      >
        {children}
      </div>
    </section>
  );
}
