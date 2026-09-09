import Image from "next/image";
import Link from "next/link";
import { MarketingInvitation } from "@/components/layout/marketing-invitation";

import { ArrowRightIcon, PhoneIcon } from "@/components/ui/icons";
import { LEGAL_ROUTE_LIST } from "@/config/legal-routes";
import { siteConfig } from "@/config/site";

const energyLinks = [
  ["Photovoltaik", "/photovoltaik"],
  ["Stromspeicher", "/stromspeicher"],
  ["Wärmepumpen", "/waermepumpen"],
  ["Klimaanlagen", "/klimaanlagen"],
  ["Wallbox", "/wallbox"],
  ["Für Unternehmen", "/energieloesungen/photovoltaik-fuer-unternehmen"],
  ["Stromtarife", "/energieloesungen/stromtarife-pv"],
] as const;

const companyLinks = [
  ["Über uns", "/ueber-uns"],
  ["Service & Wartung", "/service-und-wartung"],
  ["Service & Team", "/service-und-wartung/service-und-team"],
  ["Referenzen", "/pv-referenzen"],
  ["Jobs", "/jobs"],
  ["Kunden werben Kunden", "/kunden-werben-kunden"],
  ["Kontakt", "/kontakt"],
] as const;

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-brand-dark border-border-default relative overflow-hidden border-t">
      <MarketingInvitation>
        <div className="border-border-default border-b">
          <div className="section-shell grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center lg:py-16">
            <div>
              <p className="text-brand-primary text-xs font-bold tracking-[0.16em] uppercase">
                Ihr Energieprojekt
              </p>
              <h2 className="text-brand-primary mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
                Lassen Sie uns die passende Lösung für Ihr Gebäude entwickeln.
              </h2>
            </div>
            <Link href="/konfigurator" className="button-primary group md:min-w-52">
              Projekt konfigurieren
              <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </MarketingInvitation>
      <div className="section-shell relative grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:py-18">
        <div>
          <Link href="/" className="inline-flex" aria-label={`${siteConfig.name} – Startseite`}>
            <Image
              src="/brand/energie-kraft/eksued-logo-kompakt-website.svg"
              alt="Energie-Kraft Süd"
              width={206}
              height={90}
              className="h-auto w-52"
            />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7">
            Individuelle Lösungen für Photovoltaik, Stromspeicher, E-Mobilität, Wärmepumpen und
            Klimatisierung – persönlich geplant in Ainring.
          </p>
          <a
            href={siteConfig.contact.phoneHref}
            className="text-brand-primary mt-6 inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline"
          >
            <PhoneIcon className="size-4" />
            {siteConfig.contact.phoneDisplay}
          </a>
        </div>

        <div>
          <h2 className="text-brand-primary text-xs font-bold tracking-[0.16em] uppercase">
            Energielösungen
          </h2>
          <ul className="mt-5 space-y-3.5 text-sm">
            {energyLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-brand-primary underline-offset-4 hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-brand-primary text-xs font-bold tracking-[0.16em] uppercase">
            Unternehmen
          </h2>
          <ul className="mt-5 space-y-3.5 text-sm">
            {companyLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-brand-primary underline-offset-4 hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-brand-primary text-xs font-bold tracking-[0.16em] uppercase">
            Kontakt
          </h2>
          <address className="mt-5 space-y-4 text-sm leading-6 not-italic">
            <p>{siteConfig.legalName}</p>
            <p>
              {siteConfig.contact.address.street}
              <br />
              {siteConfig.contact.address.postalCode} {siteConfig.contact.address.city}
            </p>
            <p>
              <a
                href={siteConfig.contact.emailHref}
                className="text-brand-primary break-all underline-offset-4 hover:underline"
              >
                {siteConfig.contact.email}
              </a>
            </p>
          </address>
          <Image
            src="/brand/certifications/dgs-mitglied.jpg"
            alt="Mitglied der Deutschen Gesellschaft für Sonnenenergie (DGS)"
            width={1431}
            height={904}
            sizes="176px"
            className="mt-8 h-auto w-44"
          />
        </div>
      </div>

      <div className="border-border-default border-t">
        <div className="section-shell flex flex-col gap-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {siteConfig.legalName}
          </p>
          <nav aria-label="Rechtliche Informationen">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_ROUTE_LIST.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="text-brand-primary underline-offset-4 hover:underline"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
