import Image from "next/image";

import { Reveal } from "@/components/marketing/reveal";
import {
  commercialStorageApplications,
  commercialStorageContent,
  commercialStorageProducts,
} from "@/content/pages/gewerbespeicher";

function getSection(id: string) {
  return commercialStorageContent.sections.find((section) => section.id === id)!;
}

export function CommercialStorageApplicationsSection() {
  const section = getSection("anwendungen");
  return (
    <section
      id={section.id}
      aria-labelledby="anwendungen-heading"
      className="bg-brand-navy py-16 text-white md:py-24"
    >
      <div className="section-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <p className="eyebrow eyebrow-on-dark">{section.eyebrow}</p>
          <h2 id="anwendungen-heading" className="section-title mt-4 text-white">
            {section.title}
          </h2>
        </Reveal>
        <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {commercialStorageApplications.map((application, index) => (
            <li key={application.title} className="border-t border-white/30 pt-6">
              <Reveal delay={index * 60}>
                <span className="text-sm font-semibold text-white/75" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3 className="mt-4 text-xl leading-snug text-white">{application.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/90">{application.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CommercialStorageProductsSection() {
  const section = getSection("produkte");
  return (
    <section
      id={section.id}
      aria-labelledby="produkte-heading"
      className="bg-background py-16 md:py-24"
    >
      <div className="section-shell">
        <Reveal className="max-w-4xl">
          <p className="eyebrow">{section.eyebrow}</p>
          <h2 id="produkte-heading" className="section-title mt-4">
            {section.title}
          </h2>
          <p className="lead-copy mt-6">{section.paragraphs[0]}</p>
        </Reveal>
        <div className="mt-12 md:mt-16">
          {commercialStorageProducts.map((product, index) => (
            <article
              key={product.id}
              id={product.id}
              aria-labelledby={`${product.id}-heading`}
              className="border-border-strong grid min-w-0 gap-8 border-t py-12 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16"
            >
              <Reveal className={`min-w-0 ${index === 1 ? "lg:order-2" : ""}`}>
                <figure>
                  <div className="bg-surface-soft flex aspect-video items-center overflow-hidden">
                    <Image
                      src={product.image}
                      width={product.width}
                      height={product.height}
                      alt={product.alt}
                      sizes="(max-width: 1023px) calc(100vw - 32px), 608px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                  <figcaption className="mt-4 text-xs leading-6 text-[var(--text-muted)]">
                    Produktdarstellung von {product.manufacturer}. Systemausstattung je nach
                    Konfiguration.
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal className="min-w-0">
                <p className="eyebrow">{product.manufacturer}</p>
                <h3
                  id={`${product.id}-heading`}
                  className="mt-4 text-3xl leading-tight md:text-4xl"
                >
                  {product.name}
                </h3>
                <p className="mt-6 text-base leading-8 text-[var(--text-muted)]">
                  {product.description}
                </p>
                <dl className="mt-8">
                  {product.details.map((detail) => (
                    <div
                      key={detail.label}
                      className="border-border-strong grid gap-2 border-t py-4 sm:grid-cols-[8rem_1fr]"
                    >
                      <dt className="text-brand-primary text-sm font-semibold">{detail.label}</dt>
                      <dd className="text-sm leading-6 text-[var(--text-muted)]">{detail.text}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href={product.source}
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-primary mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
                >
                  {product.sourceLabel}
                  <span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CommercialStorageEnergyManagementSection() {
  const section = getSection("energiemanagement");
  return (
    <section
      id={section.id}
      aria-labelledby="energiemanagement-heading"
      className="bg-background py-16 md:py-24"
    >
      <div className="section-shell grid gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="eyebrow">{section.eyebrow}</p>
          <h2 id="energiemanagement-heading" className="section-title mt-4">
            {section.title}
          </h2>
          {section.paragraphs.map((text) => (
            <p key={text} className="mt-6 text-base leading-8 text-[var(--text-muted)]">
              {text}
            </p>
          ))}
        </Reveal>
        <Reveal className="min-w-0 lg:pt-8">
          <figure
            aria-labelledby="energiefluss-caption"
            className="bg-surface-soft px-6 py-8 md:px-10"
          >
            <div className="text-brand-dark text-center text-sm font-semibold" aria-hidden="true">
              <p className="border-border-strong border-b pb-5">Photovoltaik · Speicher · Netz</p>
              <p className="text-brand-primary py-3 text-2xl">↕</p>
              <p className="text-brand-primary text-lg">Energiemanagement</p>
              <p className="text-brand-primary py-3 text-2xl">↕</p>
              <p className="border-border-strong border-t pt-5">
                Betrieb · Produktion · Ladeinfrastruktur
              </p>
            </div>
            <figcaption
              id="energiefluss-caption"
              className="mt-6 text-xs leading-6 text-[var(--text-muted)]"
            >
              Schematisches Steuerungsprinzip: Energiemanagement stimmt PV, Speicher, Netzbezug und
              betriebliche Verbraucher aufeinander ab. Verfügbare Funktionen sind system- und
              projektabhängig.
            </figcaption>
          </figure>
          <dl className="mt-8">
            <div className="border-border-strong border-t py-5">
              <dt className="text-brand-primary font-semibold">SigenStack · Sigen Cloud</dt>
              <dd className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                Sigenergy beschreibt eine Echtzeit-Systemüberwachung über Sigen Cloud. Die für den
                Betrieb benötigten Steuerungsfunktionen und Schnittstellen werden im Projekt
                geprüft.
              </dd>
            </div>
            <div className="border-border-strong border-t py-5">
              <dt className="text-brand-primary font-semibold">FlexStack · sonnenPro EMS</dt>
              <dd className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                Laut sonnen unterstützt sonnenPro EMS die Nutzung von PV-Strom, die Reduktion von
                Lastspitzen und die Steuerung von Verbrauchern. Die konkrete Betriebsstrategie wird
                an den Betrieb angepasst.
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
