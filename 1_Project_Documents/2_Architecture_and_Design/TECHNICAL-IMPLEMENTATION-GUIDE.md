# TECHNICAL IMPLEMENTATION GUIDE - War Room MVP
**Status**: Ready for Execution
**Timeline**: 90 minutes (wiring job, not development)
**Date**: September 5, 2025
**Approach**: Connect existing code, rebuild proven chat functionality

---

## 🎯 REALITY CHECK

**This is NOT a complex enterprise build. This is a 90-minute wiring job.**

From MVP-REQUIREMENTS.md:
- **80% of code already exists**
- **Backend services already built** (monitoring, alerts, intelligence, performance)
- **Frontend components ready** (62 Mentionlytics components)
- **APIs configured** (Mentionlytics token, credentials ready)

## 🚀 PHASE 1: CLIENT P0 TESTABLE FEATURES (30-45 minutes)

### **Priority 1: Build Chat System** ✅ Fresh start with Encore
```typescript
// Endpoints needed:
POST /api/v1/chat/message          // Send message to AI
GET  /api/v1/chat/history          // Retrieve conversation
POST /api/v1/documents/analyze     // Process uploaded docs for chat context
```

**Implementation**: 
- Use Encore's vector database (cleaner integration, no external dependencies)
- Build chat endpoints from scratch via Leap.new
- Connect to existing chat UI components

### **Priority 2: PDF & Document System** ✅ CRITICAL P0 CLIENT REQUIREMENT
```typescript
// CRITICAL: PDF functionality is core client testing requirement
POST /api/v1/documents/upload      // Single file upload (PDF processing)
POST /api/v1/reports/generate      // PDF report generation via ReportLab  
GET  /api/v1/documents/:id/download // Download with progress indicators
GET  /api/v1/reports/:id/download   // Download generated PDF reports
POST /api/v1/documents/analyze      // Process uploaded PDFs for AI context
```

**Critical PDF Requirements**:
- PDF upload with validation and processing
- PDF report generation (charts, analytics, summaries)  
- Download progress indicators and error handling
- File size limits and security validation
- PDF text extraction for AI chat context

### **Priority 3: Settings System** ✅ Make settings page actually work
```typescript
// Make existing settings UI functional:
PATCH /api/v1/settings/profile     // Save profile changes
PATCH /api/v1/settings/alerts      // Save notification preferences  
PATCH /api/v1/settings/preferences // General user preferences
GET   /api/v1/settings/current     // Load current settings
```

---

## 🔧 IMPLEMENTATION SEQUENCE

### **Step 1: Auth + Core Services (15 minutes)**
- Deploy Auth service via Leap.new (JWT patterns from Production Blueprint)
- Deploy Mentionlytics service (token already configured)
- Verify health endpoints respond

### **Step 2: Chat Endpoints (15 minutes)** 
- Deploy chat service with Encore's vector database
- Connect to OpenAI API for responses
- Wire to existing frontend chat components
- Test "Ask AI" with document context

### **Step 3: Upload + Settings (15 minutes)**
- Activate document upload endpoints
- Connect settings persistence
- Wire save functionality for conversations

### **Step 4: Integration Testing (15-30 minutes)**
- Test complete user flows
- Verify all P0 functionality works
- Client can test: chat, upload, save, settings, "Ask AI"

---

## 📋 LEAP.NEW PROMPTS (Ready to Execute)

### **Prompt 1: Auth + Mentionlytics Services**
```
🎯 SERVICE: Authentication + Mentionlytics Integration
**Objective**: Wire existing frontend to backend auth and live Mentionlytics data
**Blueprint Compliance**: YES ✅ (Production Blueprint patterns)
**Endpoints**: 
- POST /api/v1/auth/login (JWT with refresh)
- GET /api/v1/mentionlytics/* (7 endpoints from existing spec)
**Security**: JWT with Base64 secret, rate limiting, CORS configured
**Expected Score**: 9.0+/10

Connect the 62 existing Mentionlytics frontend components to live API. Token already configured: MENTIONLYTICS_API_TOKEN. Use Production Blueprint patterns for JWT auth. All secrets in GitHub → Encore pipeline.

REPORT BACK: Confirmation that login works and Mentionlytics data flows to frontend components.
```

### **Prompt 2: Chat + Document Services**
```
🎯 SERVICE: Chat + Document Intelligence  
**Objective**: Build chat system with Encore vector database + document upload
**Blueprint Compliance**: YES ✅
**Endpoints**:
- POST /api/v1/chat/message (AI chat with context)
- GET /api/v1/chat/history (conversation persistence)  
- POST /api/v1/documents/upload (single file upload)
- POST /api/v1/documents/analyze (AI analysis for chat context)
**Security**: JWT protected, file validation, rate limiting
**Expected Score**: 9.0+/10

Build fresh chat system using Encore's built-in vector database for document context. Connect to OpenAI API (key configured). Enable "Ask AI" functionality with uploaded document context. Wire to existing frontend chat components.

REPORT BACK: Chat responds to messages, documents upload successfully, "Ask AI" works with document context using Encore vector DB.
```

### **Prompt 3: Settings System**
```
🎯 SERVICE: Functional Settings Page
**Objective**: Make existing settings UI actually work - save changes, load preferences
**Blueprint Compliance**: YES ✅
**Endpoints**:
- GET /api/v1/settings/current (load user's current settings)
- PATCH /api/v1/settings/profile (save profile changes) 
- PATCH /api/v1/settings/alerts (save notification preferences)
- PATCH /api/v1/settings/preferences (save general preferences)
**Security**: JWT protected, input validation
**Expected Score**: 9.0+/10

Connect existing settings page UI to backend persistence. When user changes settings, they should save and persist. When user loads settings page, show their current preferences.

REPORT BACK: Settings page loads current values, saves changes successfully, persists between sessions.
```

---

## ✅ SUCCESS CRITERIA (Client Can Test)

**Client P0 Testing Requirements** ✅:
- ✅ **Chat**: AI responds to messages, maintains conversation history
- ✅ **Upload**: Documents upload successfully, progress indicators work  
- ✅ **Save**: Conversations and uploads persist, can be retrieved
- ✅ **Settings**: User can modify preferences, changes save correctly
- ✅ **"Ask AI"**: Can query uploaded documents, gets intelligent responses

**From MVP-REQUIREMENTS.md**:
- ✅ All Mentionlytics data flows live (62 components connected)
- ✅ JWT authentication working with refresh
- ✅ Document upload and analysis functional
- ✅ Real-time features stable
- ✅ All 8 data types routing properly

---

## 🔥 CRITICAL INSIGHTS

**This is a wiring job, not development**:
- Frontend components exist (62 Mentionlytics components)
- Backend services partially exist (monitoring, alerts, intelligence)
- APIs configured (tokens, credentials ready)
- Chat proven to work yesterday

**Speed Reality**:
- Leap.new deployment: 5-10 minutes per service
- Integration testing: 15 minutes total
- **Total time**: 90 minutes maximum

**Why it's fast**:
- No new UI development needed
- No complex architecture decisions
- Just connecting existing pieces
- Proven patterns (chat worked yesterday)

---

This guide reflects the reality that 80% of the work is done. We're not building an enterprise platform from scratch - we're wiring existing components to make them testable for the client.