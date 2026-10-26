import { describe, expect, it } from "vitest";

import { parseContactLeadInput } from "@/lib/validation/contact-lead";
import { contactLeadPayloadSchema } from "../../functions/src/contact-lead-validation";

const validInput = {
  firstName: "Max",
  lastName: "Mustermann",
  company: "Muster GmbH",
  email: "max@example.com",
  phone: "+49 123 456789",
  street: "Musterstraße 12",
  postalCode: "83435",
  city: "Bad Reichenhall",
  interests: ["photovoltaik", "stromspeicher"] as const,
  buildingType: "einfamilienhaus" as const,
  ownership: "eigentuemer" as const,
  message:
    "Ich interessiere mich für eine Photovoltaikanlage mit Stromspeicher.",
  preferredContact: "email" as const,
  privacyAccepted: true,
  website: "",
  formStartedAt: Date.now(),
};

describe("contactLeadInputSchema", () => {
  it("accepts a valid contact lead", () => {
    const result = parseContactLeadInput(validInput);

    expect(result.firstName).toBe("Max");
    expect(result.lastName).toBe("Mustermann");
    expect(result.interests).toEqual([
      "photovoltaik",
      "stromspeicher",
    ]);
    expect(result.privacyAccepted).toBe(true);
  });

  it("trims user input", () => {
    const result = parseContactLeadInput({
      ...validInput,
      firstName: "  Max  ",
      lastName: "  Mustermann  ",
      street: "  Musterstraße 12  ",
      city: "  Bad Reichenhall  ",
    });

    expect(result.firstName).toBe("Max");
    expect(result.lastName).toBe("Mustermann");
    expect(result.city).toBe("Bad Reichenhall");
    expect(result.street).toBe("Musterstraße 12");
  });

  it.each([undefined, "", "  ", "ab", "a".repeat(151)])("requires a valid street in the new form (%s)", (street) => {
    expect(() => parseContactLeadInput({ ...validInput, street })).toThrow();
  });

  it("accepts old clients without street on the server during rollout", () => {
    const legacy = { ...validInput } as Partial<typeof validInput>;
    delete legacy.street;
    expect(contactLeadPayloadSchema.parse(legacy).street).toBeUndefined();
  });

  it("validates and normalizes street on the server when provided", () => {
    expect(contactLeadPayloadSchema.parse({ ...validInput, street: "  Musterstraße 12  " }).street).toBe("Musterstraße 12");
    for (const street of ["", "  ", "ab", "a".repeat(151), null, 12]) {
      expect(contactLeadPayloadSchema.safeParse({ ...validInput, street }).success).toBe(false);
    }
  });

  it("requires at least one interest", () => {
    expect(() =>
      parseContactLeadInput({
        ...validInput,
        interests: [],
      }),
    ).toThrow();
  });

  it("requires privacy consent", () => {
    expect(() =>
      parseContactLeadInput({
        ...validInput,
        privacyAccepted: false,
      }),
    ).toThrow();
  });

  it("requires a phone number when telephone is preferred", () => {
    expect(() =>
      parseContactLeadInput({
        ...validInput,
        preferredContact: "telefon",
        phone: "",
      }),
    ).toThrow();
  });

  it("rejects duplicate interests", () => {
    expect(() =>
      parseContactLeadInput({
        ...validInput,
        interests: ["photovoltaik", "photovoltaik"],
      }),
    ).toThrow();
  });

  it("rejects invalid email addresses", () => {
    expect(() =>
      parseContactLeadInput({
        ...validInput,
        email: "keine-email-adresse",
      }),
    ).toThrow();
  });
});
