# Energie-Kraft Next – Agent Guide

## Mission

This repository is the production-quality Next.js relaunch of Energie-Kraft Süd.

Extend existing working systems instead of rebuilding them.

For visible frontend work, deliver premium design quality as well as technical correctness.

Priority order:

1. correctness and security
2. preserve working behavior and data contracts
3. satisfy the explicit task
4. maintainability
5. premium UX/UI quality
6. performance and efficiency

Explicit task instructions take precedence over this file.


## Working Mode

Work efficiently and autonomously.

Before editing:

1. understand the requested outcome
2. run `git status --short` once
3. inspect only files relevant to the task
4. search for existing patterns before creating new ones
5. implement the coherent change as one batch
6. minimally verify the affected area

Prefer targeted searches such as `rg`, targeted paths and relevant line ranges.

Do not:

- repeatedly scan the repository
- repeatedly reread unchanged files
- dump entire large files when a targeted search is sufficient
- inspect full diffs repeatedly
- rerun checks after every small edit
- ask the user for information that can safely be discovered from the repository

Ask only when a missing fact requires a genuine business, legal, privacy, security or irreversible architecture decision.


## Technology

Primary stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Firebase Auth
- Firestore
- Firebase Functions
- Firebase Storage
- Firebase App Hosting
- Zod
- Mailgun EU
- existing Vitest infrastructure

Reuse existing dependencies and repository patterns.

Do not add a dependency when the existing stack can solve the task cleanly.

Never run `npm audit fix --force` unless explicitly instructed.


## Architecture

Reuse before creating.

Prefer:

- existing component -> extend it
- existing schema -> extend it safely
- existing helper -> reuse it
- existing validation -> reuse it
- existing backend pipeline -> reuse it
- existing design primitive -> reuse it

Avoid parallel implementations of the same concept.

Never duplicate:

- calculator formulas
- business logic
- validation rules
- routing logic
- SEO metadata logic
- Firebase access patterns
- mail infrastructure

Prefer simple, typed and cohesive implementations over speculative abstractions.


## Firebase and Data Security

Protected business data must remain server-authoritative.

Public browsers must never directly write protected business data to Firestore.

Protected areas include at least:

- leads
- configurator submissions
- applications
- referrals

Use existing server/Admin SDK patterns.

Do not weaken Firestore Rules, Storage Rules, authentication or validation to make something work or make a test pass.

The Firebase Admin SDK bypasses Firestore Rules. Privileged server actions and Functions must therefore perform their own authorization where required.

Never expose, log or commit:

- credentials
- tokens
- private keys
- secrets
- sensitive environment variables
- private customer/user data

Do not provision or deploy Firebase resources unless explicitly requested.


### Current Development Environment

During the current development phase, application data and protected business collections are expected to exist only in the local Firebase Emulator environment.

Do not search the production Firebase project merely to verify development collections.

Do not conclude that Firestore, Storage or a collection is missing because production discovery returns no data.

Do not provision databases, collections, Storage resources or other Firebase infrastructure because production discovery is empty.

Use the configured local Firebase Emulator Suite only when affected development or targeted verification actually requires it.

Production Firebase work must be explicitly requested.


## Mail

Reuse the existing Mailgun EU infrastructure.

Known destinations include:

- contact/general inquiries: existing configured Energie-Kraft recipient
- applications: `jobs@energie-kraft.de`
- referrals: `anfragen@energie-kraft.de`

Important business submissions must be persisted before attempting mail delivery.

Mail failure must not destroy an already stored submission.

Do not report an email as "delivered" merely because the mail provider accepted it.

Never send real external test emails unless explicitly requested.


## Contact, Lead and Admin Architecture

Reuse the existing Sprint-5 lead/admin/realtime/mail architecture.

Do not create a second lead backend when the existing architecture can be extended safely.

Reuse existing:

- Admin authentication
- server-side Firestore access
- status concepts
- validation patterns
- realtime signaling
- Mailgun integration

Use existing central route/config constants instead of repeatedly hardcoding URLs.


