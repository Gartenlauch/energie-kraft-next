import type { Metadata } from "next";
import Link from "next/link";
import { DeleteContactLeadButton } from "./delete-contact-lead-button";
import { listContactLeads } from "@/lib/leads/contact-lead-repository";
import { ContactLeadRealtimeRefresh } from "./contact-lead-realtime-refresh";
import type {
  ContactInterest,
  ContactLead,
  ContactLeadStatus,
} from "@/types/contact-lead";

import { updateContactLeadStatusAction } from "./actions";

export const metadata: Metadata = {
  title: "Anfragen",
};

export const dynamic = "force-dynamic";

interface ContactLeadAdminPageProps {
  searchParams: Promise<
    Record<
      string,
      string | string[] | undefined
    >
  >;
}

const STATUS_LABELS: Record<
  ContactLeadStatus,
  string
> = {
  new: "Neu",
  in_progress: "In Bearbeitung",
  completed: "Erledigt",
  rejected: "Abgelehnt",
};

const INTEREST_LABELS: Record<
  ContactInterest,
  string
> = {
  photovoltaik: "Photovoltaik",
  stromspeicher: "Stromspeicher",
  wallbox: "Wallbox",
  klimaanlage: "Klimaanlage",
  waermepumpe: "Wärmepumpe",
  sonstiges: "Sonstiges",
};

const BUILDING_TYPE_LABELS = {
  einfamilienhaus: "Einfamilienhaus",
  mehrfamilienhaus: "Mehrfamilienhaus",
  gewerbe: "Gewerbe",
  sonstiges: "Sonstiges",
} as const;

const OWNERSHIP_LABELS = {
  eigentuemer: "Eigentümer",
  mieter: "Mieter",
  sonstiges: "Sonstiges",
} as const;

const CONTACT_PREFERENCE_LABELS = {
  telefon: "Telefon",
  email: "E-Mail",
  egal: "Keine Präferenz",
} as const;

function getFirstSearchParameter(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value)
    ? value[0]
    : value;
}

function isContactLeadStatus(
  value: string | undefined,
): value is ContactLeadStatus {
  return (
    value === "new" ||
    value === "in_progress" ||
    value === "completed" ||
    value === "rejected"
  );
}

