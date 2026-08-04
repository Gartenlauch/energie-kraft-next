import Link from "next/link";

import { PUBLIC_ROUTE_LIST } from "@/config/routes";
import { siteConfig } from "@/config/site";

const navigationRoutes = PUBLIC_ROUTE_LIST.filter((route) => route.navigation.header);

export function SiteHeader() {
  return (
    <header className="border-foreground/10 bg-background/95 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center justify-between gap-6 px-6">
        <Link href="/" aria-label={`${siteConfig.name} – Startseite`} className="shrink-0 py-4">
          <span className="block text-lg font-bold tracking-tight">ENERGIE-KRAFT</span>
          <span className="text-foreground/60 block text-xs font-semibold tracking-[0.24em] uppercase">
            Süd
          </span>
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-5 md:flex">
          {navigationRoutes.map((route) => (
            <Link
              key={route.key}
              href={route.href}
              className="text-foreground/75 hover:text-foreground py-6 text-sm font-semibold transition"
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/kontakt"
          className="bg-foreground text-background hidden min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-semibold lg:inline-flex"
        >
          Beratung anfragen
        </Link>

        <details className="relative md:hidden">
          <summary className="border-foreground/20 flex min-h-11 cursor-pointer list-none items-center justify-center rounded-md border px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            Menü
          </summary>

          <div className="border-foreground/10 bg-background absolute top-[calc(100%+0.75rem)] right-0 w-[min(20rem,calc(100vw-3rem))] rounded-lg border p-3 shadow-xl">
            <nav aria-label="Mobile Hauptnavigation">
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/"
                    className="hover:bg-foreground/5 block rounded-md px-4 py-3 text-sm font-semibold"
                  >
                    Startseite
                  </Link>
                </li>

                {navigationRoutes.map((route) => (
                  <li key={route.key}>
                    <Link
                      href={route.href}
                      className="hover:bg-foreground/5 block rounded-md px-4 py-3 text-sm font-semibold"
                    >
                      {route.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Link
              href="/kontakt"
              className="bg-foreground text-background mt-3 flex min-h-11 items-center justify-center rounded-md px-4 py-3 text-sm font-semibold"
            >
              Beratung anfragen
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
