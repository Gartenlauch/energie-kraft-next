import {
  describe,
  expect,
  it,
} from "vitest";

import {
  parseLeadDeleteFormData,
  parseLeadStatusUpdateFormData,
} from "@/lib/validation/lead-admin";

describe("lead admin validation", () => {
  it("parses a valid status update", () => {
    const formData = new FormData();

    formData.set(
      "id",
      "lead-123",
    );

    formData.set(
      "status",
      "in_progress",
    );

    expect(
      parseLeadStatusUpdateFormData(
        formData,
      ),
    ).toEqual({
      id: "lead-123",
      status: "in_progress",
    });
  });

  it("rejects an unsupported status", () => {
    const formData = new FormData();

    formData.set(
      "id",
      "lead-123",
    );

    formData.set(
      "status",
      "unknown",
    );

    expect(() =>
      parseLeadStatusUpdateFormData(
        formData,
      ),
    ).toThrow();
  });

  it("parses a delete request", () => {
    const formData = new FormData();

    formData.set(
      "id",
      "lead-123",
    );

    expect(
      parseLeadDeleteFormData(
        formData,
      ),
    ).toBe("lead-123");
  });
});