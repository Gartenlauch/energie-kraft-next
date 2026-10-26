import { describe, expect, it, vi } from "vitest";
import { buildContactLeadMail, buildContactCustomerConfirmation } from "../../functions/src/contact-lead-mail";
import { buildForwardedLeadMail, handleAdminForwardLead } from "../../functions/src/admin-submission-actions";
import { createInquiryTextAttachment } from "../../functions/src/inquiry-text-attachment";
import type { ContactLeadPayload } from "../../functions/src/contact-lead-validation";
import { normalizeAdminLeadDocument } from "@/lib/leads/normalize-admin-lead";

vi.mock("../../functions/src/admin-authorization.js", () => ({
  checkStaffClaim: vi.fn(),
  requireStaffCaller: vi.fn().mockResolvedValue({ uid: "staff-fixture", email: "staff@example.test" }),
}));
vi.mock("../../functions/src/configurator-project-pdf.js", () => ({
  generateConfiguratorProjectPdf: vi.fn().mockResolvedValue(Buffer.from("%PDF-fixture")),
}));

const lead: ContactLeadPayload = {
  firstName: "Erika", lastName: "Müller", company: "Beispiel & Söhne",
  email: "erika@example.test", phone: "08654 123456",
  street: "Musterstraße 12", postalCode: "83404", city: "Ainring",
  interests: ["photovoltaik", "stromspeicher"], buildingType: "einfamilienhaus", ownership: "eigentuemer",
  message: "Bitte prüfen Sie die Möglichkeit.\n\nRückruf ab 14 Uhr.\r\nVielen Dank!",
  preferredContact: "telefon", privacyAccepted: true,
};
const storedContact = {
  type: "contact", contact: lead,
  location: { street: lead.street, postalCode: lead.postalCode, city: lead.city },
  project: { interests: lead.interests, buildingType: lead.buildingType, ownership: lead.ownership },
  message: lead.message, preferredContact: lead.preferredContact,
  createdAt: { toDate: () => new Date("2026-10-20T12:00:00Z") },
};

describe("KPLUS inquiry attachments", () => {
  it("includes all contact details and complete multiline text, without technical IDs", () => {
    const mail = buildContactLeadMail({ leadId: "PRIVATE-INTERNAL-ID", lead });
    expect(mail.html).toContain('<table cellpadding="6" cellspacing="0">');
    expect(mail.html).toContain("Musterstraße 12");
    const [attachment] = mail.attachments;
    expect(attachment.filename).toBe("Kontaktanfrage.txt");
    expect(attachment.contentType).toBe("text/plain; charset=utf-8");
    expect([...attachment.data.subarray(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
    const text = attachment.data.toString("utf8");
    for (const value of ["Erika", "Müller", "Beispiel & Söhne", lead.email, lead.phone!, lead.street!, lead.postalCode, lead.city, "Photovoltaik", "Stromspeicher", "Einfamilienhaus", "Eigentümer", "Bevorzugter Kontaktweg: Telefon"]) {
      expect(text).toContain(value);
    }
    expect(text).toContain("Bitte prüfen Sie die Möglichkeit.\r\n\r\nRückruf ab 14 Uhr.\r\nVielen Dank!");
    expect(text).not.toMatch(/PRIVATE-INTERNAL-ID|<[^>]+>|\t|(?<!\r)\n|\r(?!\n)|\|/);
    expect(buildContactCustomerConfirmation({ leadId: "reference", lead })).not.toHaveProperty("attachments");
  });

  it("keeps optional and legacy contact fields readable", () => {
    const legacy = { ...lead, street: undefined, company: undefined, phone: undefined, buildingType: undefined, ownership: undefined };
    const mail = buildContactLeadMail({ leadId: "legacy", lead: legacy });
    expect(mail.attachments[0].data.toString("utf8")).toContain("Straße und Hausnummer: Keine Angabe");
    expect(mail.text).not.toContain("undefined");
    expect(mail.html).not.toContain("undefined");
    const oldRecord = { ...storedContact, location: { postalCode: "83404", city: "Ainring" } };
    expect(normalizeAdminLeadDocument("legacy", oldRecord)).toMatchObject({ type: "contact", location: { city: "Ainring" } });
    expect(buildForwardedLeadMail(oldRecord, "legacy").attachments[0].data.toString("utf8")).toContain("Straße und Hausnummer: Keine Angabe");
  });

  it("normalizes Windows line endings and tabs without losing text or blank lines", () => {
    const attachment = createInquiryTextAttachment("Kontaktanfrage.txt", "Grüße\n\nZeile\rEnde\tText\u0000");
    expect(attachment.data.toString("utf8")).toBe("\uFEFFGrüße\r\n\r\nZeile\r\nEnde    Text");
  });

  it.each(["contact", "configurator"])("forwards %s with TXT and preserves the configurator PDF", async (type) => {
    const data = type === "contact" ? storedContact : {
      type, contact: storedContact.contact, installation: { atResidence: true, ...storedContact.location },
      products: [], configurators: [], journey: { entryPoint: "photovoltaic", completedProducts: [] },
      createdAt: storedContact.createdAt,
    };
    const add = vi.fn().mockResolvedValue(undefined);
    const reference = { get: async () => ({ exists: true, id: "PRIVATE-ID", data: () => data }), collection: () => ({ add }) };
    const firestore = { collection: () => ({ doc: () => reference }) };
    const send = vi.fn().mockResolvedValue({ id: "mock-only", message: "accepted" });
    await handleAdminForwardLead({ data: { id: "PRIVATE-ID", recipient: "staff@example.test", message: "Bitte prüfen.\nRückruf nötig." } } as never, firestore as never, send);
    const mail = send.mock.calls[0][0];
    expect(mail.to).toBe("staff@example.test");
    expect(mail.attachments.map((item: { filename: string }) => item.filename)).toEqual(type === "contact" ? ["Kontaktanfrage.txt"] : ["Konfiguratoranfrage.txt", "energie-kraft-projektanalyse-PRIVATE-ID.pdf"]);
    const text = mail.attachments[0].data.toString("utf8");
    expect(text).toContain("Eingegangen: 20.10.2026");
    expect(text).toContain("Musterstraße 12");
    expect(text).toContain("Bitte prüfen.\r\nRückruf nötig.");
    expect(text).not.toContain("PRIVATE-ID");
    if (type === "configurator") expect(mail.attachments[1]).toMatchObject({ contentType: "application/pdf", data: Buffer.from("%PDF-fixture") });
    expect(add).toHaveBeenCalledOnce();
  });
});
