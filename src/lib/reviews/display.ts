import type { CustomerReview } from "./types";

/** Reorder only Google's returned, usable text reviews; do not fetch or select a different set. */
export function getVisibleGoogleReviews(reviews: readonly CustomerReview[]) {
  return reviews
    .filter(
      (review) =>
        review.provider === "google" &&
        Boolean(review.author.trim() && review.text.trim()) &&
        Number.isFinite(review.rating) &&
        review.rating >= 1 &&
        review.rating <= 5 &&
        Number.isFinite(Date.parse(review.publishedAt)),
    )
    .slice(0, 5)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}
