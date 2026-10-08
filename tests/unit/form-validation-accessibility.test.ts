// @vitest-environment jsdom

import { act, createElement, type ComponentProps } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactLeadForm } from "@/components/contact/contact-lead-form";
import { ConfiguratorContactForm } from "@/components/configurator/configurator-contact-form";

vi.mock("next/link", () => ({
  default: (props: ComponentProps<"a">) => createElement("a", props),
}));
vi.mock("@/lib/leads/submit-contact-lead", () => ({ submitContactLead: vi.fn() }));
vi.mock("@/components/configurator/configurator-phase-indicator", () => ({
  ConfiguratorPhaseIndicator: () => null,
}));

let container: HTMLDivElement;
let root: Root;
let frames: FrameRequestCallback[];

beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  frames = [];
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.push(callback);
    return frames.length;
  });
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});
function element<T extends HTMLElement = HTMLInputElement>(selector: string): T {
  const result = container.querySelector<T>(selector);
  if (!result) throw new Error(`Missing element: ${selector}`);
  return result;
}
function flushFocus() {
  act(() => frames.splice(0).forEach((callback) => callback(0)));
}
function fill(id: string, value: string) {
  const input = element<HTMLInputElement | HTMLTextAreaElement>(`#${id}`);
  const prototype =
    input.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  act(() => {
    Object.getOwnPropertyDescriptor(prototype, "value")!.set!.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
function click(selector: string) {
  act(() => element(selector).click());
}
function submitContact() {
  act(() =>
    element<HTMLFormElement>("form").dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    ),
  );
  flushFocus();
}
function continueConfigurator() {
  const button = Array.from(container.querySelectorAll("button")).find(
    (item) => item.textContent === "Weiter zur Anfrage",
  )!;
  act(() => button.click());
  flushFocus();
}
function expectError(selector: string, errorId: string) {
  const input = element(selector);
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(input.getAttribute("aria-describedby")?.split(" ")).toContain(errorId);
  for (const id of input.getAttribute("aria-describedby")!.split(" ")) {
    expect(element(`#${id}`).textContent?.length).toBeGreaterThan(0);
  }
  expect(element(`#${errorId}`).textContent?.length).toBeGreaterThan(0);
  expect(element(`#${errorId}`).getAttribute("role")).not.toBe("alert");
}
function fillContact() {
  for (const [id, value] of Object.entries({
    "first-name": "Erika",
    "last-name": "Mustermann",
    email: "erika@example.test",
    "postal-code": "83404",
    city: "Ainring",
    message: "Bitte beraten Sie mich zu meinem Projekt.",
  }))
    fill(`contact-${id}`, value);
}
const validConfig: NonNullable<ComponentProps<typeof ConfiguratorContactForm>["initialValues"]> = {
  firstName: "Erika",
  lastName: "Mustermann",
  email: "erika@example.test",
  phone: "",
  installationAtResidence: true,
  street: "Testweg 1",
  postalCode: "83404",
  city: "Ainring",
  privacyAccepted: true,
  website: "",
};
function renderConfig(overrides = {}, onContinue = vi.fn()) {
  act(() =>
    root.render(
      createElement(ConfiguratorContactForm, {
        initialValues: { ...validConfig, ...overrides },
        focusFirstName: false,
        onContinue,
        onBack: vi.fn(),
      }),
    ),
  );
  return onContinue;
}

describe("contact validation accessibility", () => {
  beforeEach(() => act(() => root.render(createElement(ContactLeadForm))));
  it("focuses the first invalid field in DOM order and clears only the edited field without moving focus", () => {
    submitContact();
    expect(document.activeElement).toBe(element("#contact-first-name"));
    expectError("#contact-first-name", "contact-first-name-error");
    expectError("#contact-email", "contact-email-error");
    const last = element("#contact-last-name");
    last.focus();
    fill("contact-last-name", "Mustermann");
    flushFocus();
    expect(document.activeElement).toBe(last);
    expect(last.hasAttribute("aria-invalid")).toBe(false);
    expect(last.hasAttribute("aria-describedby")).toBe(false);
    expect(container.querySelector("#contact-last-name-error")).toBeNull();
    submitContact();
    expect(document.activeElement).toBe(element("#contact-first-name"));
  });
  it("focuses an actual interest checkbox, keeps its hint, then focuses the privacy checkbox", () => {
    fillContact();
    submitContact();
    const interest = element('input[type="checkbox"]');
    expect(document.activeElement).toBe(interest);
    expectError('input[type="checkbox"]', "contact-interests-error");
    expect(interest.getAttribute("aria-describedby")).toContain("contact-interests-help");
    expect(element("#contact-interests-help").textContent).toContain("Mehrfachauswahl");
    act(() => interest.click());
    expect(interest.hasAttribute("aria-invalid")).toBe(false);
    expect(interest.getAttribute("aria-describedby")).toBe("contact-interests-help");
    submitContact();
    expect(document.activeElement).toBe(element("#contact-privacy"));
    expectError("#contact-privacy", "contact-privacy-error");
    click("#contact-privacy");
    expect(element("#contact-privacy").hasAttribute("aria-invalid")).toBe(false);
    expect(container.querySelector("#contact-privacy-error")).toBeNull();
  });
  it("includes optional company validation and conditional phone validation", () => {
    fillContact();
    fill("contact-company", "x".repeat(121));
    submitContact();
    expect(document.activeElement).toBe(element("#contact-company"));
    expectError("#contact-company", "contact-company-error");
    fill("contact-company", "");
    click('input[name="preferredContact"][value="telefon"]');
    submitContact();
    expect(document.activeElement).toBe(element("#contact-phone"));
    expectError("#contact-phone", "contact-phone-error");
  });
});

describe("configurator contact validation accessibility", () => {
  it("focuses the first invalid field on every invalid attempt without announcing the same field in an alert", () => {
    renderConfig({ firstName: "", lastName: "", email: "invalid" });
    continueConfigurator();
    expect(document.activeElement).toBe(element("#configurator-first-name"));
    expectError("#configurator-first-name", "configurator-first-name-error");
    expectError("#configurator-email", "configurator-email-error");
    element("#configurator-email").focus();
    fill("configurator-email", "valid@example.test");
    flushFocus();
    expect(document.activeElement).toBe(element("#configurator-email"));
    expect(element("#configurator-email").hasAttribute("aria-invalid")).toBe(false);
    continueConfigurator();
    expect(document.activeElement).toBe(element("#configurator-first-name"));
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });
  it("focuses the first installation card before privacy and clears both cards after selection", () => {
    renderConfig({ installationAtResidence: null, privacyAccepted: false });
    continueConfigurator();
    const card = element<HTMLInputElement>('input[name="installationAtResidence"]');
    expect(document.activeElement).toBe(card);
    expect(element('[role="radiogroup"]').getAttribute("aria-invalid")).toBe("true");
    expect(card.getAttribute("aria-describedby")).toBe("configurator-installation-error");
    expect(element("#configurator-installation-error").textContent).toContain("Bitte");
    act(() => card.click());
    expect(card.checked).toBe(true);
    expect(container.querySelector('[role="radiogroup"][aria-invalid="true"]')).toBeNull();
    continueConfigurator();
    expect(document.activeElement).toBe(element("#configurator-privacy"));
    expectError("#configurator-privacy", "configurator-privacy-error");
    click("#configurator-privacy");
    expect(element("#configurator-privacy").hasAttribute("aria-describedby")).toBe(false);
  });
  it("focuses newly visible address errors after the installation choice", () => {
    renderConfig({ installationAtResidence: null, street: "", postalCode: "", city: "" });
    continueConfigurator();
    click('input[name="installationAtResidence"]');
    continueConfigurator();
    expect(document.activeElement).toBe(element("#configurator-street"));
    expectError("#configurator-street", "configurator-street-error");
    expectError("#configurator-postal-code", "configurator-postal-code-error");
    expectError("#configurator-city", "configurator-city-error");
  });
  it("preserves phone help alongside errors and continues with unchanged valid data", () => {
    const onContinue = renderConfig({ phone: "x".repeat(41) });
    continueConfigurator();
    expect(document.activeElement).toBe(element("#configurator-phone"));
    expectError("#configurator-phone", "configurator-phone-error");
    expect(element("#configurator-phone").getAttribute("aria-describedby")).toContain(
      "configurator-phone-help",
    );
    fill("configurator-phone", "");
    expect(element("#configurator-phone").getAttribute("aria-describedby")).toBe(
      "configurator-phone-help",
    );
    continueConfigurator();
    expect(onContinue).toHaveBeenCalledWith(validConfig, expect.any(Number));
  });
  it("retains optional initial autofocus without re-focusing during input", () => {
    act(() =>
      root.render(createElement(ConfiguratorContactForm, { onContinue: vi.fn(), onBack: vi.fn() })),
    );
    expect(document.activeElement).toBe(element("#configurator-first-name"));
    element("#configurator-last-name").focus();
    fill("configurator-last-name", "Mustermann");
    flushFocus();
    expect(document.activeElement).toBe(element("#configurator-last-name"));
  });
});
