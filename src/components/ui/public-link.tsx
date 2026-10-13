import NextLink from "next/link";
import type { ComponentProps } from "react";

import { siteConfig } from "@/config/site";
import { isExternalWebLink, newTabRel } from "@/lib/navigation/link-behavior";

type PublicLinkProps = ComponentProps<typeof NextLink>;

/** Shared public link policy; explicit new-tab form privacy links remain supported. */
export function PublicLink({
  href,
  children,
  target,
  rel,
  download,
  "aria-label": ariaLabel,
  ...props
}: PublicLinkProps) {
  const url =
    typeof href === "string"
      ? href
      : (href.href ??
        (href.host
          ? `${href.protocol ?? "https:"}//${href.host}${href.pathname ?? ""}`
          : (href.pathname ?? "")));
  const external = isExternalWebLink(url, siteConfig.canonicalBaseUrl);
  const resolvedTarget = download ? target : external ? "_blank" : target;
  const opensNewTab = resolvedTarget === "_blank";
  const attributes = {
    ...props,
    download,
    target: resolvedTarget,
    rel: opensNewTab ? newTabRel(rel) : rel,
    "aria-label": ariaLabel && opensNewTab ? `${ariaLabel} (öffnet in neuem Tab)` : ariaLabel,
  };
  const content = (
    <>
      {children}
      {opensNewTab && !ariaLabel && <span className="sr-only"> (öffnet in neuem Tab)</span>}
    </>
  );
  return external || download || /^(?:mailto:|tel:|#)/i.test(url) ? (
    <a href={url} {...attributes}>
      {content}
    </a>
  ) : (
    <NextLink href={href} {...attributes}>
      {content}
    </NextLink>
  );
}
