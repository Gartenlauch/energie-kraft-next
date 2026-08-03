import type { Metadata } from "next";

import { LegalPage } from "@/app/(site)/_components/legal/legal-page";
import { LegalSection } from "@/app/(site)/_components/legal/legal-section";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";
import type { SeoContent } from "@/types/content";

const seo = {
  title: "Datenschutz | Energie-Kraft Süd",
  description:
    "Informationen zum Datenschutz bei Energie-Kraft Süd.",
  canonicalPath: "/datenschutz",
} satisfies SeoContent;

export const metadata: Metadata = buildMetadata({
  ...seo,
  noIndex: true,
});

export default function DatenschutzPage() {
  return (
    <LegalPage
      seo={seo}
      eyebrow="Rechtliche Informationen"
      title="Datenschutz"
      description="Diese Datenschutzerklärung wird vor dem Produktivstart auf die tatsächlich eingesetzten Dienste und Verarbeitungen der neuen Website abgestimmt."
    >
      <aside className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6">
        <h2 className="text-xl font-semibold">
          Noch nicht für den Produktivbetrieb freigegeben
        </h2>

        <p className="mt-3 leading-7">
          Die neue Next.js-/Firebase-Website befindet sich noch in
          Entwicklung. Die endgültige Datenschutzerklärung wird erst
          nach Abschluss der technischen Integration von Hosting,
          Analytics, Consent Management, Kontaktformular und
          möglichen Drittanbietern veröffentlicht.
        </p>
      </aside>

      <LegalSection title="Verantwortlicher">
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

          <p>
            Datenschutz-E-Mail:{" "}
            <a
              href="mailto:datenschutz@energie-kraft.de"
              className="font-medium underline underline-offset-4"
            >
              datenschutz@energie-kraft.de
            </a>
          </p>

          <p>
            Telefon:{" "}
            <a
              href={siteConfig.contact.phoneHref}
              className="font-medium underline underline-offset-4"
            >
              {siteConfig.contact.phoneDisplay}
            </a>
          </p>
        </address>
      </LegalSection>

      <LegalSection title="Noch zu dokumentierende Verarbeitungen">
        <ul className="list-disc space-y-2 pl-6">
          <li>Firebase App Hosting und technische Protokolldaten</li>
          <li>Firebase Authentication für den Admin-Bereich</li>
          <li>Firestore-Datenverarbeitung</li>
          <li>Kontaktformular und E-Mail-Versand</li>
          <li>Consent-Management-Plattform</li>
          <li>Webanalyse und Conversion-Messung</li>
          <li>Google Maps beziehungsweise externe Kartenlinks</li>
          <li>eingebundene Schriftarten und Mediendienste</li>
          <li>Speicherdauern und Löschkonzept</li>
          <li>Auftragsverarbeiter und Drittlandübermittlungen</li>
        </ul>
      </LegalSection>

      <LegalSection title="Betroffenenrechte">
        <p>
          Betroffene Personen haben im Rahmen der gesetzlichen
          Voraussetzungen insbesondere Rechte auf Auskunft,
          Berichtigung, Löschung, Einschränkung der Verarbeitung,
          Datenübertragbarkeit und Widerspruch.
        </p>

        <p>
          Die vollständigen Informationen einschließlich
          Rechtsgrundlagen, Speicherdauern und Beschwerderechten
          werden in der final geprüften Datenschutzerklärung
          veröffentlicht.
        </p>
      </LegalSection>
    </LegalPage>
  );
}