import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/structured-data";
import type { SeoContent } from "@/types/content";

interface LegalPageProps {
  seo: SeoContent;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function LegalPage({
  seo,
  eyebrow,
  title,
  description,
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

      <main>
        <Breadcrumbs currentLabel={title} />

        <header className="border-b border-foreground/10 px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">
              {eyebrow}
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-foreground/70">
                {description}
              </p>
            ) : null}
          </div>
        </header>

        <div className="px-6 py-16">
          <article className="mx-auto w-full max-w-4xl space-y-10 leading-7">
            {children}
          </article>
        </div>
      </main>
    </>
  );
}