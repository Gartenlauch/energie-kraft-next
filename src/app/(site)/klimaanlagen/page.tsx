import type { Metadata } from "next";

import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { klimaanlagenContent } from "@/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { KlimaanlagenProductsSection } from "./klimaanlagen-products-section";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(klimaanlagenContent.seo);

export default function KlimaanlagenPage() {
  return (
    <PublicContentPage
      brandIntroVariant="brand"
      content={klimaanlagenContent}
      sectionOverrides={{
        "bosch-klimaanlagen": <KlimaanlagenProductsSection key="bosch-klimaanlagen" />,
      }}
    />
  );
}
