import { describe, expect, it, vi } from "vitest";
import { sendConfiguratorCustomerMail } from "../../functions/src/configurator-customer-mail";
import { sendMailgunMail } from "../../functions/src/mailgun";
import type { ConfiguratorLeadPayload } from "../../functions/src/configurator-lead-validation";

vi.mock("../../functions/src/mailgun", () => ({
  INTERNAL_SUBMISSION_RECIPIENT: "test@example.invalid",
  sendMailgunMail: vi.fn().mockResolvedValue({ id: "mock-only", message: "accepted" }),
}));
describe("configurator customer email", () => {
  it("uses polite copy in text, HTML and subject while keeping the PDF attachment", async () => {
    const pdf = Buffer.from("%PDF-fixture");
    const lead = {
      contact: { firstName: "Test", email: "test@example.invalid" },
      products: ["photovoltaic", "battery_storage"],
    } as ConfiguratorLeadPayload;
    await sendConfiguratorCustomerMail({ leadId: "TEST-1", lead, pdf, filename: "analyse.pdf" });
    const mail = vi.mocked(sendMailgunMail).mock.calls[0]![0];
    expect(mail.subject).toContain("Ihre persönliche Energieprojekt-Analyse");
    expect(mail.text).toContain("finden Sie");
    expect(mail.html).toContain("finden Sie Ihre persönliche");
    expect(`${mail.text} ${mail.html} ${mail.subject}`).not.toMatch(/\b(?:du|dein\w*|dir|dich)\b/i);
    expect(mail.attachments).toEqual(
      expect.arrayContaining([expect.objectContaining({ filename: "analyse.pdf", data: pdf })]),
    );
    expect(mail.attachments?.some((attachment) => attachment.filename.endsWith(".txt"))).toBe(false);
  });
});
