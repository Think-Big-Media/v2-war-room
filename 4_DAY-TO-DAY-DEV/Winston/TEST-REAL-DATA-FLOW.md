# TEST REAL DATA FLOW - Complete Verification

## Backend Endpoints to Test (staging-war-room-backend-45-x83i.encr.app)

### 1. BrandMentions Webhook Cache ✅
```bash
curl https://staging-war-room-backend-45-x83i.encr.app/api/v1/webhook/cache/mentions
```
**Expected**: Real mentions about Jack Harrison from BrandMentions

### 2. Meta/Facebook Campaigns 🔥
```bash
curl https://staging-war-room-backend-45-x83i.encr.app/api/v1/campaigns/meta
```
**Expected**: Real Facebook Ads data (if account has campaigns)

### 3. Google Ads Campaigns 
```bash
curl https://staging-war-room-backend-45-x83i.encr.app/api/v1/campaigns/google
```
**Expected**: Real Google Ads data (needs OAuth setup)

### 4. Mentionlytics Feed
```bash
curl https://staging-war-room-backend-45-x83i.encr.app/api/v1/mentionlytics/feed
```
**Expected**: Jack Harrison mentions with sentiment

### 5. Analytics Dashboard
```bash
curl https://staging-war-room-backend-45-x83i.encr.app/api/v1/analytics/dashboard
```
**Expected**: Calculated metrics from real data

### 6. Crisis Detection
```bash
curl https://staging-war-room-backend-45-x83i.encr.app/api/v1/alerting/status
```
**Expected**: Crisis score calculated from real sentiment

## Data Flow Verification

### Current Data Sources:
1. **BrandMentions** (30% of dashboard)
   - ✅ Social mentions (3,229 available)
   - ✅ Basic sentiment
   - ✅ Author names
   - ✅ Timestamps
   - ❌ No geographic data
   - ❌ No emotion analysis

2. **Meta Ads API** (20% of dashboard)
   - ✅ Campaign performance
   - ✅ Ad spend
   - ✅ Impressions/clicks
   - ✅ ROI metrics
   - **Status**: Ready with real token

3. **Google Ads API** (20% of dashboard)
   - ⚠️ Needs OAuth flow
   - Campaign metrics
   - Search performance
   - **Status**: Credentials ready, OAuth needed

4. **Calculated Metrics** (30% of dashboard)
   - Crisis risk score (from sentiment)
   - Share of voice (from mentions)
   - Trending topics (from mention text)
   - **Status**: Algorithms ready

## Frontend Dashboard Mapping

| Dashboard Element | Backend Endpoint | Data Source | Status |
|------------------|------------------|-------------|---------|
| Sentiment Score | `/mentionlytics/sentiment` | BrandMentions | ✅ REAL |
| Mention Volume | `/mentionlytics/feed` | BrandMentions | ✅ REAL |
| Crisis Risk | `/alerting/status` | Calculated | ✅ REAL |
| Meta Ads | `/campaigns/meta` | Meta API | ✅ REAL |
| Google Ads | `/campaigns/google` | Google API | ⚠️ OAuth |
| Geographic Map | N/A | Missing | ❌ MOCK |
| Emotion Analysis | N/A | Missing | ❌ MOCK |
| SWOT Analysis | Static | Manual | ❌ STATIC |

## Zapier Integration Status

**BrandMentions → Zapier → Webhook**
- Trigger: New mentions for "Jack Harrison"
- Action: POST to `/api/v1/webhook/brandmentions`
- Frequency: Real-time
- **Status**: User configuring

## Quick Test Script

Save as `test-backend.sh`:
```bash
#!/bin/bash
BASE_URL="https://staging-war-room-backend-45-x83i.encr.app"

echo "Testing War Room Backend - REAL DATA"
echo "====================================="

echo -e "\n1. BrandMentions Cache:"
curl -s "$BASE_URL/api/v1/webhook/cache/mentions" | jq '.'

echo -e "\n2. Meta Campaigns:"
curl -s "$BASE_URL/api/v1/campaigns/meta" | jq '.'

echo -e "\n3. Mentionlytics Feed:"
curl -s "$BASE_URL/api/v1/mentionlytics/feed" | jq '.'

echo -e "\n4. Analytics Dashboard:"
curl -s "$BASE_URL/api/v1/analytics/dashboard" | jq '.'

echo -e "\n5. Crisis Status:"
curl -s "$BASE_URL/api/v1/alerting/status" | jq '.'
```

## Success Criteria

✅ **Minimum Viable (NOW)**:
- BrandMentions data flowing
- Basic sentiment working
- Mention volume accurate

🎯 **Target State (TODAY)**:
- Meta Ads connected
- Crisis detection working
- 70% real data

🚀 **Full Integration (THIS WEEK)**:
- Google Ads OAuth complete
- GPT-4 emotion analysis
- 95% real data

---

**NO MORE MOCK DATA - WE HAVE REAL CREDENTIALS NOW!**