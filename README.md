# War Room 3.1 - Political Campaign Intelligence Platform

## 🚀 CURRENT ARCHITECTURE
**Status**: Frontend Complete, Backend Integration In Progress  
**Frontend**: React/Vite deployed on Netlify (100% operational)  
**Backend**: Encore via Leap.new (serving HTML, needs JSON fix)  
**Date**: September 2, 2025

---

## 🏗️ SYSTEM ARCHITECTURE

### Current Deployment (3.1)
```
┌─────────────────────────────────────────────────────┐
│  FRONTEND (Netlify)                                 │
│  https://war-room-3-1-ui.netlify.app               │
│  • React 18 + Vite + TypeScript                    │
│  • Redux Toolkit + RTK Query                       │
│  • Sentry Error Monitoring                         │
│  • Status: ✅ OPERATIONAL                          │
└─────────────────────────────────────────────────────┘
                    ↓ API Calls ↓
┌─────────────────────────────────────────────────────┐
│  BACKEND (Encore via Leap.new)                     │
│  https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev │
│  • TypeScript + Encore Framework                   │
│  • PostgreSQL + Redis                              │
│  • 48 API Endpoints                                │
│  • Status: ⚠️ SERVING HTML (needs fix)             │
└─────────────────────────────────────────────────────┘
```

---

## 📚 MASTER DOCUMENTATION

### Core Architecture Documents
- **[`_3.1-UI-STATUS.md`](./_3.1-UI-STATUS.md)** - Frontend deployment status
- **[`_BACKEND-STATUS.md`](./_BACKEND-STATUS.md)** - Backend API status
- **[`*OPERATIONS-IRONCLAD-COMPLETE.md`](./*OPERATIONS-IRONCLAD-COMPLETE.md)** - P0 blockers resolved
- **[`*BACKEND-FIX-GUIDE.md`](./*BACKEND-FIX-GUIDE.md)** - How to fix HTML→JSON issue

### Product Documents
- **[`*PRODUCT-VISION.md`](./*PRODUCT-VISION.md)** - 3-year strategic vision (2025-2028)
- **[`*PRD.md`](./*PRD.md)** - Product Requirements Document
- **[`*MVP-REQUIREMENTS.md`](./*MVP-REQUIREMENTS.md)** - MVP deliverables
- **[`*V2-REQUIREMENTS.md`](./*V2-REQUIREMENTS.md)** - V2 enhancements

### Technical Specifications
- **[`*FSD.md`](./*FSD.md)** - Functional Specification Document
- **[`*DATA-ARCHITECTURE.md`](./*DATA-ARCHITECTURE.md)** - 8 data types routing
- **[`*SECURITY-ARCHITECTURE.md`](./*SECURITY-ARCHITECTURE.md)** - Auth & encryption
- **[`*LEAP-NEW-BACKEND-CREATION-GUIDE.md`](./*LEAP-NEW-BACKEND-CREATION-GUIDE.md)** - Backend specs

### Operations Guides
- **[`CLAUDE.md`](./CLAUDE.md)** - AI CTO continuity protocol
- **[`ENCORE-NUGGETS.md`](./ENCORE-NUGGETS.md)** - Hard-won Encore wisdom
- **[`*ERROR-HANDLING-GUIDE.md`](./*ERROR-HANDLING-GUIDE.md)** - Recovery strategies
- **[`*TESTING-STRATEGY.md`](./*TESTING-STRATEGY.md)** - Test coverage

### 📁 Project Structure
- **`3.1-ui-war-room-netlify-clean/`** - Frontend (React/Vite) - ✅ COMPLETE
- **`repositories/war-room-backend-clean/`** - Backend reference code
- **`repositories/`** - Historical versions for reference
- **`docs/`** - Legacy documentation

---

## 🎯 QUICK START

### 1. Access Live Frontend
```bash
# Production Frontend
open https://war-room-3-1-ui.netlify.app

# Local Development
cd 3.1-ui-war-room-netlify-clean
npm install
npm run dev
```

### 2. Fix Backend (Currently Serving HTML)
```bash
# Test current status
curl https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/api/v1/health

# If HTML returned, apply fix via Leap.new
# See *BACKEND-FIX-GUIDE.md for step-by-step instructions
```

### 3. Verify Integration
- Frontend loads without errors
- Backend returns JSON for /api/v1/health
- Authentication flow works
- WebSocket connections establish

---

## 🚨 CRITICAL NEXT STEPS

### Fix Backend HTML Issue (Priority #1)
The backend is currently serving HTML instead of JSON. This MUST be fixed first:

```bash
# Test the problem
curl https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/api/v1/health
# Returns: HTML with <script src="https://leap.new/scripts/preview.js">

# Fix via Leap.new (see *BACKEND-FIX-GUIDE.md)
# The issue: Leap.new preview UI is intercepting API calls
# The solution: Disable static file serving in admin service
```

### Configure Sentry Monitoring (Priority #2)
1. Create project at https://sentry.io
2. Get DSN: `https://[key]@[org].ingest.sentry.io/[project-id]`
3. Add to Netlify: Settings → Environment → `VITE_SENTRY_DSN`
4. Redeploy and test error capture

---

## 🛡️ PRODUCTION STATUS

### Frontend (Netlify) ✅
- **URL**: https://war-room-3-1-ui.netlify.app
- **Status**: OPERATIONAL
- **Features**: All UI components working
- **Issue**: None

### Backend (Encore) ⚠️
- **URL**: https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev
- **Status**: SERVING HTML (needs fix)
- **Features**: 48 endpoints built
- **Issue**: Preview UI intercepting API calls

### Security Implementation ✅
- [x] JWT with automatic refresh (mutex protected)
- [x] Rate limiting configured
- [x] CORS headers in place
- [x] Secure token storage
- [x] Sentry error boundaries

### Performance Achieved ✅
- [x] Bundle size optimized (manual chunks)
- [x] React Redux 8.1.3 (fixed from 9.2.0)
- [x] RTK Query for caching
- [x] AbortController timeouts

---

## 📞 SUPPORT & AUTHORITY

### Project Leadership
- **Chairman Gemini**: Overall project authority & final decisions
- **CC1 (Claude)**: Frontend specialist (React/Redux/Integration)
- **CC2 (Claude)**: Backend specialist (Encore/Leap.new/APIs)

### Key Lessons Learned
1. **Never panic**: Check last working deployment first
2. **Leap.new = Backend Only**: Not for frontend (common confusion)
3. **React Redux 9.2.0 breaks**: Must use 8.1.3
4. **Encore environments**: Can be deleted and recreated in 30 seconds
5. **HTML from API**: Usually Leap preview UI issue

### Quick Diagnostics
```bash
# Is backend returning JSON?
./test-backend-json.sh

# Is frontend deployed?
curl -I https://war-room-3-1-ui.netlify.app

# Check frontend errors
# Open browser console at production URL
```

---

**Current Mission**: Fix backend to serve JSON, not HTML. Everything else is complete and operational.