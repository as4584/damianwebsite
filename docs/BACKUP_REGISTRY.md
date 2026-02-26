# Documentation Backup Registry

This registry tracks versioned documentation backup artifacts that are committed to GitHub.

## Active Backup

- **Backup Version:** `docs-v2026.02.26-01`
- **Backup Date (UTC):** `2026-02-26`
- **Archive File:** `docs/backups/docs-backup-v2026.02.26-01.tar.gz`
- **Checksum File:** `docs/backups/docs-backup-v2026.02.26-01.sha256`
- **SHA256:** `6c6f8f38e7385a16932f86a89c461b8d48dfc543fc62dfbfae5b2939bbd70023`
- **Repository:** `https://github.com/as4584/damianwebsite`
- **Branch:** `main`

## Agent Context

When a future agent needs to recover or compare docs:

1. Pull latest from `main`.
2. Verify backup integrity:
   - `sha256sum -c docs/backups/docs-backup-v2026.02.26-01.sha256`
3. Extract backup locally:
   - `tar -xzf docs/backups/docs-backup-v2026.02.26-01.tar.gz`
4. Use this registry as the source of truth for backup version naming.

## Versioning Convention

- Format: `docs-vYYYY.MM.DD-##`
- Example: `docs-v2026.02.26-01`
- Increment `##` for multiple backups on the same day.
