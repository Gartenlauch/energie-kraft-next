import Link from "next/link";

import { FaqJsonLd } from "@/components/faq/faq-json-ld";
import { PublicFaqSection } from "@/components/faq/public-faq-section";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";
import type { PublicPageContent } from "@/types/content";

interface PublicContentPageProps {
  content: PublicPageContent;
}

export async function PublicContentPage({
  content,
}: PublicContentPageProps) {
  const faqs = await getPublicFaqEntriesByRoute(content.faqRouteKey);

  return (
    <>
      <FaqJsonLd faqs={faqs} />

      <main>
        <section className="flex min-h-[70vh] items-center bg-background px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            {content.hero.eyebrow ? (
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest">
                {content.hero.eyebrow}
              </p>
            ) : null}

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              {content.hero.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-foreground/70">
              {content.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={content.hero.primaryCta.href}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-semibold text-background"
              >
                {content.hero.primaryCta.label}
              </Link>

              {content.hero.secondaryCta ? (
                <Link
                  href={content.hero.secondaryCta.href}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-foreground/20 px-5 py-3 text-sm font-semibold"
                >
                  {content.hero.secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        {content.sections.map((section, index) => (
          <section
            id={section.id}
            key={`${section.title}-${index}`}
            className="scroll-mt-24 border-t border-foreground/10 px-6 py-20"
          >
            <div className="mx-auto w-full max-w-7xl">
              {section.eyebrow ? (
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest">
                  {section.eyebrow}
                </p>
              ) : null}

              <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                {section.title}
              </h2>

              <div className="mt-6 max-w-3xl space-y-4 text-lg leading-8 text-foreground/70">
                {section.text.map((paragraph, paragraphIndex) => (
                  <p
                    key={`${section.id ?? section.title}-${paragraphIndex}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ))}

        <PublicFaqSection faqs={faqs} />
      </main>
    </>
  );
}