import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  buildBreadcrumbJsonLd,
  buildServiceJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";
import type { PublicPageContent } from "@/types/content";

interface PublicPageJsonLdProps {
  content: PublicPageContent;
}

export function PublicPageJsonLd({ content }: PublicPageJsonLdProps) {
  const serviceJsonLd = buildServiceJsonLd(content.seo, content.faqRouteKey);

  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(content.seo)} />

      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: content.hero.eyebrow ?? content.hero.title,
          currentPath: content.seo.canonicalPath,
        })}
      />

      {serviceJsonLd ? <JsonLdScript data={serviceJsonLd} /> : null}
    </>
  );
}
