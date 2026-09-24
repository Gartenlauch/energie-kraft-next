# FAQ category administration

**Status: Implemented.**

`/admin/faqs/categories` is Administrator-only and performs its own server authorization. It supports list/search/status filtering, create, edit, activation/deactivation, sorting and delete.

Categories are stored at `faqCategories/{slug}`. The document ID and `slug` are fixed after creation; editable fields are `name`, `sortOrder` and `isActive`. Create/update audit fields are server controlled.

A category cannot be deleted while any FAQ references its ID. Reads/writes use the Admin SDK; there is no direct browser Firestore write. Mitarbeiter have no route or action access.

JSON export/preview/import is exposed from the FAQ entry page and includes categories in the same versioned document. See [FAQ entry administration](faq-entry-admin.md).
