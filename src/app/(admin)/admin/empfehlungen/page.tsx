import type { Metadata } from "next";
import Link from "next/link";

import { DeleteSubmissionButton } from "@/components/admin/delete-submission-button";
import { SubmissionRealtimeRefresh } from "@/components/admin/submission-realtime-refresh";
import { listReferrals } from "@/lib/submissions/referral-repository";
import { LEAD_STATUS_VALUES, type LeadStatus } from "@/types/lead";

import { deleteReferralAction, updateReferralStatusAction } from "./actions";

export const metadata: Metadata = { title: "Empfehlungen" };
export const dynamic = "force-dynamic";
const statusLabels: Record<LeadStatus, string> = { new: "Neu", in_progress: "In Bearbeitung", completed: "Erledigt", rejected: "Abgelehnt" };

function formatDate(value: { toDate(): Date }) {
  try { return new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short" }).format(value.toDate()); }
  catch { return "Zeitpunkt nicht verfügbar"; }
}

export default async function ReferralsAdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [referrals, parameters] = await Promise.all([listReferrals(), searchParams]);
  const result = Array.isArray(parameters.result) ? parameters.result[0] : parameters.result;
  const message = Array.isArray(parameters.message) ? parameters.message[0] : parameters.message;
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <SubmissionRealtimeRefresh documentId="referrals" />
      <Link href="/admin" className="text-sm font-medium text-emerald-800 hover:underline">← Dashboard</Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-semibold text-slate-950">Empfehlungen</h1><p className="mt-2 text-slate-600">Empfehlungen prüfen und ihren Bearbeitungsstatus pflegen.</p></div>
        <p className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">{referrals.length} Eingänge</p>
      </div>
      {message ? <div role="status" className={`mt-7 border px-5 py-4 text-sm ${result === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}>{message}</div> : null}
      <div className="mt-8 space-y-5">
        {referrals.length === 0 ? <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">Noch keine Empfehlungen vorhanden.</p> : referrals.map((referral) => (
          <details key={referral.id} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <summary className="grid min-h-16 cursor-pointer list-none gap-3 px-5 py-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
              <span><span className="block font-semibold text-slate-950">{referral.referrer.firstName} {referral.referrer.lastName}</span><span className="text-sm text-slate-500">{formatDate(referral.createdAt)}</span></span>
              <span className="text-sm text-slate-700">empfiehlt <strong>{referral.referredCustomer.firstName} {referral.referredCustomer.lastName}</strong></span>
              <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700">{statusLabels[referral.status]}</span>
            </summary>
            <div className="border-t border-slate-200 p-5 lg:p-7">
              <div className="grid gap-8 lg:grid-cols-2">
                <section><h2 className="font-semibold text-slate-950">Empfehlungsgeber:in</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-500">Name</dt><dd>{referral.referrer.firstName} {referral.referrer.lastName}</dd></div><div><dt className="text-slate-500">E-Mail</dt><dd><a className="text-emerald-800 underline" href={`mailto:${referral.referrer.email}`}>{referral.referrer.email}</a></dd></div></dl></section>
                <section><h2 className="font-semibold text-slate-950">Empfohlene Person</h2><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-slate-500">Name</dt><dd>{referral.referredCustomer.firstName} {referral.referredCustomer.lastName}</dd></div><div><dt className="text-slate-500">E-Mail</dt><dd><a className="text-emerald-800 underline" href={`mailto:${referral.referredCustomer.email}`}>{referral.referredCustomer.email}</a></dd></div><div><dt className="text-slate-500">Telefon</dt><dd>{referral.referredCustomer.phone ?? "Keine Angabe"}</dd></div><div><dt className="text-slate-500">Adresse</dt><dd>{referral.referredCustomer.street}, {referral.referredCustomer.postalCode} {referral.referredCustomer.city}</dd></div><div><dt className="text-slate-500">ID</dt><dd className="break-all font-mono text-xs">{referral.id}</dd></div></dl></section>
              </div>
              <div className="mt-8 grid gap-6 border-t border-slate-200 pt-6 lg:grid-cols-2">
                <form action={updateReferralStatusAction} className="flex flex-wrap items-end gap-3"><input type="hidden" name="id" value={referral.id} /><div className="min-w-52 flex-1"><label htmlFor={`referral-status-${referral.id}`} className="block text-sm font-semibold">Status</label><select id={`referral-status-${referral.id}`} name="status" defaultValue={referral.status} className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3">{LEAD_STATUS_VALUES.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></div><button type="submit" className="min-h-11 rounded-lg bg-emerald-800 px-5 text-sm font-semibold text-white">Speichern</button></form>
                <div className="lg:text-right"><p className="mb-3 text-xs text-slate-500">Intern: {referral.mail?.internal?.status ?? "offen"} · Empfehlungsgeber: {referral.mail?.referrer?.status ?? "offen"} · Empfohlene Person: {referral.mail?.referredCustomer?.status ?? "offen"}</p><DeleteSubmissionButton action={deleteReferralAction} id={referral.id} label="Empfehlung löschen" subject={`Empfehlung ${referral.id}`} /></div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </main>
  );
}
