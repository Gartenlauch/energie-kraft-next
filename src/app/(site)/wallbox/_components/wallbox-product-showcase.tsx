import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/marketing/reveal";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { wallboxProducts } from "@/content/wallbox-products";
import type { ContentSection } from "@/types/content";

export function WallboxProductShowcase({ section }: { section: ContentSection }) {
  return (
    <section id={section.id} aria-labelledby="wallbox-products-heading" className="bg-background">
      <div className="section-shell pt-14 pb-8 md:pt-20 md:pb-10">
        <Reveal className="max-w-4xl">
          <p className="eyebrow">{section.eyebrow}</p>
          <h2 id="wallbox-products-heading" className="section-title mt-4">
            {section.title}
          </h2>
          {section.text.map((text) => (
            <p key={text} className="lead-copy mt-5">
              {text}
            </p>
          ))}
        </Reveal>
        <nav
          aria-label="Wallbox-Systeme im Überblick"
          className="border-border-default mt-8 grid grid-cols-2 border-y lg:grid-cols-4"
        >
          {wallboxProducts.map((product, index) => (
            <a
              key={product.id}
              href={`#${product.id}`}
              className="group text-brand-primary hover:bg-surface-soft focus-visible:bg-surface-soft flex min-h-16 items-center justify-between gap-3 px-3 py-4 transition-colors md:px-5"
            >
              <span className="text-sm font-semibold">
                <span className="mr-2 text-[var(--text-subtle)]">0{index + 1}</span>
                {product.brand}
              </span>
              <ArrowRightIcon className="size-4 shrink-0" />
            </a>
          ))}
        </nav>
      </div>
      {wallboxProducts.map((product, index) => (
        <article
          key={product.id}
          id={product.id}
          aria-labelledby={`${product.id}-heading`}
          className={`py-10 md:py-14 lg:py-16 ${index % 2 === 1 ? "bg-surface-soft/60" : "bg-background"}`}
        >
          <div className="section-shell">
            <div className="grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-14">
              <Reveal className={`min-w-0 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="border-brand-primary/10 from-surface-soft to-background flex aspect-[4/3] items-center overflow-hidden rounded-[var(--radius-lg)] border bg-gradient-to-br">
                  <Image
                    {...product.image}
                    alt={product.image.alt}
                    sizes="(max-width: 1023px) calc(100vw - 32px), (max-width: 1328px) 46vw, 612px"
                    quality={84}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>
              </Reveal>
              <Reveal className="min-w-0" delay={80}>
                <p className="eyebrow">
                    0{index + 1} · {product.brand}
                </p>
                <h3
                  id={`${product.id}-heading`}
                  className="text-brand-navy mt-4 text-3xl leading-tight md:text-4xl"
                >
                  {product.name}
                </h3>
                <p className="text-brand-primary mt-4 text-lg leading-relaxed font-semibold md:text-xl">
                  {product.positioning}
                </p>
                <p className="mt-5 text-base leading-7 text-[var(--text-muted)]">
                  {product.description}
                </p>
                <ul className="mt-6">
                  {product.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="border-brand-primary/15 text-brand-dark flex gap-3 border-b py-4 text-base leading-6"
                    >
                      <CheckIcon className="text-brand-primary mt-1 size-4 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                {product.detail && (
                  <p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">
                    {product.detail}
                  </p>
                )}
                {product.availabilityNote && (
                  <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                    {product.availabilityNote}
                  </p>
                )}
              </Reveal>
            </div>
            {product.note && (
              <aside
                className="border-brand-primary/15 mt-8 grid gap-3 rounded-[var(--radius-lg)] border bg-white/60 p-5 md:mt-10 md:p-7 lg:grid-cols-[1fr_2fr] lg:gap-10"
                aria-labelledby={`${product.id}-note`}
              >
                <h4
                  id={`${product.id}-note`}
                  className="text-brand-navy text-base leading-7 font-semibold"
                >
                  {product.note.title}
                </h4>
                <p className="text-brand-dark text-sm leading-7">{product.note.text}</p>
              </aside>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}

export function WallboxBusinessSection({ section }: { section: ContentSection }) {
  return (
    <section
      id={section.id}
      aria-labelledby="wallbox-business-heading"
      className="section-space bg-surface-soft overflow-x-clip"
    >
      <div className="section-shell grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <p className="eyebrow">{section.eyebrow}</p>
          <h2 id="wallbox-business-heading" className="section-title mt-4">
            {section.title}
          </h2>
          {section.text.map((text) => (
            <p key={text} className="mt-5 text-base leading-8 text-[var(--text-muted)]">
              {text}
            </p>
          ))}
          {section.cta && (
            <Link href={section.cta.href} className="button-primary mt-8">
              {section.cta.label}
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          )}
        </Reveal>
        <Reveal variant="right">
          <Image
            src="/images/wallbox/products/abl-em4.webp"
            alt="ABL eM4 Twin Ladestation"
            width={1200}
            height={800}
            sizes="(max-width: 1023px) calc(100vw - 32px), (max-width: 1280px) 46vw, 600px"
            quality={84}
            loading="lazy"
            className="aspect-[3/2] h-auto w-full rounded-[var(--radius-lg)] object-contain"
          />
        </Reveal>
      </div>
    </section>
  );
}
