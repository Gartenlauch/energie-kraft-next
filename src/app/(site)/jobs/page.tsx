import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  EditorialFeatureSection,
  PremiumHeroSection,
} from "@/components/marketing/marketing-sections";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { activeJobOpenings } from "@/content/jobs";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

const seo = {
  title: "Jobs & Karriere | Energie-Kraft Süd",
  description:
    "Aktuelle Jobs bei Energie-Kraft Süd in Ainring: Elektriker, Dachmontage und Ausbildung in einer regionalen Photovoltaik-Mannschaft.",
  canonicalPath: "/jobs",
};

export const metadata: Metadata = buildMetadata(seo);

const sharedBenefits = [
  "Attraktives Gehalt und langfristige Perspektive",
  "Jobrad für Mitarbeitende; Firmenfahrzeug je nach leitender oder vertrieblicher Rolle",
  "Hochwertige Arbeitskleidung, Arbeitsgeräte und Getränke",
  "Arbeitgeberzuschüsse und vermögenswirksame Leistungen",
  "Zwei gemeinsame Firmenfeiern im Jahr",
] as const;

export default function JobsPage() {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
      <JsonLdScript data={buildBreadcrumbJsonLd({ currentLabel: "Jobs", currentPath: seo.canonicalPath })} />
      <main id="main-content">
        <Breadcrumbs currentLabel="Jobs" />
        <PremiumHeroSection
          eyebrow="Arbeiten bei Energie-Kraft Süd"
          title="Dein neuer Job wartet nicht auf der Straße, sondern auf dem Dach."
          description="Werde Teil eines regionalen Teams, das Photovoltaik, Stromspeicher und vernetzte Energietechnik mit Erfahrung und persönlicher Verantwortung umsetzt."
          image={{
            desktopSrc: "/images/team/company-service-hero-desktop.webp",
            mobileSrc: "/images/team/company-service-hero-mobile.webp",
            desktopWidth: 1800,
            desktopHeight: 1039,
            mobileWidth: 1080,
            mobileHeight: 1350,
            alt: "Mitarbeiter von Energie-Kraft Süd bei der Arbeit auf einem Dach",
          }}
          primaryCta={{ label: "Aktuelle Stellen", href: "#stellen" }}
          secondaryCta={{ label: "Direkt bewerben", href: "/bewerbung" }}
        />

        <EditorialFeatureSection
          eyebrow="Arbeitgeber Energie-Kraft"
          title="Technik, Teamgeist und Verantwortung für die Energiewende"
          paragraphs={[
            "Energie-Kraft Süd gehört zu den etablierten Photovoltaikanbietern in der oberbayerischen Region rund um Berchtesgaden und Traunstein. Außen- und Innendienst arbeiten auf kurzen Wegen zusammen – von der Elektroinstallation und PV-Montage bis zur Kundenbetreuung.",
            "Die Arbeit verbindet einen hohen Qualitätsanspruch mit einer persönlichen Atmosphäre, eigenverantwortlichem Handeln und dem gemeinsamen Ziel, erneuerbare Energie im Alltag voranzubringen. Wochenendarbeit ist für die veröffentlichten Stellen nicht vorgesehen.",
          ]}
          surface="soft"
          layout="image-right"
          image={{
            desktopSrc: "/images/team/company-service-hero-desktop.webp",
            mobileSrc: "/images/team/company-service-hero-mobile.webp",
            desktopWidth: 1800,
            desktopHeight: 1039,
            mobileWidth: 1080,
            mobileHeight: 1350,
            alt: "Arbeit auf einem Photovoltaikdach in der Region",
          }}
        />

        <section className="section-space bg-brand-navy text-white" aria-labelledby="benefits-title">
          <div className="section-shell">
            <Reveal className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="eyebrow eyebrow-on-dark">Was dich erwartet</p>
                <h2 id="benefits-title" className="section-title mt-4 text-white">Vorteile, die im Arbeitsalltag zählen</h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white lg:justify-self-end">
                Verlässliche Ausstattung, Entwicklungsmöglichkeiten und gemeinsamer Teamgeist bilden den Rahmen. Einzelne Leistungen richten sich nach Rolle und Vereinbarung.
              </p>
            </Reveal>
            <ul className="mt-14 grid border-y border-white/30 md:grid-cols-2 xl:grid-cols-5">
              {sharedBenefits.map((benefit, index) => (
                <li key={benefit} className="border-white/25 py-7 md:border-l md:px-6 md:[&:nth-child(odd)]:border-l-0 xl:[&:nth-child(odd)]:border-l xl:first:border-l-0">
                  <Reveal delay={(index % 5) * 50}>
                    <CheckIcon className="size-5 text-cyan-200" />
                    <p className="mt-4 text-sm leading-7 text-white">{benefit}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="stellen" className="section-space bg-background" aria-labelledby="jobs-title">
          <div className="section-shell">
            <Reveal className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="eyebrow">Aktuelle Jobangebote</p>
                <h2 id="jobs-title" className="section-title mt-4">Dein Platz im Team</h2>
              </div>
              <p className="lead-copy lg:justify-self-end">
                Ob Elektrotechnik, Dachmontage oder Ausbildung: Hier findest du die Aufgaben, Anforderungen und Perspektiven der aktuell offenen Positionen.
              </p>
            </Reveal>

            <div className="border-border-strong mt-14 border-y">
              {activeJobOpenings.map((job, index) => (
                <article key={job.id} className="border-border-default border-b py-9 last:border-b-0" id={job.id}>
                  <Reveal delay={(index % 3) * 50} className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr]">
                    <div>
                      <p className="text-brand-primary text-xs font-bold tracking-[0.14em] uppercase">
                        {job.employmentType} · {job.location}
                      </p>
                      <h3 className="mt-3 text-3xl">{job.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{job.intro}</p>
                      <Link href={`/bewerbung?stelle=${job.slug}`} className="button-primary mt-6">
                        Auf diese Stelle bewerben <ArrowRightIcon className="ml-2 size-4" />
                      </Link>
                    </div>
                    <div className="grid gap-8 md:grid-cols-3">
                      <div>
                        <h4 className="text-sm font-bold tracking-[0.1em] uppercase">Aufgaben</h4>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--text-muted)]">
                          {job.tasks.map((item) => <li key={item}>— {item}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold tracking-[0.1em] uppercase">Das bringst du mit</h4>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--text-muted)]">
                          {job.requirements.map((item) => <li key={item}>— {item}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold tracking-[0.1em] uppercase">Das bieten wir</h4>
                        <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--text-muted)]">
                          {job.benefits.map((item) => <li key={item}>— {item}</li>)}
                        </ul>
                      </div>
                    </div>
                  </Reveal>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-gradient py-16 text-white md:py-20">
          <div className="section-shell grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow eyebrow-on-dark">Kein passender Job dabei?</p>
              <h2 className="mt-4 max-w-3xl text-3xl text-white md:text-4xl">Wir freuen uns auch über deine Initiativbewerbung.</h2>
            </div>
            <Link href="/bewerbung" className="button-light">Jetzt bewerben</Link>
          </div>
        </section>
      </main>
    </>
  );
}
