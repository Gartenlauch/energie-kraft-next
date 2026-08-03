import { serializeJsonLd } from "@/lib/seo/json-ld";

interface JsonLdScriptProps {
  data: unknown;
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(data),
      }}
    />
  );
}
