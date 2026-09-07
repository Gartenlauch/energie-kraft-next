"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  ArrowRightIcon,
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  PhoneIcon,
} from "@/components/ui/icons";
import { siteConfig } from "@/config/site";

type MegaMenuKey = "energy" | "service";

interface NavigationLink {
  label: string;
  href: string;
  description?: string;
}

const energyLinks: readonly NavigationLink[] = [
  {
    label: "Photovoltaik",
    href: "/photovoltaik",
    description: "Solarstrom passend zu Dach und Verbrauch planen.",
  },
  {
    label: "Stromspeicher",
    href: "/stromspeicher",
    description: "Eigene Energie flexibel und intelligent nutzen.",
  },
  {
    label: "Wärmepumpe",
    href: "/waermepumpen",
    description: "Wärmeversorgung als Teil des Energiesystems.",
  },
  {
    label: "Klimaanlage",
    href: "/klimaanlagen",
    description: "Räume effizient kühlen und temperieren.",
  },
  {
    label: "Wallbox",
    href: "/wallbox",
    description: "Elektromobilität mit PV-Strom verbinden.",
  },
  {
    label: "Energie-Konfigurator",
    href: "/konfigurator",
    description: "Ihr Vorhaben in wenigen Schritten vorbereiten.",
  },
] as const;

const serviceLinks: readonly NavigationLink[] = [
  {
    label: "Service & Wartung",
    href: "/service-und-wartung",
    description: "Zuverlässiger Betrieb über die Inbetriebnahme hinaus.",
  },
  {
    label: "Anlagencheck",
    href: "/service-und-wartung#anlagencheck",
    description: "Funktion und Leistung strukturiert prüfen lassen.",
  },
  {
    label: "Wartung",
    href: "/service-und-wartung#wartung",
    description: "Pflege und Prüfung passend zur installierten Technik.",
  },
  {
    label: "Persönliche Unterstützung",
    href: "/service-und-wartung#kontakt",
    description: "Ihr Anliegen direkt mit unserem Team klären.",
  },
] as const;

