# CI Governance Contract Enforcement

**Document Version:** 1.0  
**Last Updated:** February 3, 2026  
**Status:** ✅ ENFORCED

## Executive Summary

This repository enforces **5 mandatory CI contracts** that prevent silent regressions and ensure deterministic test execution. Any violation causes the pipeline to **fail fast** with explicit error messages before expensive E2E tests run.

---

## Enforced Contracts

### 1. Build Contract
**Rule:** `npm run build` MUST succeed before any tests execute.

**Enforcement:**
- Pre-flight job validates code quality (lint + typecheck)
- Dedicated build job compiles the application
- Build artifacts are packaged and passed to test jobs
- E2E tests only run if build succeeds

**Failure Message:**
```
❌ BUILD CONTRACT VIOLATION: 'npm run build' failed.
   E2E tests CANNOT run until build succeeds.
```

**Location:** `.github/workflows/e2e-tests.yml` (build job, lines 51-75)

---

### 2. Readiness Contract
**Rule:** E2E tests MUST NOT run unless `/api/health` returns `{"ready": true}`.

**Enforcement:**
- Signal-based readiness script (`scripts/wait-for-app.sh`) polls health endpoint
- Bounded timeout (120 seconds) prevents infinite hangs
- Mandatory guardrail check validates health response structure
- Tests are blocked until application signals readiness

**Failure Message:**
```
❌ READINESS CONTRACT VIOLATION: Invalid health response.
   Expected: {"ready": true}
   Received: <actual payload>
```

**Location:** `.github/workflows/e2e-tests.yml` (lines 140-165)

---

### 3. Isolation Contract
**Rule:** CI must not depend on external services unless mocked.

**Enforcement:**
- Tests run on fixed port (3001) to avoid collisions
- Application runs in production mode with local state
- Pre-flight script checks for hardcoded external URLs
- Supabase and external APIs use environment variables

**Failure Message:**
```
❌ ISOLATION CONTRACT VIOLATION: Forbidden pattern 'pattern' found in source code.
   Source code must use relative paths or environment variables.
```

**Location:** `scripts/ci-preflight.sh` (lines 10-20)

---

### 4. Determinism Contract
**Rule:** CI runs must be repeatable with identical outcomes.

**Enforcement:**
- Arbitrary `waitForTimeout()` calls are flagged as violations
- Signal-based waits (`expect().toBeVisible()`) are mandatory
- Health endpoint must exist and be referenced
- CI contract detector scans for non-deterministic patterns

**Failure Message:**
```
⚠️  WARNING: Found waitForTimeout() calls in E2E tests.
   These should be replaced with signal-based waits.
```

**Location:** `scripts/ci-contract-check.sh` (lines 12-21)

---

### 5. Cleanup Contract
**Rule:** No background processes may survive after job completion.

**Enforcement:**
- Cleanup step runs unconditionally (`if: always()`)
- Server PID is tracked and terminated explicitly
- Port 3001 is swept with `kill-port` as fallback
- Verification ensures port is free before job ends

**Failure Message:**
```
❌ CLEANUP CONTRACT VIOLATION: Port 3001 still occupied.
```

**Location:** `.github/workflows/e2e-tests.yml` (lines 190-215)

---

## Workflow Architecture

```
┌──────────────────┐
│   Pre-flight     │  ← Lint, Typecheck, Source Integrity
│   Validation     │     Fails fast if code is invalid
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Build          │  ← npm run build + artifact packaging
│   Contract       │     Fails if build doesn't produce .next/
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   E2E Tests      │  ← Only runs if build succeeds
│   (3 browsers)   │     Enforces readiness + isolation
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Governance     │  ← Reports contract status
│   Summary        │     Marks pipeline as passed/failed
└──────────────────┘
```

---

## Contract Violation Detection

Run manually before push:
```bash
./scripts/ci-contract-check.sh
```

This script scans for:
1. `waitForTimeout()` in test files (determinism violation)
2. Missing health endpoint (readiness violation)
3. Hardcoded URLs in source (isolation violation)
4. Non-executable scripts (build violation)
5. Missing health checks in workflow (readiness violation)
6. Missing `if: always()` on cleanup (cleanup violation)

**Exit Code:**
- `0` = Warnings (non-blocking)
- `1` = Critical failures (blocking)

---

## Guardrails

### Pre-Execution Guardrail
Before E2E tests run, the following check is mandatory:

```bash
READY_SIGNAL=$(curl -s http://localhost:3001/api/health)
if [[ ! "$READY_SIGNAL" == *"\"ready\":true"* ]]; then
  echo "❌ READINESS CONTRACT VIOLATION"
  exit 1
fi
```

**Purpose:** Prevents race conditions where tests start before the application is initialized.

**Cannot be bypassed:** This step is hardcoded in the workflow and will fail the entire job.

---

## Regression Prevention

### Future-Proofing Mechanisms

1. **Job Dependencies:** Tests depend on build, which depends on pre-flight
2. **Explicit Failures:** All violations emit clear error messages
3. **Contract Scanner:** `ci-contract-check.sh` runs on every push
4. **Unconditional Cleanup:** Processes are terminated even if tests fail
5. **Artifact Validation:** Build job verifies `.next/` exists

### What Cannot Regress

- ❌ Tests running before build completes
- ❌ Tests running with unhealthy application
- ❌ Orphaned processes blocking future runs
- ❌ Time-based waits causing flakiness
- ❌ Silent failures masking real issues

---

## Maintenance

### Adding New Contracts

1. Define the invariant (what MUST be true)
2. Add enforcement in workflow (fail-fast check)
3. Add detection in `ci-contract-check.sh`
4. Update this document

### Modifying Existing Contracts

**NEVER:**
- Remove error messages
- Add `continue-on-error: true`
- Skip contract checks
- Weaken failure conditions

**ALWAYS:**
- Test changes locally first
- Run `ci-contract-check.sh` before push
- Update failure messages for clarity

---

## Ownership

**CI Reliability Owner:** Responsible for pipeline correctness  
**CI Governance Owner:** Responsible for contract enforcement

Contact: See repository maintainers

---

## References

- Health Endpoint: `app/api/health/route.ts`
- Readiness Script: `scripts/wait-for-app.sh`
- Pre-flight Script: `scripts/ci-preflight.sh`
- Contract Scanner: `scripts/ci-contract-check.sh`
- Workflow: `.github/workflows/e2e-tests.yml`
- Deployment Workflow: `.github/workflows/deployment-verification.yml`

---

**Last Contract Audit:** February 3, 2026  
**All Contracts:** ✅ ENFORCED
