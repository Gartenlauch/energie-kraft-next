import { buildFaqPageJsonLd } from "@/lib/seo/faq-json-ld";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import type { PublicFaqEntry } from "@/types/faq";

interface FaqJsonLdProps {
  faqs: readonly PublicFaqEntry[];
}

export function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  const jsonLd = buildFaqPageJsonLd(faqs);

  if (!jsonLd) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(jsonLd),
      }}
    />
  );
}
