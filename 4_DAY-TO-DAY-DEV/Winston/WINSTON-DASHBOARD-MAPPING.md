# WINSTON DASHBOARD MAPPING
## Every Dashboard Widget → Backend Service Endpoint

**Date**: September 7, 2025  
**Critical**: Every dashboard element MUST connect to a real backend service  
**Requirement**: Both MOCK and LIVE data must be available for each widget  

---

## 🗺️ POLITICAL INTELLIGENCE MAP

### Widget: Geographic Heat Map
**Backend Service**: Mentionlytics  
**Endpoint**: `/api/v1/mentionlytics/geo`  
**Data Flow**:
```json
// Request
GET /api/v1/mentionlytics/geo

// Response (LIVE from Mentionlytics)
{
  "locations": [
    {
      "state": "Pennsylvania",
      "lat": 41.2033,
      "lng": -77.1945,
      "mentions": 342,
      "sentiment": 0.65,
      "trending_topics": ["healthcare", "economy"]
    },
    {
      "state": "Michigan",
      "lat": 44.3148,
      "lng": -85.6024,
      "mentions": 289,
      "sentiment": 0.58,
      "trending_topics": ["jobs", "infrastructure"]
    }
  ],
  "timestamp": "2025-09-07T10:00:00Z"
}
```

---

## 📊 SWOT RADAR

### Widget: Strengths/Weaknesses/Opportunities/Threats Analysis
**Backend Service**: Mentionlytics + Analytics  
**Primary Endpoint**: `/api/v1/mentionlytics/sentiment`  
**Secondary Endpoint**: `/api/v1/analytics/swot`  
**Data Flow**:
```json
// Combined data from multiple sources
{
  "strengths": {
    "score": 78,
    "factors": ["Strong social presence", "Positive sentiment trend"]
  },
  "weaknesses": {
    "score": 45,
    "factors": ["Low youth engagement", "Limited TikTok presence"]
  },
  "opportunities": {
    "score": 82,
    "factors": ["Viral potential", "Untapped demographics"]
  },
  "threats": {
    "score": 61,
    "factors": ["Competitor activity", "Negative viral content"]
  }
}
```

---

## 📱 META CAMPAIGNS

### Widget: Facebook/Instagram Campaign Dashboard
**Backend Service**: Campaigns  
**Endpoint**: `/api/v1/campaigns/meta`  
**Data Flow**:
```json
{
  "campaigns": [
    {
      "id": "meta_001",
      "name": "Youth Voter Outreach",
      "platform": "Instagram",
      "status": "active",
      "budget": 50000,
      "spent": 23456,
      "impressions": 1234567,
      "clicks": 45678,
      "conversions": 3456,
      "ctr": 3.7,
      "cpc": 0.51
    }
  ],
  "total_spend": 23456,
  "total_reach": 1234567
}
```

---

## 🔍 GOOGLE CAMPAIGNS

### Widget: Google Ads Performance
**Backend Service**: Campaigns  
**Endpoint**: `/api/v1/campaigns/google`  
**Data Flow**:
```json
{
  "campaigns": [
    {
      "id": "google_001",
      "name": "Search - Policy Keywords",
      "type": "search",
      "status": "active",
      "keywords": ["healthcare policy", "economic plan"],
      "impressions": 987654,
      "clicks": 34567,
      "cost": 18976,
      "conversions": 2345,
      "quality_score": 8.5
    }
  ]
}
```

---

## 💭 SENTIMENT ANALYSIS

### Widget: Real-time Sentiment Tracker
**Backend Service**: Analytics  
**Primary Endpoint**: `/api/v1/analytics/sentiment`  
**Mentionlytics Endpoint**: `/api/v1/mentionlytics/sentiment`  
**Data Flow**:
```json
{
  "current_sentiment": 0.65,
  "trend": "improving",
  "positive": 45,
  "negative": 25,
  "neutral": 30,
  "volume": 12345,
  "change_24h": "+5.2%",
  "platforms": {
    "twitter": 0.68,
    "facebook": 0.62,
    "tiktok": 0.71,
    "instagram": 0.64
  }
}
```

---

## 🚨 CRISIS ALERTS

### Widget: Crisis Detection Panel
**Backend Service**: Alerting  
**Endpoint**: `/api/v1/alerting/crisis`  
**Data Flow**:
```json
{
  "alerts": [
    {
      "id": "crisis_001",
      "type": "sentiment_drop",
      "severity": "high",
      "title": "Significant Sentiment Drop Detected",
      "description": "15% drop in past 4 hours",
      "affected_platforms": ["Twitter", "TikTok"],
      "recommended_actions": [
        "Review recent statements",
        "Prepare response",
        "Monitor closely"
      ],
      "timestamp": "2025-09-07T09:45:00Z"
    }
  ],
  "risk_level": "medium",
  "total_alerts": 3
}
```

