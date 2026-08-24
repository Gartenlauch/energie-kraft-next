import { DeleteLeadButton } from "./delete-lead-button";
import { updateLeadStatusAction } from "./actions";

import type { AdminLead } from "@/types/admin-lead";
import type { LeadStatus } from "@/types/lead";

export const STATUS_LABELS: Record<
  LeadStatus,
  string
> = {
  new: "Neu",
  in_progress: "In Bearbeitung",
  completed: "Erledigt",
  rejected: "Abgelehnt",
};

export function formatLeadDate(
  lead: AdminLead,
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

export function getStatusClassName(
  status: LeadStatus,
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

interface LeadWorkflowPanelProps {
  lead: AdminLead;
}

export function LeadWorkflowPanel({
  lead,
}: LeadWorkflowPanelProps) {
  const mail = lead.mail?.internal;

  return (
    <section className="rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-950">
        Bearbeitungsstatus
      </h3>

      <form
        action={updateLeadStatusAction}
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
            defaultValue={lead.status}
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
        <h4 className="text-sm font-semibold text-slate-900">
          E-Mail-Versand
        </h4>

        {mail ? (
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-slate-500">
                Status
              </dt>
              <dd
                className={
                  mail.status === "accepted"
                    ? "font-medium text-emerald-800"
                    : "font-medium text-red-700"
                }
              >
                {mail.status === "accepted"
                  ? "Von Mailgun angenommen"
                  : "Versand fehlgeschlagen"}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">
                Provider
              </dt>
              <dd className="font-medium text-slate-900">
                Mailgun
              </dd>
            </div>

            {mail.messageId ? (
              <div>
                <dt className="text-slate-500">
                  Message-ID
                </dt>
                <dd className="break-all font-mono text-xs text-slate-700">
                  {mail.messageId}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            Kein Mailstatus verfügbar.
          </p>
        )}
      </div>

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
          <DeleteLeadButton
            leadId={lead.id}
            leadName={`${lead.contact.firstName} ${lead.contact.lastName}`}
          />
        </div>
      </div>
    </section>
  );
}