import { requireStaffSession } from "@/lib/auth/session";
import Link from "next/link";
import {
  AdminMetricCard,
  AdminMiniDonut,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/admin/admin-ui";
import { countStatuses, timestampMillis } from "@/lib/admin/admin-view";
import { listFaqCategories } from "@/lib/faq/category-repository";
import { listFaqEntries } from "@/lib/faq/entry-repository";
import { listLeads } from "@/lib/leads/lead-repository";
import { listApplications } from "@/lib/submissions/application-repository";
import { listReferrals } from "@/lib/submissions/referral-repository";
import type { LeadStatus } from "@/types/lead";

export const dynamic = "force-dynamic";
const colors: Record<LeadStatus, string> = {
  new: "#3b82f6",
  in_progress: "#f59e0b",
  completed: "#10b981",
  rejected: "#94a3b8",
};

function OperationsPanel({
  title,
  href,
  counts,
}: {
  title: string;
  href: string;
  counts: ReturnType<typeof countStatuses>;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-white p-5 shadow-[0_12px_35px_rgba(9,20,51,0.05)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-[var(--brand-primary)] uppercase">
            Vorgänge
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--brand-navy)]">{title}</h2>
        </div>
        <AdminMiniDonut
          total={counts.total}
          label={`${title}: ${counts.total} gesamt`}
          values={Object.entries(colors).map(([status, color]) => ({
            value: counts[status as LeadStatus],
            color,
          }))}
        />
      </div>
      <div className="mt-5 grid grid-cols-3 divide-x divide-[var(--border-default)] border-y border-[var(--border-default)] py-4 text-center">
        <Link href={href} className="px-2">
          <strong className="block text-xl text-[var(--brand-navy)]">{counts.total}</strong>
          <span className="text-xs text-[var(--text-muted)]">Gesamt</span>
        </Link>
        <Link href={`${href}?filterStatus=new`} className="px-2">
          <strong className="block text-xl text-blue-700">{counts.new}</strong>
          <span className="text-xs text-[var(--text-muted)]">Neu</span>
        </Link>
        <Link href={`${href}?filterStatus=in_progress`} className="px-2">
          <strong className="block text-xl text-amber-700">{counts.open}</strong>
          <span className="text-xs text-[var(--text-muted)]">Offen</span>
        </Link>
      </div>
      <Link
        href={href}
        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--brand-primary)] hover:underline"
      >
        {title} bearbeiten →
      </Link>
    </section>
  );
}

function formatDate(value: { toDate(): Date }) {
  try {
    return new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" }).format(
      value.toDate(),
    );
  } catch {
    return "Nicht verfügbar";
  }
}

export default async function AdminPage() {
  const session = await requireStaffSession();
  const [leads, applications, referrals, faqs, categories] = await Promise.all([
    listLeads(),
    listApplications(),
    listReferrals(),
    session.role === "admin" ? listFaqEntries() : [],
    session.role === "admin" ? listFaqCategories() : [],
  ]);
  const leadCounts = countStatuses(leads);
  const applicationCounts = countStatuses(applications);
  const referralCounts = countStatuses(referrals);
  const published = faqs.filter((faq) => faq.isPublished).length;
  const recent = [
    ...leads.map((lead) => ({
      id: lead.id,
      type: "Anfrage",
      name: `${lead.contact.firstName} ${lead.contact.lastName}`,
      status: lead.status,
      createdAt: lead.createdAt,
      href: `/admin/anfragen?open=${lead.id}`,
    })),
    ...applications.map((item) => ({
      id: item.id,
      type: "Bewerbung",
      name: `${item.firstName} ${item.lastName}`,
      status: item.status,
      createdAt: item.createdAt,
      href: `/admin/bewerbungen?open=${item.id}`,
    })),
    ...referrals.map((item) => ({
      id: item.id,
      type: "Empfehlung",
      name: `${item.referrer.firstName} ${item.referrer.lastName}`,
      status: item.status,
      createdAt: item.createdAt,
      href: `/admin/empfehlungen?open=${item.id}`,
    })),
  ]
    .sort((a, b) => timestampMillis(b.createdAt) - timestampMillis(a.createdAt))
    .slice(0, 8);
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
      <AdminPageHeader
        eyebrow="Übersicht"
        title="Dashboard"
        description="Aktuelle Eingänge und Inhalte auf einen Blick."
      />
      <section className="grid gap-5 xl:grid-cols-2">
        <OperationsPanel title="Anfragen" href="/admin/anfragen" counts={leadCounts} />
        <OperationsPanel title="Bewerbungen" href="/admin/bewerbungen" counts={applicationCounts} />
        <OperationsPanel title="Empfehlungen" href="/admin/empfehlungen" counts={referralCounts} />
        {session.role === "admin" ? <section className="rounded-2xl border border-[var(--border-default)] bg-white p-5 shadow-[0_12px_35px_rgba(9,20,51,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-[var(--brand-primary)] uppercase">
                Inhalte
              </p>
              <h2 className="mt-1 text-xl font-semibold text-[var(--brand-navy)]">FAQs</h2>
            </div>
            <AdminMiniDonut
              total={faqs.length}
              label={`${faqs.length} FAQs`}
              values={[
                { value: published, color: "#005ca9" },
                { value: faqs.length - published, color: "#cbd5e1" },
              ]}
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <AdminMetricCard label="Gesamt" value={faqs.length} href="/admin/faqs" />
            <AdminMetricCard
              label="Veröffentlicht"
              value={published}
              href="/admin/faqs?filterStatus=published"
              tone="success"
            />
            <AdminMetricCard
              label="Entwürfe"
              value={faqs.length - published}
              href="/admin/faqs?filterStatus=draft"
            />
            <AdminMetricCard
              label="Kategorien"
              value={categories.length}
              href="/admin/faqs/categories"
            />
          </div>
        </section> : null}
      </section>
      <section className="mt-7 overflow-hidden rounded-2xl border border-[var(--border-default)] bg-white shadow-[0_12px_35px_rgba(9,20,51,0.05)]">
        <div className="border-b border-[var(--border-default)] px-5 py-4">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Zuletzt eingegangen</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Die jüngsten Vorgänge aus allen Eingangsbereichen.
          </p>
        </div>
        <ul className="divide-y divide-[var(--border-default)]">
          {recent.map((item) => (
            <li key={`${item.type}-${item.id}`}>
              <Link
                href={item.href}
                className="grid min-h-16 gap-2 px-5 py-4 hover:bg-[var(--surface-soft)] sm:grid-cols-[8rem_1fr_auto_auto] sm:items-center"
              >
                <span className="text-xs font-bold tracking-wide text-[var(--brand-primary)] uppercase">
                  {item.type}
                </span>
                <span className="font-semibold text-[var(--brand-dark)]">{item.name}</span>
                <span className="text-xs text-[var(--text-muted)]">
                  {formatDate(item.createdAt)}
                </span>
                <AdminStatusBadge status={item.status} />
              </Link>
            </li>
          ))}
        </ul>
        {recent.length === 0 ? (
          <p className="p-8 text-center text-sm text-[var(--text-muted)]">
            Noch keine Vorgänge vorhanden.
          </p>
        ) : null}
      </section>
    </main>
  );
}
