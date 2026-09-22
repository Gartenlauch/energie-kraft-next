import Link from "next/link";

import { ArtDirectedImage } from "@/components/media/art-directed-image";
import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { Reveal } from "@/components/marketing/reveal";
import { ArrowRightIcon, BriefcaseIcon, CheckIcon, MapPinIcon } from "@/components/ui/icons";
import type { JobOpening } from "@/content/jobs";

const jobVisuals: Record<string, { desktopSrc: string; mobileSrc: string; alt: string }> = {
  elektriker: {
    desktopSrc: "/images/jobs/job-electrician-desktop.webp",
    mobileSrc: "/images/jobs/job-electrician-mobile.webp",
    alt: "Symbolbild: Elektrofachkraft bei der Arbeit an einer technischen Installation",
  },
  dachmonteur: {
    desktopSrc: "/images/jobs/job-rooftop-installer-desktop.webp",
    mobileSrc: "/images/jobs/job-rooftop-installer-mobile.webp",
    alt: "Symbolbild: Fachkraft montiert Photovoltaikmodule auf einem Dach",
  },
  "ausbildung-elektroniker-gebaeudetechnik": {
    desktopSrc: "/images/jobs/job-trainee-desktop.webp",
    mobileSrc: "/images/jobs/job-trainee-mobile.webp",
    alt: "Symbolbild: Auszubildende arbeitet mit einem erfahrenen Kollegen an einer Elektroinstallation",
  },
};

function JobList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--text-muted)] md:text-base">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <CheckIcon className="text-brand-primary mt-1.5 size-4 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function JobEditorialArticle({ job, index }: { job: JobOpening; index: number }) {
  const image = jobVisuals[job.slug];
  const imageOnRight = index % 2 === 1;

  return (
    <article
      id={job.id}
      aria-labelledby={`${job.id}-title`}
      className="border-border-strong scroll-mt-28 border-t py-16 md:py-24"
    >
      <Reveal className="grid min-w-0 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16 xl:gap-24">
        <figure className={`min-w-0 ${imageOnRight ? "lg:order-2" : ""}`}>
          <div className="bg-surface-soft aspect-[4/5] overflow-hidden md:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/4]">
            {image ? (
              <ArtDirectedImage
                {...image}
                desktopWidth={1440}
                desktopHeight={900}
                mobileWidth={768}
                mobileHeight={960}
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 90vw, 45vw"
              />
            ) : (
              <MediaPlaceholder
                motif={`Bildmotiv für die Stelle ${job.title}`}
                width={1440}
                height={900}
                className="h-full min-h-0"
              />
            )}
          </div>
          {image ? (
            <figcaption className="mt-3 text-xs text-[var(--text-subtle)]">
              Symbolbild zum Aufgabenfeld
            </figcaption>
          ) : null}
        </figure>

        <div className={`min-w-0 ${imageOnRight ? "lg:order-1" : ""}`}>
          <p className="eyebrow">Stelle 0{index + 1}</p>
          <h3
            id={`${job.id}-title`}
            className="mt-4 max-w-3xl text-3xl leading-tight tracking-[-0.035em] sm:text-4xl xl:text-5xl"
          >
            {job.title}
          </h3>
          <p className="mt-6 text-base leading-8 text-[var(--text-muted)] md:text-lg">
            {job.intro}
          </p>

          <dl className="border-border-default mt-8 flex flex-wrap gap-x-8 gap-y-4 border-y py-5 text-sm">
            <div className="flex items-center gap-2">
              <MapPinIcon className="text-brand-primary size-5 shrink-0" />
              <dt className="sr-only">Standort</dt>
              <dd className="font-semibold">{job.location}</dd>
            </div>
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="text-brand-primary size-5 shrink-0" />
              <dt className="sr-only">Beschäftigung</dt>
              <dd className="font-semibold">{job.employmentType}</dd>
            </div>
          </dl>

          <div className="mt-9 space-y-9">
            <section aria-labelledby={`${job.id}-tasks`}>
              <h4 id={`${job.id}-tasks`} className="text-lg font-semibold">
                Deine Aufgaben
              </h4>
              <JobList items={job.tasks} />
            </section>
            <section aria-labelledby={`${job.id}-requirements`}>
              <h4 id={`${job.id}-requirements`} className="text-lg font-semibold">
                Das bringst du mit
              </h4>
              <JobList items={job.requirements} />
            </section>
            <section
              className="border-border-default border-t pt-7"
              aria-labelledby={`${job.id}-benefits`}
            >
              <h4 id={`${job.id}-benefits`} className="text-lg font-semibold">
                Darauf kannst du dich freuen
              </h4>
              <JobList items={job.benefits} />
            </section>
          </div>

          <div className="border-border-strong mt-10 flex flex-col gap-5 border-t pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-[var(--text-muted)]">
              Das passt zu dir?
              <br />
              <span className="font-semibold text-[var(--text-primary)]">
                Wir freuen uns auf deine Bewerbung.
              </span>
            </p>
            <Link
              href={`/bewerbung?stelle=${job.slug}`}
              className="button-primary shrink-0"
              aria-label={`Jetzt als ${job.title} bewerben`}
            >
              Jetzt bewerben <ArrowRightIcon className="ml-3 size-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </article>
  );
}
