"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/admin", "Dashboard"],
  ["/admin/anfragen", "Anfragen"],
  ["/admin/bewerbungen", "Bewerbungen"],
  ["/admin/empfehlungen", "Empfehlungen"],
  ["/admin/faqs", "FAQs"],
  ["/admin/einstellungen", "Einstellungen"],
] as const;
export function AdminNavigation({ role }: { role: "admin" | "staff" }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Adminnavigation" className="overflow-x-auto border-t border-white/10">
      <div className="mx-auto flex max-w-7xl gap-1 px-4 py-2 sm:px-6">
        {items
          .filter(
            ([href]) => role === "admin" || !["/admin/faqs", "/admin/einstellungen"].includes(href),
          )
          .map(([href, label]) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${active ? "bg-white text-[var(--brand-primary)]" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                {label}
              </Link>
            );
          })}
      </div>
    </nav>
  );
}
