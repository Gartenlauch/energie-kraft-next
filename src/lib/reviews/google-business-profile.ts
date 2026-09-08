import "server-only";
import type { ReviewAdapter } from "./types";

/** Sprint 8: authorized Google Business Profile transport and normalization. */
export const googleBusinessProfileAdapter: ReviewAdapter = {
  provider: "google",
  async load() {
    return { status: "not-configured", provider: "google" };
  },
};
