import { requireAdminSession } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";

import { FAQ_ROUTE_LABELS } from "@/config/routes";
import { listFaqCategories } from "@/lib/faq/category-repository";
import { listFaqEntries } from "@/lib/faq/entry-repository";
import type { FirestoreTimestamp } from "@/types/firestore";
import { AdminPageHeader, AdminToolbar } from "@/components/admin/admin-ui";
import { matchesSearchTerms } from "@/lib/admin/admin-view";

import { createFaqEntryAction, deleteFaqEntryAction, updateFaqEntryAction } from "./actions";
import { FaqEntryFormFields } from "./faq-entry-form-fields";
import { FaqJsonTransfer } from "./faq-json-transfer";

export const metadata: Metadata = {
  title: "FAQ-Verwaltung",
};

export const dynamic = "force-dynamic";

interface FaqAdminPageProps {
  searchParams: Promise<{
    status?: string | string[];
    message?: string | string[];
    q?: string | string[];
    filterStatus?: string | string[];
    filterCategory?: string | string[];
  }>;
}

function getFirstSearchParameter(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function formatTimestamp(timestamp: FirestoreTimestamp): string {
  try {
    return new Intl.DateTimeFormat("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(timestamp.toDate());
  } catch {
    return "Nicht verfügbar";
  }
}

export default async function FaqAdminPage({ searchParams }: FaqAdminPageProps) {
  await requireAdminSession();
  const [categories, entries, parameters] = await Promise.all([
    listFaqCategories(),
    listFaqEntries(),
    searchParams,
  ]);

  const status = getFirstSearchParameter(parameters.status);

  const message = getFirstSearchParameter(parameters.message);

  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const query = getFirstSearchParameter(parameters.q)?.trim() ?? "";
  const filterStatus = getFirstSearchParameter(parameters.filterStatus) ?? "";
  const filterCategory = getFirstSearchParameter(parameters.filterCategory) ?? "";
  const filteredEntries = entries.filter((entry) => {
    const category = categoriesById.get(entry.categoryId);
    return (!filterCategory || entry.categoryId === filterCategory) &&
      (!filterStatus || (filterStatus === "published" ? entry.isPublished : !entry.isPublished)) &&
      matchesSearchTerms(query, entry.question, entry.answer, entry.shortAnswer, category?.name);
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <AdminPageHeader eyebrow="Inhalte" title="FAQ-Verwaltung" description="Fragen, Antworten, Veröffentlichungsstatus und Seitenausspielungen zentral verwalten." actions={
        <>
          <a href="#neue-faq" className="rounded-lg bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-semibold text-white">+ FAQ anlegen</a>
          <Link
            href="/admin/faqs/categories"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Kategorien verwalten
          </Link>
        </>
      } />

      {message ? (
        <div
          className={
            status === "success"
              ? "mb-8 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900"
              : "mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900"
          }
          role="status"
        >
          {message}
        </div>
      ) : null}

      <AdminToolbar><form method="get" className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]"><label className="text-sm font-semibold">Suche<input type="search" name="q" defaultValue={query} placeholder="Frage, Antwort oder Kategorie" className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border-default)] px-3 font-normal" /></label><label className="text-sm font-semibold">Status<select name="filterStatus" defaultValue={filterStatus} className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border-default)] bg-white px-3 font-normal"><option value="">Alle</option><option value="published">Veröffentlicht</option><option value="draft">Entwurf</option></select></label><label className="text-sm font-semibold">Kategorie<select name="filterCategory" defaultValue={filterCategory} className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border-default)] bg-white px-3 font-normal"><option value="">Alle Kategorien</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><button className="min-h-11 self-end rounded-lg bg-[var(--brand-primary)] px-5 text-sm font-semibold text-white">Anwenden</button></form><div className="mt-3 flex justify-between text-xs text-[var(--text-muted)]"><span>{filteredEntries.length} von {entries.length} FAQs</span>{query || filterStatus || filterCategory ? <Link href="/admin/faqs" className="font-semibold text-[var(--brand-primary)]">Alle Filter zurücksetzen</Link> : null}</div></AdminToolbar>

      <details className="mb-6 rounded-xl border border-[var(--border-default)] bg-white"><summary className="min-h-11 cursor-pointer px-5 py-4 font-semibold text-[var(--brand-primary)]">Tools · JSON importieren / exportieren</summary><div className="border-t border-[var(--border-default)] p-3"><FaqJsonTransfer /></div></details>

      {categories.length === 0 ? (
        <section className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <h2 className="text-lg font-semibold">Zuerst eine Kategorie anlegen</h2>

          <p className="mt-2 text-sm leading-6">Ein FAQ-Eintrag benötigt eine gültige Kategorie.</p>

          <Link
            href="/admin/faqs/categories"
            className="mt-4 inline-flex rounded-lg bg-amber-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-800"
          >
            Kategorieverwaltung öffnen
          </Link>
        </section>
      ) : (
        <details id="neue-faq" className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <summary className="cursor-pointer text-xl font-semibold text-[var(--brand-navy)]">Neue FAQ anlegen</summary>
          <div className="mb-6">
            <p className="mt-1 text-sm text-slate-600">
              Eine FAQ muss mindestens einer öffentlichen Route zugeordnet werden.
            </p>
          </div>

          <form action={createFaqEntryAction} className="space-y-6">
            <FaqEntryFormFields categories={categories} idPrefix="new-faq" />

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-[var(--brand-primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--brand-accent)]"
              >
                FAQ erstellen
              </button>
            </div>
          </form>
        </details>
      )}

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-950">Bestehende FAQs</h2>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-600">
            Noch keine FAQ-Einträge vorhanden.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEntries.map((entry) => {
              const category = categoriesById.get(entry.categoryId);

              return (
                <article
                  key={entry.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={
                            entry.isPublished
                              ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900"
                              : "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                          }
                        >
                          {entry.isPublished ? "Veröffentlicht" : "Entwurf"}
                        </span>

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                          {category?.name ?? `Fehlende Kategorie: ${entry.categoryId}`}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-semibold text-slate-950">
                        {entry.question}
                      </h3>

                      <p className="mt-3 max-h-24 overflow-hidden text-sm leading-6 whitespace-pre-line text-slate-600">
                        {entry.answer}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {entry.placements.map((placement) => (
                          <span
                            key={placement.routeKey}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700"
                          >
                            {FAQ_ROUTE_LABELS[placement.routeKey]}
                            {" · "}
                            {placement.sortOrder}
                            {placement.showInSchema ? " · Schema" : ""}
                          </span>
                        ))}
                      </div>

                      <p className="mt-4 text-xs text-slate-500">
                        ID: {entry.id}
                        {" · "}
                        Geändert: {formatTimestamp(entry.updatedAt)}
                      </p>
                    </div>

                    <details className="w-full max-w-2xl rounded-xl border border-slate-200 bg-slate-50">
                      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-800">
                        FAQ bearbeiten
                      </summary>

                      <div className="border-t border-slate-200 p-5">
                        <form action={updateFaqEntryAction} className="space-y-6">
                          <input type="hidden" name="id" value={entry.id} />

                          <FaqEntryFormFields
                            categories={categories}
                            idPrefix={`faq-${entry.id}`}
                            initialValue={entry}
                          />

                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="rounded-lg bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-accent)]"
                            >
                              Änderungen speichern
                            </button>
                          </div>
                        </form>

                        <div className="mt-8 border-t border-red-200 pt-6">
                          <form action={deleteFaqEntryAction} className="space-y-4">
                            <input type="hidden" name="id" value={entry.id} />

                            <label className="flex items-start gap-3 text-sm text-red-900">
                              <input
                                name="confirmed"
                                type="checkbox"
                                required
                                className="mt-0.5 h-4 w-4 rounded border-red-300"
                              />

                              <span>
                                Ich bestätige, dass dieser FAQ-Eintrag endgültig gelöscht werden
                                soll.
                              </span>
                            </label>

                            <button
                              type="submit"
                              className="rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-50"
                            >
                              FAQ löschen
                            </button>
                          </form>
                        </div>
                      </div>
                    </details>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
