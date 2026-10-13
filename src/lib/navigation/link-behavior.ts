const FIRST_PARTY_HOSTS = new Set([
  "energie-kraft.de",
  "www.energie-kraft.de",
  "energie-kraft-next--energie-kraft-next.europe-west4.hosted.app",
]);

/** Relative paths, fragments and non-web protocols keep their native behavior. */
export function isExternalWebLink(href: string, canonicalBaseUrl: string): boolean {
  if (!/^(?:https?:\/\/|\/\/)/i.test(href)) return false;
  try {
    const url = new URL(href, canonicalBaseUrl);
    const canonical = new URL(canonicalBaseUrl);
    return !FIRST_PARTY_HOSTS.has(url.hostname) && url.origin !== canonical.origin;
  } catch {
    return false;
  }
}

export function newTabRel(rel?: string): string {
  return [...new Set([...(rel?.split(/\s+/).filter(Boolean) ?? []), "noopener"])].join(" ");
}
