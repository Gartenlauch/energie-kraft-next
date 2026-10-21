export const SEARCH_NO_INDEX_DIRECTIVE = "noindex, nofollow, noarchive, nosnippet";

export const SEARCH_PRODUCTION_HOST = "www.energie-kraft.de";

// Shared by Next's raw Host-header matcher and request-time metadata/robots.
// Only the canonical HTTPS authority is eligible, never a forwarded header.
export const SEARCH_PRODUCTION_HOST_PATTERN =
  SEARCH_PRODUCTION_HOST.split("")
    .map((character) =>
      /[a-z]/.test(character)
        ? `[${character}${character.toUpperCase()}]`
        : character === "."
          ? "\\."
          : character,
    )
    .join("") + "(?::443)?";

const productionHost = new RegExp(`^${SEARCH_PRODUCTION_HOST_PATTERN}$`);

export function isSearchIndexingEnabled(value = process.env.SEARCH_INDEXING_ENABLED): boolean {
  return value === "true";
}

export function isSearchIndexingEnabledForHost(
  host: string | null,
  value = process.env.SEARCH_INDEXING_ENABLED,
  siteEnv = process.env.NEXT_PUBLIC_SITE_ENV,
): boolean {
  return (
    isSearchIndexingEnabled(value) &&
    siteEnv === "production" &&
    host !== null &&
    productionHost.test(host)
  );
}
