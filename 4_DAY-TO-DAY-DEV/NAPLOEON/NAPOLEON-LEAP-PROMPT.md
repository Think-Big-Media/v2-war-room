# NAPOLEON: War Room V2 Backend Foundation - Leap.new Prompt

## 🎯 EXACT PROMPT FOR LEAP.NEW

Build a War Room V2 backend for political campaign intelligence using Encore.ts. This is foundation-first development - start simple, validate one endpoint, then expand.

**CHAIRMAN'S NON-NEGOTIABLE ARCHITECTURE REQUIREMENTS:**
- PDF generation MUST be asynchronous using Encore Pub/Sub (never sync API) - PREVENTS TIMEOUT DISASTERS
- File storage MUST use Encore Object Storage Bucket (never local filesystem) - PREVENTS DATA LOSS ON DEPLOYMENT
- All secrets via Encore secrets (never hardcode) - NO MORE HARDCODED DISASTERS
- Mock/Live data toggle in every service
- TypeScript with proper error handling
- OAuth2 flows for Google Ads and Meta Business APIs

**Core Services Needed:**

1. **Health Service** - `/api/v1/health` endpoint with DATA_MODE environment toggle showing "MOCK" or "LIVE"

2. **Authentication Service** - JWT auth with register/login/refresh endpoints, user roles (admin/manager/analyst/viewer), using Encore secrets for JWT keys

3. **File Upload Service** - Upload endpoint using Encore Object Storage Bucket, support PDF/image files, return secure URLs

4. **Chat Service** - OpenAI integration with conversation history, Mock mode returns predefined responses, Live mode calls OpenAI API using Encore secrets. CRITICAL: Real AI responses only - no canned responses for floating chat.

5. **Google Ads Integration** - Read-only endpoints to view campaigns, performance metrics, and insights using Google Ads API v16. OAuth2 integration for authentication. Endpoints: GET /api/v1/google-ads/campaigns, GET /api/v1/google-ads/performance, GET /api/v1/google-ads/insights

6. **Meta Ads Integration** - Read-only endpoints to view Facebook/Instagram campaigns, ad performance, and insights using Meta Business API v19.0. OAuth2 integration. Endpoints: GET /api/v1/meta-ads/campaigns, GET /api/v1/meta-ads/performance, GET /api/v1/meta-ads/insights

7. **Reports Service** - Async PDF generation using Encore Pub/Sub topic "pdf-generation", queue PDF requests, background worker processes them, store in Object Storage Bucket

**Technical Specs:**
- PostgreSQL database with proper migrations
- OAuth2 flows for Google Ads and Meta Business APIs  
- Input validation using Encore API decorators
- CORS enabled for frontend integration  
- Comprehensive error handling with proper HTTP codes
- Each service in separate folder with encore.service.ts
- Rate limiting and caching for external API calls
- Retry logic and circuit breakers for external APIs

Start with Health Service validation first - user will test before approving expansion to other services.

**Mock Data Strategy:**
Include realistic mock data for all services to demonstrate functionality without external dependencies during development.

**CRITICAL SUCCESS FACTORS:**
- Real OpenAI integration for floating chat (no canned responses)
- Google/Meta ads viewing integration working
- Chairman's architecture requirements followed exactly
- 6 data sources flowing: Mentionlytics → Dashboard → Relevant pages

Focus on clean, production-ready TypeScript code following Encore best practices. This replaces a $12,000 failed project - code quality is critical.

---

## 📋 IMPLEMENTATION CHECKLIST

### ✅ Immediate Validation:
1. **Health endpoint works** - Returns DATA_MODE status
2. **Single endpoint success** - Proves foundation is solid
3. **User approves** - Before building additional services

### 🚀 Phase 2 (After Health Validation):
1. Authentication with JWT + Encore secrets
2. File upload to Object Storage Bucket  
3. Chat with OpenAI integration
4. Async PDF reports with Pub/Sub

### 🔧 Foundation Requirements:
- Clean TypeScript with proper types
- Encore.ts best practices 
- No hardcoded values anywhere
- Mock/Live toggle working
- Proper error handling

**Success = One working endpoint that user can test and approve first.**