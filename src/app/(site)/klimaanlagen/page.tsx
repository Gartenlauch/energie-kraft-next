import type { Metadata } from "next";

import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { klimaanlagenContent } from "@/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(klimaanlagenContent.seo);

export default function KlimaanlagenPage() {
  return <PublicContentPage content={klimaanlagenContent} />;
}