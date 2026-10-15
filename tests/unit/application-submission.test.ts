import { describe, expect, it, vi } from "vitest";

import { applicationPayloadSchema, getApplicationJobTitle } from "../../functions/src/application-validation";
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

const resume = {
  name: "Lebenslauf.pdf", documentType: "resume" as const, contentType: "application/pdf",
  size: 14, base64: Buffer.from("%PDF-1.7\n%%EOF").toString("base64"),
};
const serverApplication = { ...validApplication, documents: [resume] };

describe("application submission", () => {
  it("accepts a valid payload on client and server", () => {
    expect(parseApplicationInput(validApplication).jobId).toBe("elektriker");
    expect(applicationPayloadSchema.parse(serverApplication).email).toBe("application@example.test");
  });

  it("accepts applications without documents and with optional attachments", () => {
    expect(applicationPayloadSchema.parse(validApplication).documents).toEqual([]);
    expect(applicationPayloadSchema.parse({ ...validApplication, documents: [] }).documents).toEqual([]);
    expect(applicationPayloadSchema.safeParse({ ...validApplication, documents: [{ ...resume, documentType: "attachment" }] }).success).toBe(true);
  });

  it("accepts the apprenticeship on client and server", () => {
    const jobId = "ausbildung-elektroniker-gebaeudetechnik";
    expect(parseApplicationInput({ ...validApplication, jobId }).jobId).toBe(jobId);
    expect(applicationPayloadSchema.parse({ ...validApplication, jobId }).jobId).toBe(jobId);
  });

  it("accepts the service role with optional documents and resolves its authoritative title", () => {
    const jobId = "servicetechniker";
    const application = { ...validApplication, jobId };
    expect(parseApplicationInput(application).jobId).toBe(jobId);
    expect(applicationPayloadSchema.parse(application).documents).toEqual([]);
    expect(applicationPayloadSchema.parse({ ...application, documents: [resume] }).jobId).toBe(jobId);
    expect(getApplicationJobTitle(jobId)).toBe(
      "Servicetechniker:in – Photovoltaik und Speichersysteme (m/w/d)",
    );
  });

  it("rejects unknown jobs on client and server", () => {
    expect(() => parseApplicationInput({ ...validApplication, jobId: "unknown" })).toThrow();
    expect(applicationPayloadSchema.safeParse({ ...validApplication, jobId: "unknown" }).success).toBe(false);
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
