export const SEARCH_NO_INDEX_DIRECTIVE = "noindex, nofollow, noarchive, nosnippet";

export const SEARCH_PRODUCTION_HOST = "www.energie-kraft.de";

// Shared by Next's raw Host-header matcher and request-time metadata/robots.
// Never use a forwarded host to grant indexing permission.
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

export function isSearchIndexingEnabledForRequest(requestHeaders: Pick<Headers, "get">): boolean {
  // App Hosting terminates TLS; Next supplies this header from the transport
  // when the proxy has not supplied it. Missing/ambiguous protocols fail closed.
  return (
    requestHeaders.get("x-forwarded-proto") === "https" &&
    isSearchIndexingEnabledForHost(requestHeaders.get("host"))
  );
}
