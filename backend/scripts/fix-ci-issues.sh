#!/bin/bash
set -e

# Automated CI Issue Fixer
# Detects and fixes common CI failures

echo "🔧 Automated CI Issue Detection & Fix"
echo "====================================="
echo ""

ISSUES_FIXED=0

# 1. Check for missing executables
echo "📋 Checking script permissions..."
for script in backend/scripts/*.sh; do
  if [ -f "$script" ] && [ ! -x "$script" ]; then
    echo "🔧 Fixing: $script (not executable)"
    chmod +x "$script"
    ISSUES_FIXED=$((ISSUES_FIXED + 1))
  fi
done
echo ""

# 2. Check for missing node_modules
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "🔧 Fixing: Installing dependencies..."
  npm ci
  ISSUES_FIXED=$((ISSUES_FIXED + 1))
elif [ "node_modules" -ot "package-lock.json" ]; then
  echo "🔧 Fixing: Dependencies out of date, reinstalling..."
  npm ci
  ISSUES_FIXED=$((ISSUES_FIXED + 1))
fi
echo ""

# 3. Check for stale build artifacts
echo "🏗️  Checking build artifacts..."
if [ -d "frontend/.next" ]; then
  BUILD_AGE=$(find frontend/.next -name "*.js" -mmin +60 | wc -l)
  if [ "$BUILD_AGE" -gt 0 ]; then
    echo "🔧 Fixing: Stale build detected, rebuilding..."
    rm -rf frontend/.next
    npm run build > /dev/null 2>&1
    ISSUES_FIXED=$((ISSUES_FIXED + 1))
  fi
fi
echo ""

# 4. Check for lingering processes on test ports
echo "🔌 Checking for port conflicts..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "🔧 Fixing: Killing process on port 3001..."
  lsof -ti:3001 | xargs kill -9 2>/dev/null || true
  ISSUES_FIXED=$((ISSUES_FIXED + 1))
fi
echo ""

# 5. Check Playwright installation
echo "🌐 Checking Playwright browsers..."
if ! npx playwright install --dry-run 2>&1 | grep -q "is already installed"; then
  echo "🔧 Fixing: Installing Playwright browsers..."
  npx playwright install chromium --with-deps
  ISSUES_FIXED=$((ISSUES_FIXED + 1))
fi
echo ""

# 6. Check TypeScript compilation
echo "📝 Checking TypeScript..."
if ! npx tsc --noEmit > /dev/null 2>&1; then
  echo "❌ TypeScript errors found. Run 'npx tsc --noEmit' to see details"
else
  echo "✅ TypeScript OK"
fi
echo ""

# Summary
echo "====================================="
if [ $ISSUES_FIXED -gt 0 ]; then
  echo "✅ Fixed $ISSUES_FIXED issues"
  echo "   Run './backend/scripts/pre-push-validation.sh' to validate"
else
  echo "✅ No issues detected"
fi
echo ""
