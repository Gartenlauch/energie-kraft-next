import Image from "next/image";
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
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow">Erfahrungen aus erster Hand</p>
            <h2 id="customer-reviews-heading" className="section-title mt-4">
              Das sagen unsere Kunden
            </h2>
          </div>
          {visibleSummaries.length > 0 && (
            <div className="flex flex-wrap gap-8">
              {visibleSummaries.map((summary) => (
                <div key={summary.provider}>
                  {summary.provider === "google" ? (
                    <div className="inline-block px-2.5 pt-2.5 pb-[5px]">
                      <Image
                        src="/images/reviews/google-maps-attribution.png"
                        alt="Google Maps"
                        width={98}
                        height={18}
                        unoptimized
                      />
                    </div>
                  ) : (
                    <p className="text-sm">{providers[summary.provider]}</p>
                  )}
                  <div className="mt-3">
                    <RatingStars rating={summary.averageRating} />
                  </div>
                  <p className="mt-2">
                    <strong className="text-4xl tracking-tight">
                      {number.format(summary.averageRating)}
                    </strong>{" "}
                    / 5
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {number.format(summary.totalReviews)} Bewertungen
                  </p>
                  {sourceHref(summary.sourceUrl) && (
                    <a
                      href={sourceHref(summary.sourceUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-primary mt-2 inline-flex min-h-11 items-center py-2 text-sm font-semibold underline underline-offset-4"
                    >
                      {summary.provider === "google"
                        ? "Alle Google-Bewertungen ansehen"
                        : `Bei ${providers[summary.provider]} ansehen`}
                    </a>
                  )}
                  {summary.attributions?.map((credit) => (
                    <p key={credit.provider} className="mt-2 text-xs text-[var(--text-muted)]">
                      {sourceHref(credit.providerUri) ? (
                        <a
                          href={sourceHref(credit.providerUri)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          {credit.provider}
                        </a>
                      ) : (
                        credit.provider
                      )}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-border-strong mt-10 grid gap-10 border-t pt-10 lg:grid-cols-3 lg:gap-12">
          {visibleReviews.map((review) => (
            <article
              key={`${review.provider}-${review.id}`}
              className="flex min-w-0 flex-col items-start"
            >
              <RatingStars rating={review.rating} />
              <blockquote
                lang={review.languageCode}
                className="mt-5 text-base leading-8 [overflow-wrap:anywhere] whitespace-pre-line"
              >
                {review.text}
              </blockquote>
              <div className="border-border-default mt-7 w-full border-t pt-5">
                <div className="flex items-center gap-3">
                  {sourceHref(review.authorImageUrl) ? (
                    <Image
                      src={sourceHref(review.authorImageUrl)!}
                      alt={`Profilbild von ${review.author}`}
                      width={36}
                      height={36}
                      unoptimized
                      referrerPolicy="no-referrer"
                      className="size-9 rounded-full"
                    />
                  ) : null}
                  <p className="text-sm font-semibold">
                    {sourceHref(review.authorUrl) ? (
                      <a
                        href={sourceHref(review.authorUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4"
                      >
                        {review.author}
                      </a>
                    ) : (
                      review.author
                    )}
                  </p>
                </div>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  <time dateTime={review.publishedAt}>
                    {review.relativeDate ?? date.format(new Date(review.publishedAt))}
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
        {visibleReviews.some((review) => review.provider === "google") ? (
          <div className="border-border-default mt-10 border-t pt-6 text-xs leading-6 text-[var(--text-muted)]">
            <p>
              Auswahl von bis zu drei textlichen Bewertungen aus der Google-API, in der von Google
              gelieferten Relevanzreihenfolge. Keine Auswahl nach Sternezahl; Texte in der
              Originalsprache.
            </p>
            <p className="mt-2">
              Google überprüft Bewertungen nicht auf einen tatsächlichen Kundenkontakt und entfernt
              erkannte gefälschte Inhalte.{" "}
              <a
                href="https://support.google.com/contributionpolicy/answer/7400114"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Google-Bewertungsrichtlinien
              </a>{" "}
              ·{" "}
              <a
                href="https://maps.google.com/help/terms_maps.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Google Maps-Nutzungsbedingungen
              </a>{" "}
              ·{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Google-Datenschutzerklärung
              </a>
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
