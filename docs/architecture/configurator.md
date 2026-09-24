# Configurator architecture

## Journey and state

`/konfigurator` starts one shared energy-project journey. Product wizards exist for Photovoltaik, Stromspeicher, Wärmepumpe, Klimaanlage and Wallbox and reuse a common React context, reducer, progress/navigation components and canonical product order.

The browser stores the draft in `sessionStorage` under `energie-kraft:configurator:state:v10`. Older state keys are migrated/removed by the storage layer. Calculator handoffs use the separate, PII-free `energie-kraft:calculator-handoff:v1` record. Drafts, handoffs and the persisted submission ID are cleared only after successful submission or an explicit project restart; failed submission keeps the project recoverable.

## Settings and versions

The current settings document is `configuratorSettings/current`; immutable snapshots are stored as `configuratorSettingsVersions/{version}`. Saving is Administrator-only, validated with the shared schema and transactional: the submitted version must equal the current version, then a new numbered snapshot and current document are written together. Version `0` is the code-default compatibility model.

Settings groups:

- `general`: modeled cost uncertainty
- `economics`: grid price, feed-in value, electricity-price development and project horizon
- `photovoltaic`: tiered kWp pricing, additional project cost, degradation, annual operating cost, self-consumption and yield assumptions
- `batteryStorage`: tiered kWh pricing, efficiency, cycles and lifetime
- `heatPump`: electricity/hot-water/full-load/capacity assumptions, fixed costs and gas/oil comparison inputs
- `climate`: electricity, load-hours, SEER, equipment/installation and additional costs
- `wallbox`: home/public/PV electricity values, efficiency, equipment/installation and additional costs

Price tables define tier starts/unit prices and a maximum modeled size. Requests outside the approved modeled corridor use `individual_quote_required`; unknown cost/economic values remain `null`, not zero or extrapolated.

`photovoltaic.annualOperatingCostEuro` is distinct from `photovoltaic.fixedAdditionalCostEuro` (“Zusätzliche Projektkosten”). When annual operating cost is `0`, customer results and the PDF omit the separate operating-cost row and operating-cost-specific explanatory copy. Positive values are displayed and included normally.

## Calculations and backward compatibility

The client shows immediate results with shared calculation modules. On submission, `submitConfiguratorLead` loads the persisted settings version and applies the authoritative server model before persisting. Canonical project economics aggregate investment corridors and isolate the supported solar/storage/heating comparisons; unavailable economics remain explicitly unavailable.

Persisted configurator leads use the current schema while Admin normalization supports the implemented older schema versions. A missing historical settings version is rejected rather than silently recalculated with current assumptions.

## Submission, reference and side effects

The client persists one UUID submission ID and reuses it for retries. The Function fingerprints the validated payload. In a Firestore transaction it claims/creates the submission, allocates the next counter from `systemCounters/configuratorLead`, builds a public reference such as `PV-BS-00001`, stores the lead and updates the Admin realtime signal.

`configuratorSubmissions/{submissionId}` is the internal idempotency record. Reusing an ID with a different payload is rejected. Mail ownership is claimed before Mailgun; ambiguous `processing` delivery is not automatically replayed and requires reconciliation. Successful persistence is not rolled back by a later mail failure.

## Result and PDF

Product result components and the shared project analysis present modeled corridors, assumptions and limitations. The customer project PDF is generated server-side with PDFKit from the persisted/authoritative project model and public reference. Admin exposes one download action and may regenerate the same presentation from stored data; forwarding can attach it.
