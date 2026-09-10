import { describe, expect, it, vi } from "vitest";

import { applicationPayloadSchema } from "../../functions/src/application-validation";
import { hasInvalidSubmissionSignals } from "../../functions/src/submission-security";
import { attemptMailDelivery } from "../../functions/src/submission-workflow";
import { parseApplicationInput } from "@/lib/validation/application";

const validApplication = {
  submissionId: "64e33d4b-c882-49f4-a0f6-625a47a10ee8",
  jobId: "elektriker",
  salutation: "divers" as const,
  firstName: "Test",
  lastName: "Person",
  street: "Musterweg 1",
  postalCode: "83404",
  city: "Ainring",
  email: "application@example.test",
  phone: "+49 8654 123456",
  qualificationExperience: "Mehrjährige Erfahrung in der Elektrotechnik.",
  privacyAccepted: true,
  website: "",
  formStartedAt: 1_000,
};

describe("application submission", () => {
  it("accepts a valid payload on client and server", () => {
    expect(parseApplicationInput(validApplication).jobId).toBe("elektriker");
    expect(applicationPayloadSchema.parse(validApplication).email).toBe("application@example.test");
  });

  it("rejects an invalid email", () => {
    expect(() => parseApplicationInput({ ...validApplication, email: "invalid" })).toThrow();
    expect(applicationPayloadSchema.safeParse({ ...validApplication, email: "invalid" }).success).toBe(false);
  });

  it("rejects a missing required field", () => {
    const { street: _street, ...withoutStreet } = validApplication;
    expect(applicationPayloadSchema.safeParse(withoutStreet).success).toBe(false);
  });

  it("rejects missing consent", () => {
    expect(() => parseApplicationInput({ ...validApplication, privacyAccepted: false })).toThrow();
  });

  it("detects the honeypot and implausible timing", () => {
    expect(hasInvalidSubmissionSignals({ website: "spam.example" }, 10_000)).toBe(true);
    expect(hasInvalidSubmissionSignals({ formStartedAt: 9_500 }, 10_000)).toBe(true);
  });

  it("keeps a stored submission successful when mail delivery fails", async () => {
    const storedApplication = { id: validApplication.submissionId };
    const logError = vi.fn();
    const mail = await attemptMailDelivery(
      async () => { throw new Error("mock mail failure"); },
      logError,
    );
    expect(storedApplication.id).toBe(validApplication.submissionId);
    expect(mail).toEqual({ status: "failed", messageId: null });
    expect(logError).toHaveBeenCalledOnce();
  });
});
