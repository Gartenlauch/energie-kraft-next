import type { Metadata } from "next";

import { FaqJsonLd } from "@/components/faq/faq-json-ld";
import { PublicFaqSection } from "@/components/faq/public-faq-section";
import { HomePageJsonLd } from "@/components/seo/home-page-json-ld";
import { homeContent } from "@/content";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(homeContent.seo);

export default async function HomePage() {
  const faqs = await getPublicFaqEntriesByRoute("home");

  return (
    <>
      <HomePageJsonLd seo={homeContent.seo} />
      <FaqJsonLd faqs={faqs} />

      <main>
        <section className="bg-background flex min-h-screen items-center px-6">
          <div className="mx-auto w-full max-w-7xl">
            {homeContent.hero.eyebrow ? (
              <p className="mb-4 text-sm font-semibold tracking-widest uppercase">
                {homeContent.hero.eyebrow}
              </p>
            ) : null}

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              {homeContent.hero.title}
            </h1>

            <p className="text-foreground/70 mt-6 max-w-2xl text-lg leading-8">
              {homeContent.hero.description}
            </p>
          </div>
        </section>

        <PublicFaqSection
          faqs={faqs}
          eyebrow="Fragen & Antworten"
          title="Häufige Fragen zu Energie-Kraft"
          description="Antworten auf häufige Fragen zu unseren Lösungen, zur Planung und zur Umsetzung."
        />
      </main>
    </>
  );
}
