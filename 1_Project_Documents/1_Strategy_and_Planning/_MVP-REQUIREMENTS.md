# WAR ROOM MVP REQUIREMENTS
**Status**: Backend Development Required for Client Testing  
**Timeline**: TODAY - Client Testing by End of Day  
**Date**: September 5, 2025  
**Architecture**: 3.1 UI → Backend APIs (Leap.new/Encore)  

## 🎯 CLIENT P0 TESTING REQUIREMENTS (TODAY)

**Client must be able to test these 5 features by end of day:**

### 1. CHAT FUNCTIONALITY (CLIENT MUST TEST)
- [ ] POST /api/chat/message - Send message, get AI response
- [ ] GET /api/chat/history - Retrieve conversation history
- [ ] Chat interface connects to working backend
- [ ] Messages persist between sessions
- [ ] OpenAI integration actually responds

### 2. FILE UPLOAD (CLIENT MUST TEST)
- [ ] POST /api/files/upload - Single file upload works
- [ ] File progress indicators show real progress
- [ ] Uploaded files are stored and retrievable
- [ ] PDF files can be uploaded successfully
- [ ] File validation and error handling works

### 3. SAVE FUNCTIONALITY (CLIENT MUST TEST)
- [ ] Conversations are saved automatically
- [ ] Uploaded files persist between sessions
- [ ] User can retrieve previous chats
- [ ] Basic data persistence working
- [ ] No data loss on page refresh

### 4. SETTINGS PERSISTENCE (CLIENT MUST TEST)
- [ ] PATCH /api/settings - Save settings changes
- [ ] GET /api/settings - Load current settings
- [ ] Settings page actually saves changes
- [ ] User preferences persist between sessions
- [ ] Settings changes are immediately reflected

### 5. "ASK AI" FUNCTIONALITY (CLIENT MUST TEST)
- [ ] POST /api/chat/ask - Query uploaded documents
- [ ] AI can reference uploaded file content
- [ ] Document context appears in responses
- [ ] Basic document analysis working
- [ ] Intelligent responses about uploaded content

## 🛠️ BACKEND IMPLEMENTATION REQUIREMENTS

### CHAT SERVICE (Priority 1)
```typescript
// Required endpoints:
POST /api/v1/chat/message    // Send message, get AI response
GET  /api/v1/chat/history    // Retrieve conversation history
DELETE /api/v1/chat/clear    // Clear conversation

// Requirements:
- OpenAI API integration (GPT-4)
- Message persistence in database
- Basic error handling
- CORS configured for frontend
```

### FILE UPLOAD SERVICE (Priority 2)
```typescript
// Required endpoints:
POST /api/v1/files/upload    // Single file upload
GET  /api/v1/files/:id       // Retrieve uploaded file
DELETE /api/v1/files/:id     // Delete uploaded file

// Requirements:
- File storage (local or cloud)
- Progress tracking
- PDF support (critical for client)
- File validation (size, type)
```

### SETTINGS SERVICE (Priority 3)
```typescript
// Required endpoints:
GET  /api/v1/settings        // Load user settings
PATCH /api/v1/settings       // Save setting changes

// Requirements:
- Settings persistence
- User-specific storage
- JSON structure for flexibility
```

### DOCUMENT ANALYSIS SERVICE (Priority 4)
```typescript
// Required endpoints:
POST /api/v1/documents/analyze  // Process document for AI context
POST /api/v1/chat/ask-document  // Query document via AI

// Requirements:
- PDF text extraction
- Document chunking for AI context
- Integration with chat service
- Basic search capability
```

### DATA PERSISTENCE
```sql
-- Required tables:
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID,
  messages JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE uploaded_files (
  id UUID PRIMARY KEY,
  user_id UUID,
  filename TEXT,
  file_path TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP
);

CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY,
  settings JSONB,
  updated_at TIMESTAMP
);
```

## ❌ NOT NEEDED FOR CLIENT TESTING
- Enterprise monitoring systems
- Advanced analytics dashboards  
- 8-type data flows
- Real-time WebSockets
- SMS/WhatsApp alerts
- Crisis detection algorithms
- SWOT radar complex visualizations
- Advanced authentication (JWT refresh, etc.)
- Rate limiting and caching
- Performance monitoring
- Vector search (can use simple text search initially)

## 🚀 DEPLOYMENT REQUIREMENTS

### SECRETS CONFIGURATION
```bash
# Required in Encore/GitHub Secrets:
OPENAI_API_KEY=sk-...
JWT_SECRET=secure-random-string
DATABASE_URL=postgres://...
FILE_STORAGE_PATH=/uploads
```

### ENVIRONMENT SETUP
- [ ] Database initialized with required tables
- [ ] File upload directory created
- [ ] CORS configured for frontend domain
- [ ] Error logging enabled
- [ ] API rate limiting (basic)

### FRONTEND INTEGRATION
```typescript
// Frontend API configuration:
const API_BASE = 'https://war-room-backend-xyz.lp.dev';
const API_ENDPOINTS = {
  chat: '/api/v1/chat',
  files: '/api/v1/files', 
  settings: '/api/v1/settings',
  documents: '/api/v1/documents'
};
```

## ✅ CLIENT TESTING SUCCESS CRITERIA

**Client can test TODAY when:**
- **Chat**: User can send message, AI responds, conversation saves
- **Upload**: User can upload a file, see progress, file is stored
- **Save**: User can retrieve previous chats and uploaded files
- **Settings**: User can change preferences, they persist
- **Ask AI**: User can ask questions about uploaded documents

**Evidence Required:**
- Video demo of each feature working
- Client can independently test all 5 features
- No major errors during basic usage
- Data persists between browser sessions

## 📊 TODAY'S IMPLEMENTATION PLAN

| Time | Task | Leap.new Prompt | Status |
|------|------|-----------------|--------|
| 10:00-12:00 | Chat + Upload Services | Build core API endpoints | ⏳ |
| 12:00-14:00 | Settings + Database | Add persistence layer | ⏳ |
| 14:00-16:00 | Document Analysis | AI integration for "Ask" | ⏳ |
| 16:00-17:00 | Frontend Integration | Connect UI to APIs | ⏳ |
| 17:00-18:00 | Testing & Demo | Verify all 5 features | ⏳ |
| **END OF DAY** | **Client Demo Ready** | **All 5 P0 Features** | **🎯** |

## 🎯 LEAP.NEW PROMPT STRATEGY

### PROMPT 1: Core Backend Services
```
Build War Room backend with 4 essential endpoints:
- Chat service with OpenAI integration
- File upload with PDF support 
- Settings persistence
- Basic user sessions

Use Encore framework, PostgreSQL database, JWT auth.
Priority: Client testing of chat, upload, save, settings.
```

### PROMPT 2: Document Analysis 
```
Add document analysis service to existing backend:
- PDF text extraction
- AI-powered document Q&A
- Integration with chat service
- "Ask AI" functionality for uploaded files
```

### SUCCESS CRITERIA
**Client can demonstrate:**
1. Send chat message → AI responds → conversation saves
2. Upload PDF file → file appears in interface
3. Change settings → refresh page → settings persist
4. Upload document → ask question → AI references content
5. All features work without errors

**Evidence**: Screen recording of all 5 features working end-to-end