import type { CustomerReview, ReviewCollection, ReviewProvider } from "@/lib/reviews/types";

const providers: Record<ReviewProvider, string> = { google: "Google", trustpilot: "Trustpilot" };
const number = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
const date = new Intl.DateTimeFormat("de-DE", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="review-stars" role="img" aria-label={`${number.format(rating)} von 5 Sternen`}>
      <span aria-hidden="true">★★★★★</span>
      <span
        aria-hidden="true"
        className="review-stars__fill"
        style={{ width: `${Math.max(0, Math.min(5, rating)) * 20}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}

function validReview(review: CustomerReview) {
  return (
    Boolean(review.author.trim() && review.text.trim()) &&
    Number.isFinite(review.rating) &&
    review.rating >= 1 &&
    review.rating <= 5 &&
    Number.isFinite(Date.parse(review.publishedAt))
  );
}

function sourceHref(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** Empty collections render nothing; only verified provider content belongs here. */
export function CustomerReviewsSection({ reviews, summaries }: ReviewCollection) {
  const visibleReviews = reviews.filter(validReview);
  const visibleSummaries = summaries.filter(
    (summary) =>
      Number.isFinite(summary.averageRating) &&
      summary.averageRating >= 1 &&
      summary.averageRating <= 5 &&
      Number.isInteger(summary.totalReviews) &&
      summary.totalReviews > 0,
  );
  if (!visibleReviews.length && !visibleSummaries.length) return null;

  return (
    <section className="section-space bg-surface-soft" aria-labelledby="customer-reviews-heading">
      <div className="section-shell">
        <div className="text-center">
          <p className="eyebrow justify-center">Kundenbewertungen</p>
          <h2 id="customer-reviews-heading" className="section-title mt-4">
            Das sagen unsere Kunden
          </h2>
        </div>
        {visibleSummaries.length > 0 && (
          <div className="review-summaries mt-10">
            {visibleSummaries.map((summary) => (
              <div key={summary.provider} className="px-8 py-5 text-center">
                <p className="text-brand-primary font-semibold">{providers[summary.provider]}</p>
                <div className="mt-3">
                  <RatingStars rating={summary.averageRating} />
                </div>
                <p className="mt-2">
                  <strong className="text-2xl">{number.format(summary.averageRating)}</strong> / 5
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {number.format(summary.totalReviews)} Bewertungen
                </p>
                {sourceHref(summary.sourceUrl) && (
                  <a
                    href={sourceHref(summary.sourceUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary mt-2 inline-block py-2 text-sm underline underline-offset-4"
                  >
                    Bei {providers[summary.provider]} ansehen
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="review-grid mt-12">
          {visibleReviews.map((review) => (
            <article key={`${review.provider}-${review.id}`} className="review-entry">
              <RatingStars rating={review.rating} />
              <blockquote className="mt-6 text-lg leading-8 whitespace-pre-line">
                {review.text}
              </blockquote>
              <div className="border-border-default mt-7 border-t pt-5">
                <p className="font-semibold">{review.author}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  <time dateTime={review.publishedAt}>
                    {date.format(new Date(review.publishedAt))}
                  </time>{" "}
                  · {providers[review.provider]}
                </p>
                {sourceHref(review.sourceUrl) && (
                  <a
                    href={sourceHref(review.sourceUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary mt-2 inline-block py-2 text-sm underline underline-offset-4"
                  >
                    Originalbewertung lesen
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
