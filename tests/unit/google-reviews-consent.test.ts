// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as CookieConsent from "vanilla-cookieconsent";
import { ConsentManager } from "@/components/consent/consent-manager";
import { CustomerReviewsSection } from "@/components/marketing/customer-reviews-section";
import { CONSENT_CHANGE_EVENT } from "@/lib/consent/client";
import { CONSENT_STORAGE_KEY } from "@/lib/consent/policy";
import type { ReviewCollection } from "@/lib/reviews/types";

vi.mock("embla-carousel-react", () => ({ default: () => [() => {}, undefined] }));
vi.mock("next/image", () => ({
  default: ({ unoptimized, ...props }: { unoptimized?: boolean }) => {
    void unoptimized;
    return createElement("img", props);
  },
}));
vi.mock("@/components/ui/public-link", () => ({
  PublicLink: (props: Record<string, unknown>) => createElement("a", props),
}));

const data: ReviewCollection = {
  summaries: [
    {
      provider: "google",
      averageRating: 4.5,
      totalReviews: 2,
      sourceUrl: "https://maps.google.com/reviews",
      attributions: [{ provider: "Google Maps", providerUri: "https://maps.google.com" }],
    },
  ],
  reviews: [
    {
      id: "test-review",
      provider: "google",
      author: "Test author",
      authorUrl: "https://maps.google.com/user",
      authorImageUrl: "https://lh3.googleusercontent.com/test-avatar",
      sourceUrl: "https://maps.google.com/review",
      text: "Test review text",
      rating: 5,
      publishedAt: "2026-10-01T12:00:00Z",
    },
  ],
};
let container: HTMLDivElement;
let root: Root;
const render = async (manager = true) => {
  await act(async () =>
    root.render(
      createElement(
        "div",
        null,
        manager ? createElement(ConsentManager) : null,
        createElement(CustomerReviewsSection, data),
      ),
    ),
  );
};
const authors = () => container.querySelectorAll('img[src^="https://"]');
const decision = () => JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!).categories;
const accept = (categories: string | string[]) =>
  act(() => CookieConsent.acceptCategory(categories));
const revokeInOtherTab = () => {
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  return act(async () =>
    window.dispatchEvent(new StorageEvent("storage", { key: CONSENT_STORAGE_KEY })),
  );
};
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  localStorage.clear();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  CookieConsent.reset(true);
  vi.unstubAllGlobals();
});

describe("Google reviews consent boundary", () => {
  it("renders no external image, preload, review text or author in server HTML even with saved consent", async () => {
    await render();
    accept("all");
    const html = renderToString(createElement(CustomerReviewsSection, data));
    expect(html).toContain("Google-Bewertungen aktivieren");
    expect(html).not.toMatch(/googleusercontent|Test author|Test review text|rel="preload"/);
  });

  it("shows an explained, labelled placeholder on first visit and after rejecting all", async () => {
    await render();
    expect(authors()).toHaveLength(0);
    const button = Array.from(container.querySelectorAll("button")).find((entry) =>
      entry.textContent?.includes("Google-Bewertungen aktivieren"),
    )!;
    expect(button.type).toBe("button");
    expect(
      container.querySelector(`#${button.getAttribute("aria-describedby")}`)?.textContent,
    ).toContain("IP-Adresse");
    accept([]);
    expect(authors()).toHaveLength(0);
    expect(container.querySelector("blockquote")).toBeNull();
  });

  it("shows the complete attribution and image immediately after accepting all", async () => {
    await render();
    accept("all");
    expect(authors()).toHaveLength(1);
    expect(container.querySelector("blockquote")?.textContent).toBe("Test review text");
    expect(
      container.querySelector('a[href="https://maps.google.com/user"]')?.textContent,
    ).toContain("Test author");
    expect(container.querySelector('a[href="https://maps.google.com/review"]')).not.toBeNull();
    expect(container.querySelector('a[href="https://maps.google.com/"]')?.textContent).toBe(
      "Google Maps",
    );
    expect(container.querySelector('img[alt="Google"]')).not.toBeNull();
  });

  it("activates only reviews from the placeholder and preserves keyboard focus", async () => {
    await render();
    accept([]);
    const button = container.querySelector<HTMLButtonElement>(
      'button[aria-describedby="google-reviews-consent-description"]',
    )!;
    button.focus();
    act(() => button.click());
    expect(decision()).toEqual(["necessary", "googleReviews"]);
    expect(authors()).toHaveLength(1);
    expect(document.activeElement?.id).toBe("customer-reviews-heading");
  });

  it("preserves an existing independent statistics choice when activating reviews", async () => {
    await render();
    accept(["necessary", "analytics"]);
    act(() =>
      container
        .querySelector<HTMLButtonElement>(
          'button[aria-describedby="google-reviews-consent-description"]',
        )!
        .click(),
    );
    expect(decision()).toEqual(["necessary", "analytics", "googleReviews"]);
  });

  it("reacts to individual selection and immediately unmounts images on revocation", async () => {
    await render();
    accept(["necessary", "googleReviews"]);
    expect(authors()).toHaveLength(1);
    accept([]);
    expect(authors()).toHaveLength(0);
    expect(container.querySelector("blockquote")).toBeNull();
  });

  it("restores a saved decision on remount and handles real manager cross-tab invalidation", async () => {
    await render();
    accept(["necessary", "googleReviews"]);
    await act(async () => root.render(null));
    await render();
    expect(authors()).toHaveLength(1);
    await revokeInOtherTab();
    expect(authors()).toHaveLength(0);
  });

  it("fails closed for expired or corrupt decisions", async () => {
    await render();
    accept(["necessary", "googleReviews"]);
    const stored = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!);
    stored.expirationTime = Date.now() - 1;
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
    act(() => window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT)));
    expect(authors()).toHaveLength(0);
    localStorage.setItem(CONSENT_STORAGE_KEY, "{invalid");
    act(() => window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT)));
    expect(authors()).toHaveLength(0);
  });

  it("keeps the existing unavailable-provider behavior", async () => {
    await act(async () =>
      root.render(createElement(CustomerReviewsSection, { reviews: [], summaries: [] })),
    );
    expect(container.textContent).toBe("");
  });
});
