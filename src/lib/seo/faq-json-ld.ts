import type { PublicFaqEntry } from "@/types/faq";

interface FaqJsonLdQuestion {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

interface FaqPageJsonLd {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: FaqJsonLdQuestion[];
}

export function buildFaqPageJsonLd(faqs: readonly PublicFaqEntry[]): FaqPageJsonLd | null {
  const schemaFaqs = faqs.filter((faq) => faq.showInSchema);

  if (schemaFaqs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: schemaFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
