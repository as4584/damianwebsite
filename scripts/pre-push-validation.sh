#!/bin/bash
set -e

# Pre-Push Validation Script
# Runs all CI checks locally before allowing push
# This ensures commits pass CI before they leave your machine

echo "🚀 Pre-Push Validation Starting..."
echo "=================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

# Function to run a check and track failures
run_check() {
  local name="$1"
  local command="$2"
  
  echo "📋 Running: $name"
  if eval "$command" > /tmp/check_output.log 2>&1; then
    echo -e "${GREEN}✅ PASSED:${NC} $name"
    echo ""
    return 0
  else
    echo -e "${RED}❌ FAILED:${NC} $name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    tail -30 /tmp/check_output.log
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# 1. Contract Violation Detector
run_check "Contract Violation Detector" "./scripts/ci-contract-check.sh"

# 2. Pre-flight Validation
run_check "Pre-flight Isolation Check" "./scripts/ci-preflight.sh"

# 3. TypeScript Type Checking (Lint)
run_check "TypeScript Type Checking" "npm run lint"

# 4. Build
echo "📋 Running: Build Check"
echo "   (This may take 1-2 minutes...)"
if npm run build > /tmp/build_output.log 2>&1; then
  echo -e "${GREEN}✅ PASSED:${NC} Build Check"
  echo ""
else
  echo -e "${RED}❌ FAILED:${NC} Build Check"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  grep -E "Error|error|Failed|failed" /tmp/build_output.log | tail -20
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  FAILED=$((FAILED + 1))
fi

# 5. Unit Tests
run_check "Unit Tests" "npm run test:ci"

# 6. E2E Tests (Quick validation only - not full suite)
echo "📋 Running: E2E Quick Validation"
echo "   (Testing confidence score only...)"
if npx playwright test e2e/confidence-score.spec.ts > /tmp/e2e_output.log 2>&1; then
  echo -e "${GREEN}✅ PASSED:${NC} E2E Quick Validation"
  echo ""
else
  echo -e "${RED}❌ FAILED:${NC} E2E Quick Validation"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  tail -30 /tmp/e2e_output.log
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  FAILED=$((FAILED + 1))
fi

# Summary
echo ""
echo "=================================="
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
  echo "   Safe to push to remote!"
  echo ""
  exit 0
else
  echo -e "${RED}❌ $FAILED CHECKS FAILED${NC}"
  echo "   Fix issues before pushing!"
  echo ""
  echo "Quick fixes:"
  echo "  - Run: npm run build (to see build errors)"
  echo "  - Run: npm run test:ci (to see test failures)"
  echo "  - Run: npm run test:e2e (to run full E2E suite)"
  echo ""
  exit 1
fi
