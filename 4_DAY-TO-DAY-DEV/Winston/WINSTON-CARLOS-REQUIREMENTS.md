# WINSTON - CARLOS'S 5 CORE REQUIREMENTS
## Making Everything Testable and Functional

**Date**: September 7, 2025  
**Client**: Carlos  
**Critical Issue**: "95% to MVP is concerning if we still cannot test the following"  

---

## 🎯 CARLOS'S EXACT REQUIREMENTS

Carlos stated: **"We cannot test if anything functions or works yet."**

His 5 specific testing requirements:
1. **Test the chat**
2. **Upload anything**  
3. **Save anything**
4. **Change settings**
5. **"Ask AI" about even the mock data**

---

## 1️⃣ TEST THE CHAT

### Requirement: Functional AI chat that responds intelligently
**Backend Service**: Intelligence  
**Endpoint**: `/api/v1/intelligence/chat/message`

### Implementation:
```typescript
// intelligence/api.ts
export const sendChatMessage = api<ChatRequest, ChatResponse>(
  { method: "POST", path: "/api/v1/intelligence/chat/message", expose: true },
  async (req: ChatRequest): Promise<ChatResponse> => {
    const openAiKey = await getOpenAiKey(); // Graceful fallback
    
    if (!openAiKey) {
      // MOCK MODE: Return intelligent mock responses
      return {
        message: req.message,
        response: generateMockAIResponse(req.message),
        sessionId: req.sessionId || generateSessionId(),
        timestamp: new Date().toISOString()
      };
    }
    
    // LIVE MODE: Use real OpenAI
    const aiResponse = await callOpenAI(openAiKey, req.message);
    return {
      message: req.message,
      response: aiResponse,
      sessionId: req.sessionId || generateSessionId(),
      timestamp: new Date().toISOString()
    };
  }
);
```

### Testing Checklist:
- [ ] User can type message and get response
- [ ] Chat maintains conversation context
- [ ] Works in MOCK mode without OpenAI key
- [ ] Works in LIVE mode with OpenAI key
- [ ] Response time < 3 seconds

---

## 2️⃣ UPLOAD ANYTHING

### Requirement: Upload and process documents
**Backend Service**: Intelligence  
**Endpoint**: `/api/v1/intelligence/documents/upload`

### Implementation:
```typescript
// intelligence/api.ts
export const uploadDocument = api<DocumentUploadRequest, DocumentUploadResponse>(
  { method: "POST", path: "/api/v1/intelligence/documents/upload", expose: true },
  async (req: DocumentUploadRequest): Promise<DocumentUploadResponse> => {
    // Save document to storage
    const documentId = generateDocumentId();
    
    // Store in database (works without external APIs)
    await saveDocument({
      id: documentId,
      filename: req.filename,
      content: req.content,
      uploadedBy: getCurrentUser().id,
      uploadedAt: new Date(),
      size: req.content.length,
      type: req.type || detectFileType(req.filename)
    });
    
    // Queue for processing
    await queueDocumentProcessing(documentId);
    
    return {
      documentId,
      filename: req.filename,
      status: "uploaded",
      message: "Document uploaded successfully",
      processingStatus: "queued"
    };
  }
);
```

### File Types to Support:
- PDF documents
- Word documents (.docx)
- Text files (.txt)
- CSV data files
- Images (PNG, JPG)
- JSON data files

### Testing Checklist:
- [ ] Can upload PDF files
- [ ] Can upload text documents
- [ ] Can upload data files (CSV/JSON)
- [ ] Files are stored persistently
- [ ] Can retrieve uploaded files
- [ ] Processing queue works

---

## 3️⃣ SAVE ANYTHING

### Requirement: Data persistence across sessions
**Backend Service**: Multiple (Campaigns, Analytics, Settings)  
**Database**: PostgreSQL with proper schemas

### Implementation Areas:

#### Campaign Data:
```typescript
// campaigns/api.ts
export const saveCampaign = api<SaveCampaignRequest, Campaign>(
  { method: "POST", path: "/api/v1/campaigns", expose: true },
  async (req: SaveCampaignRequest): Promise<Campaign> => {
    const campaign = {
      id: generateId(),
      ...req,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: getCurrentUser().id
    };
    
    // Save to database
    await db.query(
      `INSERT INTO campaigns (id, name, data, user_id, created_at) 
       VALUES ($1, $2, $3, $4, $5)`,
      [campaign.id, campaign.name, JSON.stringify(campaign), campaign.userId, campaign.createdAt]
    );
    
    return campaign;
  }
);
```

#### User Preferences:
```typescript
// auth/api.ts
export const saveSettings = api<UserSettings, SuccessResponse>(
  { method: "PUT", path: "/api/v1/auth/settings", expose: true },
  async (req: UserSettings): Promise<SuccessResponse> => {
    const userId = getCurrentUser().id;
    
    await db.query(
      `UPDATE users SET preferences = $1, updated_at = $2 WHERE id = $3`,
      [JSON.stringify(req), new Date(), userId]
    );
    
    return { success: true, message: "Settings saved" };
  }
);
```

