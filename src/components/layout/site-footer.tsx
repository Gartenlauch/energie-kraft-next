import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon, PhoneIcon } from "@/components/ui/icons";
import { LEGAL_ROUTE_LIST } from "@/config/legal-routes";
import { siteConfig } from "@/config/site";

const energyLinks = [
  ["Photovoltaik", "/photovoltaik"],
  ["Stromspeicher", "/stromspeicher"],
  ["Wärmepumpen", "/waermepumpen"],
  ["Klimaanlagen", "/klimaanlagen"],
  ["Wallbox", "/wallbox"],
] as const;

const companyLinks = [
  ["Service & Wartung", "/service-und-wartung"],
  ["Referenzen", "/pv-referenzen"],
  ["Kontakt", "/kontakt"],
  ["Jobs", "/jobs"],
] as const;

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-navy text-white">
      <Image
        src="/brand/energie-kraft/energie-kraft-supersign.svg"
        alt=""
        width={530}
        height={516}
        className="pointer-events-none absolute -right-30 bottom-4 w-[34rem] rotate-6 opacity-[0.055]"
      />

      <div className="border-b border-white/12">
        <div className="section-shell grid gap-8 py-12 md:grid-cols-[1fr_auto] md:items-center lg:py-16">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase">
              Ihr Energieprojekt
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              Lassen Sie uns die passende Lösung für Ihr Gebäude entwickeln.
            </h2>
          </div>
          <Link href="/konfigurator" className="button-light group md:min-w-52">
            Projekt konfigurieren
            <ArrowRightIcon className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="section-shell relative grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr] lg:py-18">
        <div>
          <Link
            href="/"
            className="inline-flex border-l-4 border-brand-accent bg-white px-4 py-3"
            aria-label={`${siteConfig.name} – Startseite`}
          >
            <Image
              src="/brand/energie-kraft/energie-kraft-logo.svg"
              alt="Energie-Kraft Süd"
              width={292}
              height={58}
              className="h-auto w-52"
            />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7 text-white/66">
            Individuelle Lösungen für Photovoltaik, Stromspeicher, E-Mobilität,
            Wärmepumpen und Klimatisierung – persönlich geplant in Ainring.
          </p>
          <a
            href={siteConfig.contact.phoneHref}
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-white transition hover:text-cyan-200"
          >
            <PhoneIcon className="size-4" />
            {siteConfig.contact.phoneDisplay}
          </a>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase">
            Energielösungen
          </h2>
          <ul className="mt-5 space-y-3.5 text-sm">
            {energyLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-white/72 transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase">
            Unternehmen
          </h2>
          <ul className="mt-5 space-y-3.5 text-sm">
            {companyLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-white/72 transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase">
            Kontakt
          </h2>
          <address className="mt-5 space-y-4 text-sm leading-6 text-white/72 not-italic">
            <p>{siteConfig.legalName}</p>
            <p>
              {siteConfig.contact.address.street}
              <br />
              {siteConfig.contact.address.postalCode} {siteConfig.contact.address.city}
            </p>
            <p>
              <a href={siteConfig.contact.emailHref} className="break-all hover:text-white">
                {siteConfig.contact.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/12">
        <div className="section-shell flex flex-col gap-4 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {siteConfig.legalName}
          </p>
          <nav aria-label="Rechtliche Informationen">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {LEGAL_ROUTE_LIST.map((route) => (
                <li key={route.href}>
                  <Link href={route.href} className="transition hover:text-white">
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
