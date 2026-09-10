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
import { activeJobOpenings, sharedJobBenefits } from "@/content/jobs";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

const seo = {
  title: "Jobs & Karriere | Energie-Kraft Süd",
  description:
    "Aktuelle Jobs bei Energie-Kraft Süd in Ainring: Elektriker, Dachmontage und Ausbildung in einer regionalen Photovoltaik-Mannschaft.",
  canonicalPath: "/jobs",
};

export const metadata: Metadata = buildMetadata(seo);

export default function JobsPage() {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({ currentLabel: "Jobs", currentPath: seo.canonicalPath })}
      />
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

        <section
          className="section-space bg-brand-navy text-white"
          aria-labelledby="benefits-title"
        >
          <div className="section-shell">
            <Reveal className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
              <div>
                <p className="eyebrow eyebrow-on-dark">Was dich erwartet</p>
                <h2 id="benefits-title" className="section-title mt-4 text-white">
                  Vorteile, die im Arbeitsalltag zählen
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white lg:justify-self-end">
                Verlässliche Ausstattung, Entwicklungsmöglichkeiten und gemeinsamer Teamgeist bilden
                den Rahmen. Einzelne Leistungen richten sich nach Rolle und Vereinbarung.
              </p>
            </Reveal>
            <ul className="mt-14 grid gap-x-14 border-t border-white/30 md:grid-cols-2">
              {sharedJobBenefits.map((benefit, index) => (
                <li key={benefit} className="border-b border-white/25 py-7 md:py-9">
                  <Reveal delay={(index % 5) * 50}>
                    <div className="flex items-start gap-5">
                      <CheckIcon className="mt-1 size-5 shrink-0 text-cyan-200" />
                      <p className="max-w-lg text-base leading-8 text-white md:text-lg">
                        {benefit}
                      </p>
                    </div>
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
                <h2 id="jobs-title" className="section-title mt-4">
                  Dein Platz im Team
                </h2>
              </div>
              <p className="lead-copy lg:justify-self-end">
                Ob Elektrotechnik, Dachmontage oder Ausbildung: Hier findest du die Aufgaben,
                Anforderungen und Perspektiven der aktuell offenen Positionen.
              </p>
            </Reveal>

            <nav
              aria-label="Direkt zur offenen Stelle"
              className="border-border-strong mt-12 grid border-y md:grid-cols-3"
            >
              {activeJobOpenings.map((job, index) => (
                <a
                  key={job.id}
                  href={`#${job.id}`}
                  className="group border-border-default flex min-h-24 items-center gap-5 border-b py-6 last:border-b-0 md:border-b-0 md:pr-8"
                >
                  <span className="text-brand-primary text-xs tabular-nums">0{index + 1}</span>
                  <span className="flex-1 text-sm leading-6 font-semibold group-hover:underline">
                    {job.title}
                  </span>
                  <ArrowRightIcon className="text-brand-primary size-4 shrink-0" />
                </a>
              ))}
            </nav>
            <div>
              {activeJobOpenings.map((job, index) => (
                <article
                  key={job.id}
                  className="border-border-strong scroll-mt-28 border-b py-14 last:border-b-0 last:pb-0 md:py-24"
                  id={job.id}
                  aria-labelledby={`${job.id}-title`}
                >
                  <Reveal className="grid gap-8 lg:grid-cols-[0.28fr_1fr] lg:gap-16">
                    <aside>
                      <span
                        aria-hidden="true"
                        className="text-brand-primary/25 text-6xl font-semibold tracking-[-0.06em] md:text-8xl"
                      >
                        0{index + 1}
                      </span>
                      <dl className="border-border-default mt-6 grid grid-cols-2 gap-5 border-t pt-5 text-sm lg:grid-cols-1">
                        <div>
                          <dt className="text-xs text-[var(--text-subtle)]">Standort</dt>
                          <dd className="mt-2 font-semibold">{job.location}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-[var(--text-subtle)]">Beschäftigung</dt>
                          <dd className="mt-2 font-semibold">{job.employmentType}</dd>
                        </div>
                      </dl>
                    </aside>
                    <div className="min-w-0">
                      <h3
                        id={`${job.id}-title`}
                        className="max-w-4xl text-3xl leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl"
                      >
                        {job.title}
                      </h3>
                      <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--text-muted)] md:text-lg">
                        {job.intro}
                      </p>
                      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-2 md:gap-12">
                        <section aria-labelledby={`${job.id}-tasks`}>
                          <h4
                            id={`${job.id}-tasks`}
                            className="border-brand-primary border-t-2 pt-5 text-lg font-semibold"
                          >
                            Deine Aufgaben
                          </h4>
                          <ul className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-muted)] md:text-base">
                            {job.tasks.map((item) => (
                              <li key={item} className="flex gap-3">
                                <span aria-hidden="true" className="text-brand-primary">
                                  —
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </section>
                        <section aria-labelledby={`${job.id}-requirements`}>
                          <h4
                            id={`${job.id}-requirements`}
                            className="border-brand-primary border-t-2 pt-5 text-lg font-semibold"
                          >
                            Das bringst du mit
                          </h4>
                          <ul className="mt-5 space-y-4 text-sm leading-7 text-[var(--text-muted)] md:text-base">
                            {job.requirements.map((item) => (
                              <li key={item} className="flex gap-3">
                                <span aria-hidden="true" className="text-brand-primary">
                                  —
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </section>
                      </div>
                      <section
                        className="bg-surface-soft mt-10 p-6 md:mt-14 md:p-8"
                        aria-labelledby={`${job.id}-benefits`}
                      >
                        <h4 id={`${job.id}-benefits`} className="text-lg font-semibold">
                          Darauf kannst du dich freuen
                        </h4>
                        <ul className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-2">
                          {job.benefits.map((item) => (
                            <li key={item} className="flex gap-3 text-sm leading-7">
                              <CheckIcon className="text-brand-primary mt-1 size-4 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm leading-6 text-[var(--text-muted)]">
                          Das passt zu dir?
                          <br />
                          <span className="font-semibold text-[var(--text-primary)]">
                            Wir freuen uns auf deine Bewerbung.
                          </span>
                        </p>
                        <Link
                          href={`/bewerbung?stelle=${job.slug}`}
                          className="button-primary"
                          aria-label={`Jetzt als ${job.title} bewerben`}
                        >
                          Jetzt bewerben <ArrowRightIcon className="ml-3 size-4" />
                        </Link>
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
              <h2 className="mt-4 max-w-3xl text-3xl text-white md:text-4xl">
                Wir freuen uns auch über deine Initiativbewerbung.
              </h2>
            </div>
            <Link href="/bewerbung" className="button-light">
              Jetzt bewerben
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
