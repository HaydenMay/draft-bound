# Draftbound legal-review checkpoint

Review the public-facing About, Terms of Use, Privacy Policy and Contact pages before every public release. Confirm that each page still describes the shipped game and active services accurately. Record whether each review required a copy change; do not treat unchanged copy as an automatic pass when product behavior has changed.

## Revisit when these change

- Recruiting, training, progression, simulation or other systems described in the Terms or About page.
- Real-world player references, college or professional team names, marks, or other third-party references.
- Advertising, analytics, tracking, payment or other external services.
- Accounts, cloud saves, Firebase, or any service that transmits or stores player information off-device.
- Contact form delivery, collected fields, spam controls, processing provider, retention, or public contact method.

## Release checklist

- Compare the pages with the actual application behavior, storage, network requests, and third-party services.
- Update the Privacy Policy for new data collected, purpose, processing providers, retention, and player choices.
- Update the Terms and any independent-game disclaimer when game behavior, references, or availability claims change.
- Verify that Contact accurately describes the working submission path. Never show a success state for a message that was not delivered.
- Confirm the public operator/contact details with the owner; do not invent them. Set each revised policy's effective/updated date to its approved publication date.
- Obtain the owner's approval of revised public wording and note the approved effective date.
- Keep each page's draft notice until its publication prerequisites are satisfied. Only then mark that page publishable and remove its notice.
- Run the relevant content validation, typecheck, unit tests, browser tests, and production build before publishing.

## Current publication gate

Terms and Privacy use October 24, 2026 as their Last Updated date. They still need owner-approved public contact details before their draft notices can be removed. Contact remains a draft until a delivery service and public contact method are configured and verified. The supplied copy is approved as wording, but those missing publication details do not authorize removing the visible draft notices.

## v1.4.2 release review

The v1.4.2 receiver catalog and team-first prospect rolls introduce real professional team names and real-player references into gameplay selection. This is a required legal-review trigger. Before publishing, confirm that the existing independent-game disclaimer accurately covers this use and that no team marks or logos are displayed. Keep the current Terms and Privacy draft notices in place until the separate public-contact and contact-delivery gates above are resolved.

## October 25 receiver-curation release review

Reviewed `src/app/data/information-pages.ts` against the curated-pool and spotlight changes. The pass selects among existing professional team/player references without adding affiliations, player grades or team marks. About and Terms still describe fictional, independently interpreted player abilities and outcomes; their approved disclaimer remains applicable. Privacy and Contact still describe local saves and unavailable message delivery accurately. No services, uploads, tracking or accounts were added. No public copy or policy-date change is needed for this pass. Existing Terms, Privacy and Contact draft notices and publication prerequisites remain in place.

## October 25 v1.4.3 training release review

Reviewed `src/app/data/information-pages.ts` against the approved starting-ability, training-budget and annual school-continuity changes. About and Terms describe college development, fictional attributes/outcomes and evolving game balance without promising specific coefficients. Those descriptions still match this pass. Save data remains local; no services, collection fields, team marks, accounts or uploads are introduced. Privacy and Contact require no copy or date change. Existing publication prerequisites and draft notices remain in place.

## October 26 v1.4.4 systems release review

Reviewed About, Terms, Privacy and Contact against the owner-authorized college simulation/development, declaration and automatic-career/single-card changes. About's collection sentence now describes the approved new flow and clarifies that old Draft/Career editions are preserved. Terms already cover fictional college/draft/pro outcomes and balance updates; no Terms change is needed. Privacy and Contact remain accurate: saves stay local and message delivery is not activated. No new tracking, services, uploads, identities, licensed fonts or artwork are introduced. Existing Terms/Privacy/Contact publication prerequisites, dates and draft notices remain unchanged. The scope approval is for the system flow, not removing legal publication gates.