## Calculators

These existing calculator routes are permanent and must not be casually deleted or redirected:

- `/rechner/photovoltaik`
- `/rechner/photovoltaik-kosten`
- `/rechner/klimaanlagen-kosten`
- `/rechner/waermepumpen-kosten`
- `/rechner/wallbox-kosten`

Reuse existing calculation/business logic.

Do not duplicate formulas.

Do not silently alter economic assumptions or calculation results during UX/design work.

For future calculator refinement, improve:

- result presentation
- explanation
- visualization
- responsiveness
- conversion flow
- accessibility

without changing formulas unless explicitly requested.


## Configurators

Existing configurator architecture must be preserved.

Main routes include:

- `/konfigurator/photovoltaik`
- `/konfigurator/stromspeicher`
- `/konfigurator/klimaanlage`
- `/konfigurator/waermepumpe`
- `/konfigurator/wallbox`

The configurator represents one total-energy project journey.

Reuse the existing shared state, lead integration and project data model.

Do not redesign its journey, persistence model or data contract unless explicitly requested.


## Business Priorities

Product/business priority is:

1. Photovoltaik + Stromspeicher
2. Klimaanlage + Wärmepumpe
3. Wallbox

SEO traffic does not redefine business priority.

A page may deserve strong SEO protection without receiving stronger visual or navigational prominence than the primary business areas.


## Premium Frontend Quality

For visible frontend work, act as a senior digital art director as well as an engineer.

Do not settle for generic framework, template or SaaS appearance.

Energie-Kraft visual language:

- Montserrat
- `#005CA9` primary blue
- `#0DA1D1` cyan accent
- `#182E4C` dark text blue
- `#091433` deep navy
- `#E9EDF8` soft surface
- white / `#FFFFFE`

Preferred design characteristics:

- strong real-world photography
- editorial compositions
- image/text alternation
- deliberate typography
- generous but controlled whitespace
- varied section proportions
- blue/cyan brand areas
- clean visual hierarchy
- subtle motion
- premium interaction details

Avoid excessive:

- card grids
- pills
- boxes
- shadows
- glassmorphism
- repetitive three-column layouts
- generic SaaS patterns

Premium quality comes from composition, typography, imagery, hierarchy and detail — not additional decoration.


## Responsive Design

Desktop and mobile are intentional layouts, not simply scaled versions of each other.

Consider:

- mobile crop
- content order
- readable line lengths
- spacing
- no horizontal overflow
- touch targets around 44 px or larger
- sensible image proportions

Use responsive image variants/crops when materially useful.


## Accessibility

Accessibility is part of implementation quality.

Use:

- semantic HTML
- meaningful heading hierarchy
- keyboard navigation
- visible focus
- appropriate ARIA
- sufficient contrast
- proper form labels
- associated validation messages
- reduced-motion behavior where relevant

Do not rely only on:

- hover
- color
- animation

for essential information.


## Navigation

Preserve the existing premium header and mega-menu architecture.

Main navigation currently includes:

- Energielösungen
- Service & Wartung
- Unternehmen
- Referenzen
- Jobs
- Kontakt

The current page and appropriate parent group should have a visible premium active state.

Use `aria-current="page"` where appropriate.

Mega-menu preview behavior:

- hover/focus may temporarily preview an item
- temporary preview must not become active state
- when pointer/focus leaves the menu, clear temporary preview
- restore active-route preview when applicable
- otherwise restore the configured default preview

Do not leave stale previews.

Do not create a redundant top-level "Referenzen nach Ort" navigation item.


## FAQ Architecture

Firestore is the single runtime source of truth for FAQs.

Do not create a parallel static FAQ datastore.

FAQ architecture includes:

- `/faq`
- `/faq/photovoltaik`
- `/faq/stromspeicher`
- `/faq/waermepumpe`
- `/faq/klimaanlage`
- `/faq/wallbox`
- data-driven detail pages under `/faq/[category]/[slug]`

