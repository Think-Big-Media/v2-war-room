# NAPOLEON - LEAP.NEW IMPLEMENTATION PROMPTS

**Project**: War Room 4.3 Backend - Political Intelligence Platform  
**Objective**: Client P0 testing requirements with production-grade architecture  
**Date**: September 5, 2025

---

## 📋 PROMPT SEQUENCE

### **LEAP PROMPT 1: Foundation & File Storage**
```
🎯 SERVICE: War Room 4.3 Backend Foundation
**Project**: Political intelligence platform backend for client testing
**Objective**: Core infrastructure with durable file storage

Build foundation for War Room political intelligence platform:

**Core Architecture**:
- Encore Object Storage for all file operations (NO local filesystem)
- PostgreSQL database with UUID primary keys
- JWT authentication with CORS configuration
- Input validation and rate limiting

**File Storage System** (CRITICAL):
```typescript
import { Bucket } from "encore.dev/storage";

const filesBucket = new Bucket({
  name: "war-room-files",
  public: false
});
```

**Initial Endpoints**:
- POST /api/v1/files/upload (store in Object Storage)
- GET /api/v1/files/:id (retrieve from bucket)
- POST /api/v1/auth/login (JWT authentication)
- GET /api/v1/health (system health check)

**Database Tables**:
```sql
CREATE TABLE uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  bucket_key TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

Use Encore Object Storage primitives. No local file system dependencies.
Report back: Confirm bucket integration and file upload working.
```

### **LEAP PROMPT 2: Chat & AI Integration**
```  
🎯 SERVICE: War Room Chat System
**Project**: Political intelligence platform - AI chat functionality
**Objective**: OpenAI integration with conversation persistence

Add to existing War Room backend:

**Chat System**:
- POST /api/v1/chat/message (OpenAI GPT-4 integration)
- GET /api/v1/chat/history (retrieve conversations)
- POST /api/v1/documents/analyze (AI analysis of uploaded files)

**Database Addition**:
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  messages JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**AI Features**:
- OpenAI integration for intelligent responses
- Document context awareness (reference uploaded files)
- Conversation persistence with message history

**Environment Variables**: 
- OPENAI_API_KEY (for AI integration)

Connect to existing Object Storage for document analysis.
Report back: Chat responds intelligently, conversations save, document analysis works.
```

### **LEAP PROMPT 3: Async Reports & Settings**
```
🎯 SERVICE: War Room Reports & Settings
**Project**: Political intelligence platform - async PDF generation
**Objective**: Production-grade async reports with user settings

Add to existing War Room backend:

**Async PDF Generation** (Pub/Sub pattern):
```typescript
import { Topic } from "encore.dev/pubsub";

const reportTopic = new Topic({
  name: "report-generation",
  config: { deliveryGuarantee: "at-least-once" }
});
```

**Report Endpoints**:
- POST /api/v1/reports/generate (returns 202 + report_id immediately)
- GET /api/v1/reports/:id/status (poll: pending/processing/completed)
- GET /api/v1/reports/:id/download (when ready)

**Settings System**:
- GET /api/v1/settings (load user preferences) 
- PATCH /api/v1/settings (save changes)

**Database Tables**:
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  bucket_key TEXT,
  status TEXT DEFAULT 'pending',
  generated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_settings (
  id UUID PRIMARY KEY,
  settings JSONB DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT NOW()
);
```

Use Pub/Sub for async PDF generation to prevent timeouts.
Report back: Reports generate asynchronously, settings persist correctly.
```

---

## 🎯 SUCCESS CRITERIA

Client can test all P0 features:
1. **Chat**: Send message → AI responds → conversation saves
2. **Upload**: File uploads → stored in Object Storage → retrievable  
3. **Save**: All data persists between sessions
4. **Settings**: Change preferences → saves → persists on reload
5. **Ask AI**: Upload document → ask questions → AI references content
6. **PDF Reports**: Generate report → async processing → download when ready

---

## 📊 EXECUTION TRACKING

- [ ] **LEAP PROMPT 1**: Foundation & File Storage  
- [ ] **LEAP PROMPT 2**: Chat & AI Integration
- [ ] **LEAP PROMPT 3**: Async Reports & Settings
- [ ] **Integration Testing**: All P0 features working
- [ ] **Client Demo**: Ready for testing