import type { Metadata } from "next";

import { PublicContentPage } from "@/app/(site)/_components/public-content-page";
import { kontaktContent } from "@/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata(kontaktContent.seo);

export default function KontaktPage() {
  return <PublicContentPage content={kontaktContent} />;
}