### Testing Checklist:
- [ ] Campaign data persists after refresh
- [ ] User settings save and reload
- [ ] Dashboard configurations save
- [ ] Uploaded documents persist
- [ ] Chat history is saved
- [ ] All data survives server restart

---

## 4️⃣ CHANGE SETTINGS

### Requirement: User can modify preferences and configurations
**Backend Service**: Auth  
**Endpoint**: `/api/v1/auth/settings`

### Settings to Include:
```typescript
interface UserSettings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    alertThreshold: 'low' | 'medium' | 'high' | 'critical';
  };
  display: {
    theme: 'light' | 'dark';
    dataMode: 'MOCK' | 'LIVE';
    dashboardLayout: 'compact' | 'expanded';
    defaultView: string;
  };
  alerts: {
    crisisNotifications: boolean;
    sentimentThreshold: number;
    mentionSpikeThreshold: number;
  };
  integrations: {
    mentionlyticsEnabled: boolean;
    metaAdsEnabled: boolean;
    googleAdsEnabled: boolean;
  };
}
```

### Testing Checklist:
- [ ] Can toggle notification preferences
- [ ] Can switch between MOCK/LIVE data
- [ ] Can change alert thresholds
- [ ] Can enable/disable integrations
- [ ] Settings persist across sessions
- [ ] Settings apply immediately

---

## 5️⃣ "ASK AI" ABOUT EVEN THE MOCK DATA

### Requirement: AI can analyze and answer questions about dashboard data
**Backend Service**: Intelligence  
**Endpoint**: `/api/v1/intelligence/analyze`

### Implementation:
```typescript
// intelligence/api.ts
export const analyzeData = api<AnalyzeRequest, AnalyzeResponse>(
  { method: "POST", path: "/api/v1/intelligence/analyze", expose: true },
  async (req: AnalyzeRequest): Promise<AnalyzeResponse> => {
    // Get current dashboard data (MOCK or LIVE)
    const dashboardData = await getDashboardData(req.dataMode);
    
    // Prepare context for AI
    const context = {
      sentiment: dashboardData.sentiment,
      campaigns: dashboardData.campaigns,
      trending: dashboardData.trending,
      alerts: dashboardData.alerts
    };
    
    // Generate AI analysis
    const openAiKey = await getOpenAiKey();
    
    if (!openAiKey) {
      // MOCK MODE: Intelligent analysis of mock data
      return {
        question: req.question,
        analysis: generateMockAnalysis(req.question, context),
        dataSources: Object.keys(context),
        confidence: 0.85,
        insights: generateMockInsights(context)
      };
    }
    
    // LIVE MODE: Real AI analysis
    const analysis = await analyzeWithOpenAI(req.question, context);
    return analysis;
  }
);
```

### Example Questions Carlos Should Be Able to Ask:
- "What's the current sentiment trend?"
- "Which campaigns are performing best?"
- "Are there any crisis alerts?"
- "What are people saying about healthcare?"
- "Show me the top influencers"
- "Analyze the geographic distribution"
- "Compare this week to last week"

### Testing Checklist:
- [ ] AI responds to questions about sentiment
- [ ] AI can analyze campaign performance
- [ ] AI understands trending topics
- [ ] AI works with MOCK data
- [ ] AI works with LIVE data
- [ ] Responses are contextually relevant

---

## 🚨 CRITICAL SUCCESS FACTORS

### For Carlos to Consider MVP Complete:

1. **Every feature must work in BOTH modes:**
   - ✅ MOCK mode (no API keys needed)
   - ✅ LIVE mode (with real data)

2. **Data must persist:**
   - ✅ Survives page refresh
   - ✅ Survives server restart
   - ✅ Available across sessions

3. **Response times must be acceptable:**
   - ✅ Chat: < 3 seconds
   - ✅ Upload: < 5 seconds
   - ✅ Save: < 1 second
   - ✅ Settings: Instant
   - ✅ AI Analysis: < 5 seconds

4. **Error handling must be graceful:**
   - ✅ No white screens
   - ✅ Clear error messages
   - ✅ Fallback to mock when needed
   - ✅ Recovery without refresh

---

## 📋 FINAL VALIDATION

Carlos should be able to:
1. **Start a chat conversation** and get intelligent responses
2. **Upload a PDF** and see it saved
3. **Change a setting** and see it persist
4. **Create a campaign** and reload to see it still there
5. **Ask "What's our sentiment?"** and get a real answer
6. **Switch between MOCK/LIVE** and see different data
7. **Do all of this without any API keys** (mock mode)
8. **Do all of this with API keys** (live mode)

**When all 8 items above work, Carlos's requirements are met!**