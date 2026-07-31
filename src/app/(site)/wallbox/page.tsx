import type { Metadata } from "next";

import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { wallboxContent } from "@/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(wallboxContent.seo);

export default function WallboxPage() {
  return <PublicContentPage content={wallboxContent} />;
}