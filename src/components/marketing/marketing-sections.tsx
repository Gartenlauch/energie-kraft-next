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
    <section className="premium-hero relative isolate min-h-[43rem] overflow-hidden bg-brand-navy text-white lg:min-h-[calc(100svh-7rem)]">
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
        <Reveal className="w-full min-w-0 max-w-[43rem]" variant="text">
          {eyebrow ? <p className="eyebrow eyebrow-on-dark">{eyebrow}</p> : null}
          <h1 className="premium-hero-title mt-5 text-white">{title}</h1>
          <p className="mt-6 w-full max-w-[39rem] break-words text-[clamp(1.05rem,1.45vw,1.22rem)] leading-8 text-white">
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

export function BrandStatementSection({ eyebrow, title, description, highlights }: BrandStatementSectionProps) {
  return (
    <section className="relative overflow-visible bg-background py-20 md:py-28" aria-labelledby="brand-statement-heading">
      <Image
        src="/brand/energie-kraft/energie-kraft-supersign.svg"
        alt=""
        width={212}
        height={207}
        className="pointer-events-none absolute -bottom-14 left-[7%] z-10 hidden w-28 md:block lg:w-36"
      />
      <div className="section-shell">
        <Reveal className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="brand-statement-heading" className="section-title mt-4">{title}</h2>
          </div>
          <p className="lead-copy lg:pt-8">{description}</p>
        </Reveal>

        <div className="mt-14 grid border-y border-border-strong md:grid-cols-3">
          {highlights.map((highlight, index) => (
            <Reveal
              key={highlight.title}
              delay={index * 70}
              className="border-border-strong py-7 md:border-l md:px-8 md:first:border-l-0"
            >
              <h3 className="text-lg">{highlight.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{highlight.description}</p>
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
  surface = "white",
  imageReveal = imagePosition,
  primaryCta,
  secondaryCta,
}: SplitFeatureSectionProps) {
  const dark = surface === "blue" || surface === "gradient" || surface === "navy";
  const copyPosition = imagePosition === "right" ? "left" : "right";

  const imageContent = (
    <div className="relative h-full min-h-[24rem] md:min-h-[34rem] lg:min-h-[43rem]">
      <ArtDirectedImage
        desktopSrc={image.desktopSrc}
        mobileSrc={image.mobileSrc}
        desktopWidth={image.desktopWidth}
        desktopHeight={image.desktopHeight}
        mobileWidth={image.mobileWidth}
        mobileHeight={image.mobileHeight}
        alt={image.alt}
        sizes="(max-width: 1023px) 100vw, 50vw"
        className="block"
      />
    </div>
  );

  return (
    <section id={id} className="overflow-hidden" aria-labelledby={id ? `${id}-heading` : undefined}>
      <div className="grid lg:grid-cols-2">
        <div
          className={`split-feature-copy split-feature-copy--${copyPosition} flex items-center ${surfaceClasses[surface]} ${imagePosition === "left" ? "lg:order-2" : ""}`}
        >
          <Reveal variant="text" className="max-w-[39rem]">
            <p className={dark ? "eyebrow eyebrow-on-dark" : "eyebrow"}>{eyebrow}</p>
            <h2 id={id ? `${id}-heading` : undefined} className={`section-title mt-4 ${dark ? "text-white" : ""}`}>
              {title}
            </h2>
            <p className={`mt-6 text-lg leading-8 ${dark ? "text-white" : "text-[var(--text-muted)]"}`}>
              {description}
            </p>

            {benefits?.length ? (
              <ul className={`mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 ${dark ? "text-white" : "text-brand-dark"}`}>
                {benefits.map((benefit) => (
                  <li key={benefit} className={`flex items-start gap-3 border-t pt-3 text-sm leading-6 ${dark ? "border-white/25" : "border-border-default"}`}>
                    <CheckIcon className={`mt-1 size-4 shrink-0 ${dark ? "text-white" : "text-brand-primary"}`} />
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
                <Link href={secondaryCta.href} className={dark ? "button-outline-light" : "button-secondary"}>
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </Reveal>
        </div>

        <div className={imagePosition === "left" ? "lg:order-1" : ""}>
          {imageReveal === "none" ? imageContent : <Reveal variant={imageReveal}>{imageContent}</Reveal>}
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
  surface?: "white" | "soft" | "navy";
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
}: EditorialFeatureSectionProps) {
  const dark = surface === "navy";
  const surfaceClass = surface === "navy" ? "bg-brand-navy text-white" : surface === "soft" ? "bg-surface-soft" : "bg-background";

  return (
    <section id={id} className={`section-space ${surfaceClass}`}>
      <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 xl:gap-28">
        <Reveal>
          {eyebrow ? <p className={dark ? "eyebrow eyebrow-on-dark" : "eyebrow"}>{eyebrow}</p> : null}
          <h2 className={`section-title mt-4 ${dark ? "text-white" : ""}`}>{title}</h2>
          {cta ? (
            <Link href={cta.href} className={dark ? "button-light mt-8 hidden lg:inline-flex" : "button-secondary mt-8 hidden lg:inline-flex"}>
              {cta.label}
            </Link>
          ) : null}
        </Reveal>

        <Reveal delay={80}>
          <div className={`max-w-3xl text-[1.0625rem] leading-8 ${dark ? "text-white" : "text-[var(--text-muted)]"}`}>
            {paragraphs.map((paragraph, index) => (
              <p key={`${id ?? title}-paragraph-${index}`} className={index > 0 ? "mt-5" : undefined}>
                {paragraph}
              </p>
            ))}
          </div>

          {items?.length ? (
            <ul className={`mt-9 grid gap-x-8 gap-y-3 sm:grid-cols-2 ${dark ? "text-white" : "text-brand-dark"}`}>
              {items.map((item, index) => (
                <li key={`${id ?? title}-item-${index}`} className={`flex items-start gap-3 border-t pt-4 text-sm leading-6 ${dark ? "border-white/25" : "border-border-default"}`}>
                  <CheckIcon className={`mt-1 size-4 shrink-0 ${dark ? "text-white" : "text-brand-primary"}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {links?.length ? (
            <div className={`mt-10 grid border-y sm:grid-cols-2 ${dark ? "border-white/30" : "border-border-strong"}`}>
              {links.map((link, index) => {
                const content = (
                  <>
                    {link.eyebrow ? <span className={`text-xs font-bold tracking-[0.12em] uppercase ${dark ? "text-white" : "text-brand-primary"}`}>{link.eyebrow}</span> : null}
                    <span className={`mt-3 block text-lg font-semibold ${dark ? "text-white" : "text-brand-navy"}`}>{link.label}</span>
                    {link.description ? <span className={`mt-2 block text-sm leading-6 ${dark ? "text-white" : "text-[var(--text-muted)]"}`}>{link.description}</span> : null}
                    <span className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 group-hover:underline ${dark ? "text-white" : "text-brand-primary"}`}>
                      Öffnen <ArrowRightIcon className="size-4" />
                    </span>
                  </>
                );
                const className = `group min-h-52 border-b p-6 transition-colors last:border-b-0 sm:border-b-0 sm:border-l sm:first:border-l-0 ${dark ? "border-white/30 hover:bg-white/8" : "border-border-strong hover:bg-surface"}`;

                return link.external ? (
                  <a key={`${link.href}-${index}`} href={link.href} target="_blank" rel="noreferrer" className={className}>
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

          {cta ? (
            <Link href={cta.href} className={dark ? "button-light mt-8 lg:hidden" : "button-secondary mt-8 lg:hidden"}>
              {cta.label}
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

export function GradientBenefitSection({ eyebrow, title, description, benefits }: GradientBenefitSectionProps) {
  return (
    <section className="brand-gradient relative overflow-hidden py-20 text-white md:py-28" aria-labelledby="benefits-heading">
      <Image
        src="/brand/energie-kraft/energie-kraft-supersign.svg"
        alt=""
        width={530}
        height={516}
        className="pointer-events-none absolute -right-28 -bottom-36 w-[32rem] opacity-10"
      />
      <div className="section-shell relative">
        <Reveal>
          <p className="eyebrow eyebrow-on-dark">{eyebrow}</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <h2 id="benefits-heading" className="section-title text-white">{title}</h2>
            <p className="max-w-xl text-base leading-7 text-white lg:justify-self-end">{description}</p>
          </div>
        </Reveal>

        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ title: benefitTitle, description: benefitDescription, icon: Icon }, index) => (
            <li key={benefitTitle} className="border-t border-white/35 pt-6">
              <Reveal delay={index * 70}>
                <Icon className="size-8 text-white" />
                <h3 className="mt-5 text-xl text-white">{benefitTitle}</h3>
                <p className="mt-3 text-sm leading-6 text-white">{benefitDescription}</p>
              </Reveal>
            </li>
          ))}
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
    <section className="section-space bg-surface-soft" aria-labelledby="process-heading">
      <div className="section-shell">
        <Reveal className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">So arbeiten wir</p>
            <h2 id="process-heading" className="section-title mt-4">Vom ersten Gespräch zum stimmigen System</h2>
          </div>
          <p className="lead-copy lg:justify-self-end">
            Klare Schritte, verständliche Entscheidungen und ein persönlicher Ansprechpartner geben
            Ihrem Energieprojekt Struktur.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-0 border-y border-border-strong md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="border-border-strong py-8 md:border-l md:px-8 md:first:border-l-0">
              <Reveal delay={index * 80}>
                <span className="text-sm font-bold text-brand-primary">0{index + 1}</span>
                <h3 className="mt-6 text-2xl">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{step.description}</p>
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
  description = "Echte Anlagen zeigen, wie unterschiedlich Dächer, Gebäude und Anforderungen sein können. Veröffentlicht werden ausschließlich vorhandene Projektbilder – ohne erfundene Kennzahlen.",
  showCta = true,
}: ReferenceProjectsSectionProps) {
  return (
    <section id="referenzen" className="section-space bg-background" aria-labelledby="references-heading">
      <div className="section-shell">
        <Reveal className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="eyebrow">Referenzen</p>
            <h2 id="references-heading" className="section-title mt-4">{title}</h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="lead-copy">{description}</p>
            {showCta ? (
              <Link href="/pv-referenzen" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-brand-primary underline-offset-4 hover:underline">
                Referenzen ansehen
                <ArrowRightIcon className="size-4" />
              </Link>
            ) : null}
          </div>
        </Reveal>

        <div className="reference-mosaic mt-12">
          {projects.slice(0, 4).map((project, index) => (
            <Reveal key={project.slug} variant={index % 2 === 0 ? "left" : "right"} className={index === 0 ? "reference-mosaic__lead" : ""}>
              <figure className="group relative h-full min-h-[16rem] overflow-hidden bg-surface-soft">
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  fill
                  sizes={index === 0 ? "(max-width: 1023px) 100vw, 58vw" : "(max-width: 1023px) 50vw, 42vw"}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(9,20,51,0.88)_78%,rgba(9,20,51,0.95)_100%)]" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                  <span className="text-xs font-bold tracking-[0.12em] text-white uppercase">{project.location}</span>
                  <span className="mt-1 block text-sm text-white">{project.category}</span>
                </figcaption>
              </figure>
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

export function CTAImageBandSection({ eyebrow, title, description, image, primaryCta, secondaryCta }: CTAImageBandSectionProps) {
  return (
    <section className="relative isolate min-h-[35rem] overflow-hidden bg-brand-navy text-white" aria-labelledby="closing-cta-heading">
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
          <h2 id="closing-cta-heading" className="section-title mt-4 text-white">{title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryCta.href} className="button-light">{primaryCta.label}</Link>
            {secondaryCta ? <Link href={secondaryCta.href} className="button-outline-light">{secondaryCta.label}</Link> : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
