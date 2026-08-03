import { JsonLdScript } from "@/components/seo/json-ld-script";
import { buildOrganizationJsonLd } from "@/lib/seo/structured-data";

export function SiteOrganizationJsonLd() {
  return <JsonLdScript data={buildOrganizationJsonLd()} />;
}
