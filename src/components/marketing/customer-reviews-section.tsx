"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { getVisibleGoogleReviews } from "@/lib/reviews/display";
import type { CustomerReview, ReviewCollection } from "@/lib/reviews/types";

const number = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 });
const date = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function safeHref(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : undefined;
  } catch { return undefined; }
}

function RatingStars({ rating }: { rating: number }) {
  return <span className="review-stars" role="img" aria-label={`${number.format(rating)} von 5 Sternen`}>
    <span aria-hidden="true">★★★★★</span>
    <span aria-hidden="true" className="review-stars__fill" style={{ width: `${Math.max(0, Math.min(5, rating)) * 20}%` }}>★★★★★</span>
  </span>;
}

function ReviewCard({ review }: { review: CustomerReview }) {
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > 280;
  const original = safeHref(review.sourceUrl);
  return <article className="flex h-full flex-col border-t-2 border-[var(--brand-primary)] bg-white px-6 py-7 sm:px-7">
    <div className="flex items-center justify-between gap-3">
      <RatingStars rating={review.rating} />
      <Image src="/images/reviews/google-g.png" alt="Google" width={48} height={48} unoptimized className="size-12 shrink-0" />
    </div>
    <blockquote lang={review.languageCode} className={`mt-5 text-[0.96rem] leading-7 text-brand-dark [overflow-wrap:anywhere] whitespace-pre-line ${long && !expanded ? "line-clamp-6" : ""}`}>
      {review.text}
    </blockquote>
    {long && <button type="button" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} className="text-brand-primary mt-2 self-start py-2 text-sm font-semibold underline underline-offset-4">
      {expanded ? "Weniger lesen" : "Mehr lesen"}
    </button>}
    <div className="border-border-default mt-auto border-t pt-5">
      <div className="flex items-center gap-3">
        {safeHref(review.authorImageUrl) && <Image src={safeHref(review.authorImageUrl)!} alt="" width={40} height={40} unoptimized referrerPolicy="no-referrer" className="size-10 shrink-0 rounded-full object-cover" />}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-dark">
            {safeHref(review.authorUrl) ? <a href={safeHref(review.authorUrl)} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{review.author}</a> : review.author}
          </p>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]"><time dateTime={review.publishedAt}>{review.relativeDate ?? date.format(new Date(review.publishedAt))}</time></p>
        </div>
      </div>
      {original && <a href={original} target="_blank" rel="noopener noreferrer" className="text-brand-primary mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">Originalbewertung ansehen</a>}
    </div>
  </article>;
}

export function CustomerReviewsSection({ reviews, summaries }: ReviewCollection) {
  const summary = summaries.find((entry) => entry.provider === "google" && Number.isFinite(entry.averageRating) && entry.averageRating >= 1 && entry.averageRating <= 5 && Number.isInteger(entry.totalReviews) && entry.totalReviews > 0);
  const visible = getVisibleGoogleReviews(reviews);
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [position, setPosition] = useState(0);
  const [count, setCount] = useState(0);
  const update = useCallback(() => {
    if (!embla) return;
    setPosition(embla.selectedScrollSnap());
    setCount(embla.scrollSnapList().length);
  }, [embla]);
  useEffect(() => {
    if (!embla) return;
    const frame = requestAnimationFrame(update);
    embla.on("select", update).on("reInit", update);
    return () => { cancelAnimationFrame(frame); embla.off("select", update).off("reInit", update); };
  }, [embla, update]);
  if (!summary || !visible.length) return null;

  return <section className="section-space bg-surface-soft" aria-labelledby="customer-reviews-heading">
    <div className="section-shell">
      <p className="eyebrow">Kundenbewertungen</p>
      <h2 id="customer-reviews-heading" className="section-title mt-4">Das sagen unsere Kunden</h2>
      <div className="border-border-default mt-9 flex flex-wrap items-center justify-between gap-x-10 gap-y-6 border-y py-7 md:mt-12">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-3">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1">
              <Image src="/images/reviews/google-wordmark.png" alt="Google" width={112} height={61} unoptimized className="h-auto w-28" />
              <span className="text-sm font-semibold text-brand-dark">Bewertungen</span>
            </div>
          </div>
          <div className="border-border-default flex flex-wrap items-center gap-x-3 gap-y-1 md:border-l md:pl-8">
            <RatingStars rating={summary.averageRating} />
            <strong className="text-3xl tracking-tight text-brand-dark">{number.format(summary.averageRating)}</strong>
            <span className="text-sm text-[var(--text-muted)]">{number.format(summary.totalReviews)} Bewertungen</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-semibold">
          {safeHref(summary.sourceUrl) && <a href={safeHref(summary.sourceUrl)} target="_blank" rel="noopener noreferrer" className="text-brand-primary inline-flex min-h-11 items-center underline underline-offset-4">Alle Google-Bewertungen ansehen</a>}
          {safeHref(summary.writeReviewUrl) && <a href={safeHref(summary.writeReviewUrl)} target="_blank" rel="noopener noreferrer" className="text-brand-primary inline-flex min-h-11 items-center underline underline-offset-4">Eine Bewertung schreiben</a>}
        </div>
      </div>
      <div className="mt-9 overflow-hidden md:mt-11" ref={emblaRef} aria-label="Google-Bewertungen">
        <div className="-ml-4 flex items-stretch">
          {visible.map((review) => <div key={review.id} className="min-w-0 flex-[0_0_100%] pl-4 md:flex-[0_0_50%] xl:flex-[0_0_33.333%]"><ReviewCard review={review} /></div>)}
        </div>
      </div>
      {count > 1 && <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm tabular-nums text-[var(--text-muted)]">{position + 1} / {count}</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => embla?.scrollPrev()} disabled={position === 0} aria-label="Vorherige Bewertungen" className="border-border-strong text-brand-dark grid size-11 place-items-center rounded-full border transition-colors hover:bg-white disabled:opacity-40">←</button>
          <button type="button" onClick={() => embla?.scrollNext()} disabled={position === count - 1} aria-label="Weitere Bewertungen" className="border-border-strong text-brand-dark grid size-11 place-items-center rounded-full border transition-colors hover:bg-white disabled:opacity-40">→</button>
        </div>
      </div>}
      {summary.attributions?.length ? <div className="mt-6 text-xs text-[var(--text-muted)]">{summary.attributions.map((credit) => safeHref(credit.providerUri)
        ? <a key={credit.provider} href={safeHref(credit.providerUri)} target="_blank" rel="noopener noreferrer" className="mr-4 underline">{credit.provider}</a>
        : <span key={credit.provider} className="mr-4">{credit.provider}</span>)}</div> : null}
      <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">Google liefert eine Auswahl von bis zu fünf Bewertungen nach Relevanz. Wir zeigen deren gültige Texte nach Datum, neueste zuerst.</p>
      <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">Google überprüft Bewertungen nicht auf einen tatsächlichen Kundenkontakt. <a href="https://support.google.com/contributionpolicy/answer/7400114" target="_blank" rel="noopener noreferrer" className="underline">Bewertungsrichtlinien</a> · <a href="https://maps.google.com/help/terms_maps.html" target="_blank" rel="noopener noreferrer" className="underline">Google Maps-Nutzungsbedingungen</a> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Datenschutz</a></p>
    </div>
  </section>;
}
