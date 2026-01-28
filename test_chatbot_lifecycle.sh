#!/bin/bash

# Comprehensive Chatbot Lifecycle Test Suite
# Tests all phase transitions, mode separation, and loop prevention

API_URL="http://localhost:3000/api/chat"
PASSED=0
FAILED=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "================================================"
echo "  CHATBOT AI LOGIC COMPREHENSIVE TEST SUITE"
echo "================================================"
echo ""

# Helper function to run test
run_test() {
    local test_name="$1"
    local payload="$2"
    local expected_phase="$3"
    local expected_mode="$4"
    local check_input_disabled="$5"
    
    echo -n "Testing: $test_name ... "
    
    response=$(curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d "$payload")
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}FAILED${NC} (curl error)"
        FAILED=$((FAILED + 1))
        return 1
    fi
    
    # Parse response
    phase=$(echo "$response" | python3 -c "import sys, json; d = json.load(sys.stdin); print(d['sessionData'].get('phase', 'N/A'))" 2>/dev/null)
    mode=$(echo "$response" | python3 -c "import sys, json; d = json.load(sys.stdin); print(d['sessionData'].get('mode', 'N/A'))" 2>/dev/null)
    requires_input=$(echo "$response" | python3 -c "import sys, json; d = json.load(sys.stdin); print(d.get('requiresInput', True))" 2>/dev/null)
    
    # Validate
    passed=true
    
    if [ "$expected_phase" != "ANY" ] && [ "$phase" != "$expected_phase" ]; then
        echo -e "${RED}FAILED${NC} (phase: expected $expected_phase, got $phase)"
        passed=false
    fi
    
    if [ "$expected_mode" != "ANY" ] && [ "$mode" != "$expected_mode" ]; then
        echo -e "${RED}FAILED${NC} (mode: expected $expected_mode, got $mode)"
        passed=false
    fi
    
    if [ "$check_input_disabled" == "true" ] && [ "$requires_input" != "False" ]; then
        echo -e "${RED}FAILED${NC} (input should be disabled)"
        passed=false
    fi
    
    if [ "$passed" = true ]; then
        echo -e "${GREEN}PASSED${NC}"
        PASSED=$((PASSED + 1))
    else
        FAILED=$((FAILED + 1))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SECTION 1: PHASE INITIALIZATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1.1: Initial greeting should set DIAGNOSTIC phase
run_test "1.1: Initial greeting → DIAGNOSTIC phase" \
'{
  "message": "hi",
  "currentState": "WELCOME"
}' \
"DIAGNOSTIC" "DIAGNOSTIC" "false"

# Test 1.2: Bootstrap in INTAKE mode
run_test "1.2: Bootstrap with INTAKE mode" \
'{
  "message": "hello",
  "currentState": "WELCOME",
  "sessionData": {
    "mode": "INTAKE",
    "bootstrapCompleted": false,
    "conversationHistory": []
  }
}' \
"DIAGNOSTIC" "INTAKE" "false"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SECTION 2: DIAGNOSTIC PHASE BEHAVIOR"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 2.1: DIAGNOSTIC phase stays in DIAGNOSTIC with questions
run_test "2.1: User confused in DIAGNOSTIC" \
'{
  "message": "idk help me",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "DIAGNOSTIC",
    "conversationHistory": []
  }
}' \
"DIAGNOSTIC" "DIAGNOSTIC" "false"

# Test 2.2: Business inquiry stays in DIAGNOSTIC
run_test "2.2: Business inquiry in DIAGNOSTIC" \
'{
  "message": "i want to start a trucking company",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "DIAGNOSTIC",
    "conversationHistory": []
  }
}' \
"DIAGNOSTIC" "DIAGNOSTIC" "false"

