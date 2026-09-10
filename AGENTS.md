# Energie-Kraft Next – Codex Repository Instructions

## Mission

This repository is the Next.js relaunch of Energie-Kraft Süd.

Work as a senior software engineer, UX engineer, technical SEO engineer and premium digital product designer.

Primary objective:
deliver production-quality changes efficiently while preserving the existing architecture, business logic, SEO value, security model and Energie-Kraft visual identity.

Do not rebuild working systems when an existing pattern can be extended.

Direct task instructions take precedence over this file.


## Working mode

Before changing code:

1. Understand the requested outcome.
2. Run `git status --short` once.
3. Inspect only the files, components, types, tests and docs relevant to the task.
4. Search for existing patterns before creating new ones.
5. Implement the complete logical change in a coherent batch.
6. Verify only what the change can realistically affect.

Do not repeatedly scan the whole repository.

Do not repeatedly run git status, lint, typecheck or build after every small edit.

Do not ask the user for information that can be determined safely from the repository.

Ask only when a missing fact requires a real business, legal, privacy or irreversible architecture decision.


## Repository knowledge map

Treat the repository and these docs as the source of truth.

Read only the documents relevant to the task:

- `docs/design-system.md` – visual system / frontend design rules
- `docs/legacy-url-migration.md` – legacy WordPress URL mapping
- `docs/sprint-8-content-inventory.md` – migrated and remaining content
- `docs/sprint-8-seo-baseline.md` – SEO baseline and incident context
- `docs/sprint-8-team-assets.md` – team image/publication rules
- `docs/sprint-8-image-assets.md` – Sprint 8 image inventory
- `docs/sprint-8-placeholder-assets.md` – missing media requirements
- `docs/sprint-8-reference-data-todo.md` – unverified reference data
- `docs/sprint-8-1-go-live-guards.md` – facts that must be verified before production
- `docs/reviews-integration.md` – Google/Trustpilot review architecture

Do not load all of these automatically.

Read a document only when its subject is relevant to the current task.


## Raw input directories

`design-input/` and `migration-input/` contain local source material.

They are not application source directories.

Do not modify, rename, move or commit their contents.

Do not recursively inspect them unless the task requires legacy content, SEO migration, team images, references or other media.

`migration-input/` may contain large WXR, SQL, Search Console and GA4 exports. Avoid scanning these unnecessarily.


## Security incident context

The legacy WordPress site was compromised in July 2026.

Search Console, WordPress, GA4 and sitemap data from the incident period may contain spam URLs, query-parameter pages, foreign content and manipulated signals.

Treat suspicious data from approximately 10/11 July 2026 onward with caution.

Never interpret spam traffic or hacked URLs as legitimate SEO opportunities.

Do not migrate incident-generated content.

Do not generate mass redirects for hacked URLs unless explicitly asked during the final SEO/security migration work.

Never inspect or reuse historical form submissions, applications, referrals, customer messages or other personal data from WordPress exports.


## Business priorities

Product/business priority is:

1. Photovoltaics + battery storage
2. Air conditioning + heat pumps
3. Wallboxes

SEO traffic does not redefine this business priority.

A Wallbox page may require strong SEO preservation without giving Wallbox greater visual or navigational prominence than PV or storage.


## Technology

Primary stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Firebase
- Firestore
- Firebase Functions
- Firebase Auth
- Firebase App Hosting
- Mailgun EU
- Zod
- Vitest where already used

Prefer existing repository libraries and patterns.

Do not add a dependency if the current stack can solve the problem cleanly.

Never run `npm audit fix --force` unless explicitly instructed.


## Architecture principles

Reuse before creating.

Prefer:

existing component -> extend it
existing schema -> extend it safely
existing helper -> reuse it
existing validation pattern -> reuse it
existing backend pipeline -> reuse it

Avoid parallel implementations of the same concept.

Do not duplicate formulas, validation logic, routing logic, SEO metadata logic, mail infrastructure or Firebase access patterns.

Keep server-authoritative operations server-side.


## Firebase and data security

Public browsers must never directly write protected business data to Firestore.

Existing server-side patterns are authoritative.

Protected areas include at least:

- leads
- configurator submissions
- applications
- referrals

Use server/Admin SDK paths and existing validation/security architecture.

Do not weaken Firestore or Storage Rules to make tests pass.

Admin SDK bypasses Firestore Rules; therefore every privileged server action/function must perform its own authorization where required.

Do not provision Firebase resources, change production configuration or deploy unless explicitly requested.

Never expose or print secrets.

Use existing secret names and configuration; do not hardcode credentials.


## Mail

Reuse the existing Mailgun EU infrastructure.

Important destinations currently include:

- general/contact: existing configured Energie-Kraft recipient
- applications: `jobs@energie-kraft.de`
- referrals: `anfragen@energie-kraft.de`

Persist important business submissions before attempting mail delivery.

Mail failure must not destroy an already accepted Firestore submission.

Do not claim that an email was delivered when the provider only accepted it.

