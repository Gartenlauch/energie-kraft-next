import { LegalSection } from "@/app/(site)/_components/legal/legal-section";
import { siteConfig } from "@/config/site";
import type { LegalDocumentContent } from "@/content/legal/documents";

// Link only the original contact lines, preserving their complete visible text.
const contactLinks: Readonly<Record<string, string>> = {
  "Telefon: +49 (0) 8654/77161-0": siteConfig.contact.phoneHref,
  "E-Mail: office@energie-kraft.de": siteConfig.contact.emailHref,
  "https://ec.europa.eu/consumers/odr/": "https://ec.europa.eu/consumers/odr/",
};

export function LegalDocument({ content }: { content: LegalDocumentContent }) {
  return (
    <>
      {content.introduction ? <p className="font-semibold">{content.introduction}</p> : null}
      {content.sections.map((section) => (
        <LegalSection key={section.title} title={section.title} documentLayout>
          {section.blocks.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h3 key={index} className="text-foreground pt-4 font-semibold">
                  {block.text}
                </h3>
              );
            }
            if (block.type === "list") {
              return (
                <ol
                  key={index}
                  role="list"
                  className="border-foreground/15 list-none space-y-4 border-l pl-4 sm:pl-6"
                >
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              );
            }
            const href = contactLinks[block.text];
            return (
              <p key={index}>
                {href ? (
                  <a
                    href={href}
                    className="text-brand-primary underline underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    {block.text}
                  </a>
                ) : (
                  block.text
                )}
              </p>
            );
          })}
        </LegalSection>
      ))}
    </>
  );
}
