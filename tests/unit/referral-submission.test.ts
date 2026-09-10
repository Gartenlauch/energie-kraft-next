import { describe, expect, it, vi } from "vitest";

import { referralPayloadSchema } from "../../functions/src/referral-validation";
import { hasInvalidSubmissionSignals } from "../../functions/src/submission-security";
import { attemptMailDelivery } from "../../functions/src/submission-workflow";
import { parseReferralInput } from "@/lib/validation/referral";

const validReferral = {
  submissionId: "795df3fb-3e8d-4615-966c-f72c8e465273",
  referrer: {
    salutation: "frau" as const,
    firstName: "Test",
    lastName: "Empfehlung",
    email: "referrer@example.test",
  },
  referredCustomer: {
    salutation: "herr" as const,
    firstName: "Beispiel",
    lastName: "Kontakt",
    email: "referred@example.test",
    street: "Beispielstraße 2",
    postalCode: "83395",
    city: "Freilassing",
  },
  privacyAccepted: true,
  referredPersonPermissionConfirmed: true,
  website: "",
  formStartedAt: 1_000,
};

describe("referral submission", () => {
  it("accepts a valid payload with optional phone", () => {
    expect(parseReferralInput(validReferral).referredCustomer.phone).toBeUndefined();
    expect(referralPayloadSchema.parse(validReferral).referrer.email).toBe("referrer@example.test");
  });

  it("rejects an invalid referrer email", () => {
    expect(() => parseReferralInput({ ...validReferral, referrer: { ...validReferral.referrer, email: "invalid" } })).toThrow();
  });

  it("rejects an invalid referred customer email", () => {
    expect(referralPayloadSchema.safeParse({ ...validReferral, referredCustomer: { ...validReferral.referredCustomer, email: "invalid" } }).success).toBe(false);
  });

  it("rejects missing consent", () => {
    expect(() => parseReferralInput({ ...validReferral, referredPersonPermissionConfirmed: false })).toThrow();
  });

  it("detects the honeypot", () => {
    expect(hasInvalidSubmissionSignals({ website: "bot" }, 10_000)).toBe(true);
  });

  it("keeps a stored referral successful when mail delivery fails", async () => {
    const storedReferral = { id: validReferral.submissionId };
    const logError = vi.fn();
    const mail = await attemptMailDelivery(
      async () => { throw new Error("mock mail failure"); },
      logError,
    );
    expect(storedReferral.id).toBe(validReferral.submissionId);
    expect(mail.status).toBe("failed");
    expect(logError).toHaveBeenCalledOnce();
  });
});
