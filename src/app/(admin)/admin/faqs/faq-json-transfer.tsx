"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { FaqImportPreview, FaqImportResult } from "@/lib/faq/json-transfer";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface JsonResponse {
  error?: string;
  preview?: FaqImportPreview;
  details?: FaqImportPreview;
  result?: FaqImportResult;
}

async function readJsonResponse(response: Response): Promise<JsonResponse> {
  try {
    return (await response.json()) as JsonResponse;
  } catch {
    return {};
  }
}

export function FaqJsonTransfer() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [json, setJson] = useState<string | null>(null);
  const [preview, setPreview] = useState<FaqImportPreview | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState<"preview" | "import" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<FaqImportResult | null>(null);

  async function handlePreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setResult(null);
    setPreview(null);
    setJson(null);
    setConfirmed(false);

    if (!file) {
      setMessage("Bitte zuerst eine JSON-Datei auswählen.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage("Die JSON-Datei darf höchstens 5 MB groß sein.");
      return;
    }

    setBusy("preview");
    try {
      const fileContent = await file.text();
      const response = await fetch("/api/admin/faqs/import/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: fileContent,
      });
      const data = await readJsonResponse(response);
      const nextPreview = data.preview ?? data.details ?? null;

      setPreview(nextPreview);
      if (response.ok && nextPreview?.valid) {
        setJson(fileContent);
        setMessage("Validierung abgeschlossen. Bitte Vorschau prüfen und Import bestätigen.");
      } else {
        setMessage(data.error ?? "Die Datei konnte nicht validiert werden.");
      }
    } catch {
      setMessage("Die Datei konnte nicht gelesen oder validiert werden.");
    } finally {
      setBusy(null);
    }
  }

  async function handleImport() {
    if (!json || !preview?.valid || !confirmed) return;

    setBusy("import");
    setMessage(null);
    setResult(null);
    try {
      const response = await fetch("/api/admin/faqs/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json,
      });
      const data = await readJsonResponse(response);

      if (!response.ok || !data.result) {
        setPreview(data.details ?? preview);
        setMessage(data.error ?? "Der Import konnte nicht abgeschlossen werden.");
        return;
      }

      setResult(data.result);
      setMessage("FAQ-Daten wurden importiert.");
      setPreview(null);
      setJson(null);
      setConfirmed(false);
      router.refresh();
    } catch {
      setMessage("Der Import konnte nicht abgeschlossen werden.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">FAQ Daten</h2>
          <p className="mt-1 text-sm text-slate-600">
            Versionierte JSON-Dateien prüfen, importieren oder als vollständigen Datenstand exportieren.
          </p>
        </div>

        <a
          href="/api/admin/faqs/export"
          className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          JSON exportieren
        </a>
      </div>

      <form onSubmit={handlePreview} className="mt-6 flex flex-wrap items-end gap-3">
        <label className="min-w-64 flex-1 text-sm font-medium text-slate-800">
          JSON-Datei
          <input
            type="file"
            accept="application/json,.json"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setPreview(null);
              setJson(null);
              setResult(null);
              setMessage(null);
            }}
            className="mt-2 block min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:font-semibold"
          />
        </label>
        <button
          type="submit"
          disabled={busy !== null}
          className="min-h-11 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === "preview" ? "Wird validiert …" : "JSON importieren"}
        </button>
      </form>

      {message ? (
        <p className="mt-4 text-sm text-slate-700" role="status" aria-live="polite">
          {message}
        </p>
      ) : null}

      {preview ? (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <h3 className="font-semibold text-slate-950">Importvorschau</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-lg text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">Datentyp</th>
                  <th className="px-4 py-2 font-medium">Neu</th>
                  <th className="px-4 py-2 font-medium">Update</th>
                  <th className="px-4 py-2 font-medium">Übersprungen</th>
                </tr>
              </thead>
              <tbody className="border-t border-slate-200 text-slate-800">
                <tr>
                  <th className="py-2 pr-4 font-semibold">Kategorien</th>
                  <td className="px-4 py-2">{preview.categories.new}</td>
                  <td className="px-4 py-2">{preview.categories.update}</td>
                  <td className="px-4 py-2">{preview.categories.skipped}</td>
                </tr>
                <tr className="border-t border-slate-100">
                  <th className="py-2 pr-4 font-semibold">FAQs</th>
                  <td className="px-4 py-2">{preview.faqs.new}</td>
                  <td className="px-4 py-2">{preview.faqs.update}</td>
                  <td className="px-4 py-2">{preview.faqs.skipped}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {preview.errors.length > 0 ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              <p className="font-semibold">Fehler ({preview.errors.length})</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {preview.errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {preview.warnings.length > 0 ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              <p className="font-semibold">Warnungen ({preview.warnings.length})</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {preview.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {preview.valid ? (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
              <label className="flex items-start gap-3 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) => setConfirmed(event.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-slate-300"
                />
                <span>Ich habe die Vorschau geprüft und bestätige den UPSERT-Import.</span>
              </label>
              <button
                type="button"
                onClick={handleImport}
                disabled={!confirmed || busy !== null}
                className="min-h-11 rounded-lg bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy === "import" ? "Import läuft …" : "Import verbindlich ausführen"}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {result ? (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
          <p className="font-semibold">Importergebnis</p>
          <p className="mt-1">
            Erstellt: {result.created} · Aktualisiert: {result.updated} · Übersprungen: {result.skipped} · Fehlgeschlagen: {result.failed}
          </p>
        </div>
      ) : null}
    </section>
  );
}
