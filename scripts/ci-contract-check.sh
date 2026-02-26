#!/bin/bash
set -eo pipefail

# CI Contract Violation Detector
# Scans the codebase for patterns that would cause CI to fail silently.

echo "🔍 Scanning for CI Contract Violations..."

VIOLATIONS=0

# 1. Detect arbitrary sleeps in E2E tests (if any exist)
echo ""
echo "📋 Contract 1: No arbitrary time-based waits allowed"
if [ -d "testing/e2e" ]; then
  if grep -r "waitForTimeout" testing/e2e --include="*.spec.ts" 2>/dev/null | grep -v "playwright-report" | head -5; then
    echo "⚠️  WARNING: Found waitForTimeout() calls in E2E tests."
    echo "   These should be replaced with signal-based waits (expect().toBeVisible())."
    VIOLATIONS=$((VIOLATIONS + 1))
  else
    echo "✅ No waitForTimeout() violations found in testing/e2e."
  fi
else
  echo "✅ No E2E directory found at testing/e2e (skipping waitForTimeout check)."
fi

# 2. Detect missing health endpoint references
echo ""
echo "📋 Contract 2: Health endpoint must exist and be referenced"
if [ ! -f "app/api/health/route.ts" ]; then
  echo "❌ CRITICAL: Health endpoint missing at app/api/health/route.ts"
  VIOLATIONS=$((VIOLATIONS + 1))
  exit 1
else
  echo "✅ Health endpoint exists."
fi

# 3. Detect hardcoded production URLs in source (should use env vars)
# Note: Excludes comments, test files, and middleware files (used for subdomain routing)
echo ""
echo "📋 Contract 3: No hardcoded external URLs in application code"
FORBIDDEN_IN_SOURCE=(
  "innovationdevelopmentsolutions.com"
  "https://www."
  "http://www."
)
for pattern in "${FORBIDDEN_IN_SOURCE[@]}"; do
  # Exclude: middleware (routing), test files, comments
  if grep -r "$pattern" app/ lib/ --exclude-dir=node_modules --exclude="*.test.ts" --exclude="*.test.tsx" --exclude="*middleware*" 2>/dev/null | grep -v ".next" | grep -v "//" | grep -v "/*" | head -3; then
    echo "⚠️  WARNING: Found hardcoded URL pattern '$pattern' in source code (not comments/tests)."
    echo "   Use NEXT_PUBLIC_SITE_URL environment variable instead."
    VIOLATIONS=$((VIOLATIONS + 1))
  fi
done

# 4. Ensure wait-for-app.sh is executable and referenced
echo ""
echo "📋 Contract 4: Readiness script must be executable"
if [ ! -x "scripts/wait-for-app.sh" ]; then
  echo "❌ CRITICAL: scripts/wait-for-app.sh is not executable"
  VIOLATIONS=$((VIOLATIONS + 1))
else
  echo "✅ Readiness script is executable."
fi

# 5. Verify CI workflows reference the health check
echo ""
echo "📋 Contract 5: CI workflows must enforce health checks"
if ! grep -q "wait-for-app.sh" .github/workflows/e2e-tests.yml; then
  echo "❌ CRITICAL: e2e-tests.yml does not call wait-for-app.sh"
  VIOLATIONS=$((VIOLATIONS + 1))
  exit 1
else
  echo "✅ E2E workflow enforces health check."
fi

# 6. Verify cleanup happens unconditionally
echo ""
echo "📋 Contract 6: Cleanup must run unconditionally (if: always())"
if ! grep -q "if: always()" .github/workflows/e2e-tests.yml; then
  echo "❌ CRITICAL: Cleanup steps missing 'if: always()'"
  VIOLATIONS=$((VIOLATIONS + 1))
  exit 1
else
  echo "✅ Cleanup is unconditional."
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $VIOLATIONS -eq 0 ]; then
  echo "✅ CI Contract Scan: ALL PASSED"
  echo "   No violations detected. CI contracts are honored."
  exit 0
else
  echo "⚠️  CI Contract Scan: $VIOLATIONS WARNINGS"
  echo "   Review the warnings above and fix before merge."
  echo "   These may cause non-deterministic CI failures."
  exit 0  # Exit 0 for warnings (not blocking), change to exit 1 to block
fi
