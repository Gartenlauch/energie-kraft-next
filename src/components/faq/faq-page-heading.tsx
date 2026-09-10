import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLdScript } from "@/components/seo/json-ld-script";
import { buildBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export function FaqPageHeading({
  title,
  path,
  description,
  items = [],
}: {
  title: string;
  path: string;
  description?: string;
  items?: { label: string; href: string }[];
}) {
  return (
    <>
      <JsonLdScript
        data={buildBreadcrumbJsonLd({
          currentLabel: title,
          currentPath: path,
          items: items.map((item) => ({ label: item.label, path: item.href })),
        })}
      />
      <Breadcrumbs currentLabel={title} items={items} />
      <header className="bg-surface-soft py-14 md:py-20">
        <div className="section-shell max-w-5xl">
          <p className="eyebrow">Energie verständlich erklärt</p>
          <h1 className="section-title mt-4">{title}</h1>
          {description && <p className="lead-copy mt-6 max-w-3xl">{description}</p>}
        </div>
      </header>
    </>
  );
}
