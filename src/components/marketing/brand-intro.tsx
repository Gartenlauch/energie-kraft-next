"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const SESSION_KEY = "energie-kraft-brand-intro-seen";

export function BrandIntro() {
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intro = introRef.current;

    if (!intro || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) {
        return;
      }

      window.sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // Storage can be unavailable in strict privacy modes; the intro still remains non-blocking.
    }

    intro.hidden = false;
    window.requestAnimationFrame(() => {
      intro.dataset.active = "true";
    });

    const timeout = window.setTimeout(() => {
      intro.hidden = true;
      delete intro.dataset.active;
    }, 950);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div ref={introRef} className="brand-intro" aria-hidden="true" hidden>
      <span className="brand-intro__mark">
        <Image
          src="/brand/energie-kraft/energie-kraft-supersign.svg"
          alt=""
          width={106}
          height={103}
        />
      </span>
    </div>
  );
}
