#!/bin/bash
set -eo pipefail

# Signal-based Application Readiness Script
# Replaces time-based waits with a deterministic readiness contract.

URL=${1:-"http://localhost:3001/api/health"}
TIMEOUT=${2:-120}
INTERVAL=2
START_TIME=$(date +%s)

echo "🛡️ Waiting for application signal at $URL (Timeout: ${TIMEOUT}s)..."

# Deterministic polling loop with fail-fast timeout
while true; do
  # Verify application is responding with 200 OK
  if curl -s -f "$URL" > /dev/null; then
    echo "✅ SUCCESS: Application is responding and healthy."
    exit 0
  fi

  CURRENT_TIME=$(date +%s)
  ELAPSED=$((CURRENT_TIME - START_TIME))

  if [ "$ELAPSED" -gt "$TIMEOUT" ]; then
    echo "❌ ERROR: Application failed to signal readiness at $URL within ${TIMEOUT}s."
    exit 1
  fi

  echo "⏳ Still waiting... (${ELAPSED}s elapsed)"
  sleep "$INTERVAL"
done
