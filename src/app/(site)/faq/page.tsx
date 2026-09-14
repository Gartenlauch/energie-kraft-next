import Link from "next/link";
import { FaqExplorer } from "@/components/faq/faq-explorer";
import { FaqPageHeading } from "@/components/faq/faq-page-heading";
import { getPublicFaqCatalog } from "@/lib/faq/public-repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata({
  title: "FAQ: Photovoltaik, Speicher, Wärme & Laden | Energie-Kraft Süd",
  description:
    "Antworten zu Photovoltaik, Stromspeicher, Wärmepumpe, Klimaanlage und Wallbox. Nach Thema suchen und Planung, Technik und Betrieb verstehen.",
  canonicalPath: "/faq",
});

export default async function FaqPage() {
  const { entries, categories } = await getPublicFaqCatalog();
  const featured = entries.filter((faq) => faq.featured).slice(0, 6);
  return (
    <main id="main-content">
      <FaqPageHeading
        title="Fragen zu Ihrem Energieprojekt"
        path="/faq"
        description="Wie arbeiten Photovoltaik und Speicher zusammen? Was braucht eine Wärmepumpe, und wie lässt sich ein Elektroauto mit Solarstrom laden? Hier finden Sie Antworten für die nächsten Schritte."
      />
      <div className="section-shell py-10 md:py-16">
        <section className="mb-14" aria-labelledby="all-faqs">
          <h2 id="all-faqs" className="mb-6 text-2xl">
            Welche Frage beschäftigt Sie?
          </h2>
          <FaqExplorer entries={entries} categories={categories}>
            <nav aria-label="FAQ-Themen">
              <ul className="faq-category-nav grid sm:grid-cols-2 lg:grid-cols-5">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      className="text-brand-primary border-border-strong flex min-h-16 items-center border-t py-4 pr-4 font-semibold underline-offset-4 hover:underline"
                      href={`/faq/${category.slug}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            {featured.length > 0 && (
              <section
                className="border-border-strong mt-14 border-t pt-10"
                aria-labelledby="featured-faqs"
              >
                <h2 id="featured-faqs" className="text-2xl">
                  Ausgewählte Fragen zum Einstieg
                </h2>
                <ul className="mt-5 grid gap-4 md:grid-cols-2">
                  {featured.map((faq) => (
                    <li key={faq.id}>
                      <Link
                        className="text-brand-primary border-border-default inline-flex min-h-16 items-center border-b py-4 pr-5 leading-7 font-semibold underline-offset-4 hover:underline"
                        href={faq.href}
                      >
                        {faq.question}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </FaqExplorer>
        </section>
      </div>
    </main>
  );
}