Product/landing pages may show a curated subset of relevant FAQs while category pages contain the complete category set.

A FAQ detail page should support:

- breadcrumb
- category
- question/H1
- short answer
- long answer
- related FAQs
- useful internal link/CTA

Use the same FAQ record wherever possible instead of rewriting duplicate variants.

Do not use `QAPage` markup for editorial FAQ content.

FAQ import/export should use the existing authenticated admin architecture rather than direct client Firestore access.


## References and Local SEO

The established reference hub is:

`/pv-referenzen`

Location pages use:

`/pv-referenzen/[location]`

Do not replace this with a parallel `/referenzen/...` architecture.

Do not mass-generate thin doorway/location pages.

Reference pages must be backed by real projects and useful local substance.

Central reference data should drive pages.

Adding another project should normally require:

1. final media
2. central data entry

rather than duplicated page implementations.

Reference data currently supports:

- location
- capacity in kWp
- battery-storage status
- verification/data status

Placeholder reference values may be used for layout development only when explicitly marked.

Never use unverified placeholder project facts in:

- Metadata
- JSON-LD
- OpenGraph
- SEO copy presented as factual


## Team and Privacy

Use the central team content model.

Some employees are intentionally published by role only.

Never infer or expose an anonymous person's identity from:

- faces
- filenames
- EXIF
- WordPress metadata
- SQL
- hidden CMS content

Do not identify people by facial appearance.

Use names only where public project content explicitly permits publication.

Never invent employees or use generated people as real Energie-Kraft staff.


## Images and Assets

Asset priority:

1. real Energie-Kraft/project/team photography
2. suitable approved legacy media
3. existing final site assets
4. generated imagery only for generic non-factual visual concepts when appropriate

Never use generated imagery as if it showed:

- actual Energie-Kraft employees
- actual customers
- actual completed reference projects

Avoid repeatedly reusing the same prominent image across several pages when suitable alternatives exist.

Raw/local source media belongs under:

`design-input/`

Final optimized media belongs under:

`public/images/...`

Prefer WebP where appropriate and use `next/image`.

Do not unnecessarily upscale small originals.


## Missing Images

Never silently replace missing media with an unrelated image.

Use the established `MediaPlaceholder` pattern where appropriate.

A placeholder should communicate:

- intended motif
- target dimensions
- aspect ratio
- preferred format


## Raw Input and Migration Sources

`design-input/` and `migration-input/` contain local source/reference material.

They are not application source directories.

Do not:

- modify them
- move them
- rename them
- commit them

Do not recursively inspect these directories unless the current task genuinely requires source media or legacy analysis.

Prefer targeted access.

Do not dump or load complete large files when targeted search is sufficient.


## Legacy WordPress / SEO Context

The legacy WordPress site has valuable historical Google rankings and useful public content.

Preserve legitimate existing search intent and useful topical coverage.

Do not change ranking legacy URLs merely to make routing cleaner.

Consult:

`docs/legacy-url-migration.md`

before making legacy URL decisions.

The legacy WordPress site was compromised in July 2026.

Content, URLs, query parameters and analytics signals from the incident period may contain:

- spam
- foreign-language pages
- gambling/forex/APK content
- manipulated URLs
- query-parameter garbage
- hacked posts

Never treat suspicious incident data as legitimate SEO opportunity.

Do not migrate incident-generated content.

Do not inspect or reuse historical private:

- applications
- referrals
- contact submissions
- customer messages
- emails
- phone numbers
- addresses

Do not inspect raw WXR, SQL, GA4 or Search Console exports unless the current task explicitly requires raw-source analysis.

Prefer existing curated migration/SEO documentation and already migrated content whenever sufficient.


## SEO and GEO Content

Do not blindly copy legacy text.

Do not blindly retain AI-generated new text.

Use the strongest result based on:

- legitimate historical search intent
- technical accuracy
- user usefulness
- regional relevance
- entity clarity
- topical coverage
- readability
- conversion quality

Possible outcomes per section:

