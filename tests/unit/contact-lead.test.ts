import { describe, expect, it } from "vitest";

import { parseContactLeadInput } from "@/lib/validation/contact-lead";

const validInput = {
  firstName: "Max",
  lastName: "Mustermann",
  company: "Muster GmbH",
  email: "max@example.com",
  phone: "+49 123 456789",
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
      city: "  Bad Reichenhall  ",
    });

    expect(result.firstName).toBe("Max");
    expect(result.lastName).toBe("Mustermann");
    expect(result.city).toBe("Bad Reichenhall");
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