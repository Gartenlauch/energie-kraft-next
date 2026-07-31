import type { Metadata } from "next";

import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { photovoltaikContent } from "@/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(photovoltaikContent.seo);

export default function PhotovoltaikPage() {
  return <PublicContentPage content={photovoltaikContent} />;
}