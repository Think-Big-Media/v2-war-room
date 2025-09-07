# WINSTON DEPLOYMENT GUIDE
## War Room 4.4 Backend - Complete Deployment with Graceful Secret Handling

**Date**: September 7, 2025  
**Codename**: WINSTON  
**Version**: 4.4  
**Status**: DEPLOYING  

---

## 🎯 MISSION OBJECTIVE

Deploy a fully functional backend that:
1. Returns JSON APIs (not HTML pages)
2. Handles missing secrets gracefully (falls back to mock data)
3. Supports Carlos's 5 core requirements
4. Connects all dashboard widgets to real data sources
5. Maintains MOCK/LIVE toggle functionality

---

## 🏗️ ARCHITECTURE OVERVIEW

### 8 Core Services Required:
1. **auth** - User authentication, JWT tokens, settings
2. **health** - System monitoring, service status
3. **mentionlytics** - Social monitoring, sentiment, geographic data
4. **campaigns** - Meta/Google Ads integration
5. **intelligence** - Chat, document upload, AI analysis
6. **alerting** - Crisis detection, notifications
7. **analytics** - Data processing, insights
8. **integrations** - External API connections

---

## 📋 DEPLOYMENT SEQUENCE

### Step 1: Prepare Local Backend
```bash
# Navigate to 4.4 backend
cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/3_Backend_Codebase/4.4/war-room-4-4-backend

# Verify all services have graceful secret handling
grep -r "try.*await.*secret" .
```

### Step 2: Deploy to Encore
```bash
# Login to Encore (if needed)
encore auth login

# Deploy as Winston
encore app create winston-4-4-backend
encore deploy --env=staging
```

### Step 3: Verify JSON Endpoints
```bash
# Test health endpoint returns JSON
curl https://staging-winston-4-4-backend-[ID].encr.app/health

# Expected response:
# {"status":"healthy","services":[...],"timestamp":"..."}

# NOT THIS (HTML):
# <html><body>...</body></html>
```

---

## 🔐 GRACEFUL SECRET HANDLING

### Critical Pattern - MUST USE IN ALL SERVICES:
```typescript
// mentionlytics/api.ts example
import { secret } from "encore.dev/config";

const mentionlyticsApiToken = secret("MENTIONLYTICS_API_TOKEN");

async function getMentionlyticsToken(): Promise<string | null> {
  try {
    const token = await mentionlyticsApiToken();
    return token || null;
  } catch (error) {
    console.warn("MENTIONLYTICS_API_TOKEN not configured, using mock data");
    return null;
  }
}

// In API endpoint
export const getSentiment = api<{}, SentimentResponse>(
  { expose: true, method: "GET", path: "/api/v1/mentionlytics/sentiment" },
  async () => {
    const token = await getMentionlyticsToken();
    
    if (!token) {
      // Return mock data when secret missing
      return {
        positive: 45,
        negative: 25,
        neutral: 30,
        timestamp: new Date().toISOString()
      };
    }
    
    // Use real API when token available
    const data = await callMentionlyticsAPI(token);
    return data;
  }
);
```

### Apply to ALL Services:
- ✅ auth → JWT_SECRET
- ✅ mentionlytics → MENTIONLYTICS_API_TOKEN
- ✅ campaigns → META_ACCESS_TOKEN, GOOGLE_ADS_API_KEY
- ✅ intelligence → OPENAI_API_KEY
- ✅ alerting → TWILIO_SID, TWILIO_TOKEN
- ✅ integrations → All external API keys

---

## 🔌 POST-DEPLOYMENT CONFIGURATION

### Step 1: Add Secrets via Dashboard
1. Go to https://app.encore.cloud/winston-4-4-backend/settings/secrets
2. Add each secret for staging environment:
   - MENTIONLYTICS_API_TOKEN: `0X44tHi275ZqqK2psB4U-Ph-dw2xRkq7T4QVkSBlUz32V0ZcgkXt2dQSni52-fhB7WZyZOoGBPcR23O9oND_h1DE`
   - META_ACCESS_TOKEN: `917316510623086`
   - GOOGLE_ADS_API_KEY: `h3cQ3ss7lesG9dP0tC56ig`
   - EMAIL_API_KEY: `Info@wethinkbig.io`
   - JWT_SECRET: `war-room-secret-key-2025`

### Step 2: Update Frontend Connection
```toml
# netlify.toml
[[redirects]]
  from = "/api/*"
  to = "https://staging-winston-4-4-backend-[ID].encr.app/api/:splat"
  status = 200
  force = true

[context.production.environment]
  VITE_ENCORE_API_URL = "https://staging-winston-4-4-backend-[ID].encr.app"
```

---

## ✅ VALIDATION CHECKLIST

### Backend Health:
- [ ] `/health` returns JSON
- [ ] `/api/v1/health` shows service status
- [ ] No HTML responses on any endpoint

### Dashboard Widget Connections:
- [ ] Political Map gets data from `/api/v1/mentionlytics/geo`
- [ ] SWOT Radar gets data from `/api/v1/mentionlytics/sentiment`
- [ ] Meta Campaigns from `/api/v1/campaigns/meta`
- [ ] Google Campaigns from `/api/v1/campaigns/google`
- [ ] All widgets receive proper data

### Carlos's Requirements:
- [ ] Chat works via `/api/v1/intelligence/chat`
- [ ] Upload works via `/api/v1/intelligence/documents/upload`
- [ ] Save works with database persistence
- [ ] Settings work via `/api/v1/auth/settings`
- [ ] AI analysis via `/api/v1/intelligence/analyze`

### MOCK/LIVE Toggle:
- [ ] MOCK mode works without secrets
- [ ] LIVE mode works with secrets
- [ ] Smooth switching between modes

---

## 🚨 TROUBLESHOOTING

### If Backend Returns HTML:
1. Check encore.app file exists
2. Verify all services have encore.service.ts
3. Ensure API endpoints use `api` from "encore.dev/api"
4. Check deployment logs for errors

### If Secrets Don't Work:
1. Verify secret names match exactly
2. Check environment (staging vs production)
3. Ensure graceful fallback implemented
4. Test with curl to verify mock data returns

### If Dashboard Widgets Don't Connect:
1. Check netlify.toml redirects
2. Verify CORS headers
3. Test endpoints directly with curl
4. Check browser console for errors

---

## 📊 SUCCESS METRICS

**Deployment successful when:**
1. ✅ All endpoints return JSON (0% HTML responses)
2. ✅ Mock data works without secrets (100% graceful fallback)
3. ✅ Live data works with secrets (100% API connections)
4. ✅ Carlos can test all 5 requirements
5. ✅ All dashboard widgets display data
6. ✅ MOCK/LIVE toggle functions correctly

---

**WINSTON STATUS**: Ready for deployment with graceful secret handling