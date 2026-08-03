import Link from "next/link";

import { FaqJsonLd } from "@/components/faq/faq-json-ld";
import { PublicFaqSection } from "@/components/faq/public-faq-section";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";
import type { PublicPageContent } from "@/types/content";

interface PublicContentPageProps {
  content: PublicPageContent;
}

export async function PublicContentPage({ content }: PublicContentPageProps) {
  const faqs = await getPublicFaqEntriesByRoute(content.faqRouteKey);

  return (
    <>
      <FaqJsonLd faqs={faqs} />

      <main>
        <section className="bg-background flex min-h-[70vh] items-center px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            {content.hero.eyebrow ? (
              <p className="mb-4 text-sm font-semibold tracking-widest uppercase">
                {content.hero.eyebrow}
              </p>
            ) : null}

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              {content.hero.title}
            </h1>

            <p className="text-foreground/70 mt-6 max-w-2xl text-lg leading-8">
              {content.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={content.hero.primaryCta.href}
                className="bg-foreground text-background inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
              >
                {content.hero.primaryCta.label}
              </Link>

              {content.hero.secondaryCta ? (
                <Link
                  href={content.hero.secondaryCta.href}
                  className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
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
            className="border-foreground/10 scroll-mt-24 border-t px-6 py-20"
          >
            <div className="mx-auto w-full max-w-7xl">
              {section.eyebrow ? (
                <p className="mb-3 text-sm font-semibold tracking-widest uppercase">
                  {section.eyebrow}
                </p>
              ) : null}

              <h2 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
                {section.title}
              </h2>

              <div className="text-foreground/70 mt-6 max-w-3xl space-y-4 text-lg leading-8">
                {section.text.map((paragraph, paragraphIndex) => (
                  <p key={`${section.id ?? section.title}-paragraph-${paragraphIndex}`}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.items && section.items.length > 0 ? (
                <ul className="mt-8 grid max-w-5xl gap-4 md:grid-cols-2">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={`${section.id ?? section.title}-item-${itemIndex}`}
                      className="border-foreground/10 bg-foreground/[0.02] rounded-lg border p-5 leading-7"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.cta ? (
                <div className="mt-8">
                  <Link
                    href={section.cta.href}
                    className="border-foreground/20 inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold"
                  >
                    {section.cta.label}
                  </Link>
                </div>
              ) : null}
            </div>
          </section>
        ))}

        <PublicFaqSection faqs={faqs} />
      </main>
    </>
  );
}
