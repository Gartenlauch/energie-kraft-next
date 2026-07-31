import type { Metadata } from "next";

import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { waermepumpenContent } from "@/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(waermepumpenContent.seo);

export default function WaermepumpenPage() {
  return <PublicContentPage content={waermepumpenContent} />;
}