function formatDate(
  lead: ContactLead,
): string {
  try {
    return new Intl.DateTimeFormat(
      "de-DE",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(lead.createdAt.toDate());
  } catch {
    return "Zeitpunkt nicht verfügbar";
  }
}

function getStatusClassName(
  status: ContactLeadStatus,
): string {
  switch (status) {
    case "new":
      return "border-blue-200 bg-blue-50 text-blue-800";

    case "in_progress":
      return "border-amber-200 bg-amber-50 text-amber-800";

    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";

    case "rejected":
      return "border-slate-300 bg-slate-100 text-slate-700";
  }
}

export default async function ContactLeadAdminPage({
  searchParams,
}: ContactLeadAdminPageProps) {
  const [leads, parameters] =
    await Promise.all([
      listContactLeads(),
      searchParams,
    ]);

  const selectedStatus =
    getFirstSearchParameter(
      parameters.filterStatus,
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
    isContactLeadStatus(selectedStatus)
      ? leads.filter(
        (lead) =>
          lead.status === selectedStatus,
      )
      : leads;

  const newCount = leads.filter(
    (lead) => lead.status === "new",
  ).length;

  const inProgressCount = leads.filter(
    (lead) =>
      lead.status === "in_progress",
  ).length;

  const completedCount = leads.filter(
    (lead) =>
      lead.status === "completed",
  ).length;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <ContactLeadRealtimeRefresh />
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
            Eingehende Projekt- und
            Kontaktanfragen zentral prüfen und
            bearbeiten.
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
                isContactLeadStatus(
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
              defaultValue="contact"
              className="mt-2 min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            >
              <option value="contact">
                Kontaktformular
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
          {filteredLeads.map((lead) => (
            <article
              key={lead.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-slate-950">
                      {lead.contact.firstName}{" "}
                      {lead.contact.lastName}
                    </h2>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
                        lead.status,
                      )}`}
                    >
                      {
                        STATUS_LABELS[
                        lead.status
                        ]
                      }
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Eingegangen:{" "}
                    {formatDate(lead)}
                  </p>

                  <p className="mt-1 font-mono text-xs text-slate-400">
                    {lead.id}
                  </p>
                </div>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Kontaktformular
                </span>
              </div>

              <div className="grid gap-8 p-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="space-y-7">
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Kontaktdaten
                    </h3>

                    <dl className="mt-4 space-y-3 text-sm">
                      {lead.contact.company ? (
                        <div>
                          <dt className="text-slate-500">
                            Firma
                          </dt>

                          <dd className="font-medium text-slate-900">
                            {
                              lead.contact
                                .company
                            }
                          </dd>
                        </div>
                      ) : null}

                      <div>
                        <dt className="text-slate-500">
                          E-Mail
                        </dt>

                        <dd>
                          <a
                            href={`mailto:${lead.contact.email}`}
                            className="font-medium text-emerald-800 hover:underline"
                          >
                            {
                              lead.contact
                                .email
                            }
                          </a>
                        </dd>
                      </div>

                      {lead.contact.phone ? (
                        <div>
                          <dt className="text-slate-500">
                            Telefon
                          </dt>

                          <dd>
                            <a
                              href={`tel:${lead.contact.phone}`}
                              className="font-medium text-emerald-800 hover:underline"
                            >
                              {
                                lead.contact
                                  .phone
                              }
                            </a>
                          </dd>
                        </div>
                      ) : null}

                      <div>
                        <dt className="text-slate-500">
                          Ort
                        </dt>

                        <dd className="font-medium text-slate-900">
                          {
                            lead.location
                              .postalCode
                          }{" "}
                          {lead.location.city}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-slate-500">
                          Bevorzugter Kontakt
                        </dt>

                        <dd className="font-medium text-slate-900">
                          {
                            CONTACT_PREFERENCE_LABELS[
                            lead
                              .preferredContact
                            ]
                          }
                        </dd>
                      </div>
                    </dl>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Projekt
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {lead.project.interests.map(
                        (interest) => (
                          <span
                            key={interest}
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                          >
                            {
                              INTEREST_LABELS[
                              interest
                              ]
                            }
                          </span>
                        ),
                      )}
                    </div>

                    <dl className="mt-4 space-y-3 text-sm">
                      {lead.project
                        .buildingType ? (
                        <div>
                          <dt className="text-slate-500">
                            Gebäudetyp
                          </dt>

                          <dd className="font-medium text-slate-900">
                            {
                              BUILDING_TYPE_LABELS[
                              lead
                                .project
                                .buildingType
                              ]
                            }
                          </dd>
                        </div>
                      ) : null}

                      {lead.project
                        .ownership ? (
                        <div>
                          <dt className="text-slate-500">
                            Nutzung /
                            Eigentum
                          </dt>

                          <dd className="font-medium text-slate-900">
                            {
                              OWNERSHIP_LABELS[
                              lead
                                .project
                                .ownership
                              ]
                            }
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </section>
                </div>

                <div className="space-y-7">
                  <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Nachricht
                    </h3>

                    <p className="mt-4 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-800">
                      {lead.message}
                    </p>
                  </section>

                  <section className="rounded-xl border border-slate-200 p-5">
                    <h3 className="font-semibold text-slate-950">
                      Bearbeitungsstatus
                    </h3>

                    <form
                      action={
                        updateContactLeadStatusAction
                      }
                      className="mt-4 flex flex-wrap items-end gap-3"
                    >
                      <input
                        type="hidden"
                        name="id"
                        value={lead.id}
                      />

                      <div className="min-w-52 flex-1">
                        <label
                          htmlFor={`status-${lead.id}`}
                          className="block text-sm font-medium text-slate-700"
                        >
                          Status
                        </label>

                        <select
                          id={`status-${lead.id}`}
                          name="status"
                          defaultValue={
                            lead.status
                          }
                          className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                        >
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

                      <button
                        type="submit"
                        className="min-h-11 rounded-lg bg-emerald-800 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Status speichern
                      </button>
                    </form>
                    <div className="mt-6 border-t border-slate-200 pt-5">
                      <p className="text-sm font-semibold text-red-800">
                        Anfrage endgültig löschen
                      </p>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                        Beim Löschen werden die gespeicherten
                        personenbezogenen Daten dieser Anfrage
                        dauerhaft aus Firestore entfernt. Diese
                        Aktion kann nicht rückgängig gemacht werden.
                      </p>

                      <div className="mt-4">
                        <DeleteContactLeadButton
                          leadId={lead.id}
                          leadName={`${lead.contact.firstName} ${lead.contact.lastName}`}
                        />
                      </div>
                    </div>
                  </section>

                  <section className="text-xs leading-5 text-slate-500">
                    Datenschutz wurde bei
                    Übermittlung der Anfrage
                    bestätigt.
                  </section>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}