import { describe, expect, it } from "vitest";

import {
  parseFaqEntryCreateFormData,
  parseFaqEntryDeleteFormData,
  parseFaqEntryUpdateFormData,
} from "@/lib/validation/faq-entry-admin";

function createValidFaqFormData(): FormData {
  const formData = new FormData();

  formData.set("question", "Wie lange dauert die Installation?");

  formData.set(
    "answer",
    "Die Installationsdauer hängt vom Umfang und den örtlichen Voraussetzungen ab.",
  );

  formData.set("categoryId", "photovoltaik");

  formData.set("placement.home.enabled", "on");

  formData.set("placement.home.sortOrder", "10");

  formData.set("placement.home.showInSchema", "on");

  formData.set("placement.photovoltaik.enabled", "on");

  formData.set("placement.photovoltaik.sortOrder", "20");

  formData.set("isPublished", "on");

  return formData;
}

describe("FAQ-Adminformulare", () => {
  it("parst einen gültigen FAQ-Eintrag", () => {
    const result = parseFaqEntryCreateFormData(createValidFaqFormData());

    expect(result).toEqual({
      question: "Wie lange dauert die Installation?",
      answer: "Die Installationsdauer hängt vom Umfang und den örtlichen Voraussetzungen ab.",
      categoryId: "photovoltaik",
      placements: [
        {
          routeKey: "home",
          sortOrder: 10,
          showInSchema: true,
        },
        {
          routeKey: "photovoltaik",
          sortOrder: 20,
          showInSchema: false,
        },
      ],
      isPublished: true,
    });
  });

  it("ignoriert nicht aktivierte Routen", () => {
    const formData = createValidFaqFormData();

    formData.delete("placement.photovoltaik.enabled");

    formData.set("placement.photovoltaik.showInSchema", "on");

    const result = parseFaqEntryCreateFormData(formData);

    expect(result.placements).toEqual([
      {
        routeKey: "home",
        sortOrder: 10,
        showInSchema: true,
      },
    ]);
  });

  it("lehnt eine FAQ ohne Route ab", () => {
    const formData = createValidFaqFormData();

    formData.delete("placement.home.enabled");

    formData.delete("placement.photovoltaik.enabled");

    expect(() => parseFaqEntryCreateFormData(formData)).toThrow();
  });

  it("lehnt eine aktivierte Route ohne Sortierung ab", () => {
    const formData = createValidFaqFormData();

    formData.delete("placement.home.sortOrder");

    expect(() => parseFaqEntryCreateFormData(formData)).toThrow();
  });

  it("behandelt eine nicht gesetzte Veröffentlichung als false", () => {
    const formData = createValidFaqFormData();

    formData.delete("isPublished");

    expect(parseFaqEntryCreateFormData(formData).isPublished).toBe(false);
  });

  it("parst ein vollständiges FAQ-Update", () => {
    const formData = createValidFaqFormData();

    formData.set("id", "faq-document-id");

    const result = parseFaqEntryUpdateFormData(formData);

    expect(result.id).toBe("faq-document-id");

    expect(result.input.question).toBe("Wie lange dauert die Installation?");

    expect(result.input.placements).toHaveLength(2);
  });

  it("verlangt eine Löschbestätigung", () => {
    const formData = new FormData();

    formData.set("id", "faq-document-id");

    expect(() => parseFaqEntryDeleteFormData(formData)).toThrow();
  });

  it("akzeptiert eine bestätigte Löschung", () => {
    const formData = new FormData();

    formData.set("id", "faq-document-id");

    formData.set("confirmed", "on");

    expect(parseFaqEntryDeleteFormData(formData)).toBe("faq-document-id");
  });
});
