import type { LeadStatus } from "@/types/lead";

export type AdminSort = "newest" | "oldest" | "name_asc" | "name_desc";

export function normalizeSearchText(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("de").trim();
}

export function matchesSearchTerms(query: string, ...values: Array<string | null | undefined>): boolean {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const haystack = normalizeSearchText(values.filter(Boolean).join(" "));
  return terms.every((term) => haystack.includes(term));
}

export function isAdminSort(value: string | undefined): value is AdminSort {
  return value === "newest" || value === "oldest" || value === "name_asc" || value === "name_desc";
}

export function sortAdminItems<T>(items: readonly T[], sort: AdminSort, name: (item: T) => string, time: (item: T) => number): T[] {
  return [...items].sort((left, right) => {
    if (sort === "name_asc" || sort === "name_desc") {
      const result = name(left).localeCompare(name(right), "de", { sensitivity: "base" });
      return sort === "name_asc" ? result : -result;
    }
    return sort === "oldest" ? time(left) - time(right) : time(right) - time(left);
  });
}

export function countStatuses(items: readonly { status: LeadStatus }[]) {
  const counts: Record<LeadStatus, number> = { new: 0, in_progress: 0, completed: 0, rejected: 0 };
  for (const item of items) counts[item.status] += 1;
  return { ...counts, total: items.length, open: counts.new + counts.in_progress };
}

export function timestampMillis(value: { toMillis(): number }): number {
  try { return value.toMillis(); } catch { return 0; }
}
