#!/bin/bash
set -eo pipefail

# Build Contract Pre-Validation
# Ensures TypeScript compiles cleanly before attempting Next.js build.

echo "🔍 Build Contract Pre-Validation..."

# 1. TypeScript Compilation Check
echo "📋 Contract 1: TypeScript must compile without errors"
if ! npx tsc --noEmit 2>&1; then
  echo "❌ BUILD CONTRACT VIOLATION: TypeScript compilation failed."
  echo "   Run 'npx tsc --noEmit' to see detailed errors."
  exit 1
fi
echo "✅ TypeScript compiles cleanly."

# 2. Required files exist
echo "📋 Contract 2: Critical build files must exist"
REQUIRED_FILES=(
  "next.config.mjs"
  "tsconfig.json"
  "package.json"
  "app/layout.tsx"
  "app/page.tsx"
)
for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ BUILD CONTRACT VIOLATION: Required file '$file' is missing."
    exit 1
  fi
done
echo "✅ All critical files present."

# 3. No circular imports (basic check)
echo "📋 Contract 3: No obvious circular import patterns"
# This is a simple heuristic - deep analysis would require madge or similar
if grep -r "from '\.\./\.\./\.\./\.\./\.\." app/ lib/ 2>/dev/null | head -3; then
  echo "⚠️  WARNING: Deep relative imports detected. Check for circular dependencies."
fi
echo "✅ No obvious circular import issues."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Build Contract Pre-Validation PASSED"
echo "   Ready to run 'npm run build'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
