import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo/structured-data";
import type { SeoContent } from "@/types/content";

interface LegalPageProps {
  seo: SeoContent;
  eyebrow: string;
  title: string;
  description?: string;
  documentLayout?: boolean;
  children: ReactNode;
}

export function LegalPage({
  seo,
  eyebrow,
  title,
  description,
  documentLayout = false,
  children,
}: LegalPageProps) {
  return (
    <>
      <JsonLdScript data={buildWebPageJsonLd(seo)} />

      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: title,
          currentPath: seo.canonicalPath,
        })}
      />

      <main id="main-content">
        <Breadcrumbs currentLabel={title} />

        <header
          className={
            documentLayout
              ? "border-border-default border-b py-12 md:py-16"
              : "border-foreground/10 border-b px-6 py-16 md:py-20"
          }
        >
          <div className={documentLayout ? "section-shell" : "mx-auto w-full max-w-4xl"}>
            <p className="text-foreground/60 text-sm font-semibold tracking-widest uppercase">
              {eyebrow}
            </p>

            <h1
              className={
                documentLayout
                  ? "mt-4 text-[1.75rem] leading-tight font-semibold tracking-tight [overflow-wrap:anywhere] hyphens-auto sm:text-4xl md:text-5xl"
                  : "mt-4 text-4xl font-semibold tracking-tight md:text-6xl"
              }
            >
              {title}
            </h1>

            {description ? (
              <p className="text-foreground/70 mt-6 max-w-3xl text-lg leading-8">{description}</p>
            ) : null}
          </div>
        </header>

        <div className={documentLayout ? "py-10 md:py-14" : "px-6 py-16"}>
          <article
            className={
              documentLayout
                ? "section-shell space-y-10 leading-7 [overflow-wrap:anywhere] hyphens-auto md:space-y-14"
                : "mx-auto w-full max-w-4xl space-y-10 leading-7"
            }
          >
            {children}
          </article>
        </div>
      </main>
    </>
  );
}
