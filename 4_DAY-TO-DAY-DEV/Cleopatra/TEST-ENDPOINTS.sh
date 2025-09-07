#!/bin/bash

# War Room Backend Test Script
# Replace with actual staging URL if different

BASE_URL="https://staging-war-roombackend-45-x83i.encr.app"

echo "Testing War Room Backend Endpoints..."
echo "======================================"
echo ""

# 1. Health Check
echo "1. Health Check:"
curl -s "$BASE_URL/health" | python3 -m json.tool
echo ""
echo "---"

# 2. Analytics Summary
echo "2. Analytics Summary:"
curl -s "$BASE_URL/api/v1/analytics/summary" | python3 -m json.tool
echo ""
echo "---"

# 3. Mentionlytics Validate
echo "3. Mentionlytics Validation:"
curl -s "$BASE_URL/api/v1/mentionlytics/validate" | python3 -m json.tool
echo ""
echo "---"

# 4. Auth Login (will fail without valid credentials)
echo "4. Auth Login Test (expected to fail):"
curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' | python3 -m json.tool
echo ""
echo "---"

# 5. Monitoring Mentions
echo "5. Monitoring Mentions:"
curl -s "$BASE_URL/api/v1/monitoring/mentions" | python3 -m json.tool
echo ""
echo "---"

# 6. Campaigns Meta
echo "6. Meta Campaigns:"
curl -s "$BASE_URL/api/v1/campaigns/meta" | python3 -m json.tool
echo ""

echo "======================================"
echo "Test Complete!"