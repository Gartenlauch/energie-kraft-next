// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

const callable = vi.hoisted(() => vi.fn().mockResolvedValue({
  data: { ok: true, applicationId: "test-only", mailStatus: "accepted" },
}));
vi.mock("client-only", () => ({}));
vi.mock("@/lib/firebase/client", () => ({ firebaseFunctions: {} }));
vi.mock("firebase/functions", () => ({ httpsCallable: () => callable }));

import { submitApplication } from "@/lib/submissions/submit-application";
import type { ApplicationInput } from "@/types/application";

const input: ApplicationInput = {
  submissionId: "64e33d4b-c882-49f4-a0f6-625a47a10ee8",
  jobId: "elektriker",
  firstName: "Test",
  lastName: "Person",
  street: "Testweg 1",
  postalCode: "83404",
  city: "Ainring",
  email: "test@example.test",
  phone: "08654123456",
  qualificationExperience: "Erfahrung in der Elektrotechnik.",
  privacyAccepted: true,
};

beforeEach(() => vi.clearAllMocks());

describe("client application submission", () => {
  it("sends an empty document list without reading any files", async () => {
    const read = vi.spyOn(FileReader.prototype, "readAsDataURL");
    await expect(submitApplication(input)).resolves.toMatchObject({ ok: true });
    expect(callable).toHaveBeenCalledWith({ ...input, documents: [] });
    expect(read).not.toHaveBeenCalled();
    read.mockRestore();
  });

  it("encodes an optional document as an attachment", async () => {
    await submitApplication(input, [new File(["%PDF-1.7\n%%EOF"], "Lebenslauf.pdf", { type: "application/pdf" })]);
    expect(callable).toHaveBeenCalledWith({
      ...input,
      documents: [{
        name: "Lebenslauf.pdf", contentType: "application/pdf", size: 14,
        base64: btoa("%PDF-1.7\n%%EOF"), documentType: "attachment",
      }],
    });
  });

  it.each([
    new File(["bad"], "CV.exe", { type: "application/octet-stream" }),
    new File([new Uint8Array(10_000_001)], "CV.pdf", { type: "application/pdf" }),
  ])("rejects invalid documents before invoking the function", async (file) => {
    await expect(submitApplication(input, [file])).rejects.toThrow(/Erlaubt|10 MB/);
    expect(callable).not.toHaveBeenCalled();
  });
});
