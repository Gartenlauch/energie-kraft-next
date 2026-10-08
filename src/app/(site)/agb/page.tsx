import type { Metadata } from "next";

import { LegalDocument } from "@/app/(site)/_components/legal/legal-document";
import { LegalPage } from "@/app/(site)/_components/legal/legal-page";
import { agbContent } from "@/content/legal/documents";
import { buildMetadata } from "@/lib/seo/metadata";
import type { SeoContent } from "@/types/content";

const seo = {
  title: "Allgemeine Geschäftsbedingungen | Energie-Kraft Süd",
  description:
    "Allgemeine Geschäftsbedingungen der Energie-Kraft Süd GmbH & Co. KG, Stand 01.02.2025.",
  canonicalPath: "/agb",
} satisfies SeoContent;

export const metadata: Metadata = buildMetadata(seo);

export default function AgbPage() {
  return (
    <LegalPage
      seo={seo}
      eyebrow="Vertragsinformationen"
      title="Allgemeine Geschäftsbedingungen"
      documentLayout
    >
      <LegalDocument content={agbContent} />
    </LegalPage>
  );
}
