import type { Metadata } from "next";

import { Sprint8ContentPage } from "@/app/(site)/_components/sprint8-content-page";
import { sprint8Pages } from "@/content/sprint8-pages";
import { buildMetadata } from "@/lib/seo/metadata";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";
import { PublicFaqSection } from "@/components/faq/public-faq-section";
import { FaqJsonLd } from "@/components/faq/faq-json-ld";

export const dynamic = "force-dynamic";

const content = sprint8Pages.businessPv;

export const metadata: Metadata = buildMetadata(content.seo);

export default async function BusinessPhotovoltaicsPage() {
  const faqs = await getPublicFaqEntriesByRoute("photovoltaik");
  return (
    <Sprint8ContentPage
      content={content}
      afterSections={
        <>
          <FaqJsonLd faqs={faqs} />
          <PublicFaqSection faqs={faqs} categorySlug="photovoltaik" categoryLabel="Photovoltaik" />
        </>
      }
    />
  );
}
