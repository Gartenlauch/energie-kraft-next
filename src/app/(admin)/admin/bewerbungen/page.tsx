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
import { listApplications } from "@/lib/submissions/application-repository";
import { LEAD_STATUS_VALUES, type LeadStatus } from "@/types/lead";
import {
  bulkUpdateApplicationStatusAction,
  deleteApplicationAction,
  updateApplicationStatusAction,
} from "./actions";

export const metadata: Metadata = { title: "Bewerbungen" };
export const dynamic = "force-dynamic";
type Params = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const isStatus = (v?: string): v is LeadStatus =>
  !!v && (LEAD_STATUS_VALUES as readonly string[]).includes(v);
function formatDate(value: { toDate(): Date }) {
  try {
    return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(
      value.toDate(),
    );
  } catch {
    return "Nicht verfügbar";
  }
}

export default async function ApplicationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const session = await requireStaffSession();
  const [applications, params] = await Promise.all([listApplications(), searchParams]);
  const q = first(params.q)?.trim() ?? "";
  const status = first(params.filterStatus);
  const sortValue = first(params.sort);
  const sort: AdminSort = isAdminSort(sortValue) ? sortValue : "newest";
  const open = first(params.open);
  const filtered = sortAdminItems(
    applications.filter(
      (item) =>
        (!isStatus(status) || item.status === status) &&
        matchesSearchTerms(q, item.firstName, item.lastName),
    ),
    sort,
    (item) => `${item.lastName} ${item.firstName}`,
    (item) => timestampMillis(item.createdAt),
  );
  const counts = countStatuses(applications);
  const clearHref = (key: string) => {
    const next = new URLSearchParams();
    if (key !== "q" && q) next.set("q", q);
    if (key !== "filterStatus" && isStatus(status)) next.set("filterStatus", status);
    if (sort !== "newest") next.set("sort", sort);
    return `/admin/bewerbungen${next.size ? `?${next}` : ""}`;
  };
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
      <SubmissionRealtimeRefresh documentId="applications" />
      <AdminPageHeader
        eyebrow="Personal"
        title="Bewerbungen"
        description="Bewerbungseingänge strukturiert prüfen und sicher bearbeiten."
        actions={
          <span className="rounded-lg border border-[var(--border-default)] bg-white px-4 py-2 text-sm text-[var(--text-muted)]">
            {applications.length} Eingänge
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
        <AdminMetricCard label="Gesamt" value={counts.total} href="/admin/bewerbungen" />
        <AdminMetricCard
          label="Neu"
          value={counts.new}
          href="/admin/bewerbungen?filterStatus=new"
          tone="new"
        />
        <AdminMetricCard
          label="Offen"
          value={counts.open}
          href="/admin/bewerbungen?filterStatus=in_progress"
          tone="progress"
        />
        <AdminMetricCard
          label="Erledigt"
          value={counts.completed}
          href="/admin/bewerbungen?filterStatus=completed"
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
                placeholder="Vor- oder Nachname"
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
                href="/admin/bewerbungen"
                className="inline-flex min-h-9 items-center px-2 text-xs font-semibold text-[var(--brand-primary)]"
              >
                Alle Filter zurücksetzen
              </Link>
            </div>
          ) : null}
        </AdminToolbar>
      </div>
      {filtered.length === 0 ? (
        <AdminEmptyState title="Keine Bewerbungen gefunden">
          Passen Sie Suche oder Filter an.
        </AdminEmptyState>
      ) : (
        <AdminSelectionProvider
          ids={filtered.map((item) => item.id)}
          action={bulkUpdateApplicationStatusAction}
        >
          <div className="space-y-3">
            {filtered.map((application) => (
              <details
                key={application.id}
                open={open === application.id ? true : undefined}
                className="rounded-xl border border-[var(--border-default)] bg-white shadow-sm"
              >
                <summary className="grid min-h-20 cursor-pointer list-none gap-3 px-4 py-4 sm:grid-cols-[auto_1fr_1fr_auto_auto] sm:items-center">
                  <AdminRowCheckbox
                    id={application.id}
                    label={`${application.firstName} ${application.lastName} markieren`}
                  />
                  <span>
                    <strong className="block text-[var(--brand-navy)]">
                      {application.firstName} {application.lastName}
                    </strong>
                    <span className="text-xs text-[var(--text-muted)]">{application.email}</span>
                  </span>
                  <span className="text-sm text-[var(--brand-dark)]">{application.jobTitle}</span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {formatDate(application.createdAt)}
                  </span>
                  <AdminStatusBadge status={application.status} />
                </summary>
                <div className="border-t border-[var(--border-default)] p-5">
                  <div className="grid gap-7 lg:grid-cols-2">
                    <section>
                      <h2 className="font-semibold text-[var(--brand-navy)]">Kontaktdaten</h2>
                      <p className="mt-3 text-sm">
                        {application.street}, {application.postalCode} {application.city}
                      </p>
                      <a
                        className="mt-2 block text-sm text-[var(--brand-primary)] underline"
                        href={`mailto:${application.email}`}
                      >
                        {application.email}
                      </a>
                      <a
                        className="mt-2 block text-sm text-[var(--brand-primary)] underline"
                        href={`tel:${application.phone}`}
                      >
                        {application.phone}
                      </a>
                    </section>
                    <section>
                      <h2 className="font-semibold text-[var(--brand-navy)]">
                        Qualifikation / Erfahrung
                      </h2>
                      <p className="mt-3 text-sm leading-7 whitespace-pre-wrap">
                        {application.qualificationExperience}
                      </p>
                    </section>
                  </div>
                  <section className="mt-7 border-t border-[var(--border-default)] pt-5">
                    <h2 className="font-semibold text-[var(--brand-navy)]">Bewerbungsunterlagen</h2>
                    {application.uploadState && application.uploadState !== "ready" ? (
                      <p className="mt-3 text-sm text-amber-900" role="status">
                        Uploadstatus: {application.uploadState}. Unterlagen sind gegebenenfalls noch
                        nicht vollständig verfügbar.
                      </p>
                    ) : null}
                    <ul className="mt-3 divide-y divide-[var(--border-default)]">
                      {(application.documents ?? []).map((document) => (
                        <li
                          key={document.id}
                          className="flex flex-wrap items-center justify-between gap-3 py-3"
                        >
                          <span className="text-sm break-all">
                            <strong className="block font-medium">{document.name}</strong>
                            <span className="text-xs text-[var(--text-muted)]">
                              {document.contentType} ·{" "}
                              {(document.size / 1_000_000).toLocaleString("de-DE", {
                                maximumFractionDigits: 2,
                              })}{" "}
                              MB
                            </span>
                          </span>
                          {application.uploadState === "ready" && document.uploadedAt ? (
                            <a
                              href={`/api/admin/applications/${application.id}/documents/${document.id}`}
                              className="inline-flex min-h-11 items-center text-sm text-[var(--brand-primary)] underline"
                            >
                              Herunterladen
                            </a>
                          ) : (
                            <span className="text-xs text-[var(--text-muted)]">
                              Nicht verfügbar
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                    {!application.documents?.length ? (
                      <p className="mt-3 text-sm text-[var(--text-muted)]">
                        Keine Unterlagen beigefügt.
                      </p>
                    ) : null}
                  </section>
                  <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-t border-[var(--border-default)] pt-5">
                    <form
                      action={updateApplicationStatusAction}
                      className="flex flex-wrap items-end gap-3"
                    >
                      <input type="hidden" name="id" value={application.id} />
                      <label className="text-sm font-semibold">
                        Status
                        <select
                          name="status"
                          defaultValue={application.status}
                          className="mt-2 block min-h-11 rounded-lg border border-[var(--border-default)] px-3"
                        >
                          {LEAD_STATUS_VALUES.map((item) => (
                            <option key={item} value={item}>
                              {ADMIN_STATUS_LABELS[item]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button className="min-h-11 rounded-lg bg-[var(--brand-primary)] px-5 text-sm font-semibold text-white">
                        Speichern
                      </button>
                    </form>
                    <div className="text-right">
                      <p className="mb-3 text-xs text-[var(--text-muted)]">
                        Interne Mail: {application.mail?.internal?.status ?? "offen"} · Autoreply:{" "}
                        {application.mail?.applicant?.status ?? "offen"}
                      </p>
                      {session.role === "admin" ? <DeleteSubmissionButton
                        action={deleteApplicationAction}
                        id={application.id}
                        label="Bewerbung löschen"
                        subject={`Bewerbung von ${application.firstName} ${application.lastName}`}
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
