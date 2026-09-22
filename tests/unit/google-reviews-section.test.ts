import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const config = vi.hoisted(() => ({ enabled: true }));
vi.mock("server-only", () => ({}));
vi.mock("@/config/google-reviews", () => ({
  getGoogleReviewsConfig: () => config.enabled
    ? { apiKey: "server-test-key", placeId: "test-place", overviewUrl: "https://maps.google.com/fallback" }
    : null,
}));

import { googleBusinessProfileAdapter } from "@/lib/reviews/google-business-profile";
import { getVisibleGoogleReviews } from "@/lib/reviews/display";

afterEach(() => {
  vi.unstubAllGlobals();
  config.enabled = true;
});

const review = (index: number) => ({
  name: `places/test/reviews/${index}`,
  rating: index % 2 ? 1 : 5,
  publishTime: `2026-09-${String(index).padStart(2, "0")}T12:00:00Z`,
  text: { text: `Review ${index}`, languageCode: "en" },
  googleMapsUri: `https://maps.google.com/review/${index}`,
  authorAttribution: { displayName: `Reviewer ${index}`, uri: "https://maps.google.com/user" },
});

describe("Google Places review adapter", () => {
  it("keeps all five valid text reviews in provider order and uses supplied Maps links", async () => {
    const response = {
      rating: 4.9,
      userRatingCount: 147,
      reviews: [review(1), review(2), { ...review(3), text: { text: "" } }, review(4), review(5), review(6)],
      attributions: [{ provider: "Google Maps", providerUri: "https://maps.google.com" }],
      googleMapsLinks: {
        reviewsUri: "https://maps.google.com/reviews",
        writeAReviewUri: "https://maps.google.com/write",
      },
    };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => response });
    vi.stubGlobal("fetch", fetchMock);
    const result = await googleBusinessProfileAdapter.load();
    expect(result.status).toBe("ready");
    if (result.status !== "ready") return;
    expect(result.data.reviews.map((entry) => entry.id)).toEqual([1, 2, 4, 5, 6].map((index) => review(index).name));
    expect(getVisibleGoogleReviews(result.data.reviews).map((entry) => entry.id)).toEqual(
      [6, 5, 4, 2, 1].map((index) => review(index).name),
    );
    expect(result.data.reviews[0]!.rating).toBe(1);
    expect(result.data.summaries[0]).toMatchObject({
      averageRating: 4.9, totalReviews: 147,
      sourceUrl: "https://maps.google.com/reviews",
      writeReviewUrl: "https://maps.google.com/write",
      attributions: response.attributions,
    });
    expect(fetchMock.mock.calls[0]![1].headers["X-Goog-FieldMask"]).toContain("googleMapsLinks");
    expect(fetchMock.mock.calls[0]![0]).not.toContain("server-test-key");
  });

  it("fails quietly when not configured or when the provider responds unexpectedly", async () => {
    config.enabled = false;
    expect((await googleBusinessProfileAdapter.load()).status).toBe("not-configured");
    config.enabled = true;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ rating: "invalid" }) }));
    expect((await googleBusinessProfileAdapter.load()).status).toBe("unavailable");
  });

  it("does not add self-serving review structured data", () => {
    const source = readFileSync(path.join(process.cwd(), "src/components/marketing/customer-reviews-section.tsx"), "utf8");
    expect(source).not.toMatch(/JsonLdScript|AggregateRating|application\/ld\+json/);
    expect(source).toContain("Google liefert eine Auswahl von bis zu fünf Bewertungen nach Relevanz");
    expect(source).toContain("nach Datum, neueste zuerst");
    expect(source).toContain("/images/reviews/google-wordmark.png");
    expect(source).toContain("/images/reviews/google-g.png");
  });
});

describe("review display order", () => {
  it("sorts only valid returned reviews by instant, keeping provider order for ties", () => {
    const make = (id: string, publishedAt: string, text = "Text") => ({
      id, publishedAt, text, provider: "google" as const,
      author: "Reviewer", rating: 5,
    });
    const returned = [
      make("old", "2026-09-01T12:00:00Z"),
      make("same-a", "2026-09-03T12:00:00Z"),
      make("invalid", "2026-09-05T12:00:00Z", ""),
      make("new", "2026-09-04T14:00:00+02:00"),
      make("same-b", "2026-09-03T12:00:00Z"),
    ];
    expect(getVisibleGoogleReviews(returned).map((entry) => entry.id)).toEqual([
      "new", "same-a", "same-b", "old",
    ]);
    expect(returned.map((entry) => entry.id)).toEqual([
      "old", "same-a", "invalid", "new", "same-b",
    ]);
  });
});
