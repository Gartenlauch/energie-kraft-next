import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { FaqJsonLd } from "@/components/faq/faq-json-ld";
import { PublicFaqSection } from "@/components/faq/public-faq-section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ArtDirectedImage } from "@/components/media/art-directed-image";
import { PublicPageJsonLd } from "@/components/seo/public-page-json-ld";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import { getPublicFaqEntriesByRoute } from "@/lib/faq/public-repository";
import type { CtaContent, PublicPageContent } from "@/types/content";

interface PublicContentPageProps {
  content: PublicPageContent;
  beforeFaq?: ReactNode;
}

interface PageVisual {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  desktopWidth: number;
  desktopHeight: number;
  mobileWidth: number;
  mobileHeight: number;
  configuratorHref?: string;
}

const pageVisuals: Partial<Record<PublicPageContent["faqRouteKey"], PageVisual>> = {
  photovoltaik: {
    desktopSrc: "/images/photovoltaic/photovoltaic-feature-desktop.webp",
    mobileSrc: "/images/photovoltaic/photovoltaic-feature-mobile.webp",
    alt: "Fachgerechte Montage einer Photovoltaikanlage auf einem Hausdach",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    configuratorHref: "/konfigurator/photovoltaik",
  },
  stromspeicher: {
    desktopSrc: "/images/battery-storage/battery-storage-feature-desktop.webp",
    mobileSrc: "/images/battery-storage/battery-storage-feature-mobile.webp",
    alt: "Modern installierter Stromspeicher in einem hellen Hauswirtschaftsraum",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    configuratorHref: "/konfigurator/stromspeicher",
  },
  waermepumpen: {
    desktopSrc: "/images/heat-pump/heat-pump-feature-desktop.webp",
    mobileSrc: "/images/heat-pump/heat-pump-feature-mobile.webp",
    alt: "Dezent an einem Wohnhaus installierte Luft-Wasser-Wärmepumpe",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    configuratorHref: "/konfigurator/waermepumpe",
  },
  klimaanlagen: {
    desktopSrc: "/images/climate/climate-feature-desktop.webp",
    mobileSrc: "/images/climate/climate-feature-mobile.webp",
    alt: "Dezent integrierte Klimaanlage in einem modernen Wohnraum",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    configuratorHref: "/konfigurator/klimaanlage",
  },
  wallbox: {
    desktopSrc: "/images/wallbox/wallbox-feature-desktop.webp",
    mobileSrc: "/images/wallbox/wallbox-feature-mobile.webp",
    alt: "Elektroauto lädt an einer Wallbox neben einem Haus mit Photovoltaik",
    desktopWidth: 1600,
    desktopHeight: 1200,
    mobileWidth: 1200,
    mobileHeight: 1500,
    configuratorHref: "/konfigurator/wallbox",
  },
  kontakt: {
    desktopSrc: "/images/home-premium/consultation-reference-desktop.webp",
    mobileSrc: "/images/home-premium/consultation-reference-mobile.webp",
    alt: "Persönliche Energieberatung mit Hauseigentümern am Planungstisch",
    desktopWidth: 1600,
    desktopHeight: 1000,
    mobileWidth: 1080,
    mobileHeight: 1350,
  },
};

function CtaLink({ cta, className }: { cta: CtaContent; className: string }) {
  if (cta.href.startsWith("tel:") || cta.href.startsWith("mailto:")) {
    return (
      <a href={cta.href} className={className}>
        {cta.label}
      </a>
    );
  }

  return (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  );
}

