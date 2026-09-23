import { requireAdminSession } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";

import { getCurrentConfiguratorSettings } from "@/lib/configurator/settings-repository";

import { ConfiguratorSettingsForm } from "./settings-form";

export const metadata: Metadata = { title: "Konfigurator-Einstellungen" };
export const dynamic = "force-dynamic";

export default async function ConfiguratorSettingsPage({ searchParams }: { searchParams: Promise<{ status?: string; version?: string; message?: string }> }) {
  await requireAdminSession();
  const [settings, parameters] = await Promise.all([getCurrentConfiguratorSettings(), searchParams]);
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <Link href="/admin/einstellungen" className="text-sm font-semibold text-[var(--brand-primary)] hover:underline">← Einstellungen</Link>
      <div className="mt-3 mb-8"><p className="text-sm font-semibold text-[var(--brand-primary)]">Einstellungen</p><h1 className="mt-1 text-3xl font-semibold text-[var(--brand-navy)]">Konfiguratoren</h1><p className="mt-2 max-w-3xl text-slate-600">Zentrale Preis-, Wirtschafts- und Modellannahmen für Rechner, Konfiguratoren und Projektanalysen.</p></div>
      {parameters.status === "success" ? <p role="status" className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">Modellversion {parameters.version} wurde atomar gespeichert.</p> : null}
      {parameters.status === "error" ? <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900">{parameters.message ?? "Die Einstellungen konnten nicht gespeichert werden."}</p> : null}
      <ConfiguratorSettingsForm initialSettings={settings} />
    </main>
  );
}
