# Automated CI/CD Validation System

This project includes automated validation to ensure all commits pass CI before pushing.

## 🚀 Quick Start

Before your first push, run:
```bash
npm run fix
```

This will auto-detect and fix common issues.

## 📋 Available Commands

### `npm run validate`
Runs complete pre-push validation locally (same checks as CI):
- Contract violation detection
- Pre-flight isolation checks
- TypeScript type checking
- Full build
- Unit tests
- E2E quick validation

**Use this before pushing to avoid CI failures!**

### `npm run fix`
Auto-detects and fixes common CI issues:
- Missing executable permissions on scripts
- Stale dependencies
- Port conflicts
- Missing Playwright browsers
- Old build artifacts

### `npm run debug:e2e`
Diagnoses E2E test failures with detailed output:
- Checks Playwright installation
- Validates test configuration
- Runs diagnostic test with verbose logging
- Suggests fixes for common issues

## 🔒 Git Hooks (Automatic)

A pre-push hook is automatically installed that runs validation before every push:

```bash
git push origin main
# ↓ Automatically runs validation
# ✅ All checks pass → Push succeeds
# ❌ Checks fail → Push blocked, issues shown
```

To bypass the hook (not recommended):
```bash
git push --no-verify
```

## 🛠️ Manual Scripts

Located in `scripts/`:

- `pre-push-validation.sh` - Full validation suite
- `fix-ci-issues.sh` - Automated issue detection and fixing
- `debug-e2e.sh` - E2E test debugging
- `ci-contract-check.sh` - Contract violation detection
- `ci-preflight.sh` - Pre-flight isolation checks

All scripts can be run directly:
```bash
./scripts/fix-ci-issues.sh
./scripts/pre-push-validation.sh
./scripts/debug-e2e.sh
```

## 🎯 Typical Workflow

1. **Make your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

2. **Validate before pushing** (optional but recommended)
   ```bash
   npm run validate
   ```

3. **Push** (validation runs automatically)
   ```bash
   git push origin main
   ```

4. **If validation fails:**
   ```bash
   npm run fix        # Auto-fix common issues
   npm run validate   # Re-run validation
   ```

## 🔍 Troubleshooting

### "Port 3001 already in use"
```bash
lsof -ti:3001 | xargs kill -9
# or
npm run fix
```

### "Playwright browsers not installed"
```bash
npx playwright install chromium
# or
npm run fix
```

### "E2E tests failing"
```bash
npm run debug:e2e
```

### "Build errors"
```bash
npm run build
# Check output for specific errors
```

## ⚡ Performance Notes

- **Pre-push validation**: ~2-3 minutes
  - Contract checks: ~1s
  - Pre-flight: ~1s
  - TypeScript: ~5s
  - Build: ~60-90s
  - Unit tests: ~2s
  - E2E quick: ~30s

- **Full E2E suite**: ~5-10 minutes (run separately)

## 🎓 Best Practices

1. **Run `npm run fix` regularly** to keep environment healthy
2. **Use `npm run validate` before important pushes** to catch issues early
3. **Don't bypass the pre-push hook** unless absolutely necessary
4. **Keep dependencies updated** with `npm ci` when package-lock.json changes
5. **Check logs** if validation fails - they're detailed and helpful

## 📊 What Gets Checked

### Contract Violations
- No arbitrary `waitForTimeout()` in E2E tests
- Health endpoint exists
- No hardcoded external URLs
- Readiness scripts are executable
- CI workflows enforce health checks
- Cleanup runs unconditionally

### Pre-flight Checks
- Isolation contract (no forbidden patterns)
- Package integrity (package-lock.json exists)
- Configuration integrity (required env files)
- Critical path files exist

### Code Quality
- TypeScript compilation (no errors)
- Unit tests pass
- Build succeeds
- E2E confidence tests pass

## 🚨 CI Failure Recovery

If CI still fails after local validation passes:

1. **Check CI logs** for specific error
2. **Pull latest changes**: `git pull origin main`
3. **Clean rebuild**: 
   ```bash
   rm -rf .next node_modules
   npm ci
   npm run build
   ```
4. **Re-run validation**: `npm run validate`
5. **Force push if needed**: `git push origin main --force-with-lease`

## 📝 Adding New Checks

To add a new validation check:

1. Edit `scripts/pre-push-validation.sh`
2. Add check using `run_check` function:
   ```bash
   run_check "Your Check Name" "your-command-here"
   ```
3. Test locally: `npm run validate`
4. Update this README

## 🔗 Related Files

- `.husky/pre-push` - Git hook configuration
- `scripts/` - Automation scripts
- `.github/workflows/e2e-tests.yml` - CI workflow
- `playwright.config.ts` - E2E configuration

---

**Pro tip:** Run `npm run validate` before going home for the day. Wake up to green CI! ✅
