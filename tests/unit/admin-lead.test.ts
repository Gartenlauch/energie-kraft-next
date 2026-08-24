import {
  describe,
  expect,
  it,
} from "vitest";

import {
  isAdminLeadType,
} from "@/types/admin-lead";
import {
  CONTACT_LEAD_STATUS_VALUES,
} from "@/types/contact-lead";
import {
  LEAD_STATUS_VALUES,
} from "@/types/lead";

describe("admin lead model", () => {
  it("supports contact and configurator lead types", () => {
    expect(
      isAdminLeadType("contact"),
    ).toBe(true);

    expect(
      isAdminLeadType(
        "configurator",
      ),
    ).toBe(true);

    expect(
      isAdminLeadType("unknown"),
    ).toBe(false);
  });

  it("keeps the existing contact status API compatible", () => {
    expect(
      CONTACT_LEAD_STATUS_VALUES,
    ).toEqual(
      LEAD_STATUS_VALUES,
    );
  });

  it("supports the four existing workflow statuses", () => {
    expect(
      LEAD_STATUS_VALUES,
    ).toEqual([
      "new",
      "in_progress",
      "completed",
      "rejected",
    ]);
  });
});