- retain current copy
- improve current copy
- merge current + useful legacy content
- replace with superior verified legacy-derived content

Avoid:

- keyword stuffing
- generic AI marketing language
- artificial text length
- repetitive paragraphs
- invented facts

Write for humans first while structuring information clearly enough for search engines and AI systems to understand.


## Data Visualization

When numerical or relational information is clearer visually than as another text/card block, prefer an appropriate visualization.

For simple charts:

prefer lightweight SVG/CSS implementations.

Add a chart dependency only when complexity or interactivity genuinely justifies it.

Charts should:

- match Energie-Kraft CI
- be responsive
- contain visible labels
- be accessible
- not rely only on color
- not invent business/project statistics

Design chart components for potential reuse in future calculator/configurator result views where practical.


## Facts

Never invent factual claims including:

- company history
- founding dates
- employee counts
- certifications
- customer counts
- project counts
- installed capacity
- project performance
- testimonials
- jobs
- salaries
- subsidies
- current tariffs
- awards

If a fact is unverified:

- omit it
- phrase it neutrally
- or mark it explicitly as internal placeholder when the task allows placeholders


## Reviews

Reuse the existing review adapter architecture.

Do not create a second review system.

Use official provider integrations for Google/Trustpilot where applicable.

Never fabricate:

- reviews
- reviewer names
- rating
- review count

Do not create misleading review structured data.

The homepage review experience should link visitors to the complete external review/profile source where configured.


## Verification

Keep verification minimal and task-specific.

The current task prompt defines required checks.

Do not independently expand verification into:

- full test suites
- broad browser testing
- unrelated Firebase tests
- unrelated Functions tests
- unrelated calculator/configurator tests
- full E2E testing
- repeated builds

The user normally performs final visual QA manually.

Run only checks necessary for the changed logic or explicitly requested by the task.

Once relevant acceptance criteria pass, stop.


## Git and Production Safety

Preserve all user work.

Never use destructive commands such as:

- `git reset`
- `git clean`
- broad `git restore`
- force operations

to remove user changes unless explicitly requested.

A dirty working tree is not automatically an error.

Do not commit, push, tag or deploy unless explicitly requested.

Do not provision production infrastructure unless explicitly requested.

Do not send real external test emails unless explicitly requested.

`design-input/` and `migration-input/` must never be committed.


## Documentation Map

Read ONLY documentation relevant to the current task.

Useful sources include:

- `docs/design-system.md` – visual/frontend rules
- `docs/legacy-url-migration.md` – legacy URL decisions
- `docs/sprint-8-content-inventory.md` – migrated content inventory
- `docs/sprint-8-seo-baseline.md` – SEO and incident baseline
- `docs/sprint-8-team-assets.md` – team/media mapping
- `docs/sprint-8-placeholder-assets.md` – missing media requirements
- `docs/sprint-8-reference-data-todo.md` – unverified reference facts
- `docs/sprint-8-1-go-live-guards.md` – production verification guards
- `docs/reviews-integration.md` – reviews integration

Do not preload these documents.

Open only documents relevant to the current task.


## Scope and Roadmap

Do only the requested task and dependencies required for correctness.

Do not pull unrelated future-sprint work into the current task.

Current direction:

- Sprint 8.3: content, SEO/GEO and FAQ architecture/content
- Sprint 8.4: premium visual and media refinement
- Sprint 9: calculators, conversion UX and lead journeys
- Sprint 10: final SEO/GEO/local SEO, redirects and hack/index cleanup
- Sprint 11: accessibility, performance, tracking and cross-browser QA
- Sprint 12: production/go-live migration

If something clearly belongs to a later sprint and is not required for correctness now, leave it for that sprint rather than expanding scope.


## Completion

When the task requests implementation, implement it rather than returning only a plan.

Keep completion reports concise.

Report:

- what changed
- important decisions
- checks actually run and results
- remaining manual/user inputs
- git status when relevant

Do not produce a large audit report unless explicitly requested.

When the requested outcome is complete and relevant checks pass, stop.