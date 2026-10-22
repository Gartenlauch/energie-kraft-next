import type { Metadata } from "next";
import { SonnenServiceNotice } from "@/components/marketing/sonnen-service-notice";

import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { stromspeicherContent } from "@/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { StorageEnergyManagementSection, StorageProductsSection, StorageFunctionSection } from "./stromspeicher-sections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(stromspeicherContent.seo);

export default function StromspeicherPage() {
  return (
    <PublicContentPage
      brandIntroVariant="brand"
      content={stromspeicherContent}
      afterHero={<SonnenServiceNotice variant="storage" />}
      sectionOverrides={{
        funktionsweise: <StorageFunctionSection key="funktionsweise" />,
        speicherprodukte: <StorageProductsSection key="speicherprodukte" />,
        energiemanagement: <StorageEnergyManagementSection key="energiemanagement" />,
      }}
    />
  );
}
