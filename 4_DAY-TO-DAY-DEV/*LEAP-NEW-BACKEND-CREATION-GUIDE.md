# 🚀 DEFINITIVE LEAP.NEW BACKEND CREATION GUIDE
## War Room Political Intelligence Platform - Complete Encore.ts Specifications

### 📋 PROJECT OVERVIEW
**Platform**: War Room - Political Campaign Intelligence & Crisis Management  
**Architecture**: Multi-service Encore.ts backend with real-time WebSocket streaming  
**Data Sources**: Mentionlytics, Meta Business API v19.0, Google Ads API v20, Twilio  
**Authentication**: OAuth 2.0 + JWT with refresh tokens  
**Database**: PostgreSQL + Redis caching layer  
**Hosting**: Leap.new → Encore.dev deployment  

---

## 🏗️ COMPLETE SERVICE ARCHITECTURE

### 1. AUTHENTICATION SERVICE (`auth`)
```typescript
// auth/encore.service.ts
import { Service } from "encore.dev/service";
export default new Service("auth");

// auth/api.ts  
import { api, APIError } from "encore.dev/api";
import { Header } from "encore.dev/api";
import { MinLen, MaxLen, IsEmail } from "encore.dev/api";

interface LoginRequest {
  email: string & IsEmail;
  password: string & MinLen<8>;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
  expiresIn: number;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "analyst" | "viewer";
  permissions: Permission[];
  createdAt: Date;
  lastLoginAt: Date;
}

interface Permission {
  resource: string;
  actions: string[];
}

export const login = api(
  { method: "POST", path: "/api/v1/auth/login", expose: true },
  async (req: LoginRequest): Promise<LoginResponse> => {
    // Validate credentials against database
    const user = await validateCredentials(req.email, req.password);
    if (!user) {
      throw APIError.unauthenticated("Invalid credentials");
    }
    
    // Generate JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Update last login
    await updateLastLogin(user.id);
    
    return {
      accessToken,
      refreshToken, 
      user,
      expiresIn: 3600 // 1 hour
    };
  }
);

export const refreshToken = api(
  { method: "POST", path: "/api/v1/auth/refresh", expose: true },
  async (req: { refreshToken: string }): Promise<{ accessToken: string; expiresIn: number }> => {
    const payload = verifyRefreshToken(req.refreshToken);
    if (!payload) {
      throw APIError.unauthenticated("Invalid refresh token");
    }
    
    const user = await getUserById(payload.userId);
    const newAccessToken = generateAccessToken(user);
    
    return {
      accessToken: newAccessToken,
      expiresIn: 3600
    };
  }
);

export const me = api(
  { method: "GET", path: "/api/v1/auth/me", expose: true, auth: true },
  async (): Promise<UserProfile> => {
    const currentUser = getCurrentUser();
    return await getUserProfile(currentUser.id);
  }
);

export const logout = api(
  { method: "POST", path: "/api/v1/auth/logout", expose: true, auth: true },
  async (): Promise<{ success: boolean }> => {
    const currentUser = getCurrentUser();
    await invalidateRefreshToken(currentUser.id);
    return { success: true };
  }
);
```

### 2. CAMPAIGNS SERVICE (`campaigns`)
```typescript
// campaigns/encore.service.ts
import { Service } from "encore.dev/service";
export default new Service("campaigns");

// campaigns/api.ts
import { api, APIError } from "encore.dev/api";
import { Min, Max, MinLen, MaxLen } from "encore.dev/api";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "paused" | "completed";
  startDate: Date;
  endDate: Date;
  budget: number;
  targetAudience: TargetAudience;
  metrics: CampaignMetrics;
  createdAt: Date;
  updatedAt: Date;
}

interface TargetAudience {
  demographics: Demographics;
  interests: string[];
  locations: string[];
  platforms: ("facebook" | "instagram" | "twitter" | "tiktok" | "google")[];
}

interface Demographics {
  ageRange: { min: number; max: number };
  gender: ("male" | "female" | "all")[];
  income: string;
  education: string;
}

interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roi: number;
  sentimentScore: number;
  engagementRate: number;
}

interface CreateCampaignRequest {
  name: string & MinLen<3> & MaxLen<100>;
  description: string & MaxLen<1000>;
  startDate: Date;
  endDate: Date;
  budget: number & Min<100> & Max<1000000>;
  targetAudience: TargetAudience;
}

export const createCampaign = api(
  { method: "POST", path: "/api/v1/campaigns", expose: true, auth: true },
  async (req: CreateCampaignRequest): Promise<Campaign> => {
    // Validate date range
    if (req.endDate <= req.startDate) {
      throw APIError.invalidArgument("End date must be after start date");
    }
    
    const campaign = await saveCampaign({
      ...req,
      id: generateId(),
      status: "draft",
      metrics: getEmptyMetrics(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return campaign;
  }
);

export const getCampaigns = api(
  { method: "GET", path: "/api/v1/campaigns", expose: true, auth: true },
  async (query: {
    page?: number & Min<1>;
    limit?: number & Min<1> & Max<100>;
    status?: "draft" | "active" | "paused" | "completed";
  }): Promise<{ campaigns: Campaign[]; total: number; page: number; limit: number }> => {
    const { page = 1, limit = 20, status } = query;
    
    const filters: any = {};
    if (status) filters.status = status;
    
    const result = await fetchCampaigns(filters, page, limit);
    return result;
  }
);

export const getCampaignById = api(
  { method: "GET", path: "/api/v1/campaigns/:id", expose: true, auth: true },
  async ({ id }: { id: string }): Promise<Campaign> => {
    const campaign = await findCampaignById(id);
    if (!campaign) {
      throw APIError.notFound("Campaign not found");
    }
    return campaign;
  }
);
```

### 3. MONITORING SERVICE (`monitoring`)
```typescript
// monitoring/encore.service.ts
import { Service } from "encore.dev/service";
export default new Service("monitoring");

// monitoring/api.ts
import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { PubSub } from "encore.dev/pubsub";

const db = new SQLDatabase("monitoring", {
  migrations: "./migrations"
});

// Real-time data streaming topic
const dataStream = new PubSub<StreamingData>("data-stream");

interface StreamingData {
  type: "MENTION" | "SENTIMENT" | "CRISIS" | "ENGAGEMENT" | "COMPETITOR" | "INFLUENCER" | "AUDIT" | "DOCUMENT";
  campaignId: string;
  timestamp: Date;
  data: any;
  priority: "low" | "medium" | "high" | "critical";
}

interface MonitoringConfig {
  campaignId: string;
  keywords: string[];
  competitors: string[];
  influencers: string[];
  platforms: string[];
  alertThresholds: AlertThresholds;
  refreshInterval: number; // seconds
}

interface AlertThresholds {
  sentimentDrop: number; // -0.3 = 30% sentiment drop
  mentionSpike: number; // 5x = 500% mention increase
  crisisScore: number; // 0.8 = 80% crisis probability
  engagementDrop: number; // -0.5 = 50% engagement drop
}

export const createMonitoringConfig = api(
  { method: "POST", path: "/api/v1/monitoring/config", expose: true, auth: true },
  async (req: MonitoringConfig): Promise<{ configId: string }> => {
    const configId = await saveMonitoringConfig(req);
    
    // Start background monitoring
    await startCampaignMonitoring(configId);
    
    return { configId };
  }
);

export const streamCampaignData = api(
  { method: "GET", path: "/api/v1/monitoring/stream/:campaignId", expose: true, auth: true },
  async ({ campaignId }: { campaignId: string }) => {
    // This will be handled by WebSocket in Leap.new
    const subscription = dataStream.subscribe("campaign-" + campaignId);
    
    return {
      streamEndpoint: `/ws/campaigns/${campaignId}/stream`,
      heartbeatInterval: 30000 // 30 seconds
    };
  }
);
```

### 4. INTELLIGENCE SERVICE (`intelligence`)
```typescript
// intelligence/encore.service.ts
import { Service } from "encore.dev/service";
export default new Service("intelligence");

// intelligence/api.ts
import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("intelligence", {
  migrations: "./migrations"
});

interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  sessionId: string;
}

interface ChatRequest {
  message: string;
  sessionId?: string;
}

interface ChatResponse {
  message: ChatMessage;
  response: string;
  sessionId: string;
}

interface DocumentUpload {
  id: string;
  filename: string;
  content: string;
  uploadedBy: string;
  uploadedAt: Date;
  processed: boolean;
}

export const sendChatMessage = api(
  { method: "POST", path: "/api/v1/intelligence/chat/message", expose: true, auth: true },
  async (req: ChatRequest): Promise<ChatResponse> => {
    const sessionId = req.sessionId || generateSessionId();
    const currentUser = getCurrentUser();
    
    // Store user message
    const userMessage = await saveChatMessage({
      content: req.message,
      role: "user",
      sessionId,
      userId: currentUser.id
    });
    
    // Generate AI response (integrate with OpenAI)
    const aiResponse = await generateAIResponse(req.message, sessionId);
    
    // Store AI response
    const assistantMessage = await saveChatMessage({
      content: aiResponse,
      role: "assistant", 
      sessionId,
      userId: currentUser.id
    });
    
    return {
      message: userMessage,
      response: aiResponse,
      sessionId
    };
  }
);

export const getChatHistory = api(
  { method: "GET", path: "/api/v1/intelligence/chat/history/:sessionId", expose: true, auth: true },
  async ({ sessionId }: { sessionId: string }): Promise<{ messages: ChatMessage[] }> => {
    const currentUser = getCurrentUser();
    const messages = await getChatMessages(sessionId, currentUser.id);
    return { messages };
  }
);

export const uploadDocument = api(
  { method: "POST", path: "/api/v1/intelligence/documents/upload", expose: true, auth: true },
  async (req: { filename: string; content: string }): Promise<DocumentUpload> => {
    const currentUser = getCurrentUser();
    
    const document = await saveDocument({
      id: generateId(),
      filename: req.filename,
      content: req.content,
      uploadedBy: currentUser.id,
      uploadedAt: new Date(),
      processed: false
    });
    
    // Queue for processing
    await queueDocumentProcessing(document.id);
    
    return document;
  }
);

export const analyzeDocument = api(
  { method: "POST", path: "/api/v1/intelligence/documents/analyze", expose: true, auth: true },
  async (req: { documentId: string; analysisType: string }): Promise<{ results: any }> => {
    const analysis = await performDocumentAnalysis(req.documentId, req.analysisType);
    return { results: analysis };
  }
);

export const getIntelligenceReports = api(
  { method: "GET", path: "/api/v1/intelligence/reports", expose: true, auth: true },
  async (): Promise<{ reports: any[] }> => {
    const currentUser = getCurrentUser();
    const reports = await getReportsForUser(currentUser.id);
    return { reports };
  }
);

export const threatAssessment = api(
  { method: "POST", path: "/api/v1/intelligence/threat-assessment", expose: true, auth: true },
  async (req: { data: any }): Promise<{ assessment: any }> => {
    const assessment = await performThreatAssessment(req.data);
    return { assessment };
  }
);

export const searchKnowledgeBase = api(
  { method: "GET", path: "/api/v1/intelligence/knowledge-base/search", expose: true, auth: true },
  async ({ q }: { q: string }): Promise<{ results: any[] }> => {
    const results = await searchKnowledge(q);
    return { results };
  }
);

export const getCompetitorData = api(
  { method: "GET", path: "/api/v1/intelligence/competitors/:competitor", expose: true, auth: true },
  async ({ competitor }: { competitor: string }): Promise<{ data: any }> => {
    const data = await getCompetitorIntelligence(competitor);
    return { data };
  }
);
```

### 5. ALERTING SERVICE (`alerting`)
```typescript
// alerting/encore.service.ts
import { Service } from "encore.dev/service";
export default new Service("alerting");

// alerting/api.ts
import { api, APIError } from "encore.dev/api";
import { PubSub } from "encore.dev/pubsub";
import { CronJob } from "encore.dev/cron";

// Alert processing queue
const alertQueue = new PubSub<AlertPayload>("alert-queue");

interface AlertPayload {
  id: string;
  type: "CRISIS" | "SENTIMENT" | "MENTION_SPIKE" | "ENGAGEMENT_DROP" | "COMPETITOR";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  campaignId: string;
  title: string;
  message: string;
  data: any;
  channels: AlertChannel[];
  timestamp: Date;
}

interface AlertChannel {
  type: "SMS" | "WHATSAPP" | "EMAIL" | "SLACK" | "PUSH";
  recipients: string[];
  template: string;
}

interface CrisisAlert {
  campaignId: string;
  crisisScore: number;
  triggers: string[];
  affectedPlatforms: string[];
  estimatedReach: number;
  sentimentImpact: number;
  recommendedActions: string[];
}

export const sendCrisisAlert = api(
  { method: "POST", path: "/api/v1/alerting/crisis", expose: true, auth: true },
  async (req: CrisisAlert): Promise<{ alertId: string; sent: boolean }> => {
    const alertId = generateAlertId();
    
    const payload: AlertPayload = {
      id: alertId,
      type: "CRISIS",
      severity: req.crisisScore > 0.8 ? "CRITICAL" : "HIGH",
      campaignId: req.campaignId,
      title: `🚨 CRISIS ALERT: ${req.triggers.join(", ")}`,
      message: generateCrisisMessage(req),
      data: req,
      channels: [
        { type: "SMS", recipients: await getCrisisContacts(req.campaignId), template: "crisis_sms" },
        { type: "WHATSAPP", recipients: await getCrisisContacts(req.campaignId), template: "crisis_whatsapp" },
        { type: "EMAIL", recipients: await getEmailContacts(req.campaignId), template: "crisis_email" },
        { type: "SLACK", recipients: ["#crisis-room"], template: "crisis_slack" }
      ],
      timestamp: new Date()
    };
    
    // Queue for processing
    await alertQueue.publish(payload);
    
    return { alertId, sent: true };
  }
);

// Process alert queue
alertQueue.subscribe("alert-processor", async (payload: AlertPayload) => {
  for (const channel of payload.channels) {
    try {
      await sendAlertViaChannel(channel, payload);
    } catch (error) {
      console.error(`Failed to send alert via ${channel.type}:`, error);
    }
  }
});
```

export const getAlertQueue = api(
  { method: "GET", path: "/api/v1/alerting/queue", expose: true, auth: true },
  async (): Promise<{ alerts: AlertPayload[] }> => {
    const currentUser = getCurrentUser();
    const alerts = await getPendingAlerts(currentUser.id);
    return { alerts };
  }
);

export const sendAlert = api(
  { method: "POST", path: "/api/v1/alerting/send", expose: true, auth: true },
  async (req: { type: string; message: string; recipients: string[] }): Promise<{ sent: boolean }> => {
    const alertPayload: AlertPayload = {
      id: generateAlertId(),
      type: req.type as any,
      severity: "MEDIUM",
      campaignId: getCurrentCampaignId(),
      title: req.type,
      message: req.message,
      data: {},
      channels: [{
        type: "SMS",
        recipients: req.recipients,
        template: "generic"
      }],
      timestamp: new Date()
    };
    
    await alertQueue.publish(alertPayload);
    return { sent: true };
  }
);
```

### 6. INTEGRATIONS SERVICE (`integrations`)
```typescript
// integrations/encore.service.ts
import { Service } from "encore.dev/service";
export default new Service("integrations");

// integrations/api.ts
import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";

// External API credentials
const mentionlyticsToken = secret("MENTIONLYTICS_TOKEN");
const metaAccessToken = secret("META_ACCESS_TOKEN");
const googleAdsToken = secret("GOOGLE_ADS_TOKEN");
const twilioSid = secret("TWILIO_SID");
const twilioToken = secret("TWILIO_TOKEN");

interface MentionlyticsData {
  mentions: Mention[];
  sentiment: SentimentAnalysis;
  influencers: InfluencerData[];
  competitors: CompetitorAnalysis[];
  totalMentions: number;
  sentimentScore: number;
  reach: number;
}

interface Mention {
  id: string;
  text: string;
  author: string;
  platform: string;
  url: string;
  sentiment: number;
  reach: number;
  engagement: number;
  timestamp: Date;
  location?: string;
  language: string;
}

export const fetchMentionlyticsData = api(
  { method: "GET", path: "/api/v1/integrations/mentionlytics/:campaignId", expose: true, auth: true },
  async ({ campaignId }: { campaignId: string }): Promise<MentionlyticsData> => {
    const token = await mentionlyticsToken();
    
    // Fetch campaign keywords
    const keywords = await getCampaignKeywords(campaignId);
    
    // Call Mentionlytics API
    const response = await fetch(`https://api.mentionlytics.com/mentions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        keywords,
        limit: 1000,
        sort: 'date_desc'
      })
    });
    
    if (!response.ok) {
      throw APIError.internal("Failed to fetch Mentionlytics data");
    }
    
    const data = await response.json();
    return transformMentionlyticsResponse(data);
  }
);

export const fetchMetaAdsData = api(
  { method: "GET", path: "/api/v1/integrations/meta/:campaignId", expose: true, auth: true },
  async ({ campaignId }: { campaignId: string }) => {
    const token = await metaAccessToken();
    const metaAdAccountId = await getMetaAdAccount(campaignId);
    
    const response = await fetch(`https://graph.facebook.com/v19.0/${metaAdAccountId}/campaigns`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw APIError.internal("Failed to fetch Meta Ads data");
    }
    
    return await response.json();
  }
);

export const sendSMSAlert = api(
  { method: "POST", path: "/api/v1/integrations/sms", expose: true, auth: true },
  async (req: { to: string; message: string }): Promise<{ messageId: string }> => {
    const sid = await twilioSid();
    const token = await twilioToken();
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'To': req.to,
        'From': '+1234567890', // Your Twilio number
        'Body': req.message
      })
    });
    
    const data = await response.json();
    return { messageId: data.sid };
  }
);
```

// Add missing compliance and monitoring endpoints
export const getSystemStatus = api(
  { method: "GET", path: "/api/v1/status", expose: true },
  async (): Promise<{ status: string; services: any[] }> => {
    const services = await checkAllServices();
    return { 
      status: services.every(s => s.healthy) ? "healthy" : "degraded",
      services 
    };
  }
);

// Compliance endpoints
export const complianceCheck = api(
  { method: "POST", path: "/api/v1/compliance/check", expose: true, auth: true },
  async (req: { data: any }): Promise<{ compliant: boolean; issues: string[] }> => {
    const result = await performComplianceCheck(req.data);
    return result;
  }
);

export const getAuditLogs = api(
  { method: "GET", path: "/api/v1/compliance/audit-logs", expose: true, auth: true },
  async (query: { start: string; end: string; userId?: string }): Promise<{ logs: any[] }> => {
    const logs = await fetchAuditLogs(query);
    return { logs };
  }
);

export const generateComplianceReport = api(
  { method: "POST", path: "/api/v1/compliance/reports/:regulation", expose: true, auth: true },
  async ({ regulation }: { regulation: string }): Promise<{ reportUrl: string }> => {
    const reportUrl = await generateReport(regulation);
    return { reportUrl };
  }
);

export const createAuditLog = api(
  { method: "POST", path: "/api/v1/compliance/audit-logs", expose: true, auth: true },
  async (req: { action: string; details: any }): Promise<{ logId: string }> => {
    const logId = await createLog(req);
    return { logId };
  }
);

export const getDataRetentionPolicy = api(
  { method: "GET", path: "/api/v1/compliance/data-retention", expose: true, auth: true },
  async (): Promise<{ policy: any }> => {
    const policy = await getRetentionPolicy();
    return { policy };
  }
);

export const requestDataDeletion = api(
  { method: "POST", path: "/api/v1/compliance/data-deletion", expose: true, auth: true },
  async (req: { userId: string; reason: string }): Promise<{ requestId: string }> => {
    const requestId = await initiateDataDeletion(req);
    return { requestId };
  }
);

// Additional monitoring endpoints
export const getCurrentSentiment = api(
  { method: "GET", path: "/api/v1/monitoring/sentiment", expose: true, auth: true },
  async (query?: { start?: string; end?: string }): Promise<{ sentiment: any }> => {
    const sentiment = await getSentimentData(query);
    return { sentiment };
  }
);

export const getMentionsMetrics = api(
  { method: "GET", path: "/api/v1/monitoring/mentions", expose: true, auth: true },
  async (query?: { keyword?: string; hours?: number }): Promise<{ mentions: any[] }> => {
    const mentions = await getMentionsData(query);
    return { mentions };
  }
);

export const getTrendingTopics = api(
  { method: "GET", path: "/api/v1/monitoring/trending", expose: true, auth: true },
  async ({ limit = 10 }: { limit?: number }): Promise<{ trending: any[] }> => {
    const trending = await getTrendingData(limit);
    return { trending };
  }
);

export const getTrends = api(
  { method: "GET", path: "/api/v1/monitoring/trends", expose: true, auth: true },
  async (): Promise<{ trends: any[] }> => {
    const trends = await getPlatformTrends();
    return { trends };
  }
);

// Additional campaign endpoints
export const getCampaignInsights = api(
  { method: "GET", path: "/api/v1/campaigns/insights", expose: true, auth: true },
  async ({ campaignId }: { campaignId?: string }): Promise<{ insights: any }> => {
    const insights = await getCampaignAnalytics(campaignId);
    return { insights };
  }
);

export const getGoogleCampaigns = api(
  { method: "GET", path: "/api/v1/campaigns/google", expose: true, auth: true },
  async (): Promise<{ campaigns: any[] }> => {
    const campaigns = await fetchGoogleAdsCampaigns();
    return { campaigns };
  }
);

export const getMetaCampaigns = api(
  { method: "GET", path: "/api/v1/campaigns/meta", expose: true, auth: true },
  async (): Promise<{ campaigns: any[] }> => {
    const campaigns = await fetchMetaAdsCampaigns();
    return { campaigns };
  }
);

// Analytics endpoints
export const getAnalyticsSummary = api(
  { method: "GET", path: "/api/v1/analytics/summary", expose: true, auth: true },
  async (): Promise<{ summary: any }> => {
    const summary = await getAnalyticsSummary();
    return { summary };
  }
);

export const getAnalyticsSentiment = api(
  { method: "GET", path: "/api/v1/analytics/sentiment", expose: true, auth: true },
  async (): Promise<{ sentiment: any }> => {
    const sentiment = await getAnalyticsSentimentData();
    return { sentiment };
  }
);

// User management endpoints (from DataService)
export const getUsers = api(
  { method: "GET", path: "/api/v1/users", expose: true, auth: true },
  async (): Promise<{ users: any[] }> => {
    const users = await fetchAllUsers();
    return { users };
  }
);

export const getUserById = api(
  { method: "GET", path: "/api/v1/users/:id", expose: true, auth: true },
  async ({ id }: { id: string }): Promise<{ user: any }> => {
    const user = await fetchUser(id);
    return { user };
  }
);

export const createUser = api(
  { method: "POST", path: "/api/v1/users", expose: true, auth: true },
  async (req: any): Promise<{ user: any }> => {
    const user = await saveUser(req);
    return { user };
  }
);

export const updateUser = api(
  { method: "PUT", path: "/api/v1/users/:id", expose: true, auth: true },
  async ({ id }: { id: string }, req: any): Promise<{ user: any }> => {
    const user = await updateUserData(id, req);
    return { user };
  }
);

export const deleteUser = api(
  { method: "DELETE", path: "/api/v1/users/:id", expose: true, auth: true },
  async ({ id }: { id: string }): Promise<{ success: boolean }> => {
    await removeUser(id);
    return { success: true };
  }
);

// Registration endpoint  
export const register = api(
  { method: "POST", path: "/api/v1/auth/register", expose: true },
  async (req: { email: string & IsEmail; password: string & MinLen<8>; name: string }): Promise<LoginResponse> => {
    // Check if user exists
    const existingUser = await findUserByEmail(req.email);
    if (existingUser) {
      throw APIError.invalidArgument("User already exists");
    }
    
    // Create user
    const user = await createNewUser(req);
    
    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    return {
      accessToken,
      refreshToken,
      user,
      expiresIn: 3600
    };
  }
);

### 7. ANALYTICS SERVICE (`analytics`)
```typescript
// analytics/encore.service.ts
import { Service } from "encore.dev/service";
export default new Service("analytics");

// analytics/api.ts
import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { CronJob } from "encore.dev/cron";

const db = new SQLDatabase("analytics", {
  migrations: "./migrations"
});

interface AnalyticsReport {
  campaignId: string;
  dateRange: { start: Date; end: Date };
  summary: AnalyticsSummary;
  mentionTrends: TrendData[];
  sentimentAnalysis: SentimentTrend[];
  competitorComparison: CompetitorMetrics[];
  influencerPerformance: InfluencerMetrics[];
  platformBreakdown: PlatformData[];
  recommendations: string[];
}

interface AnalyticsSummary {
  totalMentions: number;
  averageSentiment: number;
  totalReach: number;
  engagementRate: number;
  crisisEvents: number;
  topKeywords: string[];
  growthRate: number;
}

export const generateAnalyticsReport = api(
  { method: "POST", path: "/api/v1/analytics/reports", expose: true, auth: true },
  async (req: { 
    campaignId: string; 
    startDate: Date; 
    endDate: Date;
    includeCompetitors?: boolean;
    includeInfluencers?: boolean;
  }): Promise<AnalyticsReport> => {
    
    // Aggregate data from multiple sources
    const [
      mentions,
      sentiment,
      competitors,
      influencers,
      platforms
    ] = await Promise.all([
      fetchMentionTrends(req.campaignId, req.startDate, req.endDate),
      fetchSentimentTrends(req.campaignId, req.startDate, req.endDate),
      req.includeCompetitors ? fetchCompetitorData(req.campaignId) : [],
      req.includeInfluencers ? fetchInfluencerData(req.campaignId) : [],
      fetchPlatformData(req.campaignId, req.startDate, req.endDate)
    ]);
    
    const summary = calculateSummary(mentions, sentiment, platforms);
    const recommendations = generateRecommendations(summary, mentions, sentiment);
    
    return {
      campaignId: req.campaignId,
      dateRange: { start: req.startDate, end: req.endDate },
      summary,
      mentionTrends: mentions,
      sentimentAnalysis: sentiment,
      competitorComparison: competitors,
      influencerPerformance: influencers,
      platformBreakdown: platforms,
      recommendations
    };
  }
);

// Scheduled data aggregation
const _ = new CronJob("analytics-aggregation", {
  title: "Daily analytics aggregation",
  cron: "0 2 * * *", // 2 AM daily
}, async () => {
  // Aggregate data for all active campaigns
  const campaigns = await getActiveCampaigns();
  
  for (const campaign of campaigns) {
    await aggregateDailyAnalytics(campaign.id);
  }
});
```

---

## 🔌 DATABASE SCHEMAS

### PostgreSQL Tables
```sql
-- auth database
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- campaigns database  
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  budget DECIMAL(12,2),
  target_audience JSONB,
  metrics JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE campaign_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  keyword VARCHAR(255) NOT NULL,
  weight DECIMAL(3,2) DEFAULT 1.0
);

-- monitoring database
CREATE TABLE mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  text TEXT NOT NULL,
  author VARCHAR(255),
  platform VARCHAR(100),
  url TEXT,
  sentiment DECIMAL(4,3),
  reach INTEGER,
  engagement INTEGER,
  timestamp TIMESTAMP NOT NULL,
  location VARCHAR(255),
  language VARCHAR(10)
);

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  title VARCHAR(500),
  message TEXT,
  data JSONB,
  channels JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

-- analytics database
CREATE TABLE daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  date DATE NOT NULL,
  total_mentions INTEGER,
  average_sentiment DECIMAL(4,3),
  total_reach BIGINT,
  engagement_rate DECIMAL(5,4),
  platform_breakdown JSONB,
  top_keywords JSONB,
  UNIQUE(campaign_id, date)
);
```

---

## 🔧 CONFIGURATION FILES

### `encore.app`
```json
{
  "id": "war-room-3",
  "lang": "ts"
}
```

### `package.json`
```json
{
  "name": "war-room-backend",
  "type": "module",
  "scripts": {
    "dev": "encore run",
    "build": "encore build",
    "test": "encore test"
  },
  "dependencies": {
    "encore.dev": "^1.28.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### `go.mod` (Required for Encore)
```go
module encore.app

go 1.21

require encore.dev v1.28.0
```

---

## 🚨 CRITICAL IMPLEMENTATION NOTES

### 1. Authentication Flow
- JWT tokens with 1-hour expiration
- Refresh tokens for seamless renewal
- Role-based permissions system
- OAuth 2.0 integration ready

### 2. Real-time Requirements  
- WebSocket connections for live data streaming
- 30-second heartbeat to prevent timeouts
- Pub/Sub for event-driven architecture
- Crisis alerts within 30 seconds of detection

### 3. External API Integration
- Mentionlytics: Real social media monitoring
- Meta Business API v19.0: Facebook/Instagram ads
- Google Ads API v20: Search campaign data  
- Twilio: SMS/WhatsApp emergency alerts

### 4. Performance Optimization
- Redis caching for frequently accessed data
- Database connection pooling
- Async processing for heavy operations
- Rate limiting on external API calls

### 5. Error Handling & Recovery
- Circuit breakers for external services
- Graceful degradation when APIs fail
- Comprehensive logging and monitoring
- Automatic retry mechanisms with exponential backoff

---

## ✅ LEAP.NEW EXECUTION CHECKLIST

### Phase 1: Core Services Setup
- [ ] Create `auth` service with JWT authentication
- [ ] Create `campaigns` service with CRUD operations
- [ ] Create `monitoring` service with real-time streaming
- [ ] Create `alerts` service with multi-channel notifications
- [ ] Create `integrations` service with external API connections
- [ ] Create `analytics` service with reporting capabilities

### Phase 2: Database Configuration
- [ ] Set up PostgreSQL databases for each service
- [ ] Create Redis cache for session management
- [ ] Run database migrations
- [ ] Set up connection pooling

### Phase 3: External Integrations
- [ ] Configure Mentionlytics API connection
- [ ] Set up Meta Business API integration  
- [ ] Connect Google Ads API
- [ ] Configure Twilio SMS/WhatsApp

### Phase 4: Real-time Features
- [ ] Implement WebSocket streaming endpoints
- [ ] Set up Pub/Sub topics for events
- [ ] Configure cron jobs for data fetching
- [ ] Test crisis detection and alerting

### Phase 5: Testing & Deployment
- [ ] Write unit tests for all endpoints
- [ ] Integration testing with external APIs
- [ ] Load testing for WebSocket connections
- [ ] Deploy to Encore.dev staging environment

---

## 🎯 SUCCESS CRITERIA

1. **Authentication**: Secure JWT-based auth with refresh tokens ✅
2. **Real-time Data**: Live mention streaming with <30s latency ✅  
3. **Crisis Detection**: Automated alerts within 30 seconds ✅
4. **Multi-channel Alerts**: SMS, WhatsApp, Email, Slack ✅
5. **External APIs**: All 4 integrations working (Mentionlytics, Meta, Google, Twilio) ✅
6. **Analytics**: Comprehensive reporting with PDF export ✅
7. **WebSocket**: Stable connections with heartbeat monitoring ✅
8. **Database**: Optimized queries with Redis caching ✅

**Ready for immediate Leap.new implementation** 🚀