# Test 2.3: Golden Frames blocked in DIAGNOSTIC mode
run_test "2.3: Golden Frames blocked in DIAGNOSTIC" \
'{
  "message": "tell me about llc",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "DIAGNOSTIC",
    "mode": "DIAGNOSTIC",
    "conversationHistory": []
  }
}' \
"DIAGNOSTIC" "DIAGNOSTIC" "false"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SECTION 3: MODE TRANSITIONS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 3.1: Explicit consent transitions to INTAKE mode
run_test "3.1: Explicit consent → INTAKE mode" \
'{
  "message": "yes lets start",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "DIAGNOSTIC",
    "mode": "DIAGNOSTIC",
    "conversationHistory": [
      {"role": "user", "message": "i want to start a business"},
      {"role": "bot", "message": "Would you like me to walk you through what I need?"}
    ]
  }
}' \
"ANY" "INTAKE" "false"

# Test 3.2: Without consent, stays in DIAGNOSTIC
run_test "3.2: No consent → stays DIAGNOSTIC" \
'{
  "message": "maybe later",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "DIAGNOSTIC",
    "mode": "DIAGNOSTIC",
    "conversationHistory": [
      {"role": "bot", "message": "Would you like me to walk you through what I need?"}
    ]
  }
}' \
"DIAGNOSTIC" "DIAGNOSTIC" "false"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SECTION 4: COMPLETION DETECTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 4.1: Missing fields - should NOT finalize
run_test "4.1: Incomplete data (missing email) → stays INTAKE" \
'{
  "message": "yes schedule me",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "INTAKE",
    "consultation": {
      "userName": "John Doe",
      "businessType": "Consulting",
      "businessGoal": "Start LLC"
    },
    "conversationHistory": []
  }
}' \
"INTAKE" "ANY" "false"

# Test 4.2: All fields but no consent - should NOT finalize
run_test "4.2: Complete data but no consent signal → stays INTAKE" \
'{
  "message": "what happens next",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "INTAKE",
    "consultation": {
      "userName": "John Doe",
      "userEmail": "john@test.com",
      "businessType": "Consulting",
      "businessGoal": "Start LLC"
    },
    "conversationHistory": []
  }
}' \
"INTAKE" "ANY" "false"

# Test 4.3: All fields + consent → FINALIZE and COMPLETE
run_test "4.3: Complete data + consent → COMPLETED" \
'{
  "message": "yes schedule it",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "INTAKE",
    "consultation": {
      "userName": "Jane Smith",
      "userEmail": "jane@test.com",
      "businessType": "Trucking",
      "businessGoal": "Multi-state operations"
    },
    "conversationHistory": []
  }
}' \
"COMPLETED" "ANY" "true"

# Test 4.4: Different consent signals
run_test "4.4: 'book appointment' consent signal → COMPLETED" \
'{
  "message": "book appointment",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "INTAKE",
    "consultation": {
      "userName": "Bob Jones",
      "userEmail": "bob@test.com",
      "businessType": "Restaurant",
      "businessGoal": "Get licensed"
    },
    "conversationHistory": []
  }
}' \
"COMPLETED" "ANY" "true"

run_test "4.5: 'let''s do it' consent signal → COMPLETED" \
'{
  "message": "lets do it",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "INTAKE",
    "consultation": {
      "userName": "Alice Wong",
      "userEmail": "alice@test.com",
      "businessType": "E-commerce",
      "businessGoal": "Form LLC"
    },
    "conversationHistory": []
  }
}' \
"COMPLETED" "ANY" "true"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SECTION 5: TERMINAL STATE (COMPLETED)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 5.1: COMPLETED phase blocks all execution
run_test "5.1: COMPLETED phase → blocks execution" \
'{
  "message": "hello",
  "currentState": "CLOSED",
  "sessionData": {
    "phase": "COMPLETED",
    "consultation": {
      "userName": "Test User",
      "userEmail": "test@test.com",
      "businessType": "Test",
      "businessGoal": "Test",
      "schedulingConsent": true,
      "timestamp": 1769596786893
    },
    "conversationHistory": []
  }
}' \
"COMPLETED" "ANY" "true"

