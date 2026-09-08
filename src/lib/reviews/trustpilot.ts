import "server-only";
import type { ReviewAdapter } from "./types";

/** Sprint 8: official Trustpilot transport and normalization. */
export const trustpilotAdapter: ReviewAdapter = {
  provider: "trustpilot",
  async load() {
    return { status: "not-configured", provider: "trustpilot" };
  },
};
