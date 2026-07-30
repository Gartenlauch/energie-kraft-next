import type { Metadata } from "next";
import Link from "next/link";

import { FAQ_ROUTE_LABELS } from "@/config/routes";
import { listFaqCategories } from "@/lib/faq/category-repository";
import { listFaqEntries } from "@/lib/faq/entry-repository";
import type { FirestoreTimestamp } from "@/types/firestore";

import { createFaqEntryAction, deleteFaqEntryAction, updateFaqEntryAction } from "./actions";
import { FaqEntryFormFields } from "./faq-entry-form-fields";

export const metadata: Metadata = {
  title: "FAQ-Verwaltung",
};

export const dynamic = "force-dynamic";

interface FaqAdminPageProps {
  searchParams: Promise<{
    status?: string | string[];
    message?: string | string[];
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
  const [categories, entries, parameters] = await Promise.all([
    listFaqCategories(),
    listFaqEntries(),
    searchParams,
  ]);

  const status = getFirstSearchParameter(parameters.status);

  const message = getFirstSearchParameter(parameters.message);

  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <Link href="/admin" className="text-sm font-medium text-emerald-800 hover:underline">
            ← Zurück zum Dashboard
          </Link>

          <h1 className="mt-3 text-3xl font-semibold text-slate-950">FAQ-Verwaltung</h1>

          <p className="mt-2 max-w-3xl text-slate-600">
            Fragen, Antworten, Veröffentlichungsstatus und Seitenausspielungen zentral verwalten.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/faqs/categories"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Kategorien verwalten
          </Link>

          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
            {entries.length} {entries.length === 1 ? "FAQ" : "FAQs"}
          </div>
        </div>
      </div>

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
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-950">Neue FAQ</h2>

            <p className="mt-1 text-sm text-slate-600">
              Eine FAQ muss mindestens einer öffentlichen Route zugeordnet werden.
            </p>
          </div>

          <form action={createFaqEntryAction} className="space-y-6">
            <FaqEntryFormFields categories={categories} idPrefix="new-faq" />

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-emerald-900 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                FAQ erstellen
              </button>
            </div>
          </form>
        </section>
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
            {entries.map((entry) => {
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
                              className="rounded-lg bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
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
