import type { Metadata } from "next";

import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { stromspeicherContent } from "@/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(stromspeicherContent.seo);

export default function StromspeicherPage() {
  return <PublicContentPage content={stromspeicherContent} />;
}