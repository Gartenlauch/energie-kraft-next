import type { Metadata } from "next";

import { Sprint8ContentPage } from "@/app/(site)/_components/sprint8-content-page";
import { sprint8Pages } from "@/content/sprint8-pages";
import { buildMetadata } from "@/lib/seo/metadata";

const content = sprint8Pages.funding;

export const metadata: Metadata = buildMetadata(content.seo);

export default function FundingPage() {
  return <Sprint8ContentPage content={content} />;
}
