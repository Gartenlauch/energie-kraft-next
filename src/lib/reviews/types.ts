export type ReviewProvider = "google" | "trustpilot";

export interface CustomerReview {
  id: string;
  provider: ReviewProvider;
  author: string;
  rating: number;
  text: string;
  /** ISO-8601 timestamp supplied by the provider. */
  publishedAt: string;
  sourceUrl?: string;
}

export interface ReviewSummary {
  provider: ReviewProvider;
  averageRating: number;
  totalReviews: number;
  sourceUrl?: string;
}

export interface ReviewCollection {
  reviews: readonly CustomerReview[];
  summaries: readonly ReviewSummary[];
}

export type ReviewProviderResult =
  | { status: "not-configured"; provider: ReviewProvider }
  | { status: "ready"; provider: ReviewProvider; data: ReviewCollection };

export interface ReviewAdapter {
  provider: ReviewProvider;
  load: () => Promise<ReviewProviderResult>;
}
