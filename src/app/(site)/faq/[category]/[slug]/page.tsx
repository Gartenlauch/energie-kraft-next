import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqPageHeading } from "@/components/faq/faq-page-heading";
import { FAQ_PRODUCT_LINKS, selectRelatedFaqs } from "@/lib/faq/catalog";
import { getPublicFaqCatalog } from "@/lib/faq/public-repository";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ category: string; slug: string }> };
async function getEntry(params: Props["params"]) {
  const { category, slug } = await params;
  const { entries } = await getPublicFaqCatalog();
  const faq = entries.find((entry) => entry.categorySlug === category && entry.slug === slug);
  if (!faq) notFound();
  return { faq, related: selectRelatedFaqs(faq, entries) };
}
export async function generateMetadata({ params }: Props) {
  const { faq } = await getEntry(params);
  return buildMetadata({
    title: `${faq.question} | Energie-Kraft Süd`,
    description: (faq.shortAnswer || faq.answer).slice(0, 160),
    canonicalPath: faq.href,
  });
}
export default async function FaqDetailPage({ params }: Props) {
  const { faq, related } = await getEntry(params);
  const categoryHref = `/faq/${faq.categorySlug}`;
  const product = FAQ_PRODUCT_LINKS[faq.categorySlug];
  return (
    <main id="main-content">
      <FaqPageHeading
        title={faq.question}
        path={faq.href}
        items={[
          { label: "FAQ", href: "/faq" },
          { label: faq.categoryName, href: categoryHref },
        ]}
      />
      <article className="section-shell max-w-5xl py-12 md:py-16">
        <Link href={categoryHref} className="text-brand-primary underline underline-offset-4">
          ← Alle Fragen zu {faq.categoryName}
        </Link>
        <p className="eyebrow mt-10">{faq.categoryName}</p>
        {faq.shortAnswer && (
          <section className="mt-6" aria-labelledby="short-answer">
            <h2 id="short-answer" className="text-xl">
              Kurz erklärt
            </h2>
            <p className="lead-copy mt-4">{faq.shortAnswer}</p>
          </section>
        )}
        <section
          className="border-border-default mt-10 border-t pt-8"
          aria-labelledby="long-answer"
        >
          <h2 id="long-answer" className="text-2xl">
            Im Detail
          </h2>
          <p className="mt-5 leading-8 whitespace-pre-line">{faq.answer}</p>
        </section>
        {related.length > 0 && (
          <aside
            className="border-border-default mt-12 border-t pt-8"
            aria-labelledby="related-faqs"
          >
            <h2 id="related-faqs" className="text-2xl">
              Passende weitere Fragen
            </h2>
            <ul className="mt-4">
              {related.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={entry.href}
                    className="text-brand-primary inline-block py-3 underline underline-offset-4"
                  >
                    {entry.question}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
        {product && (
          <Link href={product.href} className="button-primary mt-10">
            {product.label}
          </Link>
        )}
      </article>
    </main>
  );
}
