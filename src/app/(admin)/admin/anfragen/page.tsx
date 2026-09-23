import { requireStaffSession } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactLeadCard } from "./contact-lead-card";
import { ConfiguratorLeadCard } from "./configurator-lead-card";
import { LeadRealtimeRefresh } from "./lead-realtime-refresh";
import { bulkUpdateLeadStatusAction } from "./actions";
import { AdminActivityTimeline } from "@/components/admin/admin-activity-timeline";
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
import {
  countStatuses,
  isAdminSort,
  matchesSearchTerms,
  sortAdminItems,
  timestampMillis,
  type AdminSort,
} from "@/lib/admin/admin-view";
import { listLeadActivities, listLeads } from "@/lib/leads/lead-repository";
import {
  isAdminLeadFilterType,
  isContactAdminLead,
  isConfiguratorAdminLead,
  matchesAdminLeadFilter,
} from "@/types/admin-lead";
import { LEAD_STATUS_VALUES, type LeadStatus } from "@/types/lead";

export const metadata: Metadata = { title: "Anfragen" };
export const dynamic = "force-dynamic";
type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
const isStatus = (value?: string): value is LeadStatus =>
  !!value && (LEAD_STATUS_VALUES as readonly string[]).includes(value);
const date = (value: { toDate(): Date }) => {
  try {
    return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(
      value.toDate(),
    );
  } catch {
    return "Nicht verfügbar";
  }
};
const productLabels: Record<string, string> = {
  photovoltaic: "Photovoltaik",
  battery_storage: "Stromspeicher",
  heat_pump: "Wärmepumpe",
  climate: "Klimaanlage",
  wallbox: "Wallbox",
};

