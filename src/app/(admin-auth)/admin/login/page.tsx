import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";

import { ADMIN_HOME_PATH } from "@/config/auth";
import { getStaffSession } from "@/lib/auth/session";

import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin-Anmeldung",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    noimageindex: true,
  },
};

export default async function AdminLoginPage() {
  const existingSession =
    await getStaffSession();

  if (existingSession) {
    redirect(ADMIN_HOME_PATH);
  }

  return (
    <main className="grid min-h-screen bg-[var(--surface-soft)] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[var(--brand-navy)] p-14 text-white lg:flex lg:flex-col lg:justify-between">
        <Image src="/brand/energie-kraft/eksued-signet-website.svg" alt="" width={620} height={620} className="pointer-events-none absolute -right-32 -bottom-28 opacity-[0.08] brightness-0 invert" />
        <Image src="/brand/energie-kraft/eksued-logo-website.svg" alt="Energie-Kraft Süd" width={250} height={76} className="rounded-xl bg-white px-5 py-4" priority />
        <div className="relative max-w-xl"><p className="text-sm font-bold tracking-[0.18em] text-[var(--brand-accent)] uppercase">Interner Arbeitsbereich</p><h1 className="mt-5 text-5xl leading-tight font-semibold">Energieprojekte klar im Blick.</h1><p className="mt-5 max-w-lg text-lg leading-8 text-white/70">Anfragen, Bewerbungen, Empfehlungen und Inhalte sicher an einem Ort bearbeiten.</p></div>
      </section>
      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-default)] bg-white p-7 shadow-[0_24px_70px_rgba(9,20,51,0.12)] sm:p-9">
        <Image src="/brand/energie-kraft/eksued-logo-website.svg" alt="Energie-Kraft Süd" width={210} height={64} className="mb-9 lg:hidden" priority />
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-wide text-[var(--brand-primary)] uppercase">
            Sicherer Zugang
          </p>

          <h1 className="text-3xl font-semibold text-[var(--brand-navy)]">
            Administration
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Melden Sie sich mit Ihrem
            freigeschalteten Administratorkonto
            an.
          </p>
        </div>

        <AdminLoginForm />
      </div></section>
    </main>
  );
}
