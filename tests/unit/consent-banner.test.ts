// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as CookieConsent from "vanilla-cookieconsent";
import { ConsentManager } from "@/components/consent/consent-manager";

let root: Root;
let container: HTMLDivElement;
beforeEach(async () => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  localStorage.clear();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root.render(createElement(ConsentManager)));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  CookieConsent.reset(true);
  vi.unstubAllGlobals();
});

describe("release consent banner", () => {
  it("uses the library bottom bar with equally weighted acceptance and rejection", () => {
    expect(CookieConsent.getConfig("guiOptions")?.consentModal).toEqual({
      layout: "bar",
      position: "bottom",
      equalWeightButtons: true,
    });
    expect(document.querySelector(".cm--bar.cm--bottom")).not.toBeNull();
    expect(document.querySelector(".cm__title")?.textContent).toBe("Cookie-Einstellungen");
    expect(document.querySelector('.cm__btn[data-role="all"]')?.textContent).toBe(
      "Alle akzeptieren",
    );
    expect(document.querySelector('.cm__btn[data-role="necessary"]')?.textContent).toBe(
      "Nur notwendige",
    );
    expect(document.querySelector('.cm__btn[data-role="show"]')?.textContent).toBe("Einstellungen");
  });

  it("keeps the preferences dialog configuration and all five categories", () => {
    expect(CookieConsent.getConfig("guiOptions")?.preferencesModal).toEqual({
      layout: "box",
      equalWeightButtons: true,
    });
    act(() => CookieConsent.showPreferences());
    expect(document.querySelectorAll("#cc-main input[type=checkbox]")).toHaveLength(5);
    const necessary = document.querySelector<HTMLInputElement>("#cc-main input[type=checkbox]")!;
    expect(necessary.checked).toBe(true);
    expect(necessary.disabled).toBe(true);
    expect(document.querySelector('.pm__btn[data-role="necessary"]')?.textContent).toBe(
      "Alle ablehnen",
    );
  });
});
