import { FaqExplorer } from "@/components/faq/faq-explorer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqPageHeading } from "@/components/faq/faq-page-heading";
import { getPublicFaqCatalog } from "@/lib/faq/public-repository";
import { FAQ_PRODUCT_LINKS } from "@/lib/faq/catalog";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ category: string }> };
async function getCategory(params: Props["params"]) {
  const { category: slug } = await params;
  const catalog = await getPublicFaqCatalog();
  const category = catalog.categories.find((item) => item.slug === slug);
  if (!category) notFound();
  return { category, entries: catalog.entries.filter((faq) => faq.categoryId === category.id) };
}
export async function generateMetadata({ params }: Props) {
  const { category, entries } = await getCategory(params);
  return buildMetadata({
    title: `${category.name}: Fragen & Antworten | Energie-Kraft Süd`,
    description: `Alle Fragen zu ${category.name}: verständliche Antworten zu Planung, Technik und Betrieb.`,
    canonicalPath: `/faq/${category.slug}`,
    noIndex: entries.length === 0,
  });
}
export default async function FaqCategoryPage({ params }: Props) {
  const { category, entries } = await getCategory(params);
  const product = FAQ_PRODUCT_LINKS[category.slug];
  return (
    <main id="main-content">
      <FaqPageHeading
        title={`Fragen zu ${category.name}`}
        path={`/faq/${category.slug}`}
        items={[{ label: "FAQ", href: "/faq" }]}
        description={`Hier finden Sie alle veröffentlichten Antworten zu ${category.name} – von den Voraussetzungen bis zur Nutzung im Alltag.`}
      />
      <div className="section-shell max-w-5xl py-12 md:py-16">
        <Link
          href="/faq"
          className="text-brand-primary inline-flex min-h-11 items-center underline underline-offset-4"
        >
          ← Alle Themen & globale Suche
        </Link>
        {entries.length === 0 && (
          <p className="mt-8">Zu diesem Thema werden Antworten vorbereitet.</p>
        )}
        <section className="mt-8" aria-labelledby="category-questions">
          <h2 id="category-questions" className="sr-only">
            Fragen und Antworten
          </h2>
          <FaqExplorer entries={entries} categories={[category]} categoryPage />
        </section>
        {product && (
          <Link href={product.href} className="button-primary mt-10">
            {product.label}
          </Link>
        )}
      </div>
    </main>
  );
}
