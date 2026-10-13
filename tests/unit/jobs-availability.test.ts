import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/env/public", () => ({
  publicEnv: { NEXT_PUBLIC_CANONICAL_BASE_URL: "https://www.energie-kraft.de" },
}));
vi.mock("@/components/forms/application-form", () => ({
  ApplicationForm: ({ initialJobId }: { initialJobId?: string }) =>
    createElement("div", { "data-job-id": initialJobId }),
}));

import JobsPage from "@/app/(site)/jobs/page";
import ApplicationPage from "@/app/(site)/bewerbung/page";
import { getActiveJobOpening } from "@/content/jobs";

const id = "ausbildung-elektroniker-gebaeudetechnik";

describe("active apprenticeship", () => {
  it("renders one job article with its original content, anchor and application link", () => {
    const html = renderToStaticMarkup(createElement(JobsPage));
    const job = getActiveJobOpening(id)!;
    expect(job).toBeDefined();
    expect(html.match(new RegExp(`<article id="${id}"`, "g"))).toHaveLength(1);
    expect(html).toContain(`href="#${id}"`);
    expect(html).toContain(`href="/bewerbung?stelle=${id}"`);
    expect(html).toContain(job.title);
    expect(html).toContain(job.intro);
    for (const text of [...job.tasks, ...job.requirements, ...job.benefits]) {
      expect(html).toContain(text);
    }
    expect(html).not.toContain("derzeit nicht ausgeschrieben");
    expect(html).toContain("Elektriker:in (w/m/d)");
    expect(html).toContain("Dachmonteur:in (w/m/d)");
  });

  it("preselects the existing apprenticeship link without a closed-job notice", async () => {
    const html = renderToStaticMarkup(await ApplicationPage({
      searchParams: Promise.resolve({ stelle: id }),
    }));
    expect(html).toContain(`data-job-id="${id}"`);
    expect(html).not.toContain("derzeit nicht ausgeschrieben");
    expect(html).not.toContain("benötigen wir die Angaben im Formular und deinen Lebenslauf");
  });
});
