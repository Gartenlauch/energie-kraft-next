"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import type { FaqCatalogEntry } from "@/types/faq";
import { matchesSearchTerms } from "@/lib/admin/admin-view";

interface Props {
  entries: FaqCatalogEntry[];
  categories: { id: string; name: string; slug: string }[];
  categoryPage?: boolean;
  children?: ReactNode;
}

export function FaqExplorer({ entries, categories, categoryPage = false, children }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const filtered = entries.filter(
    (faq) =>
      (!category || faq.categoryId === category) &&
      matchesSearchTerms(search, faq.question, faq.shortAnswer, faq.answer, faq.categoryName),
  );
  return (
    <div>
      <div
        className={`faq-search-panel grid gap-5 ${categoryPage ? "" : "md:grid-cols-[2fr_1fr]"}`}
      >
        <div>
          <label htmlFor="faq-search" className="block font-semibold">
            {categoryPage ? "In diesem Thema suchen" : "Alle Fragen durchsuchen"}
          </label>
          <input
            id="faq-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setVisibleCount(12);
            }}
            placeholder="Zum Beispiel: Speicher, Dach, Eigenverbrauch"
            className="border-border-strong bg-background mt-3 min-h-13 w-full rounded-lg border px-4"
          />
        </div>
        {!categoryPage && (
          <div>
            <label htmlFor="faq-category" className="block font-semibold">
              Thema eingrenzen
            </label>
            <select
              id="faq-category"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setVisibleCount(12);
              }}
              className="border-border-strong bg-background mt-3 min-h-13 w-full rounded-lg border px-4"
            >
              <option value="">Alle Themen</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      {!search && !category && children && <div className="my-10">{children}</div>}
      <p role="status" className="my-6 text-sm text-[var(--text-muted)]">
        {filtered.length} Fragen gefunden
        {!categoryPage && filtered.length > visibleCount ? ` · ${visibleCount} angezeigt` : ""}
      </p>
      {filtered.length === 0 && (
        <p>
          Keine passende Frage gefunden. Versuchen Sie einen anderen Begriff oder wählen Sie alle
          Themen.
        </p>
      )}
      <ul className="divide-border-default divide-y">
        {(categoryPage ? filtered : filtered.slice(0, visibleCount)).map((faq) => (
          <li key={faq.id} className="faq-result py-6 md:py-8">
            <p className="eyebrow">{faq.categoryName}</p>
            <h3 className="mt-2 max-w-3xl text-xl leading-snug md:text-2xl">
              <Link
                href={faq.href}
                className="text-brand-primary inline-flex min-h-11 items-center underline-offset-4 hover:underline"
              >
                {faq.question}
              </Link>
            </h3>
            {faq.shortAnswer && (
              <p className="mt-3 max-w-3xl leading-7 text-[var(--text-muted)]">{faq.shortAnswer}</p>
            )}
            {categoryPage && (
              <details className="mt-3 max-w-3xl">
                <summary className="text-brand-primary min-h-11 cursor-pointer py-3 text-sm font-semibold">
                  Ausführliche Antwort
                </summary>
                <p className="pb-3 leading-8 whitespace-pre-line text-[var(--text-muted)]">
                  {faq.answer}
                </p>
              </details>
            )}
          </li>
        ))}
      </ul>
      {!categoryPage && filtered.length > visibleCount && (
        <button
          type="button"
          className="button-secondary mt-8 w-full sm:w-auto"
          onClick={() => setVisibleCount((count) => count + 12)}
        >
          Weitere Fragen anzeigen
        </button>
      )}
    </div>
  );
}
