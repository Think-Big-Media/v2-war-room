# NAPOLEON STAGE 1: Foundation 
**Status**: 🟢 MERGE - Ready for Leap.new execution  
**Word Count**: 248 words (within 300 limit)

---

## 🎯 LEAP.NEW PROMPT - STAGE 1 FOUNDATION

Build War Room V2 foundation backend using Encore.ts. Foundation-first development - validate single endpoint before expanding.

**CHAIRMAN'S NON-NEGOTIABLE REQUIREMENTS:**
- All secrets via Encore secrets (never hardcode)
- PostgreSQL with pgvector extension for document embeddings  
- Mock/Live data toggle in every service
- Clean JSON responses only (no HTML contamination)

**Core Services:**

1. **Health Service** - `/api/v1/health` endpoint returning `{"status": "ok", "data_mode": "MOCK"}` with current DATA_MODE toggle

2. **Authentication Service** - JWT auth with endpoints: POST /api/v1/auth/register, POST /api/v1/auth/login, POST /api/v1/auth/refresh. Use Encore secrets for JWT keys.

3. **Database Setup** - PostgreSQL with pgvector extension enabled. Create users table with proper UUID primary keys and timestamps.

**Technical Requirements:**
- TypeScript with comprehensive error handling
- CORS enabled for frontend integration
- Input validation using Encore API decorators  
- Each service in separate folder with encore.service.ts
- Mock data for development testing

**Test First**: Health endpoint must return proper JSON with data_mode before expanding to other services.

Focus on foundation stability. This replaces a $12,000 failed project - reliability is critical.

---

## ✅ COMET VALIDATION PROMPT

Test the generated foundation:

1. Verify `/api/v1/health` returns `{"status": "ok", "data_mode": "MOCK"}`
2. Test auth endpoints return proper JSON (not HTML)  
3. Confirm PostgreSQL pgvector extension is enabled
4. Validate no hardcoded secrets in codebase
5. Ensure all responses are clean JSON format

Pass/Fail: All 5 tests must pass before Stage 2.