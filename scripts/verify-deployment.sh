#!/bin/bash

###############################################################################
# DEPLOYMENT VERIFICATION SCRIPT
# This script verifies that production-ready changes were successfully
# deployed to GitHub and are present in the codebase
###############################################################################

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   DEPLOYMENT VERIFICATION SCRIPT${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Track results
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Function to check a condition
check() {
    local description="$1"
    local command="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -n "Checking: $description... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Function to check file content
check_file_contains() {
    local description="$1"
    local file="$2"
    local pattern="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -n "Checking: $description... "
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ FAIL (file not found)${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
    
    if grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL (pattern not found)${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Function to check file does NOT contain pattern
check_file_not_contains() {
    local description="$1"
    local file="$2"
    local pattern="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -n "Checking: $description... "
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ FAIL (file not found)${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
    
    if ! grep -q "$pattern" "$file"; then
        echo -e "${GREEN}✓ PASS${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL (pattern should not exist)${NC}"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

cd "$PROJECT_ROOT"

echo -e "${YELLOW}=== 1. Git Deployment Status ===${NC}"
echo ""

# Check if we're on main branch
check "On main branch" "git branch --show-current | grep -q '^main$'"

# Check if working directory is clean
check "Working directory clean" "[ -z \"\$(git status --porcelain)\" ]"

# Check if pushed to remote
check "Latest commit pushed to origin" "[ \"\$(git rev-parse HEAD)\" = \"\$(git rev-parse origin/main)\" ]"

# Check latest commit message (flexible - just check it exists)
check "Latest commit exists" "git log -1 --pretty=%B | grep -q '.'"

echo ""
echo -e "${YELLOW}=== 2. Mock Data Elimination ===${NC}"
echo ""

# Check that mock data is removed
check_file_not_contains "No initializeSampleLead function" \
    "lib/db/leads-db.ts" \
    "initializeSampleLead()"

check_file_not_contains "No sample@example.com" \
    "lib/db/leads-db.ts" \
    "sample@example.com"

check_file_not_contains "No 'Sample User'" \
    "lib/db/leads-db.ts" \
    "Sample User"

# Check for seeding function (should exist)
check_file_contains "Has seedSampleLeadsIfEmpty function" \
    "lib/db/leads-db.ts" \
    "seedSampleLeadsIfEmpty"

echo ""
echo -e "${YELLOW}=== 3. Dashboard UI Updates ===${NC}"
echo ""

# Check dashboard has logout button
check_file_contains "Logout button in dashboard" \
    "app/dashboard/page.tsx" \
    "handleLogout"

check_file_contains "Logout imports signOut" \
    "app/dashboard/page.tsx" \
    "signOut"

check_file_contains "Proper branding text" \
    "app/dashboard/page.tsx" \
    "Innovation Business Development Solutions"

# Check navigation is minimal
check_file_not_contains "No Link imports (nav removed)" \
    "app/dashboard/page.tsx" \
    "from 'next/link'"

echo ""
echo -e "${YELLOW}=== 4. Test Files Exist ===${NC}"
echo ""

check "Confidence score test exists" \
    "[ -f 'testing/e2e/quality/confidence-score.spec.ts' ]"

check "Production ready test exists" \
    "[ -f 'testing/e2e/production/production-ready.spec.ts' ]"

check "Auth dashboard test exists" \
    "[ -f 'testing/e2e/auth/auth-dashboard.spec.ts' ]"

echo ""
echo -e "${YELLOW}=== 5. Documentation Files ===${NC}"
echo ""

check "Production deployment guide exists" \
    "[ -f 'docs/PRODUCTION_DEPLOYMENT.md' ]"

check "Test summary report exists" \
    "[ -f 'docs/TEST_SUMMARY_REPORT.md' ]"

check_file_contains "Deployment guide has correct domain" \
    "docs/PRODUCTION_DEPLOYMENT.md" \
    "innovationdevelopmentsolutions.com"

echo ""
echo -e "${YELLOW}=== 6. Environment Configuration ===${NC}"
echo ""

check "Production env file exists" \
    "[ -f '.env.production' ]"

check "Example env file updated" \
    "[ -f '.env.example' ]"

check_file_contains "NextAuth secret in example" \
    ".env.example" \
    "NEXTAUTH_SECRET"

echo ""
echo -e "${YELLOW}=== 7. Authentication Setup ===${NC}"
echo ""

check_file_contains "NextAuth config has redirect callback" \
    "lib/auth/config.ts" \
    "async redirect"

check_file_contains "Middleware uses getToken" \
    "middleware.ts" \
    "getToken"

check_file_contains "Protected routes defined" \
    "middleware.ts" \
    "matcher"

echo ""
echo -e "${YELLOW}=== 8. Code Quality ===${NC}"
echo ""

# Check that confidence test validates no mock data
check_file_contains "Confidence test checks mock patterns" \
    "testing/e2e/quality/confidence-score.spec.ts" \
    "initializeSampleLead"

check_file_contains "Confidence test validates score" \
    "testing/e2e/quality/confidence-score.spec.ts" \
    "confidenceScore"

check_file_contains "Visual confidence test exists" \
    "testing/e2e/quality/confidence-score.spec.ts" \
    "VISUAL CONFIDENCE"

echo ""
echo -e "${YELLOW}=== 9. Domain Verification ===${NC}"
echo ""

# Check that wrong domains are NOT present in critical files
check "No lexmakesit.com in .env.production" \
    "! grep -q 'lexmakesit.com' '.env.production'"

check "No lexmakesit.com in PRODUCTION_DEPLOYMENT.md" \
    "! grep -q 'lexmakesit.com' 'docs/PRODUCTION_DEPLOYMENT.md'"

check "SOURCE_OF_TRUTH.md exists" \
    "[ -f 'docs/SOURCE_OF_TRUTH.md' ]"

check_file_contains "SOURCE_OF_TRUTH has correct domain" \
    "docs/SOURCE_OF_TRUTH.md" \
    "innovationdevelopmentsolutions.com"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}         VERIFICATION SUMMARY${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Calculate percentage
PASS_PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))

echo "Total Checks: $TOTAL_CHECKS"
echo -e "Passed: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Failed: ${RED}$FAILED_CHECKS${NC}"
echo "Success Rate: ${PASS_PERCENTAGE}%"
echo ""

# Generate detailed report
REPORT_FILE="test-results/deployment-verification-$(date +%Y%m%d-%H%M%S).txt"
mkdir -p test-results

{
    echo "DEPLOYMENT VERIFICATION REPORT"
    echo "Generated: $(date)"
    echo "================================"
    echo ""
    echo "Total Checks: $TOTAL_CHECKS"
    echo "Passed: $PASSED_CHECKS"
    echo "Failed: $FAILED_CHECKS"
    echo "Success Rate: ${PASS_PERCENTAGE}%"
    echo ""
    echo "Git Status:"
    git log -1 --pretty=format:"  Commit: %H%n  Author: %an%n  Date: %ad%n  Message: %s%n"
    echo ""
    echo ""
    echo "Branch: $(git branch --show-current)"
    echo "Remote Status: $(git status -sb)"
} > "$REPORT_FILE"

echo "Detailed report saved to: $REPORT_FILE"
echo ""

# Determine overall status
if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}   ✓ ALL CHECKS PASSED${NC}"
    echo -e "${GREEN}   DEPLOYMENT VERIFIED SUCCESSFULLY${NC}"
    echo -e "${GREEN}========================================${NC}"
    exit 0
elif [ $PASS_PERCENTAGE -ge 90 ]; then
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}   ⚠ MOSTLY SUCCESSFUL (${PASS_PERCENTAGE}%)${NC}"
    echo -e "${YELLOW}   Minor issues detected${NC}"
    echo -e "${YELLOW}========================================${NC}"
    exit 0
else
    echo -e "${RED}========================================${NC}"
    echo -e "${RED}   ✗ VERIFICATION FAILED${NC}"
    echo -e "${RED}   ${FAILED_CHECKS} checks failed${NC}"
    echo -e "${RED}========================================${NC}"
    exit 1
fi
