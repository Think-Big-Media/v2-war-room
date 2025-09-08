#!/bin/bash

echo "🔄 Monitoring Encore deployment for REAL Meta data..."
echo "=================================================="

URL="https://staging-war-roombackend-45-x83i.encr.app/api/v1/campaigns/meta"
ATTEMPTS=0
MAX_ATTEMPTS=20

while [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
    ATTEMPTS=$((ATTEMPTS + 1))
    echo -n "Attempt $ATTEMPTS/$MAX_ATTEMPTS: "
    
    RESPONSE=$(curl -s "$URL")
    
    if echo "$RESPONSE" | grep -q "meta_camp_"; then
        echo "⏳ Still mock data - waiting for deployment..."
        sleep 15
    else
        echo "🚀 REAL META DATA DETECTED!"
        echo ""
        echo "Sample response:"
        echo "$RESPONSE" | python3 -m json.tool | head -30
        exit 0
    fi
done

echo "❌ Deployment timeout - still returning mock data"
echo "Manual intervention may be needed in Encore dashboard"
exit 1