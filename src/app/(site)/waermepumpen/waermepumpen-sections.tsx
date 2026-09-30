import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/marketing/reveal";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import {
  waermepumpenContent,
  waermepumpenProducts,
  waermepumpenProductNotes,
  waermepumpenSystemNote,
} from "@/content/pages/waermepumpen";

function getSection(id: string) {
  return waermepumpenContent.sections.find((section) => section.id === id)!;
}

export function HeatPumpProductsSection() {
  const section = getSection("bosch-waermepumpen");
  return (
    <section
      id={section.id}
      aria-labelledby="bosch-waermepumpen-heading"
      className="bg-background py-16 md:py-24"
    >
      <div className="section-shell">
        <Reveal className="max-w-4xl">
          <p className="eyebrow">{section.eyebrow}</p>
          <h2
            id="bosch-waermepumpen-heading"
            style={{ fontSize: "clamp(1.625rem, 3.5vw, 3.65rem)" }}
            className="section-title mt-4 [overflow-wrap:anywhere] hyphens-auto"
          >
            {section.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--text-muted)]">
            {section.text[0]}
          </p>
        </Reveal>
        <div className="mt-12 md:mt-16">
          {waermepumpenProducts.map((product, index) => (
            <article
              key={product.id}
              id={product.id}
              aria-labelledby={`${product.id}-heading`}
              className="border-border-strong grid min-w-0 gap-8 border-t py-10 first:border-t-0 first:pt-0 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16"
            >
              <Reveal className={`min-w-0 ${index === 1 ? "lg:order-2" : ""}`}>
                <figure>
                  <div className="bg-surface-soft rounded-2xl p-5 sm:p-8">
                    <Image
                      src={product.image}
                      width={product.width}
                      height={product.height}
                      alt={product.alt}
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                  <figcaption className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
                    {waermepumpenProductNotes.caption}
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal className="min-w-0">
                <p className="eyebrow">{product.eyebrow}</p>
                <h3 id={`${product.id}-heading`} className="mt-4 text-3xl md:text-4xl">
                  {product.name}
                </h3>
                <p className="mt-6 text-base leading-8 text-[var(--text-muted)]">
                  {product.description}
                </p>
                <ul className="mt-6">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="border-border-default flex items-start gap-3 border-t py-3 text-sm leading-6"
                    >
                      <CheckIcon className="text-brand-primary mt-1 size-4 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={product.source}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-primary mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4"
                >
                  {waermepumpenProductNotes.sourceLabel}
                  <ArrowRightIcon className="size-4" />
                </a>
              </Reveal>
            </article>
          ))}
        </div>
        <Reveal className="border-border-strong border-t pt-8">
          <p className="max-w-3xl text-sm leading-7 text-[var(--text-muted)]">
            {waermepumpenProductNotes.selection}
          </p>
          <Link href={section.cta!.href} className="button-secondary mt-6">
            {section.cta!.label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function HeatPumpPhotovoltaicSection() {
  const section = getSection("photovoltaik-kombination");
  const note = waermepumpenSystemNote;
  return (
    <section
      id={section.id}
      aria-labelledby="photovoltaik-kombination-heading"
      className="bg-surface-soft py-16 md:py-24"
    >
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow">{section.eyebrow}</p>
            <h2 id="photovoltaik-kombination-heading" className="section-title mt-4">
              {section.title}
            </h2>
          </Reveal>
          <Reveal>
            {section.text.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`text-base leading-8 text-[var(--text-muted)] ${index > 0 ? "mt-5" : ""}`}
              >
                {paragraph}
              </p>
            ))}
            <Link
              href={section.cta!.href}
              className="text-brand-primary mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4"
            >
              {section.cta!.label}
              <ArrowRightIcon className="size-4" />
            </Link>
          </Reveal>
        </div>
        <Reveal className="mt-10 md:mt-12">
          <aside
            aria-labelledby="waermepumpen-system-note-heading"
            className="bg-brand-primary rounded-2xl p-6 text-white sm:p-8 lg:p-10"
          >
            <p className="text-xl font-semibold text-white">{note.label}</p>
            <h3
              id="waermepumpen-system-note-heading"
              className="mt-3 max-w-4xl text-2xl leading-snug text-white md:text-3xl"
            >
              {note.title}
            </h3>
            <p className="mt-5 max-w-4xl text-base leading-8 text-white">{note.text}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={note.primaryCta.href} className="button-light">
                {note.primaryCta.label}
              </Link>
              <Link href={note.secondaryCta.href} className="button-outline-light">
                {note.secondaryCta.label}
              </Link>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
