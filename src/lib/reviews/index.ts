import "server-only";
import { googleBusinessProfileAdapter } from "./google-business-profile";
import { trustpilotAdapter } from "./trustpilot";
import type { ReviewCollection } from "./types";

export type { CustomerReview, ReviewSummary, ReviewProvider, ReviewCollection } from "./types";

export async function getCustomerReviews(): Promise<ReviewCollection> {
  const results = await Promise.allSettled([
    googleBusinessProfileAdapter.load(),
    trustpilotAdapter.load(),
  ]);
  const collection: {
    reviews: ReviewCollection["reviews"][number][];
    summaries: ReviewCollection["summaries"][number][];
  } = {
    reviews: [],
    summaries: [],
  };
  for (const result of results) {
    if (result.status === "fulfilled" && result.value.status === "ready") {
      collection.reviews.push(...result.value.data.reviews);
      collection.summaries.push(...result.value.data.summaries);
    }
  }
  return collection;
}
