import type { Metadata } from "next";
import { ArtDirectedImage } from "@/components/media/art-directed-image";
import { PublicLink as Link } from "@/components/ui/public-link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { CONTACT_FORM_HREF, PUBLIC_ROUTES } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { sonnenInformation as info } from "@/content/sonnen-insolvenz";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

const baseMetadata = buildMetadata(info.seo);
export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    type: "article",
    publishedTime: info.date,
    modifiedTime: info.date,
    authors: [siteConfig.name],
    images: [
      {
        url: buildCanonicalUrl(info.image.src),
        width: info.image.width,
        height: info.image.height,
        alt: info.image.alt,
      },
    ],
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": `${buildCanonicalUrl(info.path)}#article`,
  url: buildCanonicalUrl(info.path),
  mainEntityOfPage: buildCanonicalUrl(info.path),
  headline: info.title,
  description: info.seo.description,
  datePublished: info.date,
  dateModified: info.date,
  inLanguage: "de-DE",
  author: {
    "@type": "Organization",
    "@id": buildCanonicalUrl("/#organization"),
    name: siteConfig.name,
    url: buildCanonicalUrl("/"),
  },
  publisher: { "@id": buildCanonicalUrl("/#organization") },
  image: buildCanonicalUrl(info.image.src),
  citation: info.sources.map((source) => source.href),
};

