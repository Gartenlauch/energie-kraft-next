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
import { activeJobOpenings, getActiveJobOpening } from "@/content/jobs";

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

describe("updated job catalog", () => {
  it("renders exactly four unique jobs in order, with working anchors and application links", () => {
    const html = renderToStaticMarkup(createElement(JobsPage));
    expect(activeJobOpenings.map((job) => job.id)).toEqual([
      "elektriker", "dachmonteur", "servicetechniker", "ausbildung-elektroniker-gebaeudetechnik",
    ]);
    expect(html.match(/<article id=/g)).toHaveLength(4);
    for (const [index, job] of activeJobOpenings.entries()) {
      expect(html.match(new RegExp('<article id="' + job.id + '"', "g"))).toHaveLength(1);
      expect(html).toContain('href="#' + job.id + '"');
      expect(html).toContain('href="/bewerbung?stelle=' + job.slug + '"');
      expect(html).toContain("Stelle 0" + (index + 1));
      expect(html).toContain(job.title);
    }
  });

  it("adds the roofer licence and preserves the remaining electrician tasks", () => {
    expect(getActiveJobOpening("dachmonteur")!.requirements).toEqual([
      "Technisches Verständnis",
      "Einsatzbereitschaft und Teamfähigkeit",
      "Eine Ausbildung als Dachdecker:in oder Spengler:in ist von Vorteil",
      "PKW-Führerschein (Klasse B)",
    ]);
    expect(getActiveJobOpening("elektriker")!.tasks).toEqual([
      "Wechselrichter, Batteriespeichersysteme und Wallboxen installieren",
      "Batteriespeichersysteme und Photovoltaikanlagen inspizieren und warten",
    ]);
  });

  it("renders the complete service role with an explicit exclusion of roof work and a suitable image", () => {
    const html = renderToStaticMarkup(createElement(JobsPage));
    const article = html.match(/<article id="servicetechniker"[\s\S]*?<\/article>/)![0];
    const job = getActiveJobOpening("servicetechniker")!;
    for (const text of [job.title, job.intro, ...job.tasks, ...job.requirements, ...job.benefits]) {
      expect(article).toContain(text);
    }
    expect(article).toContain("Dachmontage und Dacharbeiten gehören nicht zu deinen Aufgaben.");
    expect(article).toContain("/images/home-premium/service-maintenance-desktop.webp");
    expect(article).toContain("/images/home-premium/service-maintenance-mobile.webp");
    expect(article).not.toContain("job-rooftop-installer");
    expect(article).not.toContain("Beschäftigung");
    expect(html).toContain("Attraktives Gehalt");
    expect(html).toContain("Jobrad für Mitarbeitende");
    expect(html).toContain("Zwei gemeinsame Firmenfeiern im Jahr");
  });

  it.each(activeJobOpenings)("preselects $title through its application link", async (job) => {
    const html = renderToStaticMarkup(await ApplicationPage({
      searchParams: Promise.resolve({ stelle: job.slug }),
    }));
    expect(html).toContain('data-job-id="' + job.id + '"');
    expect(html).not.toContain("derzeit nicht ausgeschrieben");
  });
});
