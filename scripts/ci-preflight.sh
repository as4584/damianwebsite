#!/bin/bash
set -eo pipefail

# CI Pre-flight Validation Script
# Enforces the fundamental contracts before any expensive jobs run.

echo "🔍 Running CI Pre-flight Checks..."

# 1. Isolation Contract: Check for forbidden external dependencies in source
# (Example: Hardcoded production secrets or specific dev domains that should be environment variables)
echo "🛡️ Checking Isolation Contract..."
FORBIDDEN_PATTERNS=("lexmakesit.com" "localhost:3000") # 3000 is often wrong in our 3001-base CI
for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
  if grep -r "$pattern" ./app ./lib --exclude-dir=node_modules --exclude-dir=.next > /dev/null 2>&1; then
    echo "❌ ISOLATION CONTRACT VIOLATION: Forbidden pattern '$pattern' found in source code."
    echo "   Source code must use relative paths or environment variables (NEXT_PUBLIC_SITE_URL)."
    exit 1
  fi
done
echo "✅ Isolation Contract verified."

# 2. Package Integrity
echo "📦 Checking Package Integrity..."
if [ ! -f "package-lock.json" ]; then
  echo "❌ PACKAGE CONTRACT VIOLATION: package-lock.json is missing."
  exit 1
fi
echo "✅ Package Integrity verified."

# 3. Environment Contract
echo "🌍 Checking Configuration Integrity..."
REQUIRED_ENV_FILES=(".env.example" ".env.production")
for file in "${REQUIRED_ENV_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ CONFIG CONTRACT VIOLATION: Critical file '$file' is missing."
    exit 1
  fi
done
echo "✅ Configuration Integrity verified."

# 4. Critical Path verification
echo "🚀 Checking Critical Path Files..."
CRITICAL_FILES=(
  "app/api/health/route.ts"
  "scripts/wait-for-app.sh"
  "playwright.config.ts"
)
for file in "${CRITICAL_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ FILE CONTRACT VIOLATION: Critical file '$file' is missing."
    exit 1
  fi
done
echo "✅ Critical Path verified."

echo "✨ CI Pre-flight successful. Contracts honored."
