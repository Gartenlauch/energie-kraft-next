import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ArtDirectedImage } from "@/components/media/art-directed-image";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { CheckIcon } from "@/components/ui/icons";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";
import type { SeoContent } from "@/types/content";

export interface MarketingFeatureSection {
  id?: string;
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  items?: readonly string[];
}

interface MarketingFeaturePageProps {
  seo: SeoContent;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  desktopSrc: string;
  mobileSrc: string;
  imageAlt: string;
  sections: readonly MarketingFeatureSection[];
  ctaTitle: string;
  ctaLabel: string;
  ctaHref: string;
}

export function MarketingFeaturePage({
  seo,
  breadcrumbLabel,
  eyebrow,
  title,
  description,
  desktopSrc,
  mobileSrc,
  imageAlt,
  sections,
  ctaTitle,
  ctaLabel,
  ctaHref,
}: MarketingFeaturePageProps) {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: breadcrumbLabel,
          currentPath: seo.canonicalPath,
        })}
      />
      <main id="main-content">
      <Breadcrumbs currentLabel={breadcrumbLabel} />
      <section className="bg-surface-soft">
        <div className="section-shell grid min-h-[38rem] items-center gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-5 max-w-[17ch] text-[clamp(2.35rem,4.5vw,4.65rem)] leading-[1.04] tracking-[-0.045em]">
              {title}
            </h1>
            <p className="lead-copy mt-6">{description}</p>
            <Link href={ctaHref} className="button-primary mt-8">
              {ctaLabel}
            </Link>
          </div>
          <div className="media-frame aspect-[4/5] lg:aspect-[8/5]">
            <ArtDirectedImage
              desktopSrc={desktopSrc}
              mobileSrc={mobileSrc}
              desktopWidth={1600}
              desktopHeight={1000}
              mobileWidth={1080}
              mobileHeight={1350}
              alt={imageAlt}
              sizes="(max-width: 1023px) calc(100vw - 2rem), 52vw"
              fetchPriority="high"
              className="block"
            />
          </div>
        </div>
      </section>

      {sections.map((section, index) => (
        <section
          id={section.id}
          key={section.title}
          className={`section-space ${index % 2 === 1 ? "bg-surface" : "bg-background"}`}
        >
          <div className="section-shell grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 xl:gap-28">
            <div>
              <p className="eyebrow">{section.eyebrow}</p>
              <h2 className="section-title mt-4">{section.title}</h2>
            </div>
            <div>
              <div className="prose-copy max-w-3xl">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.items ? (
                <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-b border-border-default pb-4 text-sm leading-6 text-brand-dark"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-brand-primary">
                        <CheckIcon className="size-3.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
      ))}

      <section className="bg-brand-primary py-14 text-white md:py-18">
        <div className="section-shell flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-3xl text-3xl text-white md:text-4xl">{ctaTitle}</h2>
          <Link href={ctaHref} className="button-light shrink-0">
            {ctaLabel}
          </Link>
        </div>
      </section>
      </main>
    </>
  );
}