export default async function LeadAdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  await requireStaffSession();
  const [leads, parameters] = await Promise.all([listLeads(), searchParams]);
  const status = first(parameters.filterStatus);
  const type = first(parameters.filterType);
  const query = first(parameters.q)?.trim() ?? "";
  const sortValue = first(parameters.sort);
  const sort: AdminSort = isAdminSort(sortValue) ? sortValue : "newest";
  const open = first(parameters.open);
  const filtered = sortAdminItems(
    leads.filter(
      (lead) =>
        (!isStatus(status) || lead.status === status) &&
        (!isAdminLeadFilterType(type) || matchesAdminLeadFilter(lead, type)) &&
        matchesSearchTerms(query, lead.contact.firstName, lead.contact.lastName),
    ),
    sort,
    (lead) => `${lead.contact.lastName} ${lead.contact.firstName}`,
    (lead) => timestampMillis(lead.createdAt),
  );
  const activities = await listLeadActivities(filtered.map((lead) => lead.id));
  const counts = countStatuses(leads);
  const resetWithout = (key: string) => {
    const next = new URLSearchParams();
    if (key !== "q" && query) next.set("q", query);
    if (key !== "filterStatus" && isStatus(status)) next.set("filterStatus", status);
    if (key !== "filterType" && isAdminLeadFilterType(type)) next.set("filterType", type);
    if (sort !== "newest") next.set("sort", sort);
    return `/admin/anfragen${next.size ? `?${next}` : ""}`;
  };
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-10">
      <LeadRealtimeRefresh />
      <AdminPageHeader
        eyebrow="CRM"
        title="Anfragen"
        description="Kontakt- und Konfigurator-Anfragen kompakt prüfen, auswählen und bearbeiten."
        actions={
          <span className="rounded-lg border border-[var(--border-default)] bg-white px-4 py-2 text-sm text-[var(--text-muted)]">
            {leads.length} Anfragen
          </span>
        }
      />
      {first(parameters.message) ? (
        <div
          role="status"
          className={`mb-6 rounded-xl border px-5 py-4 text-sm ${first(parameters.result) === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}
        >
          {first(parameters.message)}
        </div>
      ) : null}
      <AdminMetricGrid>
        <AdminMetricCard label="Gesamt" value={counts.total} href="/admin/anfragen" />
        <AdminMetricCard
          label="Neu"
          value={counts.new}
          href="/admin/anfragen?filterStatus=new"
          tone="new"
        />
        <AdminMetricCard
          label="Offen"
          value={counts.open}
          href="/admin/anfragen?filterStatus=in_progress"
          tone="progress"
        />
        <AdminMetricCard
          label="Erledigt"
          value={counts.completed}
          href="/admin/anfragen?filterStatus=completed"
          tone="success"
        />
      </AdminMetricGrid>
      <div className="mt-6">
        <AdminToolbar>
          <form
            method="get"
            className="grid gap-3 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_1fr_auto]"
          >
            <label className="text-sm font-semibold text-[var(--brand-dark)]">
              Suche
              <input
                type="search"
                name="q"
                defaultValue={query}
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
              Produkt
              <select
                name="filterType"
                defaultValue={isAdminLeadFilterType(type) ? type : ""}
                className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border-default)] bg-white px-3 font-normal"
              >
                <option value="">Alle Produkte</option>
                <option value="contact">Kontaktformular</option>
                {Object.entries(productLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
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
            <button className="min-h-11 self-end rounded-lg bg-[var(--brand-primary)] px-5 text-sm font-semibold text-white hover:bg-[var(--brand-accent)]">
              Anwenden
            </button>
          </form>
          {query || isStatus(status) || isAdminLeadFilterType(type) ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {query ? (
                <AdminFilterChip href={resetWithout("q")}>Suche: {query}</AdminFilterChip>
              ) : null}
              {isStatus(status) ? (
                <AdminFilterChip href={resetWithout("filterStatus")}>
                  Status: {ADMIN_STATUS_LABELS[status]}
                </AdminFilterChip>
              ) : null}
              {isAdminLeadFilterType(type) ? (
                <AdminFilterChip href={resetWithout("filterType")}>
                  Produkt: {type === "contact" ? "Kontaktformular" : productLabels[type]}
                </AdminFilterChip>
              ) : null}
              <Link
                href="/admin/anfragen"
                className="inline-flex min-h-9 items-center px-2 text-xs font-semibold text-[var(--brand-primary)] hover:underline"
              >
                Alle Filter zurücksetzen
              </Link>
            </div>
          ) : null}
        </AdminToolbar>
      </div>
      {filtered.length === 0 ? (
        <AdminEmptyState title="Keine Anfragen gefunden">
          Passen Sie Suche oder Filter an.
        </AdminEmptyState>
      ) : (
        <AdminSelectionProvider
          ids={filtered.map((lead) => lead.id)}
          action={bulkUpdateLeadStatusAction}
        >
          <div className="space-y-3">
            {filtered.map((lead) => {
              const place = isContactAdminLead(lead)
                ? `${lead.location.postalCode} ${lead.location.city}`
                : `${lead.installation.postalCode} ${lead.installation.city}`;
              const products = isContactAdminLead(lead)
                ? lead.project.interests.join(", ")
                : lead.products.map((item) => productLabels[item]).join(", ");
              return (
                <details
                  key={lead.id}
                  open={open === lead.id ? true : undefined}
                  className="group overflow-hidden rounded-xl border border-[var(--border-default)] bg-white shadow-[0_8px_24px_rgba(9,20,51,0.04)]"
                >
                  <summary className="grid min-h-20 cursor-pointer list-none gap-3 px-4 py-4 hover:bg-[var(--surface-soft)] lg:grid-cols-[2.75rem_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,.8fr)_7rem_8rem] lg:items-center [&>*]:min-w-0 [&>*]:break-words">
                    <AdminRowCheckbox
                      id={lead.id}
                      label={`${lead.contact.firstName} ${lead.contact.lastName} markieren`}
                    />
                      <span>
                        <strong className="block text-[var(--brand-navy)]">
                          {lead.contact.firstName} {lead.contact.lastName}
                        </strong>
                        <span className="mt-1 block text-xs text-[var(--text-muted)]">
                          {lead.contact.email}
                        </span>
                        {isConfiguratorAdminLead(lead) && lead.publicReference ? (
                          <span className="mt-1 block font-mono text-xs font-semibold text-[var(--brand-primary)]">
                            {lead.publicReference}
                          </span>
                        ) : null}
                      </span>
                    <span className="text-sm text-[var(--brand-dark)]">{products}</span>
                    <span className="text-sm text-[var(--text-muted)]">{place}</span>
                    <span className="text-xs text-[var(--text-muted)]">{date(lead.createdAt)}</span>
                    <AdminStatusBadge status={lead.status} />
                  </summary>
                  <div className="border-t border-[var(--border-default)] bg-slate-50/50 p-3 sm:p-5">
                    {isContactAdminLead(lead) ? (
                      <ContactLeadCard lead={lead} />
                    ) : (
                      <ConfiguratorLeadCard lead={lead} />
                    )}
                    <div className="mt-4 grid gap-5 rounded-xl border border-[var(--border-default)] bg-white p-5 lg:grid-cols-2">
                      <AdminSubmissionActions
                        kind="lead"
                        id={lead.id}
                        email={lead.contact.email}
                        reference={isConfiguratorAdminLead(lead) ? lead.publicReference : undefined}
                        hasReport={isConfiguratorAdminLead(lead)}
                      />
                      <AdminActivityTimeline
                        activities={activities.get(lead.id) ?? []}
                        createdAt={lead.createdAt}
                      />
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </AdminSelectionProvider>
      )}
    </main>
  );
}
