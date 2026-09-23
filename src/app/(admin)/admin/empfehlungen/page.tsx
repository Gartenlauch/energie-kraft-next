import { requireStaffSession } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";
import {
  AdminEmptyState,
  AdminFilterChip,
  AdminMetricCard,
  AdminMetricGrid,
  AdminPageHeader,
  AdminStatusBadge,
  AdminToolbar,
  ADMIN_STATUS_LABELS,
} from "@/components/admin/admin-ui";
import { AdminRowCheckbox, AdminSelectionProvider } from "@/components/admin/admin-selection";
import { AdminSubmissionActions } from "@/components/admin/admin-submission-actions";
import { AdminActivityTimeline } from "@/components/admin/admin-activity-timeline";
import { DeleteSubmissionButton } from "@/components/admin/delete-submission-button";
import { SubmissionRealtimeRefresh } from "@/components/admin/submission-realtime-refresh";
import {
  countStatuses,
  isAdminSort,
  matchesSearchTerms,
  sortAdminItems,
  timestampMillis,
  type AdminSort,
} from "@/lib/admin/admin-view";
import { listReferralActivities, listReferrals } from "@/lib/submissions/referral-repository";
import { LEAD_STATUS_VALUES, type LeadStatus } from "@/types/lead";
import {
  bulkUpdateReferralStatusAction,
  deleteReferralAction,
  updateReferralStatusAction,
} from "./actions";

export const metadata: Metadata = { title: "Empfehlungen" };
export const dynamic = "force-dynamic";
type Params = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const isStatus = (v?: string): v is LeadStatus =>
  !!v && (LEAD_STATUS_VALUES as readonly string[]).includes(v);
function date(value: { toDate(): Date }) {
  try {
    return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(
      value.toDate(),
    );
  } catch {
    return "Nicht verfügbar";
  }
}

