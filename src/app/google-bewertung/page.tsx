import type { Metadata } from "next";
import Image from "next/image";
import { headers } from "next/headers";

import { buildCanonicalUrl } from "@/lib/seo/canonical";
import { buildMetadata } from "@/lib/seo/metadata";

const title = "Energie-Kraft SÃ¼d | Ihre Meinung zÃ¤hlt";
const description =
  "Waren Sie mit unserer Arbeit zufrieden? Wir freuen uns Ã¼ber Ihre Bewertung bei Google.";
const baseMetadata = buildMetadata({
  title,
  description,
  canonicalPath: "/google-bewertung",
  noIndex: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const first = (value: string | null) => value?.split(",")[0]?.trim();
  const host = first(requestHeaders.get("x-forwarded-host")) || first(requestHeaders.get("host"));
  const forwardedProtocol = first(requestHeaders.get("x-forwarded-proto"));
  const protocol =
    forwardedProtocol === "http" || forwardedProtocol === "https"
      ? forwardedProtocol
      : host && /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host)
        ? "http"
        : "https";
  let requestOrigin = buildCanonicalUrl("/");
  if (host && !/[\s/@\\?#]/.test(host)) {
    try {
      requestOrigin = new URL(`${protocol}://${host}`).origin;
    } catch {
      // Malformed/missing proxy headers must not break metadata rendering.
    }
  }

  const requestPageUrl = new URL("/google-bewertung", requestOrigin).toString();
  const requestImageUrl = new URL(
    "/images/google-bewertung/google-bewertung-share-v2.jpg",
    requestOrigin,
  ).toString();

  return {
    ...baseMetadata,
    robots: { index: false, follow: true },
    openGraph: {
      ...baseMetadata.openGraph,
      url: requestPageUrl,
      images: [
        {
          url: requestImageUrl,
          type: "image/jpeg",
          width: 1200,
          height: 630,
          alt: "Energie-Kraft SÃ¼d â€“ Ihre Meinung zÃ¤hlt. FÃ¼nf Sterne vor einem illustrativen Hausmotiv mit Photovoltaik und WÃ¤rmepumpe.",
        },
      ],
    },
  };
}

// Outside (site) deliberately: this focused invitation needs no marketing navigation.
export default function GoogleReviewPage() {
  return (
    <main
      id="main-content"
      className="border-brand-primary bg-background flex min-h-svh flex-col items-center border-t-4 px-5 py-8 text-center sm:px-8 sm:py-12"
    >
      <Image
        src="/brand/energie-kraft/eksued-logo-website.svg"
        alt="Energie-Kraft SÃ¼d"
        width={292}
        height={57}
        priority
        className="h-auto w-56 sm:w-64"
      />

      <div className="my-auto w-full max-w-xl py-9 sm:py-16">
        <div aria-hidden="true" className="text-brand-primary mb-5 flex justify-center gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <svg key={index} viewBox="0 0 24 24" fill="currentColor" className="size-6 sm:size-7">
              <path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5Z" />
            </svg>
          ))}
        </div>

        <h1 className="text-brand-navy text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.08] font-bold tracking-tight">
          Ihre Meinung zÃ¤hlt.
        </h1>

        <div className="text-brand-dark mx-auto mt-6 max-w-lg space-y-4 text-[0.9375rem] leading-relaxed sm:text-base">
          <p>
            Waren Sie mit unserer Beratung, Installation oder unserem Service zufrieden? Dann freuen
            wir uns sehr Ã¼ber Ihre persÃ¶nliche Bewertung bei Google.
          </p>
          <p>
            Ihre RÃ¼ckmeldung hilft anderen Kunden bei ihrer Entscheidung und unterstÃ¼tzt uns als
            regionales Unternehmen.
          </p>
        </div>

        <a
          href="https://g.page/r/CbQYaiCf6F9eEBM/review"
          className="button-primary mt-7 min-h-14 w-full gap-3 sm:w-auto"
          aria-describedby="google-review-hint"
        >
          Google-Bewertung abgeben
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="size-5 shrink-0"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </a>
        <p
          id="google-review-hint"
          className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm"
        >
          Sie werden anschlieÃŸend zu unserem Google-Unternehmensprofil weitergeleitet.
        </p>

        <p className="text-brand-dark mt-9 text-sm leading-relaxed sm:mt-12">
          Vielen Dank fÃ¼r Ihr Vertrauen.
          <br />
          <span className="font-semibold">Ihr Team von Energie-Kraft SÃ¼d</span>
        </p>
      </div>
    </main>
  );
}