import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ADMIN_HOME_PATH } from "@/config/auth";
import { getAdminSession } from "@/lib/auth/session";

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
    await getAdminSession();

  if (existingSession) {
    redirect(ADMIN_HOME_PATH);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/5">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-wide text-emerald-800 uppercase">
            Energie-Kraft Süd
          </p>

          <h1 className="text-3xl font-semibold text-slate-950">
            Administration
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Melden Sie sich mit Ihrem
            freigeschalteten Administratorkonto
            an.
          </p>
        </div>

        <AdminLoginForm />
      </section>
    </main>
  );
}