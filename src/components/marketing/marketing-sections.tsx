import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";

import { ArtDirectedImage } from "@/components/media/art-directed-image";
import { Reveal, type RevealVariant } from "@/components/marketing/reveal";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";
import type { ReferenceProject } from "@/content/reference-projects";

interface MarketingImage {
  desktopSrc: string;
  mobileSrc: string;
  desktopWidth: number;
  desktopHeight: number;
  mobileWidth: number;
  mobileHeight: number;
  alt: string;
}

interface MarketingCta {
  label: string;
  href: string;
}

interface EditorialLink {
  eyebrow?: string;
  label: string;
  description?: string;
  href: string;
  external?: boolean;
}

interface PremiumHeroSectionProps {
  eyebrow?: string;
  title: string;
  description: string;
  image: MarketingImage;
  primaryCta: MarketingCta;
  secondaryCta?: MarketingCta;
}

export function PremiumHeroSection({
  eyebrow,
  title,
  description,
  image,
  primaryCta,
  secondaryCta,
}: PremiumHeroSectionProps) {
  return (
    <section className="premium-hero bg-brand-navy relative isolate min-h-[43rem] overflow-hidden text-white lg:min-h-[calc(100svh-7rem)]">
      <div className="absolute inset-0">
        <ArtDirectedImage
          desktopSrc={image.desktopSrc}
          mobileSrc={image.mobileSrc}
          desktopWidth={image.desktopWidth}
          desktopHeight={image.desktopHeight}
          mobileWidth={image.mobileWidth}
          mobileHeight={image.mobileHeight}
          alt={image.alt}
          sizes="100vw"
          fetchPriority="high"
          className="block"
        />
      </div>
      <div className="premium-hero__scrim absolute inset-0" />

      <div className="section-shell relative flex min-h-[43rem] items-end py-12 md:items-center md:py-16 lg:min-h-[calc(100svh-7rem)]">
        <Reveal className="hero-copy w-full min-w-0" variant="text">
          {eyebrow ? <p className="eyebrow eyebrow-on-dark">{eyebrow}</p> : null}
          <h1 className="premium-hero-title mt-5 text-white">{title}</h1>
          <p className="mt-6 w-full max-w-[39rem] text-[clamp(1.05rem,1.45vw,1.22rem)] leading-8 break-words text-white">
            {description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={primaryCta.href} className="button-light group">
              {primaryCta.label}
              <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {secondaryCta ? (
              <Link href={secondaryCta.href} className="button-outline-light">
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

interface BrandStatementSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  highlights: readonly { title: string; description: string }[];
}

export function BrandStatementSection({
  eyebrow,
  title,
  description,
  highlights,
}: BrandStatementSectionProps) {
  return (
    <section
      className="brand-statement bg-brand-primary relative text-white"
      aria-labelledby="brand-statement-heading"
    >
      <div className="section-shell">
        <Reveal className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <div>
            <p className="eyebrow eyebrow-on-dark">{eyebrow}</p>
            <h2 id="brand-statement-heading" className="section-title mt-4 text-white">
              {title}
            </h2>
          </div>
          <p className="brand-statement-copy max-w-xl text-lg leading-8 lg:pt-8">{description}</p>
        </Reveal>

        <div className="mt-16 grid border-y border-white/35 md:grid-cols-3">
          {highlights.map((highlight, index) => (
            <Reveal
              key={highlight.title}
              delay={index * 70}
              className="border-white/35 py-8 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0"
            >
              <h3 className="text-xl text-white">{highlight.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white">{highlight.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type SplitSurface = "white" | "soft" | "blue" | "gradient" | "navy";

interface SplitFeatureSectionProps {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  benefits?: readonly string[];
  image: MarketingImage;
  imagePosition?: "left" | "right";
  proportion?: "balanced" | "image-wide" | "image-dominant";
  surface?: SplitSurface;
  imageReveal?: RevealVariant | "none";
  primaryCta: MarketingCta;
  secondaryCta?: MarketingCta;
}

const surfaceClasses: Record<SplitSurface, string> = {
  white: "bg-background text-brand-navy",
  soft: "bg-surface-soft text-brand-navy",
  blue: "bg-brand-primary text-white",
  gradient: "brand-gradient text-white",
  navy: "bg-brand-navy text-white",
};

export function SplitFeatureSection({
  id,
  eyebrow,
  title,
  description,
  benefits,
  image,
  imagePosition = "right",
  proportion = "balanced",
  surface = "white",
  imageReveal = imagePosition,
  primaryCta,
  secondaryCta,
}: SplitFeatureSectionProps) {
  const dark = surface === "blue" || surface === "gradient" || surface === "navy";
  const copyPosition = imagePosition === "right" ? "left" : "right";

  const imageContent = (
    <div className="split-feature-image">
      <ArtDirectedImage
        desktopSrc={image.desktopSrc}
        mobileSrc={image.mobileSrc}
        desktopWidth={image.desktopWidth}
        desktopHeight={image.desktopHeight}
        mobileWidth={image.mobileWidth}
        mobileHeight={image.mobileHeight}
        alt={image.alt}
        sizes={`(max-width: 1023px) 100vw, ${proportion === "image-dominant" ? "65vw" : proportion === "image-wide" ? "60vw" : "50vw"}`}
        className="block"
      />
    </div>
  );

  return (
    <section id={id} className="overflow-hidden" aria-labelledby={id ? `${id}-heading` : undefined}>
      <div
        className={`split-feature-grid split-feature-grid--${proportion} split-feature-grid--${imagePosition}`}
      >
        <div
          className={`split-feature-copy split-feature-copy--${copyPosition} flex items-center ${surfaceClasses[surface]} ${imagePosition === "left" ? "lg:order-2" : ""}`}
        >
          <Reveal variant="text" className="max-w-[39rem]">
            <p className={dark ? "eyebrow eyebrow-on-dark" : "eyebrow"}>{eyebrow}</p>
            <h2
              id={id ? `${id}-heading` : undefined}
              className={`section-title mt-4 ${dark ? "text-white" : ""}`}
            >
              {title}
            </h2>
            <p
              className={`mt-6 text-lg leading-8 ${dark ? "text-white" : "text-[var(--text-muted)]"}`}
            >
              {description}
            </p>

            {benefits?.length ? (
              <ul
                className={`mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 ${dark ? "text-white" : "text-brand-dark"}`}
              >
                {benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className={`flex items-start gap-3 border-t pt-3 text-sm leading-6 ${dark ? "border-white/25" : "border-border-default"}`}
                  >
                    <CheckIcon
                      className={`mt-1 size-4 shrink-0 ${dark ? "text-white" : "text-brand-primary"}`}
                    />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={primaryCta.href} className={dark ? "button-light" : "button-primary"}>
                {primaryCta.label}
              </Link>
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className={dark ? "button-outline-light" : "button-secondary"}
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </Reveal>
        </div>

        <div className={`split-feature-media ${imagePosition === "left" ? "lg:order-1" : ""}`}>
          {imageReveal === "none" ? (
            imageContent
          ) : (
            <Reveal className="h-full" variant={imageReveal}>
              {imageContent}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

interface EditorialFeatureSectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
  items?: readonly string[];
  links?: readonly EditorialLink[];
  cta?: MarketingCta;
  surface?: "white" | "soft" | "blue";
  layout?: "editorial" | "statement" | "image-left" | "image-right";
  linkLayout?: "editorial" | "topics";
  image?: MarketingImage;
}

export function EditorialFeatureSection({
  id,
  eyebrow,
  title,
  paragraphs,
  items,
  links,
  cta,
  surface = "white",
  layout = "editorial",
  linkLayout = "editorial",
  image,
}: EditorialFeatureSectionProps) {
  const dark = surface === "blue";
  const surfaceClass = dark
    ? "bg-brand-primary text-white"
    : surface === "soft"
      ? "bg-surface-soft"
      : "bg-background";
  const hasImage = image && (layout === "image-left" || layout === "image-right");
  const action = cta && !links?.some((link) => link.href === cta.href) ? cta : undefined;

  return (
    <section id={id} className={`editorial-section editorial-section--${layout} ${surfaceClass}`}>
      <div className={hasImage ? "editorial-image-grid" : "section-shell editorial-grid"}>
        {hasImage ? (
          <Reveal variant={layout === "image-left" ? "left" : "right"} className="editorial-media">
            <div className="editorial-photo">
              <ArtDirectedImage {...image} sizes="(max-width: 1023px) 100vw, 50vw" />
            </div>
          </Reveal>
        ) : null}
        <div className="editorial-heading">
          <Reveal>
            {eyebrow ? (
              <p className={dark ? "eyebrow eyebrow-on-dark" : "eyebrow"}>{eyebrow}</p>
            ) : null}
            <h2 className={`section-title mt-4 ${dark ? "text-white" : ""}`}>{title}</h2>
          </Reveal>
        </div>

        <Reveal delay={80} className="editorial-body">
          <div
            className={`max-w-3xl text-[1.0625rem] leading-8 ${dark ? "text-white" : "text-[var(--text-muted)]"}`}
          >
            {paragraphs.map((paragraph, index) => (
              <p
                key={`${id ?? title}-paragraph-${index}`}
                className={index > 0 ? "mt-5" : undefined}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {items?.length ? (
            <ul
              className={`mt-9 grid gap-x-8 gap-y-3 sm:grid-cols-2 ${dark ? "text-white" : "text-brand-dark"}`}
            >
              {items.map((item, index) => (
                <li
                  key={`${id ?? title}-item-${index}`}
                  className={`flex items-start gap-3 border-t pt-4 text-sm leading-6 ${dark ? "border-white/25" : "border-border-default"}`}
                >
                  <CheckIcon
                    className={`mt-1 size-4 shrink-0 ${dark ? "text-white" : "text-brand-primary"}`}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {links?.length && linkLayout === "topics" ? (
            <div className="contact-topic-matrix mt-8">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="contact-topic group">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-brand-primary text-lg font-semibold">{link.label}</span>
                    <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1" />
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-[var(--text-muted)]">
                    {link.description}
                  </span>
                </Link>
              ))}
            </div>
          ) : links?.length ? (
            <div
              className={`mt-10 grid border-y sm:grid-cols-2 ${dark ? "border-white/30" : "border-border-strong"}`}
            >
              {links.map((link, index) => {
                const content = (
                  <>
                    {link.eyebrow ? (
                      <span
                        className={`text-xs font-bold tracking-[0.12em] uppercase ${dark ? "text-white" : "text-brand-primary"}`}
                      >
                        {link.eyebrow}
                      </span>
                    ) : null}
                    <span
                      className={`mt-3 block text-[clamp(1.2rem,1.6vw,1.5rem)] leading-snug font-semibold ${dark ? "text-white" : "text-brand-navy"}`}
                    >
                      {link.label}
                    </span>
                    {link.description ? (
                      <span
                        className={`mt-2 block text-sm leading-6 ${dark ? "text-white" : "text-[var(--text-muted)]"}`}
                      >
                        {link.description}
                      </span>
                    ) : null}
                    <span
                      className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 group-hover:underline ${dark ? "text-white" : "text-brand-primary"}`}
                    >
                      Öffnen{" "}
                      <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1" />
                    </span>
                  </>
                );
                const className = `editorial-option group min-w-0 min-h-52 border-b p-6 transition-colors last:border-b-0 sm:border-b-0 sm:border-l sm:first:border-l-0 ${dark ? "border-white/30 hover:bg-white/8 focus-visible:bg-white/8" : "border-border-strong hover:bg-surface focus-visible:bg-surface"}`;

                return link.external ? (
                  <a
                    key={`${link.href}-${index}`}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link key={`${link.href}-${index}`} href={link.href} className={className}>
                    {content}
                  </Link>
                );
              })}
            </div>
          ) : null}

          {action ? (
            <Link
              href={action.href}
              className={dark ? "button-light mt-8" : "button-secondary mt-8"}
            >
              {action.label}
            </Link>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

interface Benefit {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

interface GradientBenefitSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  benefits: readonly Benefit[];
}

export function GradientBenefitSection({
  eyebrow,
  title,
  description,
  benefits,
}: GradientBenefitSectionProps) {
  return (
    <section
      className="brand-gradient relative overflow-hidden py-20 text-white md:py-28"
      aria-labelledby="benefits-heading"
    >
      <div className="section-shell benefit-composition relative">
        <Reveal>
          <p className="eyebrow eyebrow-on-dark">{eyebrow}</p>
          <div className="mt-4 grid gap-6">
            <h2 id="benefits-heading" className="section-title text-white">
              {title}
            </h2>
            <p className="max-w-xl text-base leading-7 text-white lg:justify-self-end">
              {description}
            </p>
          </div>
        </Reveal>

        <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {benefits.map(
            ({ title: benefitTitle, description: benefitDescription, icon: Icon }, index) => (
              <li key={benefitTitle} className="border-t border-white/35 pt-6">
                <Reveal delay={index * 70}>
                  <Icon className="size-8 text-white" />
                  <h3 className="mt-5 text-xl text-white">{benefitTitle}</h3>
                  <p className="mt-3 text-sm leading-6 text-white">{benefitDescription}</p>
                </Reveal>
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}

interface ProcessStep {
  title: string;
  description: string;
}

export function ProcessSection({ steps }: { steps: readonly ProcessStep[] }) {
  return (
    <section className="section-space bg-background" aria-labelledby="process-heading">
      <div className="section-shell">
        <Reveal className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">So arbeiten wir</p>
            <h2 id="process-heading" className="section-title mt-4">
              Vom ersten Gespräch zum stimmigen System
            </h2>
          </div>
          <p className="lead-copy lg:justify-self-end">
            Klare Schritte, verständliche Entscheidungen und ein persönlicher Ansprechpartner geben
            Ihrem Energieprojekt Struktur.
          </p>
        </Reveal>

        <ol className="border-border-strong mt-14 grid gap-0 border-y md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="border-border-strong py-8 md:border-l md:px-8 md:first:border-l-0"
            >
              <Reveal delay={index * 80}>
                <span className="text-brand-primary text-sm font-bold">0{index + 1}</span>
                <h3 className="mt-6 text-2xl">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

interface ReferenceProjectsSectionProps {
  projects: readonly ReferenceProject[];
  title?: string;
  description?: string;
  showCta?: boolean;
}

export function ReferenceProjectsSection({
  projects,
  title = "Energieprojekte aus unserer Region",
  description = "Vom Wohnhaus bis zum Gewerbedach: Entdecken Sie Photovoltaikanlagen aus unserer Region und die unterschiedlichen Möglichkeiten für Ihr Gebäude.",
  showCta = true,
}: ReferenceProjectsSectionProps) {
  return (
    <section
      id="referenzen"
      className="section-space bg-background"
      aria-labelledby="references-heading"
    >
      <div className="section-shell">
        <Reveal className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">Referenzen</p>
            <h2 id="references-heading" className="section-title mt-4">
              {title}
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="lead-copy">{description}</p>
            {showCta ? (
              <Link
                href="/pv-referenzen"
                className="text-brand-primary mt-6 inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"
              >
                Referenzen ansehen
                <ArrowRightIcon className="size-4" />
              </Link>
            ) : null}
          </div>
        </Reveal>

        <div className="reference-mosaic mt-12">
          {projects.slice(0, 4).map((project, index) => (
            <Reveal key={project.id} className={index === 0 ? "reference-mosaic__lead" : ""}>
              <Link
                href={`/pv-referenzen/${project.locationSlug}#${project.id}`}
                className="reference-tile group"
                aria-label={`${project.location}: ${project.category} – Projekt ansehen`}
              >
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes={
                    index === 0 || index === 3
                      ? "(max-width: 1023px) 100vw, 70vw"
                      : "(max-width: 1023px) 100vw, 40vw"
                  }
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
                />
                <div className="reference-tile__scrim" />
                <div className="reference-tile__caption">
                  <span className="text-xs font-bold tracking-[0.12em] text-white uppercase">
                    {project.location}
                  </span>
                  <span className="mt-1 block text-sm text-white">{project.category}</span>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold">
                    Projekt ansehen <ArrowRightIcon className="size-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CTAImageBandSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  image: MarketingImage;
  primaryCta: MarketingCta;
  secondaryCta?: MarketingCta;
}

export function CTAImageBandSection({
  eyebrow,
  title,
  description,
  image,
  primaryCta,
  secondaryCta,
}: CTAImageBandSectionProps) {
  return (
    <section
      className="bg-brand-navy relative isolate min-h-[35rem] overflow-hidden text-white"
      aria-labelledby="closing-cta-heading"
    >
      <div className="absolute inset-0">
        <ArtDirectedImage
          desktopSrc={image.desktopSrc}
          mobileSrc={image.mobileSrc}
          desktopWidth={image.desktopWidth}
          desktopHeight={image.desktopHeight}
          mobileWidth={image.mobileWidth}
          mobileHeight={image.mobileHeight}
          alt={image.alt}
          sizes="100vw"
          className="block"
        />
      </div>
      <div className="cta-image-band__scrim absolute inset-0" />
      <div className="section-shell relative flex min-h-[35rem] items-center py-16">
        <Reveal className="max-w-[42rem]">
          <p className="eyebrow eyebrow-on-dark">{eyebrow}</p>
          <h2 id="closing-cta-heading" className="section-title mt-4 text-white">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryCta.href} className="button-light">
              {primaryCta.label}
            </Link>
            {secondaryCta ? (
              <Link href={secondaryCta.href} className="button-outline-light">
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
