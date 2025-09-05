# NAPOLEON STAGE 3: Ads Integration
**Status**: 🟢 MERGE - Ready for Leap.new execution after Stage 2 passes  
**Word Count**: 294 words (within 300 limit)

---

## 🎯 LEAP.NEW PROMPT - STAGE 3 ADS

Build War Room V2 ads integration using existing foundation. Add Google Ads and Meta Business APIs for viewing campaigns only.

**CHAIRMAN'S NON-NEGOTIABLE REQUIREMENTS:**
- OAuth2 flows for external APIs
- All API secrets via Encore secrets (never hardcode)
- Rate limiting and caching for external API calls
- Viewing only - no campaign creation functionality yet

**Core Services:**

1. **Google Ads Integration** - Read-only Google Ads API v16 integration. OAuth2 authentication flow. Endpoints: GET /api/v1/google-ads/campaigns, GET /api/v1/google-ads/performance, GET /api/v1/google-ads/insights. Use Encore secrets for API credentials.

2. **Meta Ads Integration** - Read-only Meta Business API v19.0 integration. OAuth2 authentication flow. Endpoints: GET /api/v1/meta-ads/campaigns, GET /api/v1/meta-ads/performance, GET /api/v1/meta-ads/insights. Facebook/Instagram campaign viewing only.

3. **Reports Service** - Async PDF generation using Encore Pub/Sub topic "pdf-generation". Queue PDF requests, background worker processes them, store in Object Storage Bucket. Never synchronous PDF generation.

**Technical Requirements:**
- OAuth2 + PKCE flow for Google Ads
- OAuth2 app-scoped IDs for Meta Business
- Retry logic and circuit breakers for external APIs
- 15-minute cache TTL for ads performance data
- Rate limiting to prevent API quota exhaustion

**Data Sources Architecture:**
Enable 6 data sources: Mentionlytics → Dashboard → Relevant pages user journey.

**Critical Success Factors:**
- Google/Meta OAuth2 flows working
- Campaign viewing endpoints functional
- No campaign creation abilities (viewing only)

Focus on reliable data viewing. P1 priority after chat system.

---

## ✅ COMET VALIDATION PROMPT

Test ads integration:

1. Google Ads OAuth2 authentication completes successfully
2. Meta Business OAuth2 authentication completes successfully
3. Campaign viewing endpoints return proper data (or mock data)
4. NO campaign creation endpoints exist (viewing only)
5. Rate limiting and caching implemented properly

Pass/Fail: All 5 tests must pass for complete Napoleon conquest.