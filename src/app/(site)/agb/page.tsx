import type { Metadata } from "next";

import { LegalPage } from "@/app/(site)/_components/legal/legal-page";
import { LegalSection } from "@/app/(site)/_components/legal/legal-section";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import type { SeoContent } from "@/types/content";

const seo = {
  title: "Allgemeine Geschäftsbedingungen | Energie-Kraft Süd",
  description:
    "Allgemeine Geschäftsbedingungen der Energie-Kraft Süd GmbH & Co. KG.",
  canonicalPath: "/agb",
} satisfies SeoContent;

export const metadata: Metadata = buildMetadata({
  ...seo,
  noIndex: true,
});

export default function AgbPage() {
  return (
    <LegalPage
      seo={seo}
      eyebrow="Vertragsinformationen"
      title="Allgemeine Geschäftsbedingungen"
      description="Die vollständige und rechtlich geprüfte AGB-Fassung wird vor dem Produktivstart unverändert aus der freigegebenen Unternehmensvorlage übernommen."
    >
      <aside className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
        <h2 className="text-xl font-semibold">
          Rechtliche Freigabe erforderlich
        </h2>

        <p className="mt-3 leading-7">
          Die AGB werden nicht redaktionell durch die
          Websiteentwicklung verändert. Vor dem Go-live muss die
          aktuell gültige und freigegebene Originalfassung
          bereitgestellt und vollständig in diese Route übernommen
          werden.
        </p>
      </aside>

      <LegalSection title="Vertragspartner">
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

      <LegalSection title="Für die finale Migration erforderlich">
        <ul className="list-disc space-y-2 pl-6">
          <li>aktuelle freigegebene Originalfassung der AGB</li>
          <li>Versionsdatum beziehungsweise Gültigkeitsdatum</li>
          <li>Prüfung des aktuellen Leistungsumfangs</li>
          <li>
            Prüfung neuer Leistungen wie Klimaanlagen und
            Wärmepumpen
          </li>
          <li>
            Prüfung der Regelungen für Verbraucher und Unternehmer
          </li>
          <li>Freigabe durch die Geschäftsführung</li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}