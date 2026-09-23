"use client";

import { httpsCallable } from "firebase/functions";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { firebaseFunctions } from "@/lib/firebase/client";

interface ReportResult {
  ok: true;
  filename: string;
  contentType: string;
  dataBase64: string;
}

function base64Blob(data: string, type: string) {
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Blob([bytes], { type });
}

export function AdminSubmissionActions({
  kind,
  id,
  email,
  reference,
  hasReport = false,
}: {
  kind: "lead" | "referral";
  id: string;
  email: string;
  reference?: string;
  hasReport?: boolean;
}) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const inFlight = useRef(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  async function report() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy("download");
    setMessage(null);
    try {
      const result = await httpsCallable<{ leadId: string }, ReportResult>(
        firebaseFunctions,
        "adminGenerateLeadReport",
      )({ leadId: id });
      const blobUrl = URL.createObjectURL(
        base64Blob(result.data.dataBase64, result.data.contentType),
      );
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = result.data.filename;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      setMessage("PDF steht zum Herunterladen bereit.");
      router.refresh();
    } catch {
      setMessage("Das Projekt-PDF konnte nicht erzeugt werden.");
    } finally {
      inFlight.current = false;
      setBusy(null);
    }
  }
  async function forward(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy("forward");
    setMessage(null);
    const data = new FormData(event.currentTarget);
    try {
      const functionName = kind === "lead" ? "adminForwardLead" : "adminForwardReferral";
      await httpsCallable(
        firebaseFunctions,
        functionName,
      )({
        id,
        recipient: String(data.get("recipient") ?? ""),
        message: String(data.get("message") ?? "") || undefined,
      });
      dialog.current?.close();
      setMessage(
        "Mailgun hat die Weiterleitung angenommen. Dies ist keine Zustellbestätigung.",
      );
      router.refresh();
    } catch {
      setMessage(
        "Die Weiterleitung konnte nicht bestätigt werden. Vor erneutem Senden bitte Bearbeitungshistorie und Versand prüfen.",
      );
    } finally {
      inFlight.current = false;
      setBusy(null);
    }
  }
  return (
    <section>
      <h3 className="font-semibold text-[var(--brand-navy)]">Aktionen</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(reference ? `Energieprojekt ${reference}` : "Ihre Anfrage bei Energie-Kraft")}`}
          className="inline-flex min-h-11 items-center rounded-lg border border-[var(--border-default)] px-4 text-sm font-semibold text-[var(--brand-primary)] hover:bg-[var(--surface-soft)]"
        >
          E-Mail senden
        </a>
        {hasReport ? (
          <>
            <button
              type="button"
              disabled={busy !== null}
              onClick={report}
              className="min-h-11 rounded-lg border border-[var(--border-default)] px-4 text-sm font-semibold text-[var(--brand-primary)]"
            >
              PDF herunterladen
            </button>
          </>
        ) : null}
        <button
          type="button"
          onClick={() => dialog.current?.showModal()}
          className="min-h-11 rounded-lg bg-[var(--brand-primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--brand-accent)]"
        >
          {kind === "lead" ? "Lead weiterleiten" : "Empfehlung weiterleiten"}
        </button>
      </div>
      {message ? (
        <p role="status" className="mt-3 text-sm text-[var(--text-muted)]">
          {message}
        </p>
      ) : null}
      <dialog
        ref={dialog}
        className="m-auto w-[min(34rem,calc(100%-2rem))] rounded-2xl border border-[var(--border-default)] p-0 shadow-2xl backdrop:bg-[var(--brand-navy)]/55"
      >
        <form onSubmit={forward} className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-[var(--brand-navy)]">
                Intern weiterleiten
              </h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {hasReport
                  ? "Das aktuelle Projekt-PDF wird automatisch angehängt."
                  : "Die wichtigsten Angaben werden sicher über Mailgun versendet."}
              </p>
            </div>
            <button
              type="button"
              aria-label="Dialog schließen"
              onClick={() => dialog.current?.close()}
              className="min-h-11 min-w-11 rounded-lg text-2xl text-slate-500 hover:bg-slate-100"
            >
              ×
            </button>
          </div>
          <label className="mt-5 block text-sm font-semibold">
            Empfänger-E-Mail
            <input
              autoFocus
              name="recipient"
              type="email"
              required
              maxLength={254}
              className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border-default)] px-3 font-normal"
            />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Optionale Nachricht
            <textarea
              name="message"
              maxLength={2000}
              rows={4}
              className="mt-2 w-full rounded-lg border border-[var(--border-default)] p-3 font-normal"
            />
          </label>
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="min-h-11 rounded-lg border border-[var(--border-default)] px-4 text-sm font-semibold"
            >
              Abbrechen
            </button>
            <button
              disabled={busy === "forward"}
              className="min-h-11 rounded-lg bg-[var(--brand-primary)] px-5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy === "forward" ? "Wird gesendet …" : "Weiterleiten"}
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
