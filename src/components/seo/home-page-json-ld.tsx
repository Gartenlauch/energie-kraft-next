import { JsonLdScript } from "@/components/seo/json-ld-script";
import { buildWebPageJsonLd, buildWebSiteJsonLd } from "@/lib/seo/structured-data";
import type { SeoContent } from "@/types/content";

interface HomePageJsonLdProps {
  seo: SeoContent;
}

export function HomePageJsonLd({ seo }: HomePageJsonLdProps) {
  return (
    <>
      <JsonLdScript data={buildWebSiteJsonLd()} />
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
    </>
  );
}