export default function SonnenInsolvenzPage() {
  return (
    <>
      <JsonLdScript data={articleJsonLd} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({ currentLabel: "sonnen Insolvenz", currentPath: info.path })}
      />
      <main id="main-content">
        <Breadcrumbs currentLabel="sonnen Insolvenz" />
        <article>
          <header className="bg-surface-soft pt-12 pb-10 md:pt-16 md:pb-14">
            <div className="section-shell">
              <p className="eyebrow">
                Einordnung & Service · <time dateTime={info.date}>{info.displayDate}</time>
              </p>
              <h1 className="text-brand-navy mt-5 max-w-5xl text-[clamp(2rem,4.5vw,4.25rem)] leading-[1.1] font-semibold text-balance">
                {info.title}
              </h1>
              <p className="lead-copy mt-6 max-w-3xl">
                Was bislang bekannt ist, welche Fragen offenbleiben und wie wir Sie bei Ihrer
                bestehenden Anlage unterstützen.
              </p>
              <figure className="mt-10 md:mt-12">
                <div className="aspect-[4/5] overflow-hidden rounded-xl md:aspect-video">
                  <ArtDirectedImage
                    desktopSrc={info.image.src}
                    mobileSrc={info.image.mobileSrc}
                    desktopWidth={info.image.width}
                    desktopHeight={info.image.height}
                    mobileWidth={960}
                    mobileHeight={1200}
                    alt={info.image.alt}
                    sizes="(min-width: 1280px) 1232px, 100vw"
                    fetchPriority="high"
                  />
                </div>
                <figcaption className="mt-3 text-xs leading-6 text-[var(--text-muted)]">
                  Herstellerabbildung: sonnenBatterie 10 performance · Bild: sonnen · kein
                  Energie-Kraft-Referenzprojekt.
                </figcaption>
              </figure>
            </div>
          </header>

          <div className="section-shell grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
            <section aria-labelledby="lage-heading" className="max-w-3xl">
              <p className="eyebrow">Die aktuelle Lage</p>
              <h2
                id="lage-heading"
                className="text-brand-navy mt-4 text-2xl leading-tight font-semibold md:text-3xl"
              >
                Insolvenzantrag gemeldet. Langfristige Fragen bleiben offen.
              </h2>
              <p className="mt-6 leading-8">
                Nach einem Bericht von{" "}
                <Link
                  href={info.sources[0].href}
                  className="text-brand-primary underline underline-offset-4"
                >
                  pv magazine vom 22. Oktober 2026
                </Link>
                , der sich auf Handelsblatt beruft, hat die sonnen GmbH einen Insolvenzantrag
                gestellt. Dem Bericht zufolge soll das Bestandskundengeschäft einschließlich der
                Betreuung fortgeführt werden. Das beschreibt den gemeldeten Plan; es ist keine
                verbindliche Zusage zur künftigen Serviceleistung.
              </p>
              <p className="mt-4 leading-8">
                Wie sich Ersatzteilversorgung, Softwareunterstützung und die Erfüllung von
                Herstellergarantien langfristig entwickeln, ist derzeit nicht abschließend geklärt.
                Aus der Nachricht allein lässt sich weder ein technischer Defekt Ihrer Anlage noch
                ein notwendiger Austausch ableiten.
              </p>
              <Link
                href="#quellen"
                className="text-brand-primary mt-4 inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
              >
                Quellen und Informationsstand
              </Link>
            </section>
            <aside
              aria-labelledby="service-heading"
              className="bg-brand-primary self-start rounded-xl p-7 text-white md:p-8"
            >
              <p id="service-heading" className="text-xs font-bold tracking-widest uppercase">
                Energie-Kraft Süd
              </p>
              <p className="mt-5 leading-7">
                Wir sind weiterhin Ansprechpartner für Ihre bestehende sonnenBatterie und Wallbox –
                mit mehr als zehn Jahren Erfahrung in Verkauf, Installation und Betreuung.
              </p>
              <Link href={CONTACT_FORM_HREF} className="button-light mt-6 w-full">
                Service anfragen
              </Link>
              <p className="mt-4 text-sm leading-6">
                Bitte Modell und Anliegen im vorhandenen Kontaktformular beschreiben.
              </p>
            </aside>
          </div>

          <div className="section-shell pb-12 md:pb-20">
            {info.questions.map((question, index) => (
              <section
                key={question.id}
                id={question.id}
                aria-labelledby={`${question.id}-heading`}
                className="border-border-default grid gap-5 border-t py-10 md:py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16"
              >
                <div>
                  <p aria-hidden="true" className="text-brand-primary text-sm font-bold">
                    0{index + 1} / 04
                  </p>
                  <h2
                    id={`${question.id}-heading`}
                    className="text-brand-navy mt-4 max-w-xl text-[clamp(1.5rem,2.5vw,2.3rem)] leading-tight font-semibold text-balance"
                  >
                    {question.title}
                  </h2>
                </div>
                <div className="max-w-2xl space-y-5 leading-8">
                  {question.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section
            aria-labelledby="naechste-schritte-heading"
            className="bg-surface-soft py-12 md:py-20"
          >
            <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <p className="eyebrow">Gut vorbereitet</p>
                <h2
                  id="naechste-schritte-heading"
                  className="text-brand-navy mt-4 text-3xl leading-tight font-semibold"
                >
                  Was sollten sonnen-Kunden jetzt tun?
                </h2>
              </div>
              <ol className="space-y-5 leading-8">
                <li>
                  <strong>1. Unterlagen sichern.</strong> Rechnung, Vertrag, Garantiebedingungen,
                  Seriennummer und Inbetriebnahmeprotokoll zusammenstellen.
                </li>
                <li>
                  <strong>2. Anlagenstatus dokumentieren.</strong> Fehlermeldungen, Zeitpunkt und
                  beobachtetes Verhalten notieren; verfügbare Monitoring-Daten aufbewahren.
                </li>
                <li>
                  <strong>3. Bei Störungen Unterstützung anfragen.</strong> Den Vertragspartner und
                  bei technischen Fragen unseren Service kontaktieren. An der elektrischen Anlage
                  nur Fachkräfte arbeiten lassen.
                </li>
                <li>
                  <strong>4. Entscheidungen am konkreten Bedarf ausrichten.</strong> Eine
                  funktionierende Anlage muss wegen der Meldung allein nicht ersetzt werden. Bei
                  Bedarf prüfen wir Möglichkeiten und Grenzen der weiteren Betreuung.
                </li>
              </ol>
            </div>
          </section>

          <section
            aria-labelledby="unterstuetzung-heading"
            className="section-shell grid gap-8 py-12 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
          >
            <div>
              <p className="eyebrow">Ihr Ansprechpartner</p>
              <h2
                id="unterstuetzung-heading"
                className="text-brand-navy mt-4 text-3xl leading-tight font-semibold"
              >
                Wie unterstützt Energie-Kraft Süd bestehende sonnen-Kunden?
              </h2>
            </div>
            <div className="max-w-2xl space-y-5 leading-8">
              <p>
                Seit mehr als zehn Jahren verkaufen, installieren und betreuen wir sonnenBatterien
                und Wallboxen. Diese Erfahrung und unsere eigene Serviceabteilung stehen Ihnen
                weiterhin zur Verfügung. Wir ordnen technische Anliegen ein und stimmen ab, welche
                Prüfung oder weitere Betreuung für Ihre Anlage möglich ist.
              </p>
              <p>
                Unser erster Schritt ist die Bestandsanlage. Nur wenn es technisch sinnvoll ist oder
                Sie es wünschen, sprechen wir anschließend über Ersatz- oder
                Modernisierungslösungen. Die Verfügbarkeit von Herstellerleistungen, Ersatzteilen
                und Software wird dabei gesondert geprüft.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href={CONTACT_FORM_HREF} className="button-primary">
                  Service anfragen
                </Link>
                <Link
                  href={PUBLIC_ROUTES["service-und-wartung"].href}
                  className="text-brand-primary inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
                >
                  Mehr zu Service & Wartung
                </Link>
              </div>
            </div>
          </section>

          <footer id="quellen" className="border-border-default border-t py-10 md:py-14">
            <div className="section-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <h2 className="text-brand-navy text-2xl font-semibold">
                  Quellen und Informationsstand
                </h2>
                <p className="mt-4 text-sm leading-7">
                  Stand: <time dateTime={info.date}>{info.displayDate}</time>
                  <br />
                  Redaktion: Energie-Kraft Süd
                </p>
              </div>
              <div className="max-w-2xl text-sm leading-7">
                <ul className="space-y-5">
                  {info.sources.map((source) => (
                    <li key={source.href}>
                      <Link
                        href={source.href}
                        className="text-brand-primary inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
                      >
                        {source.label}
                      </Link>
                      <p>{source.description}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-6">
                  Die Einordnung beschreibt den am genannten Datum recherchierten Stand. Sie ersetzt
                  keine individuelle Rechtsberatung. Angaben zur Erfahrung und zum eigenen Service
                  stammen von Energie-Kraft Süd.
                </p>
                <p className="mt-4">
                  Bildquelle:{" "}
                  <Link
                    href="https://www.sonnen.de/stromspeicher/sonnenbatterie-10-performance"
                    className="text-brand-primary underline underline-offset-4"
                  >
                    sonnen, Produktseite sonnenBatterie 10 performance
                  </Link>
                  .
                </p>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}
