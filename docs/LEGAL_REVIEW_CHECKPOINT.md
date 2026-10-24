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
- Confirm the public operator/contact details and effective dates with the owner; do not invent them.
- Obtain the owner's approval of revised public wording and note the approved effective date.
- Keep each page's draft notice until its publication prerequisites are satisfied. Only then mark that page publishable and remove its notice.
- Run the relevant content validation, typecheck, unit tests, browser tests, and production build before publishing.

## Current publication gate

Terms and Privacy still need owner-approved public contact details and effective dates. Contact remains a draft until a delivery service and public contact method are configured and verified. The supplied copy is approved as wording, but those missing publication details do not authorize removing the visible draft notices.
