# FRONTEND-BACKEND ENDPOINT MAPPING

**Dashboard Component → Backend Endpoint → Data Source**

---

## TOP METRICS CARDS

### 1. Sentiment Score (+33%)
- **Frontend Component**: `SentimentCard`
- **Backend Endpoint**: `/api/v1/mentionlytics/sentiment`
- **Data Source**: BrandMentions webhook cache
- **Current Status**: ✅ WORKING with test data

### 2. Mention Volume (1,039)
- **Frontend Component**: `MentionVolumeCard`
- **Backend Endpoint**: `/api/v1/mentionlytics/feed` (count)
- **Data Source**: BrandMentions webhook cache
- **Current Status**: ✅ WORKING with test data

### 3. Share of Voice (51.7%)
- **Frontend Component**: `ShareOfVoiceCard`
- **Backend Endpoint**: `/api/v1/analytics/share` (MISSING)
- **Data Source**: Calculated from competitor mentions
- **Current Status**: ❌ MOCK DATA

### 4. Crisis Risk (HIGH)
- **Frontend Component**: `CrisisRiskCard`
- **Backend Endpoint**: `/api/v1/alerting/status` (EXISTS)
- **Data Source**: Algorithm analyzing sentiment trends
- **Current Status**: ⚠️ Returns mock data

---

## MAIN VISUALIZATIONS

### Geographic Heat Map
- **Frontend Component**: `USStateMap`
- **Backend Endpoint**: `/api/v1/mentionlytics/geo`
- **Data Source**: NONE (BrandMentions doesn't provide)
- **Current Status**: ❌ MOCK DATA (PA, MI, WI)

### Sentiment Donut Chart
- **Frontend Component**: `SentimentDonut`
- **Backend Endpoint**: `/api/v1/mentionlytics/sentiment`
- **Data Source**: BrandMentions webhook cache
- **Current Status**: ✅ WORKING with test data

### Emotion Analysis
- **Frontend Component**: `EmotionBreakdown`
- **Backend Endpoint**: `/api/v1/intelligence/emotions` (MISSING)
- **Data Source**: Would need GPT-4 analysis
- **Current Status**: ❌ MOCK DATA

---

## LIVE INTELLIGENCE FEED

### Mentions Feed
- **Frontend Component**: `LiveFeed`
- **Backend Endpoint**: `/api/v1/mentionlytics/feed`
- **Data Source**: BrandMentions webhook cache
- **Current Status**: ✅ WORKING with test data
- **Example Response**:
```json
{
  "mentions": [
    {
      "id": "jack-1",
      "text": "Jack Harrison wins endorsement...",
      "author": "PA Education News",
      "platform": "Twitter",
      "sentiment": "positive",
      "timestamp": "2025-09-08T05:00:00Z"
    }
  ]
}
```

---

## COMPETITOR ANALYSIS

### Competitor Metrics
- **Frontend Component**: `CompetitorAnalysis`
- **Backend Endpoint**: `/api/v1/analytics/competitors` (MISSING)
- **Data Source**: Would need to track each competitor in BrandMentions
- **Current Status**: ❌ MOCK DATA
- **Required Setup**: Add keywords for:
  - Sarah Mitchell (main opponent)
  - Jack Cattauzzi
  - Mike Sherrill
  - Josh Gottheimer

---

## CAMPAIGN PERFORMANCE

### Meta Ads Metrics
- **Frontend Component**: `MetaAdsCard`
- **Backend Endpoint**: `/api/v1/campaigns/meta` (EXISTS)
- **Data Source**: Meta Marketing API (NOT CONNECTED)
- **Current Status**: ❌ MOCK DATA
- **Required**: Meta App ID, Access Token

### Google Ads Metrics
- **Frontend Component**: `GoogleAdsCard`
- **Backend Endpoint**: `/api/v1/campaigns/google` (EXISTS)
- **Data Source**: Google Ads API (NOT CONNECTED)
- **Current Status**: ❌ MOCK DATA
- **Required**: Google Ads Customer ID, API Token

---

## SWOT ANALYSIS

### SWOT Radar Chart
- **Frontend Component**: `SwotRadar`
- **Backend Endpoint**: `/api/v1/intelligence/swot` (MISSING)
- **Data Source**: Manual configuration or AI-generated
- **Current Status**: ❌ STATIC DATA
- **Possible Solution**: GPT-4 analysis of mention patterns

---

## QUICK ACTIONS

### Campaign Actions
- **Frontend Component**: `QuickActions`
- **Backend Endpoints**: Various `/api/v1/campaigns/*`
- **Data Source**: Frontend-triggered actions
- **Current Status**: ⚠️ Buttons exist, actions incomplete

---

## 🔥 WHAT ACTUALLY WORKS NOW

With BrandMentions webhook connected:
1. ✅ Live mention feed (real text)
2. ✅ Sentiment percentages (pos/neg/neutral)
3. ✅ Mention volume counts
4. ✅ Individual mention display

Everything else is MOCK or MISSING.

---

## 🎯 PRIORITY FIX ORDER

### Must Have (Client Demo):
1. **Mentions Feed** - ✅ DONE
2. **Sentiment** - ✅ DONE
3. **Volume** - ✅ DONE

### Should Have (Looks Real):
4. **Crisis Detection** - Calculate from sentiment
5. **Share of Voice** - Calculate from mentions
6. **Geographic** - Fake Pennsylvania focus

### Nice to Have (Future):
7. **Meta Ads** - Real API integration
8. **Google Ads** - Real API integration
9. **Emotion Analysis** - GPT-4 integration
10. **SWOT** - AI generation

---

## 🚀 NEXT 3 HOURS PLAN

1. **Hour 1**: Get Zapier → BrandMentions working
2. **Hour 2**: Create crisis detection algorithm
3. **Hour 3**: Deploy winston-warroom frontend

**Result**: Client sees real mentions with enhanced calculations