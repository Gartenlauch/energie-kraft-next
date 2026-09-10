"use client";

import { useState } from "react";
import Link from "next/link";
import type { FaqCatalogEntry } from "@/types/faq";

interface Props {
  entries: FaqCatalogEntry[];
  categories: { id: string; name: string; slug: string }[];
}

export function FaqExplorer({ entries, categories }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const terms = search.toLocaleLowerCase("de").trim().split(/\s+/).filter(Boolean);
  const filtered = entries.filter(
    (faq) =>
      (!category || faq.categoryId === category) &&
      terms.every((term) =>
        `${faq.question} ${faq.shortAnswer} ${faq.answer} ${faq.categoryName}`
          .toLocaleLowerCase("de")
          .includes(term),
      ),
  );
  return (
    <div>
      <div className="border-border-default grid gap-5 border-y py-6 md:grid-cols-[2fr_1fr]">
        <div>
          <label htmlFor="faq-search" className="block font-semibold">
            Alle Fragen durchsuchen
          </label>
          <input
            id="faq-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Zum Beispiel: Speicher, Dach, Eigenverbrauch"
            className="border-border-strong bg-background mt-3 min-h-13 w-full rounded-lg border px-4"
          />
        </div>
        <div>
          <label htmlFor="faq-category" className="block font-semibold">
            Thema eingrenzen
          </label>
          <select
            id="faq-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
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
      </div>
      <p role="status" className="my-6 text-sm text-[var(--text-muted)]">
        {filtered.length} Fragen gefunden
      </p>
      {filtered.length === 0 && (
        <p>
          Keine passende Frage gefunden. Versuchen Sie einen anderen Begriff oder wählen Sie alle
          Themen.
        </p>
      )}
      <ul className="divide-border-default divide-y">
        {filtered.map((faq) => (
          <li key={faq.id} className="py-6">
            <p className="eyebrow">{faq.categoryName}</p>
            <h3 className="mt-2 text-xl">
              <Link
                href={faq.href}
                className="text-brand-primary underline-offset-4 hover:underline"
              >
                {faq.question}
              </Link>
            </h3>
            {faq.shortAnswer && (
              <p className="mt-3 max-w-3xl leading-7 text-[var(--text-muted)]">{faq.shortAnswer}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
