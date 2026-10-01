"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { FaqCatalogEntry } from "@/types/faq";
import { matchesSearchTerms } from "@/lib/admin/admin-view";

interface Props {
  entries: FaqCatalogEntry[];
  categories: { id: string; name: string; slug: string }[];
  children?: ReactNode;
}

export function FaqExplorer({ entries, categories, children }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const requestedCategory = searchParams.get("category");
  const category = categories.find((item) => item.slug === requestedCategory)?.slug ?? "";
  const filtered = entries.filter(
    (faq) =>
      (!category || faq.categorySlug === category) &&
      matchesSearchTerms(search, faq.question, faq.shortAnswer, faq.answer, faq.categoryName),
  );
  return (
    <div>
      <div className="faq-search-panel grid gap-5 md:grid-cols-[2fr_1fr]">
        <div>
          <label htmlFor="faq-search" className="block font-semibold">
            Alle Fragen durchsuchen
          </label>
          <input
            id="faq-search"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
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
            onChange={(event) => {
              const params = new URLSearchParams(searchParams.toString());
              if (event.target.value) params.set("category", event.target.value);
              else params.delete("category");
              const query = params.toString();
              router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
            }}
            className="border-border-strong bg-background mt-3 min-h-13 w-full rounded-lg border px-4"
          >
            <option value="">Alle Themen</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {!search && !category && children && <div className="my-10">{children}</div>}
      <FaqResults key={JSON.stringify([category, search])} entries={filtered} />
    </div>
  );
}

// Reset pagination on category/search changes, including browser history navigation.
function FaqResults({ entries }: { entries: FaqCatalogEntry[] }) {
  const [visibleCount, setVisibleCount] = useState(12);
  return (
    <>
      <p role="status" className="my-6 text-sm text-[var(--text-muted)]">
        {entries.length} Fragen gefunden
        {entries.length > visibleCount ? ` · ${visibleCount} angezeigt` : ""}
      </p>
      {entries.length === 0 && (
        <p>
          Keine passende Frage gefunden. Versuchen Sie einen anderen Begriff oder wählen Sie alle
          Themen.
        </p>
      )}
      <ul className="divide-border-default divide-y">
        {entries.slice(0, visibleCount).map((faq) => (
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
          </li>
        ))}
      </ul>
      {entries.length > visibleCount && (
        <button
          type="button"
          className="button-secondary mt-8 w-full sm:w-auto"
          onClick={() => setVisibleCount((count) => count + 12)}
        >
          Weitere Fragen anzeigen
        </button>
      )}
    </>
  );
}
