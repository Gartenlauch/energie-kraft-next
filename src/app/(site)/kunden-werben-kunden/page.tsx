import type { Metadata } from "next";

import { ReferralForm } from "@/components/forms/referral-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PremiumHeroSection } from "@/components/marketing/marketing-sections";
import { Reveal } from "@/components/marketing/reveal";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { CheckIcon } from "@/components/ui/icons";
import {
  REFERRAL_REWARD_EURO,
  referralCampaignTerms,
} from "@/content/referral-campaign";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";

const seo = {
  title: "Kunden werben Kunden | 250 € Prämie",
  description:
    "Energie-Kraft Süd weiterempfehlen: Empfehlung vor der Angebotserstellung anmelden und bei erfolgreichem Vertragsabschluss 250 Euro Prämie erhalten.",
  canonicalPath: "/kunden-werben-kunden",
};

export const metadata: Metadata = buildMetadata(seo);

export default function ReferralPage() {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: "Kunden werben Kunden",
          currentPath: seo.canonicalPath,
        })}
      />
      <main id="main-content">
        <Breadcrumbs currentLabel="Kunden werben Kunden" />
        <PremiumHeroSection
          eyebrow="Empfehlen & Prämie sichern"
          title="Ihre Empfehlung ist uns viel wert."
          description="Teilen Sie Ihre gute Erfahrung mit Freunden, Familie oder Bekannten. Führt Ihre rechtzeitig gemeldete Empfehlung unter den Aktionsbedingungen zu einem Auftrag, bedanken wir uns mit einer Prämie."
          image={{
            desktopSrc: "/images/home-premium/consultation-reference-desktop.webp",
            mobileSrc: "/images/home-premium/consultation-reference-mobile.webp",
            desktopWidth: 1800,
            desktopHeight: 1200,
            mobileWidth: 1080,
            mobileHeight: 1350,
            alt: "Persönliches Gespräch über ein Energieprojekt",
          }}
          primaryCta={{ label: "Empfehlung eintragen", href: "#empfehlungsformular" }}
          secondaryCta={{ label: "Bedingungen prüfen", href: "#aktionsbedingungen" }}
        />

        <section className="section-space bg-background" aria-labelledby="referral-intro-title">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <Reveal>
              <p className="eyebrow">Kunden werben Kunden</p>
              <p className="text-brand-primary mt-5 text-[clamp(4rem,9vw,8rem)] leading-none font-bold tracking-[-0.06em]">
                {REFERRAL_REWARD_EURO} €
              </p>
              <p className="mt-3 text-sm font-bold tracking-[0.12em] uppercase">pro erfolgreicher Empfehlung</p>
            </Reveal>
            <Reveal delay={70}>
              <h2 id="referral-intro-title" className="section-title">Gute Erfahrungen dürfen nachhaltige Projekte anstoßen.</h2>
              <p className="lead-copy mt-6">
                Eine persönliche Empfehlung ist eine besondere Anerkennung. Gleichzeitig hilft sie anderen dabei, erneuerbare Energie zu nutzen und Stromkosten mit einer passenden Photovoltaiklösung zu senken.
              </p>
              <p className="mt-5 text-base leading-8 text-[var(--text-muted)]">
                Die Prämie wird nicht schon mit dem Absenden verdient. Sie setzt einen erfolgreichen Vertragsabschluss sowie die unten aufgeführten Aktionsbedingungen voraus.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section-space bg-surface-soft" aria-labelledby="referral-process-title">
          <div className="section-shell">
            <Reveal>
              <p className="eyebrow">So läuft die Aktion</p>
              <h2 id="referral-process-title" className="section-title mt-4">Von der Empfehlung bis zur möglichen Prämie</h2>
            </Reveal>
            <ol className="border-border-strong mt-12 grid border-y md:grid-cols-4">
              {[
                ["Kontakt übermitteln", "Tragen Sie die erforderlichen Angaben zur empfohlenen Person im Formular ein."],
                ["Eingang bestätigen", "Sie erhalten eine Bestätigung; die empfohlene Person wird knapp über die übermittelten Daten informiert."],
                ["Projekt beraten", "Wir nehmen Kontakt auf, beraten, planen und erstellen ein individuelles Angebot."],
                ["Prämie prüfen", "Kommt es unter den Bedingungen zum Vertragsabschluss, erhalten Sie ein separates Überweisungsformular."],
              ].map(([title, description], index) => (
                <li key={title} className="border-border-strong py-8 md:border-l md:px-7 md:first:border-l-0">
                  <Reveal delay={index * 60}>
                    <span className="text-brand-primary text-sm font-bold">0{index + 1}</span>
                    <h3 className="mt-5 text-xl">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{description}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="aktionsbedingungen" className="section-space bg-brand-navy text-white" aria-labelledby="terms-title">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow eyebrow-on-dark">Aktionsbedingungen</p>
              <h2 id="terms-title" className="section-title mt-4 text-white">Was für die Aktion gilt</h2>
              <p className="mt-5 text-sm leading-7 text-white">
                Maßgeblich ist die Prüfung im konkreten Fall. Die Aktion ist freiwillig und kann beendet werden.
              </p>
            </Reveal>
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {referralCampaignTerms.map((term, index) => (
                <li key={term} className="flex gap-3 border-t border-white/25 pt-4 text-sm leading-7 text-white">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-cyan-200" />
                  <span>{term}</span>
                  <span className="sr-only">Bedingung {index + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="empfehlungsformular" className="section-space bg-surface-soft" aria-labelledby="form-title">
          <div className="section-shell grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:items-start">
            <Reveal>
              <p className="eyebrow">Empfehlung anmelden</p>
              <h2 id="form-title" className="section-title mt-4">In drei klaren Schritten</h2>
              <p className="lead-copy mt-5">
                Halten Sie Ihre eigenen Kontaktdaten und die Angaben der empfohlenen Person bereit. Vor dem Absenden sehen Sie eine vollständige Zusammenfassung.
              </p>
            </Reveal>
            <Reveal delay={70}>
              <ReferralForm />
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
