export const SEARCH_NO_INDEX_DIRECTIVE =
  "noindex, nofollow, noarchive, nosnippet";

export function isSearchIndexingEnabled(
  value = process.env.SEARCH_INDEXING_ENABLED,
): boolean {
  return value === "true";
}
