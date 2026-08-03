import Link from "next/link";
import { LEGAL_ROUTE_LIST } from "@/config/legal-routes";
import { PUBLIC_ROUTE_LIST } from "@/config/routes";
import { siteConfig } from "@/config/site";

const serviceRoutes = PUBLIC_ROUTE_LIST.filter(
  (route) => route.key !== "home" && route.key !== "kontakt",
);

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-foreground/10 bg-foreground/[0.03] border-t px-6 py-14">
      <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-block">
            <span className="block text-lg font-bold tracking-tight">ENERGIE-KRAFT</span>
            <span className="text-foreground/60 block text-xs font-semibold tracking-[0.24em] uppercase">
              Süd
            </span>
          </Link>

          <p className="text-foreground/70 mt-5 max-w-sm leading-7">
            Individuelle Lösungen für Photovoltaik, Stromspeicher, E-Mobilität, Wärmepumpen und
            Klimatisierung.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-widest uppercase">Energielösungen</h2>

          <ul className="mt-5 space-y-3">
            {serviceRoutes.map((route) => (
              <li key={route.key}>
                <Link
                  href={route.href}
                  className="text-foreground/70 hover:text-foreground transition"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-widest uppercase">Kontakt</h2>

          <address className="text-foreground/70 mt-5 space-y-3 not-italic">
            <p>{siteConfig.legalName}</p>

            <p>
              {siteConfig.contact.address.street}
              <br />
              {siteConfig.contact.address.postalCode} {siteConfig.contact.address.city}
            </p>

            <p>
              <a href={siteConfig.contact.phoneHref} className="hover:text-foreground transition">
                {siteConfig.contact.phoneDisplay}
              </a>
            </p>

            <p>
              <a
                href={siteConfig.contact.emailHref}
                className="hover:text-foreground break-all transition"
              >
                {siteConfig.contact.email}
              </a>
            </p>
          </address>
        </div>

        <div>
          <h2 className="text-sm font-semibold tracking-widest uppercase">Beratung</h2>

          <p className="text-foreground/70 mt-5 leading-7">
            Wir beraten Sie persönlich zu Ihrem Gebäude und Ihrem geplanten Energiesystem.
          </p>

          <Link
            href="/kontakt"
            className="bg-foreground text-background mt-5 inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold"
          >
            Kontakt aufnehmen
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-7xl flex-col gap-5 border-t border-foreground/10 pt-6 text-sm text-foreground/60 lg:flex-row lg:items-center lg:justify-between">
        <p>
          © {currentYear} {siteConfig.legalName}
        </p>

        <nav aria-label="Rechtliche Informationen">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_ROUTE_LIST.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className="transition hover:text-foreground"
                >
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
