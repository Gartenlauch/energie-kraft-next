import type { Metadata } from "next";

import { LegalDocument } from "@/app/(site)/_components/legal/legal-document";
import { LegalPage } from "@/app/(site)/_components/legal/legal-page";
import { imprintContent } from "@/content/legal/documents";
import { buildMetadata } from "@/lib/seo/metadata";
import type { SeoContent } from "@/types/content";

const seo = {
  title: "Impressum | Energie-Kraft Süd",
  description: "Impressum und Anbieterkennzeichnung der Energie-Kraft Süd GmbH & Co. KG.",
  canonicalPath: "/impressum",
} satisfies SeoContent;

export const metadata: Metadata = buildMetadata(seo);

export default function ImpressumPage() {
  return (
    <LegalPage seo={seo} eyebrow="Rechtliche Informationen" title="Impressum" documentLayout>
      <LegalDocument content={imprintContent} />
    </LegalPage>
  );
}
