import "server-only";

/** Server-only activation. The address-search URL is NOT a business profile. */
export function getGoogleReviewsConfig() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();
  const overviewUrl = process.env.GOOGLE_REVIEWS_URL?.trim();
  if (!apiKey || !placeId || !overviewUrl) return null;
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
      return null;
    return { apiKey, placeId, overviewUrl: url.href };
  } catch {
    return null;
  }
}
