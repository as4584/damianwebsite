# Agent Handoff Context

## Documentation Backup Location

The documentation backup is committed to GitHub in this repository and tracked by version.

- Registry: `docs/BACKUP_REGISTRY.md`
- Latest Archive: `docs/backups/docs-backup-v2026.02.26-01.tar.gz`
- Latest Checksum: `docs/backups/docs-backup-v2026.02.26-01.sha256`

## Current Documentation Layout

- All markdown docs are centralized under `docs/`.
- Testing specs are centralized under `testing/e2e/` and grouped by website area:
  - `auth`, `chatbot`, `navigation`, `production`, `quality`, `debug`

## For Future Changes

When updating documentation:

1. Update relevant docs in `docs/`.
2. Create a new versioned backup artifact in `docs/backups/`.
3. Add the new entry/version details in `docs/BACKUP_REGISTRY.md`.
4. Commit and push to `main` so GitHub remains the canonical backup store.
