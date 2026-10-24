# Contact Form Implementation Notes

These are implementation requirements, not copy to display on the Contact page.

## Before enabling submissions

- Select and configure a submission service that delivers messages to a dedicated Draftbound email address.
- Keep the form inactive until delivery has been tested end to end. Never show a success message for a message that was not accepted for delivery.
- Add low-friction spam protection that does not make players solve unnecessary puzzles.
- Collect only the planned fields: category, email, subject, and message required; name and browser/device optional. Do not add accounts, tracking, or mandatory device details.
- Do not add file uploads yet. Keep the design extensible for future screenshot attachments.
- Update the Privacy page after selecting a provider to accurately explain submission processing, storage, and retention.

## Planned form fields

- “What can we help you with?” (required): Bug Report — Something isn’t working as expected; Feature Suggestion — Have an idea that could make Draftbound better?; Gameplay Feedback — Share thoughts on balance, mechanics, or the overall experience; Technical / Save Issue — Trouble with saved progress, importing, exporting, or performance; Privacy / Rights Concern — Questions about personal information, privacy, or intellectual-property rights; General Inquiry — Anything else.
- Your Name (optional).
- Email Address (required), used only to communicate with the player about their message.
- Subject (required).
- Message (required).
- Browser / Device (optional).
- State that fields marked with * are required. Include concise instructions that bug reports benefit from reproduction steps.
- Include the save troubleshooting and feedback expectations copy from the user-provided Contact page text.

The page currently explains that the contact form is unavailable. Replace that notice with the active form only after service configuration, privacy copy, and delivery verification are complete.

## Current code behavior

- `src/app/data/contact-form-config.ts` contains an empty endpoint and a disabled submission flag. The form stays unavailable until both are configured.
- The form sends JSON with `POST` and shows success only after the configured endpoint returns a successful HTTP response.
- The provider must accept cross-origin browser requests from the GitHub Pages origin, support the JSON field names used by the form, and provide any additional spam filtering required.
- The configured endpoint is public browser code. Never put a private API key or secret in this file; use a provider endpoint or public-client credential intended for static sites.
- The built-in honeypot is a low-friction first layer, not a replacement for provider-side abuse controls.
- Update the Privacy page and owner contact details before enabling submissions. Do not enable the form merely by setting an endpoint.
