import type { Metadata } from "next";

import { Sprint8ContentPage } from "@/app/(site)/_components/sprint8-content-page";
import { sprint8Pages } from "@/content/sprint8-pages";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  CommercialStorageApplicationsSection,
  CommercialStorageProductsSection,
  CommercialStorageEnergyManagementSection,
} from "./gewerbespeicher-sections";

const content = sprint8Pages.commercialStorage;

export const metadata: Metadata = buildMetadata(content.seo);

export default function CommercialStoragePage() {
  return (
    <Sprint8ContentPage
      brandIntroVariant="brand"
      content={content}
      sectionOverrides={{
        anwendungen: <CommercialStorageApplicationsSection />,
        produkte: <CommercialStorageProductsSection />,
        energiemanagement: <CommercialStorageEnergyManagementSection />,
      }}
    />
  );
}
