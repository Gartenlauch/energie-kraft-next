import type { Metadata } from "next";
import Link from "next/link";

import { ContactLeadCard } from "./contact-lead-card";
import { LeadRealtimeRefresh } from "./lead-realtime-refresh";
import { PhotovoltaicConfiguratorLeadCard } from "./photovoltaic-configurator-lead-card";

import { listLeads } from "@/lib/leads/lead-repository";
import {
  isAdminLeadType,
  isContactAdminLead,
} from "@/types/admin-lead";
import {
  LEAD_STATUS_VALUES,
  type LeadStatus,
} from "@/types/lead";

export const metadata: Metadata = {
  title: "Anfragen",
};

export const dynamic =
  "force-dynamic";

interface LeadAdminPageProps {
  searchParams: Promise<
    Record<
      string,
      string | string[] | undefined
    >
  >;
}

function getFirstSearchParameter(
  value:
    | string
    | string[]
    | undefined,
): string | undefined {
  return Array.isArray(value)
    ? value[0]
    : value;
}

function isLeadStatus(
  value: string | undefined,
): value is LeadStatus {
  return (
    value !== undefined &&
    (
      LEAD_STATUS_VALUES as readonly string[]
    ).includes(value)
  );
}

export default async function LeadAdminPage({
  searchParams,
}: LeadAdminPageProps) {
  const [leads, parameters] =
    await Promise.all([
      listLeads(),
      searchParams,
    ]);

  const selectedStatus =
    getFirstSearchParameter(
      parameters.filterStatus,
    );

  const selectedType =
    getFirstSearchParameter(
      parameters.filterType,
    );

  const actionResult =
    getFirstSearchParameter(
      parameters.result,
    );

  const message =
    getFirstSearchParameter(
      parameters.message,
    );

  const filteredLeads =
    leads.filter((lead) => {
      if (
        isLeadStatus(
          selectedStatus,
        ) &&
        lead.status !== selectedStatus
      ) {
        return false;
      }

      if (
        isAdminLeadType(
          selectedType,
        ) &&
        lead.type !== selectedType
      ) {
        return false;
      }

      return true;
    });

  const newCount =
    leads.filter(
      (lead) =>
        lead.status === "new",
    ).length;

  const inProgressCount =
    leads.filter(
      (lead) =>
        lead.status ===
        "in_progress",
    ).length;

  const completedCount =
    leads.filter(
      (lead) =>
        lead.status ===
        "completed",
    ).length;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <LeadRealtimeRefresh />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <Link
            href="/admin"
            className="text-sm font-medium text-emerald-800 hover:underline"
          >
            ← Zurück zum Dashboard
          </Link>

          <h1 className="mt-3 text-3xl font-semibold text-slate-950">
            Anfragen
          </h1>

          <p className="mt-2 max-w-3xl text-slate-600">
            Eingehende Kontakt- und
            Konfigurator-Anfragen zentral
            prüfen und bearbeiten.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
          {leads.length}{" "}
          {leads.length === 1
            ? "Anfrage"
            : "Anfragen"}
        </div>
      </div>

      {message ? (
        <div
          role="status"
          className={
            actionResult === "success"
              ? "mb-8 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900"
              : "mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900"
          }
        >
          {message}
        </div>
      ) : null}

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Gesamt
          </p>

          <p className="mt-2 text-3xl font-semibold text-slate-950">
            {leads.length}
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm text-blue-700">
            Neu
          </p>

          <p className="mt-2 text-3xl font-semibold text-blue-950">
            {newCount}
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-700">
            In Bearbeitung
          </p>

          <p className="mt-2 text-3xl font-semibold text-amber-950">
            {inProgressCount}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-700">
            Erledigt
          </p>

          <p className="mt-2 text-3xl font-semibold text-emerald-950">
            {completedCount}
          </p>
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <form
          method="get"
          className="flex flex-wrap items-end gap-4"
        >
          <div>
            <label
              htmlFor="filter-status"
              className="block text-sm font-semibold text-slate-800"
            >
              Status
            </label>

            <select
              id="filter-status"
              name="filterStatus"
              defaultValue={
                isLeadStatus(
                  selectedStatus,
                )
                  ? selectedStatus
                  : ""
              }
              className="mt-2 min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="">
                Alle Status
              </option>

              <option value="new">
                Neu
              </option>

              <option value="in_progress">
                In Bearbeitung
              </option>

              <option value="completed">
                Erledigt
              </option>

              <option value="rejected">
                Abgelehnt
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-type"
              className="block text-sm font-semibold text-slate-800"
            >
              Anfrageart
            </label>

            <select
              id="filter-type"
              name="filterType"
              defaultValue={
                isAdminLeadType(
                  selectedType,
                )
                  ? selectedType
                  : ""
              }
              className="mt-2 min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="">
                Alle Anfragearten
              </option>

              <option value="contact">
                Kontaktformular
              </option>

              <option value="configurator">
                PV-Konfigurator
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="min-h-11 rounded-lg bg-slate-950 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Filtern
          </button>

          <Link
            href="/admin/anfragen"
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Zurücksetzen
          </Link>
        </form>
      </section>

      {filteredLeads.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">
            Keine Anfragen vorhanden
          </h2>

          <p className="mt-2 text-slate-600">
            Für den gewählten Filter wurden
            keine Anfragen gefunden.
          </p>
        </section>
      ) : (
        <div className="space-y-6">
          {filteredLeads.map(
            (lead) =>
              isContactAdminLead(
                lead,
              ) ? (
                <ContactLeadCard
                  key={lead.id}
                  lead={lead}
                />
              ) : (
                <PhotovoltaicConfiguratorLeadCard
                  key={lead.id}
                  lead={lead}
                />
              ),
          )}
        </div>
      )}
    </main>
  );
}