import { MarketingFeaturePage } from "@/app/(site)/_components/marketing-feature-page";
import type { Sprint8PageContent } from "@/content/sprint8-pages";
import type { ReactNode } from "react";
import type { BrandIntroVariant } from "@/components/marketing/brand-intro";

export function Sprint8ContentPage({
  content,
  afterSections,
  brandIntroVariant = false,
}: {
  content: Sprint8PageContent;
  afterSections?: ReactNode;
  brandIntroVariant?: BrandIntroVariant | false;
}) {
  return (
    <MarketingFeaturePage
      brandIntroVariant={brandIntroVariant}
      seo={content.seo}
      breadcrumbLabel={content.breadcrumbLabel}
      breadcrumbItems={content.breadcrumbItems}
      eyebrow={content.eyebrow}
      title={content.title}
      description={content.description}
      desktopSrc={content.desktopSrc}
      mobileSrc={content.mobileSrc}
      imageAlt={content.imageAlt}
      sections={content.sections}
      afterSections={afterSections}
      ctaTitle={content.ctaTitle}
      ctaLabel={content.ctaLabel}
      ctaHref={content.ctaHref}
    />
  );
}