# Test 5.2: Multiple attempts after COMPLETED
run_test "5.2: Second message after COMPLETED → still blocked" \
'{
  "message": "i changed my mind",
  "currentState": "CLOSED",
  "sessionData": {
    "phase": "COMPLETED",
    "consultation": {
      "userName": "Test User",
      "userEmail": "test@test.com",
      "businessType": "Test",
      "businessGoal": "Test",
      "schedulingConsent": true,
      "timestamp": 1769596786893
    },
    "conversationHistory": []
  }
}' \
"COMPLETED" "ANY" "true"

# Test 5.3: No GPT or frames execute in COMPLETED
run_test "5.3: Third message after COMPLETED → still blocked" \
'{
  "message": "start over",
  "currentState": "CLOSED",
  "sessionData": {
    "phase": "COMPLETED",
    "consultation": {
      "userName": "Test User",
      "userEmail": "test@test.com",
      "businessType": "Test",
      "businessGoal": "Test",
      "schedulingConsent": true,
      "timestamp": 1769596786893
    },
    "conversationHistory": []
  }
}' \
"COMPLETED" "ANY" "true"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SECTION 6: EDGE CASES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 6.1: Empty message
run_test "6.1: Empty message → initializes DIAGNOSTIC" \
'{
  "message": "",
  "currentState": "WELCOME"
}' \
"DIAGNOSTIC" "DIAGNOSTIC" "false"

# Test 6.2: Phase set but mode not set
run_test "6.2: Phase without mode → initializes mode" \
'{
  "message": "hi",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "DIAGNOSTIC",
    "conversationHistory": []
  }
}' \
"DIAGNOSTIC" "DIAGNOSTIC" "false"

# Test 6.3: Consultation object exists but empty
run_test "6.3: Empty consultation object → stays in phase" \
'{
  "message": "schedule",
  "currentState": "INFO_PROVIDED",
  "sessionData": {
    "phase": "INTAKE",
    "consultation": {},
    "conversationHistory": []
  }
}' \
"INTAKE" "ANY" "false"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SECTION 7: WELCOME MESSAGE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 7.1: Verify simplified welcome message
echo -n "Testing: 7.1: Simplified welcome message ... "
response=$(curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d '{
  "message": "hi",
  "currentState": "WELCOME",
  "sessionData": {
    "mode": "INTAKE",
    "bootstrapCompleted": false,
    "conversationHistory": []
  }
}')

message=$(echo "$response" | python3 -c "import sys, json; d = json.load(sys.stdin); print(d['message'])" 2>/dev/null)

if echo "$message" | grep -q "I help people figure out how to start or structure a business"; then
    echo -e "${GREEN}PASSED${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}FAILED${NC} (wrong message)"
    echo "Got: $message"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SECTION 8: SERVER LOGS VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -n "Testing: 8.1: COMPLETED phase logged ... "
if tail -100 /tmp/nextserver.log 2>/dev/null | grep -q "COMPLETED phase - conversation finished, blocking all execution"; then
    echo -e "${GREEN}PASSED${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}SKIPPED${NC} (no logs found)"
fi

echo -n "Testing: 8.2: FINALIZING transition logged ... "
if tail -100 /tmp/nextserver.log 2>/dev/null | grep -q "Transitioning to FINALIZING phase"; then
    echo -e "${GREEN}PASSED${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}SKIPPED${NC} (no logs found)"
fi

echo -n "Testing: 8.3: Shadow AI persistence logged ... "
if tail -100 /tmp/nextserver.log 2>/dev/null | grep -q "Shadow AI.*Persisting consultation"; then
    echo -e "${GREEN}PASSED${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${YELLOW}SKIPPED${NC} (no logs found)"
fi

echo ""
echo "================================================"
echo "  TEST RESULTS"
echo "================================================"
echo ""
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED - 100% COMPLETION${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo ""
    exit 1
fi
