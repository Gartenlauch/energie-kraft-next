import type { PublicFaqEntry } from "@/types/faq";
import Link from "next/link";

interface PublicFaqSectionProps {
  faqs: readonly PublicFaqEntry[];
  eyebrow?: string;
  title?: string;
  description?: string;
  categorySlug?: string;
  categoryLabel?: string;
}

export function PublicFaqSection({
  faqs,
  eyebrow = "Häufige Fragen",
  title = "Gut informiert entscheiden",
  description = "Antworten auf häufige Fragen rund um Planung, Umsetzung und Betrieb.",
  categorySlug,
  categoryLabel,
}: PublicFaqSectionProps) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section id="faq" aria-labelledby="faq-heading" className="section-space bg-surface">
      <div className="section-shell max-w-5xl">
        <div className="mb-10 max-w-3xl md:mb-14">
          <p className="eyebrow">{eyebrow}</p>

          <h2 id="faq-heading" className="section-title mt-4">
            {title}
          </h2>

          <p className="lead-copy mt-5">{description}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group border-border-default bg-background open:border-brand-primary rounded-[var(--radius-md)] border px-5 shadow-[var(--shadow-sm)] transition md:px-7"
            >
              <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                <span className="text-brand-navy font-semibold md:text-lg">{faq.question}</span>

                <span
                  aria-hidden="true"
                  className="bg-surface-soft text-brand-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xl font-normal transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>

              <div className="max-w-3xl pr-8 pb-6">
                <p className="text-base leading-7 whitespace-pre-line text-[var(--text-muted)]">
                  {faq.answer}
                </p>
                {faq.href && (
                  <Link
                    href={faq.href}
                    className="text-brand-primary mt-4 inline-block py-2 font-semibold underline underline-offset-4"
                  >
                    Frage im Detail lesen
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
        <Link
          href={categorySlug ? `/faq/${categorySlug}` : "/faq"}
          className="button-secondary mt-8"
        >
          {categoryLabel ? `Alle Fragen zu ${categoryLabel}` : "Alle Fragen & Antworten"}
        </Link>
      </div>
    </section>
  );
}
