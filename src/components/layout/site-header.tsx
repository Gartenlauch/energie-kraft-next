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
  previewImage?: string;
  priority?: "primary" | "secondary" | "supporting";
}

const energyLinks: readonly NavigationLink[] = [
  {
    label: "Photovoltaik",
    href: "/photovoltaik",
    description: "Solarstrom passend zu Dach und Verbrauch planen.",
    previewImage: "/images/photovoltaic/photovoltaic-feature-desktop.webp",
    priority: "primary",
  },
  {
    label: "Stromspeicher",
    href: "/stromspeicher",
    description: "Eigene Energie flexibel und intelligent nutzen.",
    previewImage: "/images/battery-storage/battery-storage-feature-desktop.webp",
    priority: "primary",
  },
  {
    label: "Wärmepumpe",
    href: "/waermepumpen",
    description: "Wärmeversorgung als Teil des Energiesystems.",
    previewImage: "/images/heat-pump/heat-pump-feature-desktop.webp",
    priority: "secondary",
  },
  {
    label: "Klimaanlage",
    href: "/klimaanlagen",
    description: "Räume effizient kühlen und temperieren.",
    previewImage: "/images/climate/climate-feature-desktop.webp",
    priority: "secondary",
  },
  {
    label: "Wallbox",
    href: "/wallbox",
    description: "Elektromobilität mit PV-Strom verbinden.",
    previewImage: "/images/wallbox/wallbox-feature-desktop.webp",
    priority: "supporting",
  },
  {
    label: "Photovoltaik für Unternehmen",
    href: "/energieloesungen/photovoltaik-fuer-unternehmen",
    description: "Eigenstrom für Gewerbe, Hallen und betriebliche Dachflächen.",
    previewImage: "/images/references/freilassing-commercial.webp",
    priority: "secondary",
  },
  {
    label: "Gewerbespeicher",
    href: "/energieloesungen/gewerbespeicher",
    description: "Erzeugung und Verbrauch im Betrieb besser aufeinander abstimmen.",
    previewImage: "/images/battery-storage/battery-storage-feature-desktop.webp",
    priority: "supporting",
  },
  {
    label: "Stromtarife",
    href: "/energieloesungen/stromtarife-pv",
    description: "PV, Eigenverbrauch und ergänzenden Strombezug zusammendenken.",
    previewImage: "/images/home-premium/hero-energy-home-desktop.webp",
    priority: "supporting",
  },
] as const;

const serviceLinks: readonly NavigationLink[] = [
  {
    label: "Service & Wartung",
    href: "/service-und-wartung",
    description: "Zuverlässiger Betrieb über die Inbetriebnahme hinaus.",
    previewImage: "/images/navigation/service-maintenance-mega.webp",
  },
  {
    label: "Service & Team",
    href: "/service-und-wartung/service-und-team",
    description: "Ansprechpartner, technische Betreuung und Serviceorganisation.",
    previewImage: "/images/team/company-service-hero-desktop.webp",
  },
  {
    label: "Wartung & Reinigung",
    href: "/service-und-wartung/wartung-und-reinigung",
    description: "Prüfung, Pflege und Fehlererkennung passend zur Anlage.",
    previewImage: "/images/home-premium/service-maintenance-desktop.webp",
  },
  {
    label: "Finanzierung & Förderung",
    href: "/service-und-wartung/finanzierung-und-foerderung",
    description: "Rahmenbedingungen und mögliche Programme individuell klären.",
    previewImage: "/images/home-premium/consultation-reference-desktop.webp",
  },
] as const;

