# DukaanBoost

**Simple, practical marketing kits for local businesses.**

DukaanBoost helps shop owners, salons, cafes, tutors and local service providers prepare social captions, WhatsApp promotions and a 7-day posting plan.

## Current MVP

- Responsive, mobile-first single-page web app.
- Generates reusable social captions, WhatsApp copy, short ad lines and a weekly posting plan from a few form fields.
- Supports Hinglish (Roman Hindi), Hindi and English.
- Includes category-specific content tips and different brand tones.
- Copy buttons for each generated section.
- No sign-up, external libraries, API key, backend or paid API required.
- Form data is processed in the browser; it is not sent to a server.

## Important honesty note

This MVP uses built-in templates and simple local text generation. It does **not** call an AI model, send messages, publish posts, or guarantee sales or income. Review every offer, price, date and claim before publishing.

## Run locally

Open `index.html` in a modern browser. No install or build step is required.

## Tests and deployment

- Run the automated tests with `npm test` (Node.js 20+; no third-party packages are needed).
- Tests cover required form controls, inline JavaScript syntax, generated output, Hindi/English output, seven-day plan generation, basic HTML escaping, and deployment security-header configuration.
- The Vercel configuration adds baseline browser security headers. The Content Security Policy permits inline JavaScript and CSS because this MVP keeps its code in `index.html`; this is a compatibility trade-off, not a strict nonce-based CSP.
- The app is static HTML/CSS/JavaScript. For Vercel, use the repository root as the root directory; no build command is required.

## Roadmap (validate before building)

1. Test with 5–10 real local businesses and improve templates from feedback.
2. Add downloadable campaign kits and reusable business profiles.
3. Consider paid premium templates or a done-for-you marketing service only after users demonstrate demand.
4. Add AI generation only if a secure server-side provider and sustainable cost model are available.

## Product principle

Keep the free starter useful, mobile-friendly and transparent. Do not collect customer data unnecessarily, claim features that do not exist, or promise earnings.