---

## 📈 TRENDING TOPICS

### Widget: Real-time Trend Monitor
**Backend Service**: Monitoring  
**Endpoint**: `/api/v1/monitoring/trending`  
**Data Flow**:
```json
{
  "trending": [
    {
      "topic": "#HealthcareForAll",
      "mentions": 45678,
      "sentiment": 0.72,
      "growth_rate": "+234%",
      "platforms": ["Twitter", "TikTok"],
      "influencers": ["@PolicyExpert", "@HealthAdvocate"]
    }
  ]
}
```

---

## 👥 INFLUENCER METRICS

### Widget: Influencer Impact Dashboard
**Backend Service**: Intelligence  
**Endpoint**: `/api/v1/intelligence/influencers`  
**Data Flow**:
```json
{
  "influencers": [
    {
      "handle": "@PolicyExpert",
      "platform": "Twitter",
      "followers": 234567,
      "engagement_rate": 4.5,
      "sentiment_impact": 0.78,
      "recent_mentions": 123,
      "reach": 1234567
    }
  ]
}
```

---

## 💬 AI CHAT INTERFACE

### Widget: Intelligence Chat
**Backend Service**: Intelligence  
**Endpoint**: `/api/v1/intelligence/chat`  
**Data Flow**:
```json
// Request
{
  "message": "What's the sentiment trend for healthcare topics?",
  "context": "dashboard",
  "sessionId": "session_123"
}

// Response
{
  "response": "Healthcare sentiment has improved 12% over the past week...",
  "data_sources": ["Mentionlytics", "Twitter", "Facebook"],
  "confidence": 0.89,
  "suggestions": [
    "View detailed healthcare sentiment",
    "Analyze competitor positions",
    "Review influencer opinions"
  ]
}
```

---

## 📁 DOCUMENT UPLOAD

### Widget: Document Analysis Panel
**Backend Service**: Intelligence  
**Endpoint**: `/api/v1/intelligence/documents/upload`  
**Data Flow**:
```json
// Upload Request
{
  "filename": "campaign_strategy.pdf",
  "content": "base64_encoded_content",
  "type": "strategy_document"
}

// Analysis Response
{
  "documentId": "doc_123",
  "status": "analyzed",
  "insights": {
    "key_themes": ["Youth engagement", "Digital strategy"],
    "sentiment": 0.75,
    "recommendations": ["Increase TikTok presence", "Target Gen Z messaging"]
  }
}
```

---

## ⚙️ SETTINGS MANAGEMENT

### Widget: User Settings Panel
**Backend Service**: Auth  
**Endpoint**: `/api/v1/auth/settings`  
**Data Flow**:
```json
{
  "user": {
    "id": "user_123",
    "email": "admin@warroom.ai",
    "role": "admin",
    "preferences": {
      "notifications": true,
      "alert_threshold": "medium",
      "default_view": "dashboard",
      "data_mode": "LIVE"
    }
  }
}
```

---

## 🔄 MOCK/LIVE TOGGLE

### Critical Implementation:
**Every endpoint above MUST support both modes:**

1. **MOCK Mode** (when secrets missing or toggle set to MOCK):
   - Returns realistic sample data
   - Consistent data structure
   - No external API calls
   - Instant responses

2. **LIVE Mode** (when secrets configured and toggle set to LIVE):
   - Real Mentionlytics data
   - Real Meta/Google Ads data
   - Real-time updates
   - Actual API responses

### Toggle Implementation:
```typescript
// Frontend sends header
headers: {
  'X-Data-Mode': dataMode // 'MOCK' or 'LIVE'
}

// Backend checks mode
const mode = req.headers['x-data-mode'] || 'MOCK';
if (mode === 'LIVE' && hasValidSecrets()) {
  return getLiveData();
} else {
  return getMockData();
}
```

---

## ✅ VALIDATION CHECKLIST

For EACH widget listed above:
- [ ] Endpoint exists and returns JSON
- [ ] MOCK mode works without secrets
- [ ] LIVE mode works with secrets
- [ ] Data structure matches widget needs
- [ ] Response time < 2 seconds
- [ ] Error handling returns graceful fallback

---

**CRITICAL**: If any widget doesn't have both MOCK and LIVE data, Carlos cannot properly test the platform!