const directLinks: readonly NavigationLink[] = [
  { label: "Unternehmen", href: "/ueber-uns" },
  { label: "Referenzen", href: "/pv-referenzen" },
  { label: "Jobs", href: "/jobs" },
  { label: "Kontakt", href: "/kontakt" },
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
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const scenes = [
    { key: "default", image: imageSrc, title, description: intro },
    ...links.map((link) => ({
      key: link.href,
      image: link.previewImage ?? imageSrc,
      title: link.label,
      description: link.description ?? intro,
    })),
  ];

  function closeAndFocus() {
    setOpenMenu(null);
    buttonRef.current?.focus();
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full items-center"
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
        aria-haspopup="true"
        onClick={() => setOpenMenu(isOpen ? null : menuKey)}
        className="group text-brand-navy hover:text-brand-primary flex min-h-12 items-center gap-1.5 px-2 text-[0.82rem] font-semibold underline-offset-8 transition hover:underline focus-visible:underline"
      >
        {label}
        <ChevronDownIcon className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen ? (
        <div
          id={`${menuKey}-mega-menu`}
          className="absolute top-full left-1/2 z-50 w-[min(74rem,calc(100vw-3rem))] -translate-x-1/2 pt-3"
        >
          <div className="border-border-default bg-background overflow-hidden rounded-[1.5rem] border shadow-[var(--shadow-float)]">
            <div className="grid grid-cols-[0.8fr_1.2fr]">
              <div
                className="bg-brand-navy relative min-h-[25rem] overflow-hidden"
                aria-hidden="true"
              >
                {scenes.map((scene) => (
                  <div
                    key={scene.key}
                    className="mega-preview-scene"
                    data-active={(activePreview ?? "default") === scene.key}
                  >
                    <Image
                      src={scene.image}
                      alt={scene.key === "default" ? imageAlt : ""}
                      fill
                      sizes="(max-width: 1280px) 38vw, 470px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(9,20,51,0.12)_30%,rgba(9,20,51,0.72)_48%,rgba(9,20,51,0.78)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                      <p className="text-xs font-bold tracking-[0.16em] text-white uppercase">
                        Energie-Kraft Süd
                      </p>
                      <h2 className="mt-3 max-w-sm text-3xl font-bold tracking-tight text-white">
                        {scene.title}
                      </h2>
                      <p className="mt-3 max-w-md text-sm leading-6 text-white">
                        {scene.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="grid grid-cols-2 content-start gap-x-3 p-7"
                onFocusCapture={(event) => {
                  const previewKey =
                    event.target.closest<HTMLElement>("[data-preview-key]")?.dataset.previewKey;
                  if (previewKey) setActivePreview(previewKey);
                }}
              >
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-preview-key={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    onMouseEnter={() => setActivePreview(link.href)}
                    onFocus={() => setActivePreview(link.href)}
                    onClick={() => setOpenMenu(null)}
                    className={`mega-menu-link group ${
                      link.priority === "primary" ? "bg-brand-primary/[0.045]" : ""
                    }`}
                  >
                    <span className="text-brand-navy group-hover:text-brand-primary flex items-center justify-between gap-3 font-semibold transition">
                      <span>
                        {link.label}
                        {link.priority === "primary" ? (
                          <span className="text-brand-primary ml-2 text-[0.62rem] font-bold tracking-[0.12em] uppercase">
                            Fokus
                          </span>
                        ) : null}
                      </span>
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
  pathname: string;
}

function MobileGroup({
  groupKey,
  label,
  links,
  openGroup,
  setOpenGroup,
  closeMenu,
  pathname,
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
                aria-current={pathname === link.href ? "page" : undefined}
                className="block min-h-12 rounded-md px-3 py-3 text-sm font-semibold text-white/85 underline-offset-4 transition hover:bg-white/10 hover:text-white hover:underline focus-visible:bg-white/10 aria-[current=page]:bg-white/10 aria-[current=page]:text-white"
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
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        mobileButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = mobilePanelRef.current;
      const toggle = mobileButtonRef.current;

      if (!panel || !toggle) {
        return;
      }

      const focusable = [
        toggle,
        ...Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ),
      ];
      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      mobilePanelRef.current?.querySelector<HTMLElement>("button, a[href]")?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(focusFrame);
    };
  }, [mobileOpen]);

  return (
    <header className="border-border-default/80 bg-background/96 sticky top-0 z-50 border-b shadow-[var(--shadow-sm)] backdrop-blur-xl">
      <div className="border-border-default/70 bg-brand-navy hidden border-b text-white lg:block">
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

      <div className="section-shell relative flex h-[4.75rem] items-center justify-between gap-5">
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
              className="text-brand-navy hover:text-brand-primary aria-[current=page]:text-brand-primary flex min-h-12 items-center px-2 text-[0.82rem] font-semibold underline-offset-8 transition hover:underline focus-visible:underline aria-[current=page]:underline"
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
          className="border-border-default text-brand-navy hover:border-brand-primary hover:text-brand-primary flex size-12 shrink-0 items-center justify-center rounded-xl border transition xl:hidden"
        >
          {mobileOpen ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </div>

      {mobileOpen ? (
        <div
          ref={mobilePanelRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Hauptnavigation"
          className="bg-brand-navy fixed inset-x-0 top-[4.75rem] h-[calc(100dvh-4.75rem)] overflow-y-auto lg:top-[7rem] lg:h-[calc(100dvh-7rem)] xl:hidden"
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
                pathname={pathname}
              />
              <MobileGroup
                groupKey="service"
                label="Service & Wartung"
                links={serviceLinks}
                openGroup={mobileGroup}
                setOpenGroup={setMobileGroup}
                closeMenu={() => setMobileOpen(false)}
                pathname={pathname}
              />
              {directLinks.map((link) => (
                <li key={link.href} className="border-b border-white/10">
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                    className="flex min-h-15 items-center py-4 font-semibold text-white underline-offset-4 hover:underline focus-visible:underline aria-[current=page]:underline"
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
