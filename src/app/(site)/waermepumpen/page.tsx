import type { Metadata } from "next";

import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { waermepumpenContent } from "@/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { HeatPumpPhotovoltaicSection, HeatPumpProductsSection } from "./waermepumpen-sections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(waermepumpenContent.seo);

export default function WaermepumpenPage() {
  return (
    <PublicContentPage
      brandIntroVariant="brand"
      content={waermepumpenContent}
      sectionOverrides={{
        "bosch-waermepumpen": <HeatPumpProductsSection key="bosch-waermepumpen" />,
        "photovoltaik-kombination": <HeatPumpPhotovoltaicSection key="photovoltaik-kombination" />,
      }}
    />
  );
}