Never send real external test emails unless explicitly requested.

### Current development environment

During the current development phase, application collections are expected to exist only in the local Firebase Emulator environment.

Do not search the production Firebase project for development collections merely to verify their existence.

Do not provision databases, collections, Storage resources or other Firebase infrastructure because production discovery returns no data.

Use the configured local Firebase Emulator Suite for development and targeted integration/rules verification unless the task explicitly requests production Firebase work.

## Contact and lead architecture

Reuse the Sprint-5 lead/admin/realtime/mail patterns.

Use the existing central contact route constant such as `CONTACT_FORM_HREF` instead of hardcoding `/kontakt#kontaktformular` repeatedly.

Do not create a second lead backend when the existing architecture can support the feature safely.


## Calculators

Existing calculator URLs are permanent and must not be deleted or casually redirected:

- `/rechner/photovoltaik`
- `/rechner/photovoltaik-kosten`
- `/rechner/klimaanlagen-kosten`
- `/rechner/waermepumpen-kosten`
- `/rechner/wallbox-kosten`

Reuse their existing business logic and formulas.

Do not duplicate calculations.

Do not alter formulas or economic assumptions unless the task explicitly requests a calculation change.

For calculator UX work, improve presentation, explanation, charts, responsiveness, CTA flow and accessibility without silently changing calculation results.


## Configurators

Existing configurator architecture must be preserved.

Primary routes include:

- `/konfigurator/photovoltaik`
- `/konfigurator/stromspeicher`
- `/konfigurator/klimaanlage`
- `/konfigurator/waermepumpe`
- `/konfigurator/wallbox`

The configurator represents one total-energy project journey and reuses the existing lead architecture.

Do not redesign its data contract, journey or persistence model unless explicitly requested.


## Premium frontend quality

For visible frontend work, do not stop at functional correctness.

The result must look intentionally designed.

Energie-Kraft visual language:

- Montserrat
- `#005CA9` primary blue
- `#0DA1D1` cyan accent
- `#182E4C` dark text blue
- `#091433` deep navy
- `#E9EDF8` soft surface
- `#FFFFFE` / white backgrounds

Preserve the recognizable Energie-Kraft design DNA:

- image-led sections
- strong editorial compositions
- alternating image/text layouts
- white and soft surfaces
- blue/cyan brand sections
- generous whitespace
- deliberate typography
- varied but coherent section proportions
- subtle motion
- strong real-world photography

Avoid generic SaaS appearance.

Avoid excessive:

- cards
- pills
- shadows
- glassmorphism
- boxed content
- repetitive three-column layouts

Premium means hierarchy, typography, composition, photography, rhythm and detail — not more decoration.


## Responsive design

Desktop and mobile are intentional layouts, not merely scaled versions of each other.

Always check for:

- sensible mobile crop
- readable line lengths
- no horizontal overflow
- usable spacing
- touch targets around 44 px or larger
- meaningful content order

Use separate responsive assets/crops where the design benefits materially.


## Accessibility

Accessibility is part of completion.

Use:

- semantic HTML
- correct heading hierarchy
- keyboard navigation
- visible focus states
- appropriate ARIA
- `aria-current="page"` for active navigation where appropriate
- sufficient contrast
- proper labels and error association
- reduced-motion handling

Do not rely solely on hover, color or animation to communicate essential information.


## Navigation

Preserve the existing premium header/mega-menu architecture.

Business/navigation structure currently includes:

- Energielösungen
- Service & Wartung
- Unternehmen
- Referenzen
- Jobs
- Kontakt

The currently active page and parent group should have a premium visible active state.

Mega-menu preview behavior:

- hover/focus may temporarily preview an item's image and description
- preview state is temporary
- when pointer/focus leaves the menu, remove the temporary preview
- restore the active route's preview when applicable
- otherwise restore the group's configured default preview

Do not leave the last arbitrary hovered item as stale state.

Do not create a redundant top-level "Referenzen nach Ort" item.


## Legacy SEO

The existing WordPress site has valuable ranking history.

Do not change existing legitimate URLs merely to make routing look cleaner.

Preserve search intent and useful topical coverage from ranking legacy content.

The migration matrix in `docs/legacy-url-migration.md` is the source of truth for old-to-new routing decisions.

Do not implement large redirect sets unless the task explicitly belongs to the final SEO/go-live migration.

Do not keyword-stuff content.


## References / Local SEO

The existing SEO hub is:

`/pv-referenzen`

Keep it.

Local reference pages use the architecture:

`/pv-referenzen/[location]`

Do not replace this with a parallel `/referenzen/...` hierarchy.

Reference pages must be backed by real projects and useful local substance.

Do not mass-generate doorway/location pages.

Central reference data lives in the existing reference content model.

Adding a new project should normally require:

1. final image
2. central data entry

not a new manually duplicated `page.tsx`.

Current project fields include:

- location
- capacity in kWp
- battery-storage status
- verification/data status

Placeholder reference values may exist for layout development.

