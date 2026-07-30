import type { Metadata } from "next";
import type { ReactNode } from "react";

import { requireAdminSession } from "@/lib/auth/session";

import { AdminLogoutButton } from "./admin-logout-button";

export const metadata: Metadata = {
  title: {
    default: "Administration",
    template: "%s | Administration",
  },

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    noimageindex: true,
  },
};

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const session =
    await requireAdminSession();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              Energie-Kraft Süd
            </p>

            <p className="text-lg font-semibold text-slate-950">
              Administration
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-500">
                Angemeldet als
              </p>

              <p className="text-sm font-medium text-slate-800">
                {session.email ??
                  session.uid}
              </p>
            </div>

            <AdminLogoutButton />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}