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
      <div className="section-shell max-w-5xl py-12 md:py-16">
        <nav aria-label="FAQ-Themen">
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  className="text-brand-primary inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
                  href={`/faq/${category.slug}`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {featured.length > 0 && (
          <section className="my-12" aria-labelledby="featured-faqs">
            <h2 id="featured-faqs" className="text-2xl">
              Ausgewählte Fragen zum Einstieg
            </h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {featured.map((faq) => (
                <li key={faq.id}>
                  <Link
                    className="text-brand-primary inline-block py-2 underline underline-offset-4"
                    href={faq.href}
                  >
                    {faq.question}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="mt-10" aria-labelledby="all-faqs">
          <h2 id="all-faqs" className="mb-6 text-2xl">
            Alle Fragen & Antworten
          </h2>
          <FaqExplorer entries={entries} categories={categories} />
        </section>
      </div>
    </main>
  );
}
