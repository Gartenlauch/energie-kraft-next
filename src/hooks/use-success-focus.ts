"use client";

import { useEffect, useRef } from "react";

export function useSuccessFocus<Element extends HTMLElement>(enabled = true) {
  const successRef = useRef<Element>(null);

  useEffect(() => {
    if (!enabled) return;

    const frame = window.requestAnimationFrame(() => {
      const successElement = successRef.current;

      if (!successElement) return;

      successElement.scrollIntoView({ behavior: "auto", block: "start" });
      successElement.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [enabled]);

  return successRef;
}
