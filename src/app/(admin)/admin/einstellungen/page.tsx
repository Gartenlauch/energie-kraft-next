import { requireAdminSession } from "@/lib/auth/session";
import Link from "next/link";
import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-ui";

export const metadata: Metadata = { title: "Einstellungen" };

const modules = [
  { href: "/admin/einstellungen/konfiguratoren", eyebrow: "Aktiv", title: "Konfigurator-Einstellungen", description: "Versionierte Modell-, Preis- und Wirtschaftlichkeitsparameter verwalten.", action: "Einstellungen öffnen" },
  { href: "/admin/einstellungen/benutzer", eyebrow: "Aktiv", title: "Benutzerverwaltung", description: "Zugänge, Rollen und Benutzerprofile verwalten.", action: "Benutzer verwalten" },
] as const;

export default async function SettingsPage() {
  await requireAdminSession();
  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10"><AdminPageHeader eyebrow="Administration" title="Einstellungen" description="Zentrale Konfiguration des internen Arbeitsbereichs." /><section className="grid gap-5 md:grid-cols-2">{modules.map((item) => {
    const content = <><p className="text-xs font-bold tracking-[0.15em] text-[var(--brand-accent)] uppercase">{item.eyebrow}</p><h2 className="mt-4 text-2xl font-semibold text-[var(--brand-navy)]">{item.title}</h2><p className="mt-3 min-h-14 text-sm leading-6 text-[var(--text-muted)]">{item.description}</p><span className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--brand-primary)]">{item.action}{item.href ? " →" : ""}</span></>;
    return <Link key={item.title} href={item.href} className="rounded-2xl border border-[var(--border-default)] bg-white p-6 shadow-[0_12px_35px_rgba(9,20,51,0.05)] transition hover:-translate-y-0.5 hover:border-[var(--brand-accent)]">{content}</Link>;
  })}</section></main>;
}
