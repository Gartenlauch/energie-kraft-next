import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/marketing/reveal";
import { stromspeicherContent, stromspeicherProducts } from "@/content/pages/stromspeicher";

function getSection(id: string) {
  return stromspeicherContent.sections.find((section) => section.id === id)!;
}

export function StorageProductsSection() {
  const section = getSection("speicherprodukte");
  return (
    <section
      id={section.id}
      aria-labelledby="speicherprodukte-heading"
      className="bg-surface-soft py-16 md:py-24"
    >
      <div className="section-shell">
        <Reveal className="max-w-4xl">
          <p className="eyebrow">{section.eyebrow}</p>
          <h2 id="speicherprodukte-heading" className="section-title mt-4">
            {section.title}
          </h2>
        </Reveal>
        <div className="mt-12 md:mt-16">
          {stromspeicherProducts.map((product, index) => (
            <article
              key={product.id}
              id={product.id}
              aria-labelledby={`${product.id}-heading`}
              className="border-border-strong grid min-w-0 gap-8 border-t py-10 first:border-t-0 first:pt-0 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-16"
            >
              <Reveal className={`min-w-0 ${index === 1 ? "lg:order-2" : ""}`}>
                <figure>
                  <Image
                    src={product.image}
                    width={product.width}
                    height={product.height}
                    alt={product.alt}
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="h-auto w-full object-contain"
                  />
                  <figcaption className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
                    Produktdarstellung von Sigenergy. Systemausstattung je nach Konfiguration.
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
                <dl className="mt-8">
                  {product.details.map((detail) => (
                    <div
                      key={detail.label}
                      className="border-border-strong grid gap-2 border-t py-4 sm:grid-cols-[7rem_1fr]"
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
                  className="text-brand-primary inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
                >
                  Produktinformationen bei Sigenergy
                  <span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>
              </Reveal>
            </article>
          ))}
        </div>
        <Reveal className="border-border-strong grid gap-6 border-t pt-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
          <p className="max-w-3xl text-lg leading-8 text-[var(--text-muted)]">{section.text[0]}</p>
          {section.cta && (
            <Link href={section.cta.href} className="button-primary justify-self-start">
              {section.cta.label}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function StorageEnergyManagementSection() {
  const section = getSection("energiemanagement");
  return (
    <section
      id={section.id}
      aria-labelledby="energiemanagement-heading"
      className="bg-surface-soft py-16 md:py-24"
    >
      <div className="section-shell grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-20">
        <Reveal>
          <p className="eyebrow">{section.eyebrow}</p>
          <h2 id="energiemanagement-heading" className="section-title mt-4">
            {section.title}
          </h2>
          {section.text.map((text) => (
            <p key={text} className="mt-6 text-[1.0625rem] leading-8 text-[var(--text-muted)]">
              {text}
            </p>
          ))}
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {section.items?.map((item) => (
              <li
                key={item}
                className="border-border-strong text-brand-dark border-t pt-4 text-sm leading-6"
              >
                {item}
              </li>
            ))}
          </ul>
          <a
            href="https://www.sigenergy.com/de/products/mysigen-app"
            target="_blank"
            rel="noreferrer"
            className="text-brand-primary mt-6 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
          >
            mySigen beim Hersteller entdecken<span className="sr-only"> (öffnet in neuem Tab)</span>
          </a>
        </Reveal>
        <Reveal>
          <figure className="mx-auto w-full max-w-[18rem]">
            <Image
              src="/images/battery-storage/products/mysigen-energy-management.webp"
              width={650}
              height={1341}
              alt="mySigen-App mit Energieflussanalyse zwischen Photovoltaik, Batterie, Netz und Verbrauchern"
              sizes="288px"
              className="h-auto w-full object-contain"
            />
            <figcaption className="mt-5 text-center text-xs leading-6 text-[var(--text-muted)]">
              Beispielansicht von Sigenergy mit illustrativen Energiedaten. Verfügbare Ansichten
              hängen von System und App-Version ab.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
