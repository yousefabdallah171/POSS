#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8080/api/v1"
PASS_COUNT=0
FAIL_COUNT=0

# Helper function for tests
test_endpoint() {
  local name=$1
  local method=$2
  local endpoint=$3
  local data=$4
  local expected_code=$5

  echo -e "\n${BLUE}Testing: $name${NC}"
  echo "Endpoint: $method $BASE_URL$endpoint"

  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
  else
    echo "Data: $data"
    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi

  # Extract status code (last line)
  status_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  echo "Status Code: $status_code"
  echo "Response: $body"

  if [ "$status_code" = "$expected_code" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASS_COUNT++))
  else
    echo -e "${RED}✗ FAIL - Expected $expected_code, got $status_code${NC}"
    ((FAIL_COUNT++))
  fi
}

echo "=========================================="
echo "    COMPREHENSIVE SYSTEM API TESTING"
echo "=========================================="

# Test 1: Check subdomain availability
test_endpoint "Subdomain Check" "GET" "/auth/check-subdomain?slug=test-restaurant" "" "200"

# Test 2: User login (single tenant - stub mode)
test_endpoint "Single Tenant Login" "POST" "/auth/login" \
  '{"email":"user@test.com","password":"password123"}' "200"

# Test 3: User login with empty fields
test_endpoint "Login - Missing Fields" "POST" "/auth/login" \
  '{"email":"","password":""}' "401"

# Test 4: User login with invalid email
test_endpoint "Login - Invalid Credentials" "POST" "/auth/login" \
  '{"email":"nonexistent@test.com","password":"wrongpass"}' "401"

# Test 5: Get roles list (requires auth - but testing endpoint exists)
test_endpoint "Get Roles Endpoint Exists" "GET" "/rbac/roles" "" "401"

# Test 6: Create user endpoint
test_endpoint "Create User Endpoint Available" "POST" "/users" \
  '{"name":"Test User","email":"newuser@test.com","phone":"1234567890","password":"password123"}' "400"

# Test 7: Update user endpoint
test_endpoint "Update User Endpoint Available" "PUT" "/users/1" \
  '{"name":"Updated Name","phone":"9876543210"}' "401"

# Test 8: Delete user endpoint
test_endpoint "Delete User Endpoint Available" "DELETE" "/users/1" "" "401"

# Test 9: Get user roles
test_endpoint "Get User Roles Endpoint Available" "GET" "/rbac/users/1/roles" "" "401"

# Test 10: Create role
test_endpoint "Create Role Endpoint Available" "POST" "/rbac/roles" \
  '{"name":"Test Role","description":"A test role"}' "400"

# Test 11: Update role
test_endpoint "Update Role Endpoint Available" "PUT" "/rbac/roles/1" \
  '{"name":"Updated Role"}' "401"

# Test 12: Delete role
test_endpoint "Delete Role Endpoint Available" "DELETE" "/rbac/roles/1" "" "401"

# Test 13: Assign role to user
test_endpoint "Assign Role to User Endpoint Available" "POST" "/rbac/users/1/roles" \
  '{"role_id":1}' "401"

# Test 14: Unassign role from user
test_endpoint "Unassign Role Endpoint Available" "DELETE" "/rbac/users/1/roles/1" "" "401"

# Summary
echo -e "\n=========================================="
echo -e "        TEST SUMMARY"
echo -e "=========================================="
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo -e "=========================================="

if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed.${NC}"
  exit 1
fi
