import type { Metadata } from "next";

import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import {
  WallboxBusinessSection,
  WallboxProductShowcase,
} from "./_components/wallbox-product-showcase";
import { wallboxContent } from "@/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(wallboxContent.seo);

export default function WallboxPage() {
  return (
    <PublicContentPage
      content={wallboxContent}
      sectionOverrides={Object.fromEntries(
        wallboxContent.sections.flatMap((section) => {
          if (section.id === "wallbox-produkte")
            return [[section.id, <WallboxProductShowcase key={section.id} section={section} />]];
          if (section.id === "unternehmen")
            return [[section.id, <WallboxBusinessSection key={section.id} section={section} />]];
          return [];
        }),
      )}
    />
  );
}
