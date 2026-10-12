# Deployment notes

## Vercel setup

- Project: `dukaanboost`
- Repository: `smurari229-ai/Psm`
- App root: repository root
- Framework preset: Other / static
- Build command: none
- Output directory: leave default / repository root
- Install command: none required
- Node.js 20+ is used only by the automated tests.

The app entry point is `index.html`; `vercel.json` supplies baseline security headers. Do not add API keys or environment variables for this template-only MVP.

## Release checks

1. Confirm the GitHub Actions workflow `DukaanBoost quality checks` passes.
2. Open the branch preview and verify form submission for Hinglish, Hindi and English.
3. Test the copy buttons on both mobile and desktop browsers.
4. Inspect the deployed response headers and confirm the content loads without console errors.
5. Only promote to production after a human has reviewed the preview.

## Rollback

Vercel can redeploy a previously successful deployment from the project dashboard. Keep the GitHub default branch and release history intact; do not force-push or rewrite history.
