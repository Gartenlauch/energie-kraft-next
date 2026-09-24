# Google customer reviews integration

**Status: Implemented in the repository; production activation/deployment is not proven by configuration alone.**

The existing adapter `src/lib/reviews/google-business-profile.ts` uses Places API (New), Place Details. There is no second review store or widget. Trustpilot remains unconfigured.

## Configuration

Server-only values:

- `GOOGLE_PLACES_API_KEY` – restricted key for Places API (New)
- `GOOGLE_PLACE_ID` – verified Energie-Kraft business Place ID
- `GOOGLE_REVIEWS_URL` – verified profile/reviews overview fallback URL

Local placeholders are in `.env.example`. `apphosting.yaml` references the API key as a runtime secret and currently contains the Place ID/profile URL configuration; this is not evidence that App Hosting or the integration is live. Never use a `NEXT_PUBLIC_` API key.

## Fetching and display

The adapter requests rating, count, reviews, Google Maps links and attributions with a four-second timeout, `cache: "no-store"` and Zod validation. It never stores the response. Missing configuration suppresses the request/section; provider failures do not break the homepage.

Only usable text reviews returned by Google are eligible. `getVisibleGoogleReviews()` preserves that returned set, filters malformed items and orders up to five newest-first with stable equal-date ordering. There is no star filter and no invented fallback review. Overall rating/count come from the provider summary, not the displayed subset.

Original author/text/rating/date/source links and provider attribution remain visible. The official unchanged Google Maps attribution asset is stored under `public/images/reviews/`. The “all reviews” CTA uses the provider/configured profile URL in a new tab with `noopener noreferrer`.

No Review/AggregateRating JSON-LD is emitted. Before activation, review API restrictions, quotas/costs, provider terms, privacy handling of remote author images and the verified business profile must be approved.