Never use placeholder project facts in metadata, JSON-LD, OpenGraph or other SEO facts.

Read `docs/sprint-8-reference-data-todo.md` before treating reference facts as verified.


## Team and privacy

Use the central team content model.

Some people are intentionally published by role only.

Never infer or expose the identity of an anonymous employee from:

- images
- filenames
- EXIF
- WordPress metadata
- SQL
- hidden CMS information

Do not identify people from their faces.

Use a person's name only when the public project data explicitly permits it.

Use real Energie-Kraft people only.

Never generate fictional/AI employees.


## Images and assets

Asset priority:

1. real Energie-Kraft / project / team photography
2. approved legacy media
3. existing final site assets
4. AI only for generic non-factual atmosphere when genuinely necessary

Never use AI imagery as if it showed a real Energie-Kraft employee, customer or completed reference project.

Raw assets remain under `design-input/`.

Final optimized assets belong under appropriate `public/images/...` directories.

Prefer WebP where suitable and `next/image`.

Do not unnecessarily upscale small originals.


## Missing images

Never silently use an unrelated image because the intended media is missing.

Use the existing `MediaPlaceholder` pattern where appropriate.

A placeholder should state:

- required motif
- dimensions
- aspect ratio
- preferred format

Keep missing-asset documentation updated when the task materially changes media requirements.


## Jobs

Use the central jobs content model rather than duplicating job data.

Only publish jobs that are genuinely active/approved.

Do not invent open positions, benefits, salaries or employment conditions.

Applications use the established application workflow and server-side persistence.


## Kunden werben Kunden

The referral workflow uses the established multi-step implementation.

Do not remove:

- referrer data
- referred-customer data
- final data summary
- required consent
- server validation
- persistence before mail

The legacy 250 € reward and campaign conditions remain subject to the go-live verification guard.

Do not present an unverified campaign condition as permanently guaranteed.


## Reviews

Reuse the existing review adapter architecture.

Do not create another reviews system.

Only use official provider integrations for Google Business Profile / Trustpilot.

Never fabricate:

- review text
- reviewer names
- rating
- review count

No self-serving review/AggregateRating structured-data hacks.


## Content facts

Never invent:

- company history
- founding dates
- employee counts
- certifications
- project counts
- installed capacity
- customer counts
- project performance
- customer quotations
- job vacancies
- subsidies
- current tariffs
- awards

If a fact is not verified, omit it, phrase it neutrally or use an explicit internal placeholder where the task permits one.


## Testing strategy

Testing must be proportional to the changed area.

Do not test after every small edit.

Implement the coherent batch first, then verify once.


### Low-risk frontend / content / CSS / navigation work

Normally run near the end:

`git diff --check`
`npm run lint`
`npm run typecheck`

Run one root:

`npm run build`

when the change is substantial enough to justify it.

Do not run Functions, Rules, Firebase or full Vitest tests for unrelated frontend work.


### Calculator logic changes

Run the targeted calculator/unit tests for the modified calculation plus normal root checks.

Do not run unrelated backend test suites.


### Functions / Firestore / auth / mail / persistence changes

Run only the relevant focused tests plus:

Functions lint/build

and affected Rules tests when Rules changed.

Then perform normal root checks.

Do not automatically run every repository test.


### Security Rules changes

Use the existing emulator/rules test setup.

Never relax rules just to make a test green.


### Browser verification

Check only affected routes and critical interactions.

Use desktop plus approximately 390 px mobile for visible UI changes.

Do not perform a full-site browser tour for a small isolated change.


## Expensive / unnecessary verification

Unless explicitly requested or technically necessary, do not run:

- `npm run check:all`
- full Vitest suite
- unrelated Functions tests
- unrelated Firebase emulator suites
- full E2E suite
- PDF/mail tests unrelated to the change
- repeated production builds

Once relevant acceptance criteria pass, stop testing.


## Git safety

Preserve all user work.

Never use destructive commands such as reset/clean/restore to remove user changes unless explicitly instructed.

A dirty working tree is not automatically an error.

Determine whether existing changes belong to the current work before acting.

Do not commit, push, tag or deploy unless the current user request explicitly asks for it.

Never amend unrelated existing commits.


## Scope control

Do not pull future-sprint work into the current task unless required for correctness.

Current roadmap:

- Sprint 9: calculators, conversion UX and calculator/configurator/contact journeys
- Sprint 10: final SEO/GEO/local SEO, legacy redirects and hack/index cleanup
- Sprint 11: accessibility, performance, tracking and cross-browser QA
- Sprint 12: production/go-live migration

If a requested change belongs clearly to a later sprint and is not required now, document it rather than expanding scope.


## Completion

Do not stop at a plan when the task asks for implementation.

Finish the requested outcome.

At completion report concisely:

- what changed
- important architecture/design decisions
- checks actually run and whether they passed
- remaining real data/assets/manual verification required
- git status when relevant

Do not produce a huge audit report unless the task explicitly requests one.

When the requested result is complete and relevant verification passes, stop.