export async function PublicContentPage({ content, beforeFaq }: PublicContentPageProps) {
  const faqs = await getPublicFaqEntriesByRoute(content.faqRouteKey);
  const breadcrumbLabel = content.hero.eyebrow ?? content.hero.title;
  const visual = pageVisuals[content.faqRouteKey];

  return (
    <>
      <PublicPageJsonLd content={content} />
      <FaqJsonLd faqs={faqs} />

      <main id="main-content">
        <Breadcrumbs currentLabel={breadcrumbLabel} />

        <section className="relative overflow-hidden bg-surface-soft">
          <Image
            src="/brand/energie-kraft/energie-kraft-supersign.svg"
            alt=""
            width={530}
            height={516}
            className="pointer-events-none absolute -top-20 -left-36 w-[30rem] opacity-[0.045]"
          />
          <div className="section-shell grid min-h-[38rem] items-center gap-10 py-14 md:py-18 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
            <div className="relative z-10">
              {content.hero.eyebrow ? <p className="eyebrow">{content.hero.eyebrow}</p> : null}
              <h1 className="mt-5 max-w-[17ch] text-[clamp(2.35rem,4.5vw,4.65rem)] leading-[1.04] tracking-[-0.045em]">
                {content.hero.title}
              </h1>
              <p className="lead-copy mt-6">{content.hero.description}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {visual?.configuratorHref ? (
                  <Link href={visual.configuratorHref} className="button-primary">
                    Projekt konfigurieren
                  </Link>
                ) : (
                  <CtaLink cta={content.hero.primaryCta} className="button-primary" />
                )}
                {visual?.configuratorHref ? (
                  <CtaLink cta={content.hero.primaryCta} className="button-secondary" />
                ) : content.hero.secondaryCta ? (
                  <CtaLink cta={content.hero.secondaryCta} className="button-secondary" />
                ) : null}
              </div>
            </div>

            {visual ? (
              <div className="media-frame relative aspect-[4/5] min-h-0 lg:aspect-[4/3]">
                <ArtDirectedImage
                  desktopSrc={visual.desktopSrc}
                  mobileSrc={visual.mobileSrc}
                  desktopWidth={visual.desktopWidth}
                  desktopHeight={visual.desktopHeight}
                  mobileWidth={visual.mobileWidth}
                  mobileHeight={visual.mobileHeight}
                  alt={visual.alt}
                  sizes="(max-width: 1023px) calc(100vw - 2rem), 52vw"
                  fetchPriority="high"
                  className="block"
                />
              </div>
            ) : null}
          </div>
        </section>

        {content.sections.map((section, index) => {
          const softSection = index % 2 === 1;

          return (
            <section
              id={section.id}
              key={`${section.title}-${index}`}
              className={`section-space ${softSection ? "bg-surface" : "bg-background"}`}
            >
              <div className="section-shell grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 xl:gap-28">
                <div>
                  {section.eyebrow ? <p className="eyebrow">{section.eyebrow}</p> : null}
                  <h2 className="section-title mt-4">{section.title}</h2>
                  {section.cta ? (
                    <Link href={section.cta.href} className="button-secondary mt-8 hidden lg:inline-flex">
                      {section.cta.label}
                    </Link>
                  ) : null}
                </div>

                <div>
                  <div className="prose-copy max-w-3xl">
                    {section.text.map((paragraph, paragraphIndex) => (
                      <p key={`${section.id ?? section.title}-paragraph-${paragraphIndex}`}>
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.items && section.items.length > 0 ? (
                    <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={`${section.id ?? section.title}-item-${itemIndex}`}
                          className="flex items-start gap-3 border-b border-border-default/80 pb-4 text-sm leading-6 text-brand-dark"
                        >
                          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-brand-primary">
                            <CheckIcon className="size-3.5" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.links && section.links.length > 0 ? (
                    <div className="mt-9 grid gap-4 sm:grid-cols-2">
                      {section.links.map((link, linkIndex) => {
                        const className =
                          "group premium-card flex min-h-48 flex-col p-6 transition hover:-translate-y-0.5 hover:border-brand-accent/60";
                        const linkContent = (
                          <>
                            {link.eyebrow ? <span className="eyebrow">{link.eyebrow}</span> : null}
                            <span className="mt-3 block text-lg font-semibold text-brand-navy">
                              {link.label}
                            </span>
                            {link.description ? (
                              <span className="mt-2 block text-sm leading-6 text-[var(--text-muted)]">
                                {link.description}
                              </span>
                            ) : null}
                            <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-brand-primary">
                              Öffnen
                              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </>
                        );

                        if (link.external) {
                          return (
                            <a
                              key={`${section.id ?? section.title}-link-${linkIndex}`}
                              href={link.href}
                              target="_blank"
                              rel="noreferrer"
                              className={className}
                            >
                              {linkContent}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={`${section.id ?? section.title}-link-${linkIndex}`}
                            href={link.href}
                            className={className}
                          >
                            {linkContent}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}

                  {section.cta ? (
                    <Link href={section.cta.href} className="button-secondary mt-8 lg:hidden">
                      {section.cta.label}
                    </Link>
                  ) : null}
                </div>
              </div>
            </section>
          );
        })}

        {beforeFaq}
        <PublicFaqSection faqs={faqs} />

        <section className="bg-brand-primary py-14 text-white md:py-18">
          <div className="section-shell flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-cyan-100 uppercase">
                Persönliche Beratung
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl text-white md:text-4xl">
                Ihr Projekt verdient eine Lösung, die wirklich passt.
              </h2>
            </div>
            <Link href="/kontakt" className="button-light shrink-0">
              Beratung anfragen
              <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