export default async function ReferralsAdminPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const session = await requireStaffSession();
  const [items, params] = await Promise.all([listReferrals(), searchParams]);
  const q = first(params.q)?.trim() ?? "";
  const status = first(params.filterStatus);
  const sortValue = first(params.sort);
  const sort: AdminSort = isAdminSort(sortValue) ? sortValue : "newest";
  const open = first(params.open);
  const filtered = sortAdminItems(
    items.filter(
      (item) =>
        (!isStatus(status) || item.status === status) &&
        matchesSearchTerms(
          q,
          item.referrer.firstName,
          item.referrer.lastName,
          item.referredCustomer.firstName,
          item.referredCustomer.lastName,
        ),
    ),
    sort,
    (item) => `${item.referrer.lastName} ${item.referrer.firstName}`,
    (item) => timestampMillis(item.createdAt),
  );
  const counts = countStatuses(items);
  const activities = await listReferralActivities(filtered.map((item) => item.id));
  const clearHref = (key: string) => {
    const next = new URLSearchParams();
    if (key !== "q" && q) next.set("q", q);
    if (key !== "filterStatus" && isStatus(status)) next.set("filterStatus", status);
    if (sort !== "newest") next.set("sort", sort);
    return `/admin/empfehlungen${next.size ? `?${next}` : ""}`;
  };
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
      <SubmissionRealtimeRefresh documentId="referrals" />
      <AdminPageHeader
        eyebrow="Empfehlungsprogramm"
        title="Empfehlungen"
        description="Empfehlungsgeber und empfohlene Personen gemeinsam bearbeiten."
        actions={
          <span className="rounded-lg border border-[var(--border-default)] bg-white px-4 py-2 text-sm text-[var(--text-muted)]">
            {items.length} Empfehlungen
          </span>
        }
      />
      {first(params.message) ? (
        <div
          role="status"
          className={`mb-6 rounded-xl border px-5 py-4 text-sm ${first(params.result) === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}
        >
          {first(params.message)}
        </div>
      ) : null}
      <AdminMetricGrid>
        <AdminMetricCard label="Gesamt" value={counts.total} href="/admin/empfehlungen" />
        <AdminMetricCard
          label="Neu"
          value={counts.new}
          href="/admin/empfehlungen?filterStatus=new"
          tone="new"
        />
        <AdminMetricCard
          label="Offen"
          value={counts.open}
          href="/admin/empfehlungen?filterStatus=in_progress"
          tone="progress"
        />
        <AdminMetricCard
          label="Erledigt"
          value={counts.completed}
          href="/admin/empfehlungen?filterStatus=completed"
          tone="success"
        />
      </AdminMetricGrid>
      <div className="mt-6">
        <AdminToolbar>
          <form className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
            <label className="text-sm font-semibold">
              Suche
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Name in beiden Bereichen"
                className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border-default)] px-3 font-normal"
              />
            </label>
            <label className="text-sm font-semibold">
              Status
              <select
                name="filterStatus"
                defaultValue={isStatus(status) ? status : ""}
                className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border-default)] bg-white px-3 font-normal"
              >
                <option value="">Alle Status</option>
                {LEAD_STATUS_VALUES.map((item) => (
                  <option key={item} value={item}>
                    {ADMIN_STATUS_LABELS[item]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Sortierung
              <select
                name="sort"
                defaultValue={sort}
                className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border-default)] bg-white px-3 font-normal"
              >
                <option value="newest">Neueste zuerst</option>
                <option value="oldest">Älteste zuerst</option>
                <option value="name_asc">Name A–Z</option>
                <option value="name_desc">Name Z–A</option>
              </select>
            </label>
            <button className="min-h-11 self-end rounded-lg bg-[var(--brand-primary)] px-5 text-sm font-semibold text-white">
              Anwenden
            </button>
          </form>
          {q || isStatus(status) ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {q ? <AdminFilterChip href={clearHref("q")}>Suche: {q}</AdminFilterChip> : null}
              {isStatus(status) ? (
                <AdminFilterChip href={clearHref("filterStatus")}>
                  Status: {ADMIN_STATUS_LABELS[status]}
                </AdminFilterChip>
              ) : null}
              <Link
                href="/admin/empfehlungen"
                className="inline-flex min-h-9 items-center px-2 text-xs font-semibold text-[var(--brand-primary)]"
              >
                Alle Filter zurücksetzen
              </Link>
            </div>
          ) : null}
        </AdminToolbar>
      </div>
      {filtered.length === 0 ? (
        <AdminEmptyState title="Keine Empfehlungen gefunden">
          Passen Sie Suche oder Filter an.
        </AdminEmptyState>
      ) : (
        <AdminSelectionProvider
          ids={filtered.map((item) => item.id)}
          action={bulkUpdateReferralStatusAction}
        >
          <div className="space-y-3">
            {filtered.map((item) => (
              <details
                key={item.id}
                open={open === item.id ? true : undefined}
                className="rounded-xl border border-[var(--border-default)] bg-white shadow-sm"
              >
                <summary className="grid min-h-20 cursor-pointer list-none gap-3 px-4 py-4 sm:grid-cols-[auto_1fr_1fr_auto_auto] sm:items-center">
                  <AdminRowCheckbox id={item.id} label={`Empfehlung ${item.id} markieren`} />
                  <span>
                    <span className="block text-xs text-[var(--text-muted)]">Empfehlungsgeber</span>
                    <strong className="text-[var(--brand-navy)]">
                      {item.referrer.firstName} {item.referrer.lastName}
                    </strong>
                  </span>
                  <span>
                    <span className="block text-xs text-[var(--text-muted)]">
                      Empfohlene Person
                    </span>
                    <strong className="text-[var(--brand-dark)]">
                      {item.referredCustomer.firstName} {item.referredCustomer.lastName}
                    </strong>
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{date(item.createdAt)}</span>
                  <AdminStatusBadge status={item.status} />
                </summary>
                <div className="border-t border-[var(--border-default)] p-5">
                  <div className="grid gap-7 lg:grid-cols-2">
                    <section>
                      <h2 className="font-semibold text-[var(--brand-navy)]">
                        Empfehlungsgeber:in
                      </h2>
                      <p className="mt-3 text-sm">
                        {item.referrer.firstName} {item.referrer.lastName}
                      </p>
                      <a
                        className="mt-2 block text-sm text-[var(--brand-primary)] underline"
                        href={`mailto:${item.referrer.email}`}
                      >
                        {item.referrer.email}
                      </a>
                    </section>
                    <section>
                      <h2 className="font-semibold text-[var(--brand-navy)]">Empfohlene Person</h2>
                      <p className="mt-3 text-sm">
                        {item.referredCustomer.firstName} {item.referredCustomer.lastName}
                      </p>
                      <a
                        className="mt-2 block text-sm text-[var(--brand-primary)] underline"
                        href={`mailto:${item.referredCustomer.email}`}
                      >
                        {item.referredCustomer.email}
                      </a>
                      {item.referredCustomer.phone ? (
                        <a
                          className="mt-2 block text-sm text-[var(--brand-primary)] underline"
                          href={`tel:${item.referredCustomer.phone}`}
                        >
                          {item.referredCustomer.phone}
                        </a>
                      ) : null}
                      <p className="mt-2 text-sm">
                        {item.referredCustomer.street}, {item.referredCustomer.postalCode}{" "}
                        {item.referredCustomer.city}
                      </p>
                    </section>
                  </div>
                  <div className="mt-7 grid gap-5 border-t border-[var(--border-default)] pt-5 lg:grid-cols-2">
                    <form
                      action={updateReferralStatusAction}
                      className="flex flex-wrap items-end gap-3"
                    >
                      <input type="hidden" name="id" value={item.id} />
                      <label className="text-sm font-semibold">
                        Status
                        <select
                          name="status"
                          defaultValue={item.status}
                          className="mt-2 block min-h-11 rounded-lg border border-[var(--border-default)] px-3"
                        >
                          {LEAD_STATUS_VALUES.map((value) => (
                            <option key={value} value={value}>
                              {ADMIN_STATUS_LABELS[value]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button className="min-h-11 rounded-lg bg-[var(--brand-primary)] px-5 text-sm font-semibold text-white">
                        Speichern
                      </button>
                    </form>
                    <AdminSubmissionActions
                      kind="referral"
                      id={item.id}
                      email={item.referrer.email}
                    />
                    <AdminActivityTimeline
                      activities={activities.get(item.id) ?? []}
                      createdAt={item.createdAt}
                    />
                    <div className="lg:col-span-2">
                      {session.role === "admin" ? <DeleteSubmissionButton
                        action={deleteReferralAction}
                        id={item.id}
                        label="Empfehlung löschen"
                        subject={`Empfehlung ${item.id}`}
                      /> : null}
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </AdminSelectionProvider>
      )}
    </main>
  );
}
