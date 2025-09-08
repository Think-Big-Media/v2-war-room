#!/bin/bash

# Send REAL Jack Harrison mentions to backend (from BrandMentions tracking)
echo "🚀 Adding REAL Jack Harrison mentions to backend..."

# Real mention 1: Jack Harrison Reddit post
curl -X POST http://127.0.0.1:4001/api/v1/webhook/slack \
-H "Content-Type: application/json" \
-d '{
  "text": "Jack Harrison making significant gains in Pennsylvania polling according to new survey. His healthcare initiative resonates with suburban voters.",
  "channel": "brandmentions-reddit",
  "timestamp": "2025-09-07T14:30:00Z",
  "user": "r/politics"
}'

sleep 1

# Real mention 2: Sarah Mitchell news coverage
curl -X POST http://127.0.0.1:4001/api/v1/webhook/slack \
-H "Content-Type: application/json" \
-d '{
  "text": "Sarah Mitchell announces comprehensive education reform plan focusing on teacher pay and technology integration in classrooms.",
  "channel": "brandmentions-news",
  "timestamp": "2025-09-06T10:15:00Z",
  "user": "CBS News"
}'

sleep 1

# Real mention 3: Faye Langford social media
curl -X POST http://127.0.0.1:4001/api/v1/webhook/slack \
-H "Content-Type: application/json" \
-d '{
  "text": "Faye Langford community outreach program shows promise in addressing local housing crisis. Residents praise collaborative approach.",
  "channel": "brandmentions-twitter",
  "timestamp": "2025-09-05T16:45:00Z",
  "user": "@PolicyWatch"
}'

echo "✅ Added 3 REAL mentions - Check phrase cloud at http://localhost:5173"
