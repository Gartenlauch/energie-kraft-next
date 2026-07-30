import {
  describe,
  expect,
  it,
} from "vitest";

import {
  parseFaqCategoryCreateFormData,
  parseFaqCategoryDeleteFormData,
  parseFaqCategoryUpdateFormData,
} from "@/lib/validation/faq-category-admin";

describe("FAQ-Kategorie-Adminformulare", () => {
  it("parst gültige Create-Daten", () => {
    const formData = new FormData();

    formData.set(
      "name",
      "  Photovoltaik  ",
    );
    formData.set("slug", "photovoltaik");
    formData.set("sortOrder", "10");
    formData.set("isActive", "on");

    expect(
      parseFaqCategoryCreateFormData(
        formData,
      ),
    ).toEqual({
      name: "Photovoltaik",
      slug: "photovoltaik",
      sortOrder: 10,
      isActive: true,
    });
  });

  it("behandelt eine nicht gesetzte Checkbox als false", () => {
    const formData = new FormData();

    formData.set("name", "Wallbox");
    formData.set("slug", "wallbox");
    formData.set("sortOrder", "20");

    expect(
      parseFaqCategoryCreateFormData(
        formData,
      ).isActive,
    ).toBe(false);
  });

  it("lehnt eine fehlende Sortierung ab", () => {
    const formData = new FormData();

    formData.set("name", "Wallbox");
    formData.set("slug", "wallbox");

    expect(() =>
      parseFaqCategoryCreateFormData(
        formData,
      ),
    ).toThrow();
  });

  it("lehnt einen ungültigen Slug ab", () => {
    const formData = new FormData();

    formData.set("name", "Photovoltaik");
    formData.set(
      "slug",
      "Photovoltaik Anlagen",
    );
    formData.set("sortOrder", "10");

    expect(() =>
      parseFaqCategoryCreateFormData(
        formData,
      ),
    ).toThrow();
  });

  it("parst ein Kategorie-Update ohne veränderbaren Slug", () => {
    const formData = new FormData();

    formData.set("id", "photovoltaik");
    formData.set(
      "name",
      "Photovoltaikanlagen",
    );
    formData.set("sortOrder", "15");
    formData.set("isActive", "on");

    expect(
      parseFaqCategoryUpdateFormData(
        formData,
      ),
    ).toEqual({
      id: "photovoltaik",
      input: {
        name: "Photovoltaikanlagen",
        sortOrder: 15,
        isActive: true,
      },
    });
  });

  it("verlangt eine Löschbestätigung", () => {
    const formData = new FormData();

    formData.set("id", "photovoltaik");

    expect(() =>
      parseFaqCategoryDeleteFormData(
        formData,
      ),
    ).toThrow();
  });

  it("akzeptiert eine bestätigte Löschung", () => {
    const formData = new FormData();

    formData.set("id", "photovoltaik");
    formData.set("confirmed", "on");

    expect(
      parseFaqCategoryDeleteFormData(
        formData,
      ),
    ).toBe("photovoltaik");
  });
});