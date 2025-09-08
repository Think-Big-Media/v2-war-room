# NAPOLEON STAGE 2: Chat System
**Status**: 🟢 MERGE - Ready for Leap.new execution after Stage 1 passes  
**Word Count**: 289 words (within 300 limit)

---

## 🎯 LEAP.NEW PROMPT - STAGE 2 CHAT

Build War Room V2 chat system using existing foundation. Add real OpenAI integration for floating chat.

**CHAIRMAN'S NON-NEGOTIABLE REQUIREMENTS:**
- File storage MUST use Encore Object Storage Bucket (never local filesystem)
- All secrets via Encore secrets (never hardcode OpenAI key)
- PostgreSQL pgvector for document embeddings and chat history
- Real AI responses only - NO canned responses

**Core Services:**

1. **Chat Service** - OpenAI integration with conversation history persistence. Endpoints: POST /api/v1/chat/message, GET /api/v1/chat/history/:sessionId. Mock mode returns realistic but clearly marked test responses. Live mode uses OpenAI API via Encore secrets.

2. **File Upload Service** - Document upload using Encore Object Storage Bucket. Support PDF/image files. POST /api/v1/files/upload returns secure URLs. Process documents into vector embeddings using pgvector.

3. **Document Intelligence** - Vector search for chat context. Store document embeddings in PostgreSQL with pgvector extension. Enable "Ask AI" with document context retrieval.

**Database Schema:**
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL,
  content TEXT NOT NULL,
  role VARCHAR(20) NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Critical Success Factors:**
- Floating chat responds with real OpenAI (no canned responses)
- Documents uploaded to Object Storage Bucket successfully  
- Vector embeddings working for document context

Focus on real AI functionality. Critical P0 deliverable for end of day.

---

## ✅ COMET VALIDATION PROMPT

Test the chat system:

1. Chat responds with real OpenAI integration (not canned responses)
2. Files upload to Encore Object Storage Bucket (not local storage)
3. Document embeddings stored in pgvector successfully
4. Chat can reference uploaded document context
5. No hardcoded OpenAI keys found

Pass/Fail: All 5 tests must pass before Stage 3.