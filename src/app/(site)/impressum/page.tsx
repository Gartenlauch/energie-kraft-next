import type { Metadata } from "next";

import { LegalPage } from "@/app/(site)/_components/legal/legal-page";
import { LegalSection } from "@/app/(site)/_components/legal/legal-section";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import type { SeoContent } from "@/types/content";

const seo = {
  title: "Impressum | Energie-Kraft Süd",
  description:
    "Impressum und Anbieterkennzeichnung der Energie-Kraft Süd GmbH & Co. KG.",
  canonicalPath: "/impressum",
} satisfies SeoContent;

export const metadata: Metadata = buildMetadata(seo);

export default function ImpressumPage() {
  return (
    <LegalPage
      seo={seo}
      eyebrow="Rechtliche Informationen"
      title="Impressum"
      description="Anbieterkennzeichnung und Unternehmensinformationen der Energie-Kraft Süd GmbH & Co. KG."
    >
      <LegalSection title="Angaben zum Unternehmen">
        <address className="not-italic">
          <p className="font-semibold">
            {siteConfig.legalName}
          </p>

          <p>
            {siteConfig.contact.address.street}
            <br />
            {siteConfig.contact.address.postalCode}{" "}
            {siteConfig.contact.address.city}
            <br />
            {siteConfig.contact.address.country}
          </p>
        </address>
      </LegalSection>

      <LegalSection title="Vertretungsberechtigte Geschäftsführer">
        <p>Kai Stengle</p>
        <p>Markus Österlein</p>
      </LegalSection>

      <LegalSection title="Registereintrag">
        <dl className="grid gap-3 sm:grid-cols-[180px_1fr]">
          <dt className="font-semibold">Registergericht</dt>
          <dd>Amtsgericht Traunstein</dd>

          <dt className="font-semibold">Registernummer</dt>
          <dd>HRA 9372</dd>

          <dt className="font-semibold">
            Umsatzsteuer-ID
          </dt>
          <dd>DE814795925</dd>
        </dl>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          Telefon:{" "}
          <a
            href={siteConfig.contact.phoneHref}
            className="font-medium underline underline-offset-4"
          >
            {siteConfig.contact.phoneDisplay}
          </a>
        </p>

        <p>
          E-Mail:{" "}
          <a
            href={siteConfig.contact.emailHref}
            className="font-medium underline underline-offset-4"
          >
            {siteConfig.contact.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Verbraucherstreitbeilegung">
        <p>
          Energie-Kraft Süd ist zur Teilnahme an einem
          Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle weder verpflichtet noch
          bereit.
        </p>
      </LegalSection>

      <LegalSection title="Hinweis zur rechtlichen Prüfung">
        <p>
          Die Angaben dieses Impressums wurden aus dem bestehenden
          Webauftritt übernommen. Sie müssen vor dem Produktivstart
          nochmals von der Geschäftsführung auf Aktualität und
          Vollständigkeit geprüft werden.
        </p>
      </LegalSection>
    </LegalPage>
  );
}