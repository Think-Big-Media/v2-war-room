#!/bin/bash

# TEMPORARY: Daily BrandMentions Update Script
# This will be removed when Mentionlytics integration is ready

echo "📅 DAILY BRANDMENTIONS UPDATE"
echo "=============================="
echo "Time: $(date)"
echo ""

# Check if backend is running
echo "1️⃣ Checking backend status..."
if curl -s http://127.0.0.1:4001/api/v1/webhook/slack > /dev/null; then
    echo "✅ Backend is running"
else
    echo "❌ Backend not running! Starting it..."
    cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/3_Backend_Codebase/4.5
    encore run --port=4001 &
    sleep 5
fi

echo ""
echo "2️⃣ Current data status:"
if [ -f /tmp/brandmentions_data.json ]; then
    COUNT=$(cat /tmp/brandmentions_data.json | jq '.mentions | length' 2>/dev/null || echo "0")
    echo "📊 Current mentions in backend: $COUNT"
else
    echo "📊 No existing data found"
fi

echo ""
echo "3️⃣ Options:"
echo "   A) Open webhook processor to fetch from webhook.site"
echo "   B) Add test mentions (Jack Harrison, Sarah Mitchell, Faye Langford)"
echo "   C) Skip update"
echo ""
read -p "Choose option (A/B/C): " choice

case $choice in
    A|a)
        echo "Opening webhook processor..."
        open /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/4_DAY-TO-DAY-DEV/Darwin/webhook-data-processor.html
        echo "✅ Webhook processor opened in browser"
        echo "👉 Click 'Fetch Latest Webhook Data' → 'Process' → 'Send to Backend'"
        ;;
    B|b)
        echo "Adding test mentions..."
        # Add realistic Jack Harrison mention
        curl -X POST http://127.0.0.1:4001/api/v1/webhook/slack \
        -H "Content-Type: application/json" \
        -d "{
          \"text\": \"Jack Harrison's healthcare reform proposal gains traction in swing states. Recent polling shows 62% approval among likely voters.\",
          \"channel\": \"brandmentions-news\",
          \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
          \"user\": \"Political Daily\"
        }"
        
        sleep 1
        
        # Add Sarah Mitchell mention
        curl -X POST http://127.0.0.1:4001/api/v1/webhook/slack \
        -H "Content-Type: application/json" \
        -d "{
          \"text\": \"Sarah Mitchell announces $50M education technology grant program. Teachers unions express strong support for the initiative.\",
          \"channel\": \"brandmentions-twitter\",
          \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
          \"user\": \"@EdReformNow\"
        }"
        
        sleep 1
        
        # Add Faye Langford mention
        curl -X POST http://127.0.0.1:4001/api/v1/webhook/slack \
        -H "Content-Type: application/json" \
        -d "{
          \"text\": \"Faye Langford's community-first approach to housing crisis wins bipartisan praise. Local leaders call it a model for other cities.\",
          \"channel\": \"brandmentions-reddit\",
          \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
          \"user\": \"r/politics\"
        }"
        
        echo ""
        echo "✅ Added 3 test mentions"
        ;;
    C|c)
        echo "Skipping update"
        ;;
    *)
        echo "Invalid option"
        ;;
esac

echo ""
echo "4️⃣ Verification:"
echo "   Check phrase cloud at: http://localhost:5173"
echo "   Should show keywords from Jack Harrison, Sarah Mitchell, Faye Langford mentions"
echo ""
echo "📝 Remember: This is TEMPORARY until Mentionlytics is ready!"
echo "=============================================="
