"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function MarketingInvitation({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/konfigurator" || pathname.startsWith("/konfigurator/"))
    return null;
  return children;
}
