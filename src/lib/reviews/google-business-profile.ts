import "server-only";
import { z } from "zod";
import { getGoogleReviewsConfig } from "@/config/google-reviews";
import type { ReviewAdapter, CustomerReview } from "./types";

const responseSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  userRatingCount: z.number().int().nonnegative().optional(),
  reviews: z.array(z.unknown()).default([]),
  attributions: z
    .array(z.object({ provider: z.string(), providerUri: z.string().optional() }))
    .default([]),
});
const reviewSchema = z.object({
  name: z.string(),
  rating: z.number().min(1).max(5),
  publishTime: z.string().refine((value) => Number.isFinite(Date.parse(value))),
  relativePublishTimeDescription: z.string().optional(),
  text: z.object({ text: z.string(), languageCode: z.string().optional() }).optional(),
  originalText: z.object({ text: z.string(), languageCode: z.string().optional() }).optional(),
  googleMapsUri: z.string().url(),
  authorAttribution: z.object({
    displayName: z.string().min(1),
    uri: z.string().url().optional(),
    photoUri: z.string().url().optional(),
  }),
});

/** Official Places API (New), through the existing Google Business Profile adapter. */
export const googleBusinessProfileAdapter: ReviewAdapter = {
  provider: "google",
  async load() {
    const config = getGoogleReviewsConfig();
    if (!config) return { status: "not-configured", provider: "google" };
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${encodeURIComponent(config.placeId)}?languageCode=de`,
        {
          headers: {
            "X-Goog-Api-Key": config.apiKey,
            "X-Goog-FieldMask": "rating,userRatingCount,reviews,attributions",
          },
          cache: "no-store",
          signal: AbortSignal.timeout(4000),
        },
      );
      if (!response.ok) throw new Error("Provider unavailable");
      const data = responseSchema.parse(await response.json());
      if (!data.rating || !data.userRatingCount)
        return { status: "unavailable", provider: "google" };
      const reviews: CustomerReview[] = [];
      for (const entry of data.reviews) {
        const parsed = reviewSchema.safeParse(entry);
        if (!parsed.success) continue;
        const review = parsed.data;
        const original = review.originalText ?? review.text;
        if (!original?.text.trim()) continue;
        reviews.push({
          id: review.name,
          provider: "google",
          author: review.authorAttribution.displayName,
          authorUrl: review.authorAttribution.uri,
          authorImageUrl: review.authorAttribution.photoUri,
          rating: review.rating,
          text: original.text,
          languageCode: original.languageCode,
          publishedAt: review.publishTime,
          relativeDate: review.relativePublishTimeDescription,
          sourceUrl: review.googleMapsUri,
        });
      }
      return {
        status: "ready",
        provider: "google",
        data: {
          reviews: reviews.slice(0, 3),
          summaries:
            data.rating && data.userRatingCount
              ? [
                  {
                    provider: "google",
                    averageRating: data.rating,
                    totalReviews: data.userRatingCount,
                    sourceUrl: config.overviewUrl,
                    attributions: data.attributions,
                  },
                ]
              : [],
        },
      };
    } catch {
      // No API keys, request headers, response bodies or personal data in logs.
      console.warn("Google reviews temporarily unavailable");
      return { status: "unavailable", provider: "google" };
    }
  },
};
