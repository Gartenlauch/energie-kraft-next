import "server-only";

/** Server-only activation. Maps links from Places take priority over this optional fallback. */
export function getGoogleReviewsConfig() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();
  const overviewUrl = process.env.GOOGLE_REVIEWS_URL?.trim();
  if (!apiKey || !placeId) return null;
  if (!overviewUrl) return { apiKey, placeId, overviewUrl: undefined };
  try {
    const url = new URL(overviewUrl);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      ![
        "www.google.com",
        "google.com",
        "maps.google.com",
        "www.google.de",
        "maps.google.de",
        "maps.app.goo.gl",
        "g.page",
      ].includes(url.hostname)
    )
      return { apiKey, placeId, overviewUrl: undefined };
    return { apiKey, placeId, overviewUrl: url.href };
  } catch {
    return { apiKey, placeId, overviewUrl: undefined };
  }
}
