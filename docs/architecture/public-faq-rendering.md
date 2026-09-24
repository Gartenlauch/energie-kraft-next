# Public FAQ rendering

**Status: Implemented.** Firestore is the sole runtime FAQ source.

## Routes and selection

- `/faq`: complete published catalog across active categories, with text search, category filter and incremental display
- `/faq/[category]`: category catalog with in-topic search and expandable long answers
- `/faq/[category]/[slug]`: breadcrumb, question/H1, short and long answer, up to five related FAQs and a category-derived product CTA
- Landing-page FAQ sections: curated by route placement and limited for that surface

`src/lib/faq/public-repository.ts` reads `faqs` and `faqCategories` server-side with the Admin SDK. A record is public only when `isPublished` is true and its category is active. Landing pages additionally require a matching placement; catalog/detail routes do not.

Placement results sort by placement order, category order and question. Catalog results sort by category, FAQ order and question. Legacy FAQ documents without an explicit slug retain a stable URL derived from their document ID.

## Search

The public explorer searches normalized question, short answer, long answer and category text. It shares the general normalized search-term helper with Admin list search; Firestore remains the source of the records.

## Structured data

Landing-page `FAQPage` JSON-LD contains only FAQs that are visible on that route and whose placement enables `showInSchema`. FAQ detail pages use WebPage/breadcrumb structure and do not emit `QAPage`. Metadata and canonicals are generated from the resolved category/FAQ routes.

Audit and administration fields are mapped out before rendering.

## Admin and transfer

FAQ/category CRUD and JSON preview/import/export are implemented and Administrator-only. See [FAQ entry administration](faq-entry-admin.md).

## Rendering behavior

The sitemap and FAQ pages are dynamic because their route set comes from Firestore. Non-production robots/sitemap behavior prevents local/CI environments from being indexed. No static FAQ datastore is used as a runtime fallback.
