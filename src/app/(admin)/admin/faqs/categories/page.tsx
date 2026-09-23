import { requireAdminSession } from "@/lib/auth/session";
import type { Metadata } from "next";
import Link from "next/link";

import { listFaqCategories } from "@/lib/faq/category-repository";
import type { FirestoreTimestamp } from "@/types/firestore";
import { AdminPageHeader, AdminToolbar } from "@/components/admin/admin-ui";
import { matchesSearchTerms } from "@/lib/admin/admin-view";

import {
  createFaqCategoryAction,
  deleteFaqCategoryAction,
  updateFaqCategoryAction,
} from "./actions";

export const metadata: Metadata = {
  title: "FAQ-Kategorien",
};

export const dynamic = "force-dynamic";

interface FaqCategoriesPageProps {
  searchParams: Promise<{
    status?: string | string[];
    message?: string | string[];
    q?: string | string[];
    filterStatus?: string | string[];
  }>;
}

function getFirstSearchParameter(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value)
    ? value[0]
    : value;
}

function formatTimestamp(
  timestamp: FirestoreTimestamp,
): string {
  try {
    return new Intl.DateTimeFormat(
      "de-DE",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(timestamp.toDate());
  } catch {
    return "Nicht verfügbar";
  }
}

export default async function FaqCategoriesPage({
  searchParams,
}: FaqCategoriesPageProps) {
  await requireAdminSession();
  const [categories, parameters] =
    await Promise.all([
      listFaqCategories(),
      searchParams,
    ]);

  const status = getFirstSearchParameter(
    parameters.status,
  );

  const message = getFirstSearchParameter(
    parameters.message,
  );
  const query = getFirstSearchParameter(parameters.q)?.trim() ?? "";
  const filterStatus = getFirstSearchParameter(parameters.filterStatus) ?? "";
  const filteredCategories = categories.filter((category) =>
    matchesSearchTerms(query, category.name, category.slug, category.id) &&
    (!filterStatus || (filterStatus === "active" ? category.isActive : !category.isActive)),
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <AdminPageHeader eyebrow="Inhalte" title="FAQ-Kategorien" description="Kategorien strukturieren die FAQ-Einträge; der Slug bleibt die stabile Dokument-ID." actions={<a href="#neue-kategorie" className="rounded-lg bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-semibold text-white">Neue Kategorie</a>} />

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

      <AdminToolbar><form className="grid gap-3 md:grid-cols-[2fr_1fr_auto]"><label className="text-sm font-semibold">Suche<input type="search" name="q" defaultValue={query} placeholder="Name oder Slug" className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border-default)] px-3 font-normal" /></label><label className="text-sm font-semibold">Status<select name="filterStatus" defaultValue={filterStatus} className="mt-2 min-h-11 w-full rounded-lg border border-[var(--border-default)] bg-white px-3 font-normal"><option value="">Alle</option><option value="active">Aktiv</option><option value="inactive">Inaktiv</option></select></label><button className="min-h-11 self-end rounded-lg bg-[var(--brand-primary)] px-5 text-sm font-semibold text-white">Anwenden</button></form><div className="mt-3 flex justify-between text-xs text-[var(--text-muted)]"><span>{filteredCategories.length} von {categories.length} Kategorien</span>{query || filterStatus ? <Link href="/admin/faqs/categories" className="font-semibold text-[var(--brand-primary)]">Alle Filter zurücksetzen</Link> : null}</div></AdminToolbar>

      <details id="neue-kategorie" className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <summary className="cursor-pointer text-xl font-semibold text-[var(--brand-navy)]">Neue Kategorie anlegen</summary>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-950">
            Neue Kategorie
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Der Slug kann nach dem Erstellen
            nicht mehr geändert werden.
          </p>
        </div>

        <form
          action={createFaqCategoryAction}
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="new-category-name"
              className="block text-sm font-medium text-slate-800"
            >
              Name
            </label>

            <input
              id="new-category-name"
              name="name"
              type="text"
              required
              minLength={2}
              maxLength={100}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-950 outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-blue-200"
              placeholder="Photovoltaik"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="new-category-slug"
              className="block text-sm font-medium text-slate-800"
            >
              Slug
            </label>

            <input
              id="new-category-slug"
              name="slug"
              type="text"
              required
              minLength={2}
              maxLength={100}
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-mono text-sm text-slate-950 outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-blue-200"
              placeholder="photovoltaik"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="new-category-sort-order"
              className="block text-sm font-medium text-slate-800"
            >
              Sortierung
            </label>

            <input
              id="new-category-sort-order"
              name="sortOrder"
              type="number"
              required
              min={0}
              max={100000}
              step={1}
              defaultValue={10}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-950 outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="flex flex-col justify-end gap-4">
            <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300"
              />
              Kategorie aktiv
            </label>

            <button
              type="submit"
              className="rounded-lg bg-[var(--brand-primary)] px-4 py-2.5 font-semibold text-white transition hover:bg-[var(--brand-accent)]"
            >
              Kategorie erstellen
            </button>
          </div>
        </form>
      </details>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-950">
            Bestehende Kategorien
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-600">
            Noch keine FAQ-Kategorien
            vorhanden.
          </div>
        ) : (
          <div className="space-y-5">
            {filteredCategories.map((category) => (
              <article
                key={category.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {category.name}
                      </h3>

                      <span
                        className={
                          category.isActive
                            ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900"
                            : "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                        }
                      >
                        {category.isActive
                          ? "Aktiv"
                          : "Inaktiv"}
                      </span>
                    </div>

                    <p className="mt-2 font-mono text-sm text-slate-500">
                      {category.id}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Sortierung:{" "}
                      {category.sortOrder}
                      {" · "}
                      Geändert:{" "}
                      {formatTimestamp(
                        category.updatedAt,
                      )}
                    </p>
                  </div>

                  <details className="w-full max-w-xl rounded-xl border border-slate-200 bg-slate-50">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-800">
                      Kategorie bearbeiten
                    </summary>

                    <div className="border-t border-slate-200 p-4">
                      <form
                        action={
                          updateFaqCategoryAction
                        }
                        className="grid gap-4 sm:grid-cols-2"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={category.id}
                        />

                        <div className="space-y-2">
                          <label
                            htmlFor={`category-name-${category.id}`}
                            className="block text-sm font-medium text-slate-800"
                          >
                            Name
                          </label>

                          <input
                            id={`category-name-${category.id}`}
                            name="name"
                            type="text"
                            required
                            minLength={2}
                            maxLength={100}
                            defaultValue={
                              category.name
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor={`category-sort-${category.id}`}
                            className="block text-sm font-medium text-slate-800"
                          >
                            Sortierung
                          </label>

                          <input
                            id={`category-sort-${category.id}`}
                            name="sortOrder"
                            type="number"
                            required
                            min={0}
                            max={100000}
                            step={1}
                            defaultValue={
                              category.sortOrder
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950"
                          />
                        </div>

                        <label className="flex items-center gap-3 text-sm font-medium text-slate-800">
                          <input
                            name="isActive"
                            type="checkbox"
                            defaultChecked={
                              category.isActive
                            }
                            className="h-4 w-4 rounded border-slate-300"
                          />
                          Kategorie aktiv
                        </label>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="rounded-lg bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-accent)]"
                          >
                            Änderungen speichern
                          </button>
                        </div>
                      </form>

                      <div className="mt-6 border-t border-red-200 pt-5">
                        <form
                          action={
                            deleteFaqCategoryAction
                          }
                          className="space-y-4"
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={category.id}
                          />

                          <label className="flex items-start gap-3 text-sm text-red-900">
                            <input
                              name="confirmed"
                              type="checkbox"
                              required
                              className="mt-0.5 h-4 w-4 rounded border-red-300"
                            />

                            <span>
                              Ich bestätige, dass
                              die Kategorie endgültig
                              gelöscht werden soll.
                            </span>
                          </label>

                          <button
                            type="submit"
                            className="rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-50"
                          >
                            Kategorie löschen
                          </button>
                        </form>
                      </div>
                    </div>
                  </details>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
