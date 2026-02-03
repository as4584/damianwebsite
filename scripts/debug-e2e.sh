#!/bin/bash
set -e

# E2E Debugging Script
# Helps diagnose and fix E2E test failures

echo "🔍 E2E Test Debugging"
echo "=================================="
echo ""

# 1. Check if Playwright is installed
echo "📦 Checking Playwright installation..."
if npx playwright --version > /dev/null 2>&1; then
  echo "✅ Playwright installed: $(npx playwright --version)"
else
  echo "❌ Playwright not found. Installing..."
  npm install -D @playwright/test
  npx playwright install
fi
echo ""

# 2. Check if browsers are installed
echo "🌐 Checking browser installation..."
if npx playwright install --dry-run 2>&1 | grep -q "is already installed"; then
  echo "✅ Browsers already installed"
else
  echo "📥 Installing browsers..."
  npx playwright install chromium
fi
echo ""

# 3. Check test files exist
echo "📂 Checking test files..."
TEST_COUNT=$(find e2e -name "*.spec.ts" 2>/dev/null | wc -l)
if [ "$TEST_COUNT" -gt 0 ]; then
  echo "✅ Found $TEST_COUNT test files"
  find e2e -name "*.spec.ts" | head -5
else
  echo "❌ No test files found in e2e/"
  exit 1
fi
echo ""

# 4. Validate playwright.config.ts
echo "⚙️  Checking Playwright configuration..."
if [ -f "playwright.config.ts" ]; then
  echo "✅ playwright.config.ts exists"
  if grep -q "webServer" playwright.config.ts; then
    echo "✅ webServer configuration found"
  else
    echo "⚠️  No webServer configuration"
  fi
else
  echo "❌ playwright.config.ts not found"
  exit 1
fi
echo ""

# 5. Run a single test to diagnose issues
echo "🧪 Running diagnostic test (confidence-score)..."
echo "   This will show detailed output..."
echo ""

npx playwright test e2e/confidence-score.spec.ts --reporter=list || {
  echo ""
  echo "❌ Test failed. Common issues:"
  echo "   1. Server not starting - Check if port 3001 is available"
  echo "   2. Database connection - Check Supabase credentials"
  echo "   3. Build errors - Run 'npm run build' first"
  echo "   4. Missing environment variables - Check .env.local"
  echo ""
  echo "🔧 Try these fixes:"
  echo "   - Kill any existing servers: lsof -ti:3001 | xargs kill -9"
  echo "   - Rebuild: npm run build"
  echo "   - Check logs: cat playwright-report/index.html"
  exit 1
}

echo ""
echo "✅ Diagnostic test passed!"
echo "   You can now run the full suite: npm run test:e2e"
