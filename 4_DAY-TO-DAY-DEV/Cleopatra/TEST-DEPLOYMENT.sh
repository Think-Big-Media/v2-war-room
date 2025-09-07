#!/bin/bash

# TEST SCRIPT FOR WAR ROOM 4.5 BACKEND DEPLOYMENT
# Run this after deployment completes

# REPLACE THIS WITH YOUR ACTUAL STAGING URL
STAGING_URL="https://staging-war-roombackend-45-x83i.encr.app"

echo "🚀 Testing War Room 4.5 Backend Deployment"
echo "==========================================="
echo ""

# Test 1: Health Check
echo "1. Testing Health Endpoint..."
curl -s "$STAGING_URL/health" | python3 -m json.tool
echo ""

# Test 2: Mentionlytics Validation
echo "2. Testing Mentionlytics Integration..."
curl -s "$STAGING_URL/api/v1/mentionlytics/validate" | python3 -m json.tool
echo ""

# Test 3: Auth Endpoint (should return error but not 404)
echo "3. Testing Auth Endpoint..."
curl -s -X POST "$STAGING_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' | python3 -m json.tool
echo ""

# Test 4: Analytics Summary
echo "4. Testing Analytics Summary..."
curl -s "$STAGING_URL/api/v1/analytics/summary" \
  -H "Content-Type: application/json" | python3 -m json.tool
echo ""

# Test 5: Monitoring Mentions
echo "5. Testing Monitoring Mentions..."
curl -s "$STAGING_URL/api/v1/monitoring/mentions" \
  -H "Content-Type: application/json" | python3 -m json.tool
echo ""

echo "==========================================="
echo "✅ All tests complete!"
echo ""
echo "Expected Results:"
echo "- Health: {\"status\":\"ok\"}"
echo "- Mentionlytics: Real data from API"
echo "- Auth: Authentication error (not 404)"
echo "- Analytics: Mock or real data"
echo "- Monitoring: Mock or real mentions"