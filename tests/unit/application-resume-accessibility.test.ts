// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApplicationForm } from "@/components/forms/application-form";
import {
  applicationFileType,
} from "../../functions/src/shared/application-file-policy";
import { submitApplication } from "@/lib/submissions/submit-application";

vi.mock("@/lib/submissions/submit-application", () => ({
  submitApplication: vi
    .fn()
    .mockResolvedValue({ ok: true, applicationId: "test-only", mailStatus: "accepted" }),
  selectedApplicationFiles: (files: File[]) =>
    files.map((file) => ({
      name: file.name,
      size: file.size,
      contentType: file.type || applicationFileType(file.name) || "",
    })),
}));
let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.clearAllMocks();
  HTMLElement.prototype.scrollIntoView = vi.fn();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(createElement(ApplicationForm, { initialJobId: "elektriker" })));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});
function select(id: string, file: File) {
  const input = container.querySelector<HTMLInputElement>(`#${id}`)!;
  Object.defineProperty(input, "files", { configurable: true, value: [file] });
  act(() => input.dispatchEvent(new Event("change", { bubbles: true })));
  return input;
}
async function submit() {
  await act(async () => {
    container
      .querySelector("form")!
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
}
function fillApplication() {
    for (const [id, value] of Object.entries({
      firstName: "Test",
      lastName: "Person",
      street: "Testweg 1",
      postalCode: "83404",
      city: "Ainring",
      email: "test@example.test",
      phone: "08654123456",
      qualificationExperience: "Erfahrung in der Elektrotechnik.",
    })) {
      const input = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `#application-${id === "qualificationExperience" ? "experience" : id}`,
      )!;
      const prototype =
        input.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      act(() => {
        Object.getOwnPropertyDescriptor(prototype, "value")!.set!.call(input, value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    act(() => container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.click());
}

describe("optional application documents", () => {
  it("submits without files and has no separate required resume field", async () => {
    fillApplication();
    expect(container.querySelector("#application-resume")).toBeNull();
    const upload = container.querySelector<HTMLInputElement>("#application-documents")!;
    expect(upload.required).toBe(false);
    expect(upload.hasAttribute("aria-required")).toBe(false);
    await submit();
    expect(submitApplication).toHaveBeenCalledWith(expect.objectContaining({ jobId: "elektriker" }), []);
    expect(container.textContent).toContain("Deine Bewerbung wurde erfolgreich übermittelt.");
  });

  it.each(["Lebenslauf.pdf", "Zeugnis.pdf"])("submits optional %s without a separate resume", async (name) => {
    fillApplication();
    const file = new File(["%PDF-1.7\n%%EOF"], name, { type: "application/pdf" });
    select("application-documents", file);
    await submit();
    expect(submitApplication).toHaveBeenCalledWith(expect.objectContaining({ jobId: "elektriker" }), [file]);
    expect(container.textContent).toContain("Deine Bewerbung wurde erfolgreich übermittelt.");
  });

  it("accepts the apprenticeship selection", async () => {
    const input = container.querySelector<HTMLSelectElement>("#application-job")!;
    expect(Array.from(input.options).filter((option) => option.value === "ausbildung-elektroniker-gebaeudetechnik")).toHaveLength(1);
    act(() => {
      input.value = "ausbildung-elektroniker-gebaeudetechnik";
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    fillApplication();
    await submit();
    expect(submitApplication).toHaveBeenCalledWith(expect.objectContaining({ jobId: "ausbildung-elektroniker-gebaeudetechnik" }), []);
  });

  it.each([
    new File(["bad"], "CV.exe", { type: "application/octet-stream" }),
    new File([new Uint8Array(10_000_001)], "CV.pdf", { type: "application/pdf" }),
  ])("rejects invalid uploads accessibly and allows discarding the selection", async (file) => {
    fillApplication();
    const upload = select("application-documents", file);
    await submit();
    expect(submitApplication).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(upload);
    expect(upload.getAttribute("aria-invalid")).toBe("true");
    expect(upload.getAttribute("aria-describedby")).toContain("application-documents-error");
    expect(container.querySelector("#application-documents-error")!.textContent).toMatch(/Erlaubt|10 MB/);
    act(() => Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.includes("Auswahl verwerfen"))!.click());
    await submit();
    expect(submitApplication).toHaveBeenCalledWith(expect.any(Object), []);
  });

  it("allows removing an optional document and submitting without files", async () => {
    fillApplication();
    select("application-documents", new File(["test"], "CV.pdf", { type: "application/pdf" }));
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="CV.pdf entfernen"]')!.click());
    await submit();
    expect(submitApplication).toHaveBeenCalledWith(expect.any(Object), []);
  });
});
