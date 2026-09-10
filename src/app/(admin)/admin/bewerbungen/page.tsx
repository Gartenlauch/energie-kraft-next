import type { Metadata } from "next";
import Link from "next/link";

import { DeleteSubmissionButton } from "@/components/admin/delete-submission-button";
import { SubmissionRealtimeRefresh } from "@/components/admin/submission-realtime-refresh";
import { listApplications } from "@/lib/submissions/application-repository";
import { LEAD_STATUS_VALUES, type LeadStatus } from "@/types/lead";

import { deleteApplicationAction, updateApplicationStatusAction } from "./actions";

export const metadata: Metadata = { title: "Bewerbungen" };
export const dynamic = "force-dynamic";

const statusLabels: Record<LeadStatus, string> = {
  new: "Neu",
  in_progress: "In Bearbeitung",
  completed: "Erledigt",
  rejected: "Abgelehnt",
};

function formatDate(value: { toDate(): Date }) {
  try { return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(value.toDate()); }
  catch { return "Zeitpunkt nicht verfügbar"; }
}

export default async function ApplicationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [applications, parameters] = await Promise.all([listApplications(), searchParams]);
  const result = Array.isArray(parameters.result) ? parameters.result[0] : parameters.result;
  const message = Array.isArray(parameters.message) ? parameters.message[0] : parameters.message;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <SubmissionRealtimeRefresh documentId="applications" />
      <Link href="/admin" className="text-sm font-medium text-emerald-800 hover:underline">← Dashboard</Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Bewerbungen</h1>
          <p className="mt-2 text-slate-600">Eingänge prüfen, bearbeiten und datenschutzgerecht löschen.</p>
        </div>
        <p className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">{applications.length} Eingänge</p>
      </div>

      {message ? (
        <div role="status" className={`mt-7 border px-5 py-4 text-sm ${result === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}>{message}</div>
      ) : null}

      <div className="mt-8 space-y-5">
        {applications.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">Noch keine Bewerbungen vorhanden.</p>
        ) : applications.map((application) => (
          <details key={application.id} className="group rounded-xl border border-slate-200 bg-white shadow-sm">
            <summary className="grid min-h-16 cursor-pointer list-none gap-3 px-5 py-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
              <span><span className="block font-semibold text-slate-950">{application.firstName} {application.lastName}</span><span className="text-sm text-slate-500">{formatDate(application.createdAt)}</span></span>
              <span className="text-sm font-medium text-slate-700">{application.jobTitle}</span>
              <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700">{statusLabels[application.status]}</span>
            </summary>
            <div className="border-t border-slate-200 p-5 lg:p-7">
              <div className="grid gap-8 lg:grid-cols-2">
                <section>
                  <h2 className="font-semibold text-slate-950">Kontaktdaten</h2>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div><dt className="text-slate-500">Adresse</dt><dd>{application.street}, {application.postalCode} {application.city}</dd></div>
                    <div><dt className="text-slate-500">E-Mail</dt><dd><a className="text-emerald-800 underline" href={`mailto:${application.email}`}>{application.email}</a></dd></div>
                    <div><dt className="text-slate-500">Telefon</dt><dd><a className="text-emerald-800 underline" href={`tel:${application.phone}`}>{application.phone}</a></dd></div>
                    <div><dt className="text-slate-500">ID</dt><dd className="break-all font-mono text-xs">{application.id}</dd></div>
                  </dl>
                </section>
                <section>
                  <h2 className="font-semibold text-slate-950">Qualifikation / Erfahrung</h2>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{application.qualificationExperience}</p>
                </section>
              </div>
              <div className="mt-8 grid gap-6 border-t border-slate-200 pt-6 lg:grid-cols-2">
                <form action={updateApplicationStatusAction} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="id" value={application.id} />
                  <div className="min-w-52 flex-1">
                    <label htmlFor={`application-status-${application.id}`} className="block text-sm font-semibold">Status</label>
                    <select id={`application-status-${application.id}`} name="status" defaultValue={application.status} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3">
                      {LEAD_STATUS_VALUES.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="min-h-11 rounded-lg bg-emerald-800 px-5 text-sm font-semibold text-white">Speichern</button>
                </form>
                <div className="lg:text-right">
                  <p className="mb-3 text-xs text-slate-500">Interne Mail: {application.mail?.internal?.status === "accepted" ? "angenommen" : "fehlgeschlagen / offen"} · Autoreply: {application.mail?.applicant?.status === "accepted" ? "angenommen" : "fehlgeschlagen / offen"}</p>
                  <DeleteSubmissionButton action={deleteApplicationAction} id={application.id} label="Bewerbung löschen" subject={`Bewerbung von ${application.firstName} ${application.lastName}`} />
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
