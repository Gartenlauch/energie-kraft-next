import type { PublicFaqEntry } from "@/types/faq";

interface PublicFaqSectionProps {
  faqs: readonly PublicFaqEntry[];
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function PublicFaqSection({
  faqs,
  eyebrow = "Häufige Fragen",
  title = "Gut informiert entscheiden",
  description = "Antworten auf häufige Fragen rund um Planung, Umsetzung und Betrieb.",
}: PublicFaqSectionProps) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold tracking-widest text-emerald-800 uppercase">
            {eyebrow}
          </p>

          <h2
            id="faq-heading"
            className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl"
          >
            {title}
          </h2>

          <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq) => (
            <details key={faq.id} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left">
                <span className="text-lg font-semibold text-slate-950">{faq.question}</span>

                <span
                  aria-hidden="true"
                  className="text-2xl font-light text-emerald-800 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>

              <div className="pr-10 pb-6">
                <p className="text-base leading-7 whitespace-pre-line text-slate-600">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
