#!/bin/bash

# Test War Room Backend Endpoints for REAL DATA
echo "Testing War Room Backend - Checking for REAL DATA"
echo "=================================================="

# The actual deployment URL from your Encore app
BASE_URL="https://staging-war-roombackend-45-x83i.encr.app"

echo -e "\n1. Testing Meta Campaigns (should show REAL Facebook Ads):"
echo "-----------------------------------------------------------"
curl -s "$BASE_URL/api/v1/campaigns/meta" 2>/dev/null | python3 -m json.tool 2>/dev/null || echo "Endpoint not accessible"

echo -e "\n2. Testing Google Ads Campaigns:"
echo "--------------------------------"
curl -s "$BASE_URL/api/v1/campaigns/google" 2>/dev/null | python3 -m json.tool 2>/dev/null || echo "Endpoint not accessible"

echo -e "\n3. Testing Mentionlytics Feed:"
echo "------------------------------"
curl -s "$BASE_URL/api/v1/mentionlytics/feed" 2>/dev/null | python3 -m json.tool 2>/dev/null || echo "Endpoint not accessible"

echo -e "\n4. Testing Webhook Cache:"
echo "-------------------------"
curl -s "$BASE_URL/api/v1/webhook/cache/mentions" 2>/dev/null | python3 -m json.tool 2>/dev/null || echo "Endpoint not accessible"

echo -e "\n5. Testing Health Check:"
echo "------------------------"
curl -s "$BASE_URL/health" 2>/dev/null || echo "Health check failed"