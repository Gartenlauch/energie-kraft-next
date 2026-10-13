import { SecondaryPageHeading } from "@/components/marketing/secondary-page-heading";
import type { Metadata } from "next";

import { ApplicationForm } from "@/components/forms/application-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { EditorialFeatureSection } from "@/components/marketing/marketing-sections";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { getActiveJobOpening, jobOpenings } from "@/content/jobs";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

const seo = {
  title: "Bewerbung bei Energie-Kraft Süd",
  description:
    "Bewirb dich bei Energie-Kraft Süd in Ainring: Stelle auswählen und persönliche Qualifikation sicher übermitteln.",
  canonicalPath: "/bewerbung",
};

export const metadata: Metadata = buildMetadata(seo);

interface ApplicationPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ApplicationPage({ searchParams }: ApplicationPageProps) {
  const parameters = await searchParams;
  const requestedJob = Array.isArray(parameters.stelle) ? parameters.stelle[0] : parameters.stelle;
  const initialJobId = requestedJob ? getActiveJobOpening(requestedJob)?.id : undefined;
  const closedJob = jobOpenings.find((job) => job.slug === requestedJob && !job.active);

  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: "Bewerbung",
          currentPath: seo.canonicalPath,
          items: [{ label: "Jobs", path: "/jobs" }],
        })}
      />
      <main id="main-content">
        <Breadcrumbs currentLabel="Bewerbung" items={[{ label: "Jobs", href: "/jobs" }]} />
        <SecondaryPageHeading
          eyebrow="Deine Bewerbung"
          title="Bring deine Erfahrung in die Energiewende ein."
          description="Bewirb dich auf eine aktuelle Stelle. Deinen Lebenslauf und weitere Unterlagen kannst du direkt und privat mitsenden."
          primaryCta={{ label: "Bewerbung ausfüllen", href: "#bewerbungsformular" }}
          secondaryCta={{ label: "Stellen ansehen", href: "/jobs#stellen" }}
        />

        <section
          id="bewerbungsformular"
          className="section-space bg-background"
          aria-labelledby="application-form-title"
        >
          <div className="section-shell grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-18">
            <div>
              <p className="eyebrow">Jetzt bewerben</p>
              <h2 id="application-form-title" className="section-title mt-4">
                Erzähl uns, was du mitbringst.
              </h2>
              <p className="lead-copy mt-5">
                Alle mit * gekennzeichneten Felder sind erforderlich. Deine Angaben werden
                serverseitig geprüft und sicher gespeichert.
              </p>
            </div>
            <div>
              {closedJob && (
                <p role="status" className="mb-6 border-l-2 border-brand-primary pl-4 text-sm leading-7">
                  Die Stelle „{closedJob.title}“ ist derzeit nicht ausgeschrieben. Wähle bitte eine
                  aktuell offene Stelle aus.
                </p>
              )}
              <ApplicationForm initialJobId={initialJobId} />
            </div>
          </div>
        </section>
        <EditorialFeatureSection
          eyebrow="Sonnige Aussichten"
          title="Persönlich zusammenarbeiten und gemeinsam etwas voranbringen"
          paragraphs={[
            "Gemeinsame Pausen, Gespräche mit Kolleg:innen und eine persönliche Arbeitsatmosphäre gehören für Energie-Kraft Süd genauso dazu wie technische Sorgfalt und Verantwortung.",
            "Für deine Bewerbung benötigen wir die Angaben im Formular. Wenn du möchtest, ergänze deinen Lebenslauf, dein Anschreiben oder relevante Zeugnisse direkt bei der Bewerbung.",
          ]}
          surface="soft"
          layout="statement"
        />
      </main>
    </>
  );
}
