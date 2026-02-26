# Testing Structure

This folder is the dedicated home for automated testing assets.

## Tree

- `testing/e2e/auth/` → authentication and dashboard-access flows
- `testing/e2e/chatbot/` → chatbot UX, intake, visibility, and chatbot-to-dashboard transitions
- `testing/e2e/navigation/` → site-wide navigation and page route coverage
- `testing/e2e/production/` → production readiness smoke checks
- `testing/e2e/quality/` → confidence and scoring quality checks
- `testing/e2e/debug/` → targeted debug scenarios for flaky/regression investigation

## Run Commands

- Run all E2E tests: `npm run test:e2e`
- Run all tests: `npm run test:all`
- Run only one area (example): `npx playwright test testing/e2e/chatbot`

## Collaboration Notes

- Add new specs to the folder matching the website area they validate.
- Keep test names scenario-focused (for example, `chatbot-intake-flow.spec.ts`).
- Avoid mixing debug-only cases with production smoke suites.
