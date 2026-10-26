import type { MailAttachment } from "./mailgun";

export interface InquiryTextSection {
  heading: string;
  rows?: readonly (readonly [string, string])[];
  paragraph?: string;
}

export function renderInquiryText(title: string, sections: readonly InquiryTextSection[]): string {
  return [
    title,
    ...sections.map((section) => [
      section.heading.toLocaleUpperCase("de-DE"),
      "",
      ...(section.rows?.map(([label, value]) => `${label}: ${value}`) ?? []),
      ...(section.paragraph !== undefined ? [section.paragraph] : []),
    ].join("\n")),
  ].join("\n\n");
}

export function createInquiryTextAttachment(
  filename: "Kontaktanfrage.txt" | "Konfiguratoranfrage.txt",
  text: string,
): MailAttachment {
  // A BOM helps Windows editors detect UTF-8; CRLF also preserves blank lines.
  const windowsText = text.replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\t/g, "    ")
    // eslint-disable-next-line no-control-regex -- Strip nonprinting input while preserving line breaks.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\n/g, "\r\n");
  return {
    filename,
    contentType: "text/plain; charset=utf-8",
    data: Buffer.from(`\uFEFF${windowsText}`, "utf8"),
  };
}
