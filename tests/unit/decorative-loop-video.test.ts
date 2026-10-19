// @vitest-environment jsdom
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DecorativeLoopVideo } from "@/components/media/decorative-loop-video";
import { storageFunctionVisual, storageFunctionVideo } from "@/content/pages/stromspeicher";

let container: HTMLDivElement;
let root: Root;
let reduced: boolean;
let onChange: () => void;
let onIntersection: (visible: boolean) => void;
let tabHidden: boolean;
beforeEach(() => {
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  reduced = false;
  onChange = () => {};
  tabHidden = false;
  vi.spyOn(document, "hidden", "get").mockImplementation(() => tabHidden);
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        onIntersection = (visible: boolean) =>
          callback(
            [{ isIntersecting: visible } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_: string, callback: () => void) => {
      onChange = callback;
    },
    removeEventListener: vi.fn(),
  }));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function render(src?: string) {
  act(() =>
    root.render(
      createElement(DecorativeLoopVideo, {
        src,
        fallback: { ...storageFunctionVisual, sizes: "100vw" },
      }),
    ),
  );
}
describe("decorative storage video", () => {
  it("shows a responsive still without an asset or when reduced motion is requested", () => {
    render();
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      storageFunctionVisual.mobileSrc,
    );
    expect(container.querySelector("video")).toBeNull();
    reduced = true;
    act(() => onChange());
    render("/videos/storage.webm");
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelectorAll("picture source")).toHaveLength(2);
  });
  it("uses inline muted autoplay and a loop, with a fallback on error or changed motion preference", () => {
    render(storageFunctionVideo.src);
    const video = container.querySelector("video")!;
    expect(video.autoplay).toBe(true);
    expect(video.getAttribute("src")).toBe("/videos/stromspeicher-loop.mp4");
    expect(video.className).toContain("object-cover object-center");
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(video.controls).toBe(false);
    expect(video.getAttribute("aria-hidden")).toBe("true");
    expect(video.poster).toContain(storageFunctionVisual.desktopSrc);
    expect(video.className).toContain("opacity-0");
    const still = container.querySelector<HTMLDivElement>("[data-loop-fallback]")!;
    expect(still.hidden).toBe(false);
    act(() => video.dispatchEvent(new Event("playing")));
    expect(video.className).toContain("opacity-100");
    expect(still.hidden).toBe(true);
    reduced = true;
    act(() => onChange());
    expect(container.querySelector("video")).toBeNull();
    expect(still.hidden).toBe(false);
    reduced = false;
    act(() => onChange());
    act(() => container.querySelector("video")!.dispatchEvent(new Event("error")));
    expect(container.querySelector("video")).toBeNull();
    expect(container.querySelector("img")).not.toBeNull();
  });
  it("keeps pause available to pointer and keyboard users and preserves manual pause", async () => {
    render("/videos/storage.webm");
    const video = container.querySelector("video")!;
    const pause = vi.mocked(video.pause);
    act(() => video.dispatchEvent(new Event("playing")));
    const button = container.querySelector("button")!;
    expect(button.className).not.toContain("opacity-0");
    expect(button.className).not.toContain("pointer-events-none");
    button.focus();
    expect(document.activeElement).toBe(button);
    act(() => button.click());
    expect(pause).toHaveBeenCalled();
    expect(button.textContent).toBe("Animation abspielen");
    reduced = true;
    act(() => onChange());
    reduced = false;
    act(() => onChange());
    const restoredVideo = container.querySelector("video")!;
    expect(restoredVideo.autoplay).toBe(false);
    const restoredPlay = vi.spyOn(restoredVideo, "play").mockResolvedValue();
    restoredPlay.mockClear();
    const restoredButton = container.querySelector("button")!;
    await act(async () => restoredButton.click());
    expect(restoredPlay).toHaveBeenCalledOnce();
    expect(restoredButton.textContent).toBe("Animation pausieren");
  });
  it("pauses outside the viewport or in hidden tabs, and resumes without overriding manual pause", () => {
    render(storageFunctionVideo.src);
    const video = container.querySelector("video")!;
    const play = vi.mocked(video.play);
    const pause = vi.mocked(video.pause);
    play.mockClear();
    act(() => onIntersection(false));
    expect(pause).toHaveBeenCalled();
    expect(play).not.toHaveBeenCalled();
    act(() => onIntersection(true));
    expect(play).toHaveBeenCalledOnce();
    play.mockClear();
    tabHidden = true;
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(play).not.toHaveBeenCalled();
    tabHidden = false;
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(play).toHaveBeenCalledOnce();
    act(() => video.dispatchEvent(new Event("playing")));
    act(() => container.querySelector("button")!.click());
    play.mockClear();
    act(() => onIntersection(false));
    act(() => onIntersection(true));
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(play).not.toHaveBeenCalled();
  });
});
