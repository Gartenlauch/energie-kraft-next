import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

import { requireStaffSession } from "@/lib/auth/session";

import { AdminLogoutButton } from "./admin-logout-button";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { AdminAvatar } from "@/components/admin/admin-avatar";

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
    await requireStaffSession();

  return (
    <div className="min-h-screen bg-[var(--surface-soft)]">
      <header className="bg-[var(--brand-navy)] text-white shadow-[0_8px_30px_rgba(9,20,51,0.16)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/admin" className="flex min-w-0 items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            <span className="rounded-lg bg-white px-3 py-2"><Image src="/brand/energie-kraft/eksued-logo-kompakt-website.svg" alt="Energie-Kraft Süd" width={132} height={38} priority /></span>
            <span className="hidden border-l border-white/20 pl-4 text-sm font-semibold tracking-wide sm:block">Administration</span>
          </Link>

          <div className="flex items-center gap-5">
            <AdminAvatar uid={session.uid} name={session.displayName ?? session.email ?? "Benutzer"} photo={session.photo} />
            <div className="hidden text-right sm:block">
              <p className="text-xs text-white/60">
                {session.role === "admin" ? "Administrator" : "Mitarbeiter"}
              </p>

              <p className="max-w-56 truncate text-sm font-medium text-white">
                {session.displayName ?? session.email ??
                  session.uid}
              </p>
            </div>

            <AdminLogoutButton />
          </div>
        </div>
        <AdminNavigation role={session.role} />
      </header>

      {children}
    </div>
  );
}
