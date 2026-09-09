import { MarketingFeaturePage } from "@/app/(site)/_components/marketing-feature-page";
import type { Sprint8PageContent } from "@/content/sprint8-pages";

export function Sprint8ContentPage({ content }: { content: Sprint8PageContent }) {
  return (
    <MarketingFeaturePage
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
      ctaTitle={content.ctaTitle}
      ctaLabel={content.ctaLabel}
      ctaHref={content.ctaHref}
    />
  );
}
