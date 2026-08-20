import { describe, expect, it } from "vitest";

import {
  parseContactLeadDeleteFormData,
  parseContactLeadStatusUpdateFormData,
} from "@/lib/validation/contact-lead-admin";

function createFormData(
  id: string,
  status: string,
): FormData {
  const formData = new FormData();

  formData.set("id", id);
  formData.set("status", status);

  return formData;
}

describe("contact lead admin validation", () => {
  it("accepts a valid status update", () => {
    const result =
      parseContactLeadStatusUpdateFormData(
        createFormData("lead-123", "in_progress"),
      );

    expect(result).toEqual({
      id: "lead-123",
      status: "in_progress",
    });
  });

  it("accepts all supported statuses", () => {
    for (const status of [
      "new",
      "in_progress",
      "completed",
      "rejected",
    ]) {
      const result =
        parseContactLeadStatusUpdateFormData(
          createFormData("lead-123", status),
        );

      expect(result.status).toBe(status);
    }
  });

  it("rejects an invalid status", () => {
    expect(() =>
      parseContactLeadStatusUpdateFormData(
        createFormData(
          "lead-123",
          "irgendwas",
        ),
      ),
    ).toThrow();
  });

  it("rejects a missing lead id", () => {
    expect(() =>
      parseContactLeadStatusUpdateFormData(
        createFormData("", "new"),
      ),
    ).toThrow();
  });

  it("accepts a valid lead id for deletion", () => {
    const formData = new FormData();

    formData.set("id", "lead-123");

    expect(
      parseContactLeadDeleteFormData(formData),
    ).toBe("lead-123");
  });

  it("rejects a missing lead id for deletion", () => {
    const formData = new FormData();

    expect(() =>
      parseContactLeadDeleteFormData(formData),
    ).toThrow();
  });
});