const directLinks: readonly NavigationLink[] = [
  { label: "Referenzen", href: "/pv-referenzen" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Jobs", href: "/jobs" },
] as const;

interface MegaMenuProps {
  menuKey: MegaMenuKey;
  label: string;
  title: string;
  intro: string;
  links: readonly NavigationLink[];
  imageSrc: string;
  imageAlt: string;
  openMenu: MegaMenuKey | null;
  setOpenMenu: (menu: MegaMenuKey | null) => void;
  pathname: string;
}

function MegaMenu({
  menuKey,
  label,
  title,
  intro,
  links,
  imageSrc,
  imageAlt,
  openMenu,
  setOpenMenu,
  pathname,
}: MegaMenuProps) {
  const isOpen = openMenu === menuKey;
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function closeAndFocus() {
    setOpenMenu(null);
    buttonRef.current?.focus();
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-full items-center"
      onMouseEnter={() => setOpenMenu(menuKey)}
      onMouseLeave={() => setOpenMenu(null)}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget)) {
          setOpenMenu(null);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.preventDefault();
          closeAndFocus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${menuKey}-mega-menu`}
        onClick={() => setOpenMenu(isOpen ? null : menuKey)}
        className="group flex min-h-12 items-center gap-1.5 px-2 text-[0.82rem] font-semibold text-brand-navy transition hover:text-brand-primary"
      >
        {label}
        <ChevronDownIcon
          className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div
          id={`${menuKey}-mega-menu`}
          className="absolute top-full left-1/2 z-50 w-[min(74rem,calc(100vw-3rem))] -translate-x-1/2 pt-3"
        >
          <div className="overflow-hidden rounded-[1.5rem] border border-border-default bg-background shadow-[var(--shadow-float)]">
            <div className="grid grid-cols-[0.8fr_1.2fr]">
              <div className="relative min-h-[25rem] overflow-hidden bg-brand-navy">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1280px) 38vw, 470px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,20,51,0.06)_20%,rgba(9,20,51,0.88)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <p className="text-xs font-bold tracking-[0.16em] text-cyan-200 uppercase">
                    Energie-Kraft Süd
                  </p>
                  <h2 className="mt-3 max-w-sm text-3xl font-bold tracking-tight text-white">
                    {title}
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/80">{intro}</p>
                </div>
              </div>

              <div className="grid content-start grid-cols-2 gap-3 p-7">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    onClick={() => setOpenMenu(null)}
                    className="group rounded-xl border border-transparent p-4 transition hover:border-border-default hover:bg-surface focus-visible:border-brand-accent"
                  >
                    <span className="flex items-center justify-between gap-3 font-semibold text-brand-navy transition group-hover:text-brand-primary">
                      {link.label}
                      <ArrowRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </span>
                    {link.description ? (
                      <span className="mt-2 block text-sm leading-6 text-[var(--text-muted)]">
                        {link.description}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface MobileGroupProps {
  groupKey: MegaMenuKey;
  label: string;
  links: readonly NavigationLink[];
  openGroup: MegaMenuKey | null;
  setOpenGroup: (group: MegaMenuKey | null) => void;
  closeMenu: () => void;
}

function MobileGroup({
  groupKey,
  label,
  links,
  openGroup,
  setOpenGroup,
  closeMenu,
}: MobileGroupProps) {
  const isOpen = openGroup === groupKey;

  return (
    <li className="border-b border-white/10">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`mobile-${groupKey}-links`}
        onClick={() => setOpenGroup(isOpen ? null : groupKey)}
        className="flex min-h-15 w-full items-center justify-between gap-4 py-4 text-left font-semibold text-white"
      >
        {label}
        <ChevronDownIcon className={`size-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <ul id={`mobile-${groupKey}-links`} className="space-y-1 pb-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={closeMenu}
                className="block min-h-12 rounded-lg px-3 py-3 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<MegaMenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<MegaMenuKey | null>("energy");
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        mobileButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border-default/80 bg-background/96 shadow-[var(--shadow-sm)] backdrop-blur-xl">
      <div className="hidden border-b border-border-default/70 bg-brand-navy text-white lg:block">
        <div className="section-shell flex min-h-9 items-center justify-between gap-6 text-xs">
          <p className="font-medium tracking-wide text-white/72">
            Energielösungen aus Ainring · persönlich geplant
          </p>
          <a
            href={siteConfig.contact.phoneHref}
            className="flex min-h-9 items-center gap-2 font-semibold transition hover:text-cyan-200"
          >
            <PhoneIcon className="size-3.5" />
            {siteConfig.contact.phoneDisplay}
          </a>
        </div>
      </div>

      <div className="section-shell flex h-[4.75rem] items-center justify-between gap-5">
        <Link href="/" aria-label={`${siteConfig.name} – Startseite`} className="shrink-0">
          <Image
            src="/brand/energie-kraft/energie-kraft-logo.svg"
            alt="Energie-Kraft Süd"
            width={292}
            height={58}
            className="h-auto w-[12rem] sm:w-[13.5rem]"
          />
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden h-full items-center gap-0.5 xl:flex">
          <MegaMenu
            menuKey="energy"
            label="Energielösungen"
            title="Energie als Gesamtsystem denken"
            intro="Photovoltaik, Speicher, Wärme und Mobilität – abgestimmt auf Ihr Gebäude."
            links={energyLinks}
            imageSrc="/images/navigation/energy-solutions-mega.webp"
            imageAlt="Modernes Wohnhaus mit Photovoltaikanlage in den bayerischen Voralpen"
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            pathname={pathname}
          />
          <MegaMenu
            menuKey="service"
            label="Service & Wartung"
            title="Verlässlich an Ihrer Seite"
            intro="Strukturierte Betreuung für einen sicheren und dauerhaft leistungsfähigen Betrieb."
            links={serviceLinks}
            imageSrc="/images/navigation/service-maintenance-mega.webp"
            imageAlt="Servicetechniker prüft die Steuerung eines Energiesystems"
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            pathname={pathname}
          />
          {directLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="flex min-h-12 items-center px-2 text-[0.82rem] font-semibold text-brand-navy transition hover:text-brand-primary aria-[current=page]:text-brand-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <Link href="/konfigurator" className="button-primary whitespace-nowrap">
            Angebot anfragen
          </Link>
        </div>

        <button
          ref={mobileButtonRef}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setMobileOpen((current) => !current)}
          className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border-default text-brand-navy transition hover:border-brand-primary hover:text-brand-primary xl:hidden"
        >
          {mobileOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-[4.75rem] h-[calc(100dvh-4.75rem)] overflow-y-auto bg-brand-navy lg:top-[7rem] lg:h-[calc(100dvh-7rem)] xl:hidden"
        >
          <nav aria-label="Mobile Hauptnavigation" className="section-shell py-5">
            <ul>
              <MobileGroup
                groupKey="energy"
                label="Energielösungen"
                links={energyLinks}
                openGroup={mobileGroup}
                setOpenGroup={setMobileGroup}
                closeMenu={() => setMobileOpen(false)}
              />
              <MobileGroup
                groupKey="service"
                label="Service & Wartung"
                links={serviceLinks}
                openGroup={mobileGroup}
                setOpenGroup={setMobileGroup}
                closeMenu={() => setMobileOpen(false)}
              />
              {directLinks.map((link) => (
                <li key={link.href} className="border-b border-white/10">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-15 items-center py-4 font-semibold text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/konfigurator"
                onClick={() => setMobileOpen(false)}
                className="button-light"
              >
                Angebot konfigurieren
              </Link>
              <a
                href={siteConfig.contact.phoneHref}
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-white/25 px-5 py-3 text-sm font-semibold text-white"
              >
                <PhoneIcon className="size-4" />
                {siteConfig.contact.phoneDisplay}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
