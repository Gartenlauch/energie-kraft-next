import { describe, expect, it } from "vitest";
import { countStatuses, matchesSearchTerms, sortAdminItems } from "@/lib/admin/admin-view";
import { buildStatusActivityData } from "@/lib/admin/activity";
import {
  handleAdminForwardLead,
  handleAdminGenerateLeadReport,
  resolveReportDate,
} from "../../functions/src/admin-submission-actions";

describe("admin collection helpers", () => {
  it("normalizes umlauts and matches all search terms", () => {
    expect(matchesSearchTerms("Muller solar", "Müller", "Solaranlage")).toBe(true);
    expect(matchesSearchTerms("Muller wind", "Müller", "Solaranlage")).toBe(false);
  });

  it("counts open as new plus in progress", () => {
    const counts = countStatuses([
      { status: "new" },
      { status: "new" },
      { status: "in_progress" },
      { status: "completed" },
    ]);
    expect(counts).toMatchObject({ total: 4, new: 2, in_progress: 1, completed: 1, open: 3 });
  });

  it("combines filtering and name sorting deterministically", () => {
    const items = [
      { name: "Zeller", time: 2 },
      { name: "Äcker", time: 3 },
      { name: "Bauer", time: 1 },
    ];
    expect(
      sortAdminItems(
        items.filter((item) => matchesSearchTerms("er", item.name)),
        "name_asc",
        (item) => item.name,
        (item) => item.time,
      ).map((item) => item.name),
    ).toEqual(["Äcker", "Bauer", "Zeller"]);
  });
});

describe("admin activity and report reproducibility", () => {
  it("rejects PDF actions without an admin claim before data access", async () => {
    await expect(
      handleAdminGenerateLeadReport(
        { data: { leadId: "lead-1" }, auth: undefined } as never,
        {} as never,
      ),
    ).rejects.toMatchObject({ code: "permission-denied" });
  });

  it("rejects an invalid forwarding recipient before data access", async () => {
    await expect(
      handleAdminForwardLead(
        {
          data: { id: "lead-1", recipient: "not-an-email" },
          auth: { uid: "admin-1", token: { admin: true, email: "admin@example.test" } },
        } as never,
        {} as never,
      ),
    ).rejects.toMatchObject({ code: "invalid-argument" });
  });

  it("creates minimal status audit data", () => {
    expect(
      buildStatusActivityData({
        actor: { uid: "admin-1", email: "admin@example.test" },
        fromStatus: "new",
        toStatus: "in_progress",
        createdAt: "server-time",
      }),
    ).toEqual({
      type: "status_changed",
      createdAt: "server-time",
      actorUid: "admin-1",
      actorEmail: "admin@example.test",
      message: "Bearbeitungsstatus geändert",
      metadata: { fromStatus: "new", toStatus: "in_progress" },
    });
  });

  it("prefers the original report date and falls back for legacy leads", () => {
    const reportDate = new Date("2026-01-02T10:00:00Z");
    const createdAt = new Date("2025-12-01T10:00:00Z");
    const now = new Date("2026-09-22T10:00:00Z");
    const timestamp = (value: Date) => ({ toDate: () => value });
    expect(
      resolveReportDate(
        { report: { generatedAt: timestamp(reportDate) }, createdAt: timestamp(createdAt) },
        now,
      ),
    ).toBe(reportDate);
    expect(resolveReportDate({ createdAt: timestamp(createdAt) }, now)).toBe(createdAt);
    expect(resolveReportDate({}, now)).toBe(now);
  });
});
