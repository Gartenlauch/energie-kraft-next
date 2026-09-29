import type { Metadata } from "next";

import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { stromspeicherContent } from "@/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { StorageEnergyManagementSection, StorageProductsSection } from "./stromspeicher-sections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(stromspeicherContent.seo);

export default function StromspeicherPage() {
  return (
    <PublicContentPage
      brandIntroVariant="brand"
      content={stromspeicherContent}
      sectionOverrides={{
        speicherprodukte: <StorageProductsSection key="speicherprodukte" />,
        energiemanagement: <StorageEnergyManagementSection key="energiemanagement" />,
      }}
    />
  );
}
