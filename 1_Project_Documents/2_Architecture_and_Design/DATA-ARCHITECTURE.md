# WAR ROOM DATA ARCHITECTURE
**Version**: 4.3  
**Date**: September 5, 2025  
**Status**: Ready for Operation V-Max 4.3 Implementation  
**Backend**: 12-Service Enterprise Architecture (70+ Endpoints)

---

## 🎯 ENTERPRISE DATA ARCHITECTURE OVERVIEW

### **Data Philosophy**
War Room 4.3 implements a **hybrid data architecture** with backend-controlled MOCK/LIVE switching, enabling seamless development and production operation across all 12 services.

### **Core Principles**
- **Backend-Controlled Data Mode**: All services respect global MOCK/LIVE state
- **Real-time Intelligence**: Sub-200ms response times for all data operations
- **Multi-Source Integration**: Mentionlytics + Meta + Google + AI Analysis
- **Vector Intelligence**: Document processing with AI-powered search
- **Crisis Detection**: Automated alert triggers based on data patterns

---

## 1. INFORMATION ROUTER - 12 DATA DOMAINS

### 1.1 Enterprise Data Types
```typescript
export enum DataDomain {
  // Core Intelligence
  AUTHENTICATION_DATA = 'auth_data',           // Users, sessions, permissions
  REAL_TIME_MENTIONS = 'real_time_mentions',   // Live social monitoring
  INTELLIGENCE_ANALYSIS = 'intel_analysis',    // AI-powered insights
  
  // Campaign Management  
  META_CAMPAIGNS = 'meta_campaigns',           // Facebook/Instagram data
  GOOGLE_ADS_DATA = 'google_ads_data',        // Search campaign metrics
  CAMPAIGN_PERFORMANCE = 'campaign_performance', // Cross-platform analytics
  
  // Enterprise Features
  CRISIS_EVENTS = 'crisis_events',            // Alert triggers and responses
  DOCUMENT_VECTORS = 'document_vectors',       // PDF processing and search
  SYSTEM_REPORTS = 'system_reports',          // Automated reporting data
  PERFORMANCE_METRICS = 'performance_metrics', // System and user analytics
  
  // Administration
  ADMIN_OPERATIONS = 'admin_operations',       // User management, system config
  AUDIT_TRAIL = 'audit_trail'                 // Security and compliance logs
}
```

### 1.2 Data Flow Matrix (4.3 Architecture)

| Data Domain | Primary Service | Endpoints | Update Frequency | Priority |
|-------------|----------------|-----------|------------------|----------|
| AUTHENTICATION_DATA | Authentication (19) | /api/v1/auth/* | Real-time | CRITICAL |
| REAL_TIME_MENTIONS | Mentionlytics (7) | /api/v1/mentionlytics/* | Real-time | HIGH |
| INTELLIGENCE_ANALYSIS | Intelligence Hub (2) | /api/v1/intelligence/* | 5 min | HIGH |
| META_CAMPAIGNS | Meta Integration | /api/v1/meta/* | 15 min | MEDIUM |
| GOOGLE_ADS_DATA | Google Ads | /api/v1/google-ads/* | 15 min | MEDIUM |
| CAMPAIGN_PERFORMANCE | Campaign Mgmt (8) | /api/v1/campaigns/* | 1 min | HIGH |
| CRISIS_EVENTS | Alert Center (5) | /api/v1/alerts/* | Instant | CRITICAL |
| DOCUMENT_VECTORS | Document Intel (6) | /api/v1/documents/* | On-demand | MEDIUM |
| SYSTEM_REPORTS | Report Gen (4) | /api/v1/reports/* | Daily/On-demand | LOW |
| PERFORMANCE_METRICS | Performance (3) | /api/v1/metrics/* | 1 min | MEDIUM |
| ADMIN_OPERATIONS | Admin Service (8) | /api/v1/admin/* | Real-time | HIGH |
| AUDIT_TRAIL | All Services | /api/v1/audit/* | Real-time | MEDIUM |

---

## 2. DATA SOURCES & INTEGRATIONS

### 2.1 External API Integrations (4.3 Backend)
```javascript
const externalSources = {
  mentionlytics: {
    endpoint: 'https://app.mentionlytics.com/api/',
    encoreEndpoints: '/api/v1/mentionlytics/*',
    tokenSecret: 'MENTIONLYTICS_API_TOKEN',
    dataTypes: ['mentions', 'sentiment', 'geo', 'influencers', 'trending'],
    rateLimit: '100/min',
    cacheTTL: '5 min'
  },
  
  metaBusiness: {
    endpoint: 'https://graph.facebook.com/v19.0/',
    encoreEndpoints: '/api/v1/meta/*',
    tokenSecret: 'META_ACCESS_TOKEN',
    dataTypes: ['campaigns', 'adsets', 'insights'],
    rateLimit: '200 calls/hour',
    cacheTTL: '1 hour'
  },
  
  googleAds: {
    endpoint: 'https://googleads.googleapis.com/v20/',
    encoreEndpoints: '/api/v1/google-ads/*',
    tokenSecret: 'GOOGLE_ADS_DEVELOPER_TOKEN',
    dataTypes: ['campaigns', 'performance', 'insights'],
    authentication: 'OAuth2 + PKCE',
    cacheTTL: '15 min'
  },
  
  openAI: {
    endpoint: 'https://api.openai.com/v1/',
    encoreEndpoints: '/api/v1/intelligence/*',
    tokenSecret: 'OPENAI_API_KEY',
    dataTypes: ['analysis', 'embeddings', 'completion'],
    models: ['gpt-4', 'text-embedding-ada-002']
  }
};
```

### 2.2 Internal Data Sources
```javascript
const internalSources = {
  userGenerated: {
    documents: 'PDF uploads via /api/v1/documents/upload',
    customReports: 'Report builder via /api/v1/reports/create',
    systemSettings: 'Configuration via /api/v1/settings/*'
  },
  
  systemGenerated: {
    auditLogs: 'All service operations logged',
    performanceMetrics: 'Real-time system monitoring',
    crisisEvents: 'Automated detection and alerting'
  }
};
```

---

## 3. DATABASE ARCHITECTURE (PostgreSQL + Redis)

### 3.1 PostgreSQL Schema (Primary Storage)
```sql
-- Core Authentication & Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crisis Events & Intelligence
CREATE TABLE crisis_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    severity INTEGER CHECK (severity >= 1 AND severity <= 10),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_by UUID REFERENCES users(id)
);

-- Mentions & Social Data
CREATE TABLE mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    sentiment_score DECIMAL(3,2),
    location JSONB,
    influencer_data JSONB,
    crisis_event_id UUID REFERENCES crisis_events(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Campaign Performance Data  
CREATE TABLE campaign_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL, -- 'meta', 'google', 'mentionlytics'
    campaign_id VARCHAR(255) NOT NULL,
    metrics JSONB NOT NULL,
    date_recorded DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Intelligence
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    ai_summary TEXT,
    vector_embeddings VECTOR(1536), -- OpenAI embedding dimension
    processed_at TIMESTAMP WITH TIME ZONE,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_type VARCHAR(100) NOT NULL,
    generated_data JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_by UUID REFERENCES users(id)
);

-- Performance Metrics
CREATE TABLE performance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL,
    endpoint VARCHAR(200) NOT NULL,
    response_time_ms INTEGER,
    status_code INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);
```

### 3.2 Redis Caching Strategy
```javascript
const redisStrategy = {
  // API Response Caching
  mentionlytics: { ttl: 300 }, // 5 minutes
  metaInsights: { ttl: 3600 }, // 1 hour  
  googleAds: { ttl: 900 },     // 15 minutes
  
  // Session Management
  userSessions: { ttl: 900 },  // 15 minutes (JWT refresh)
  refreshTokens: { ttl: 604800 }, // 7 days
  
  // Real-time Data
  dashboardKPIs: { ttl: 60 }, // 1 minute
  crisisAlerts: { ttl: 30 },  // 30 seconds
  
  // System State
  dataMode: { persist: true }, // MOCK/LIVE toggle state
  systemHealth: { ttl: 30 }   // 30 seconds
};
```

---

## 4. REAL-TIME DATA ARCHITECTURE

### 4.1 WebSocket Implementation
```typescript
interface WebSocketEvents {
  // Crisis Management
  'crisis:detected': CrisisEvent;
  'crisis:resolved': { id: string; resolvedAt: Date };
  
  // Live Dashboard Updates  
  'dashboard:kpi-update': KPIMetrics;
  'dashboard:mention-stream': Mention[];
  
  // System Events
  'system:health-change': HealthStatus;
  'system:data-mode-change': 'MOCK' | 'LIVE';
  
  // User Events
  'user:login': { userId: string; timestamp: Date };
  'user:logout': { userId: string; timestamp: Date };
}
```

### 4.2 Background Job Architecture
```typescript
// Crisis Detection (Every 5 minutes)
cron("*/5 * * * *", async () => {
  const recentMentions = await mentionlyticsService.getRecent();
  const crisisEvents = await intelligenceHub.detectCrisis(recentMentions);
  
  if (crisisEvents.length > 0) {
    await Promise.all([
      alertCenter.triggerAlerts(crisisEvents),
      websocketService.broadcast('crisis:detected', crisisEvents),
      auditService.log('crisis_detected', crisisEvents)
    ]);
  }
});

// Performance Metrics (Every minute)
cron("* * * * *", async () => {
  const metrics = await performanceService.collectMetrics();
  await Promise.all([
    redisClient.setex('dashboard:kpi', 60, JSON.stringify(metrics)),
    websocketService.broadcast('dashboard:kpi-update', metrics)
  ]);
});

// Daily Intelligence Reports (6 AM)
cron("0 6 * * *", async () => {
  const dailyIntel = await intelligenceHub.generateDailyReport();
  await reportService.store(dailyIntel);
  await alertCenter.sendDailyBrief(dailyIntel);
});
```

---

## 5. DATA SECURITY & COMPLIANCE

### 5.1 Security Architecture
```typescript
interface SecurityLayers {
  authentication: {
    accessTokens: '15 minutes expiry',
    refreshTokens: '7 days expiry, hashed storage',
    passwordHashing: 'bcrypt, 12 salt rounds'
  },
  
  authorization: {
    roleBasedAccess: 'admin | manager | user | readonly',
    endpointProtection: 'JWT middleware on all /api/v1/* routes',
    adminEndpoints: 'admin role required for /api/v1/admin/*'
  },
  
  dataProtection: {
    secretsManagement: 'Encore secret() functions only',
    inputValidation: 'Joi schema validation on all inputs',
    outputSanitization: 'No sensitive data in responses'
  }
}
```

### 5.2 Audit Trail Implementation
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit all sensitive operations
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (action, resource_type, resource_id, details)
    VALUES (TG_OP, TG_TABLE_NAME, COALESCE(NEW.id, OLD.id), 
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

---

## 6. MOCK/LIVE DATA STRATEGY

### 6.1 Backend-Controlled Data Mode
```typescript
// Global data mode state (stored in Redis)
class DataModeService {
  async getDataMode(): Promise<'MOCK' | 'LIVE'> {
    const mode = await redis.get('system:data_mode');
    return mode as 'MOCK' | 'LIVE' || 'MOCK';
  }
  
  async setDataMode(mode: 'MOCK' | 'LIVE', userId: string) {
    await redis.set('system:data_mode', mode);
    await auditService.log('data_mode_change', { mode, userId });
    await websocketService.broadcast('system:data-mode-change', mode);
  }
}

// Service-level implementation
class MentionlyticsService {
  async getMentions(): Promise<Mention[]> {
    const dataMode = await dataModeService.getDataMode();
    
    if (dataMode === 'MOCK') {
      return this.generateMockMentions();
    }
    
    return this.fetchLiveMentions();
  }
}
```

### 6.2 Health Endpoint Data Mode Reporting
```typescript
// Health endpoint MUST return current data mode
export const health = api({
  method: "GET", path: "/api/v1/health"
}, async (): Promise<HealthResponse> => {
  return {
    status: "ok",
    data_mode: await dataModeService.getDataMode(),
    timestamp: new Date().toISOString(),
    services: await this.checkAllServices()
  };
});
```

---

## 7. PERFORMANCE OPTIMIZATION

### 7.1 Database Indexing Strategy
```sql
-- Time-series performance
CREATE INDEX idx_mentions_created_at ON mentions (created_at DESC);
CREATE INDEX idx_campaign_data_date ON campaign_data (date_recorded DESC);
CREATE INDEX idx_performance_logs_timestamp ON performance_logs (timestamp DESC);

-- Search optimization
CREATE INDEX idx_mentions_content_search ON mentions USING GIN (to_tsvector('english', content));
CREATE INDEX idx_documents_vector_search ON documents USING ivfflat (vector_embeddings vector_cosine_ops);

-- Foreign key performance
CREATE INDEX idx_mentions_crisis_event ON mentions (crisis_event_id);
CREATE INDEX idx_crisis_events_user ON crisis_events (created_by);

-- JSONB queries
CREATE INDEX idx_mentions_metadata ON mentions USING GIN (metadata);
CREATE INDEX idx_campaign_metrics ON campaign_data USING GIN (metrics);
```

### 7.2 Query Optimization Patterns
```sql
-- Dashboard KPIs (optimized for speed)
SELECT 
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as mentions_24h,
  AVG(sentiment_score) as avg_sentiment,
  COUNT(DISTINCT crisis_event_id) FILTER (WHERE crisis_event_id IS NOT NULL) as active_crises
FROM mentions 
WHERE created_at >= NOW() - INTERVAL '7 days';

-- Real-time crisis detection
SELECT * FROM mentions 
WHERE sentiment_score < -0.8 
  AND created_at >= NOW() - INTERVAL '15 minutes'
  AND crisis_event_id IS NULL
ORDER BY created_at DESC;
```

---

## 8. DATA INTEGRATION POINTS

### 8.1 Frontend Integration
```javascript
// Environment configuration
const API_CONFIG = {
  baseURL: process.env.VITE_ENCORE_API_URL, // https://4-3-war-room-backend-[id].lp.dev
  dataMode: 'controlled by backend', // No frontend override
  realtime: {
    websocket: true,
    heartbeat: 30000 // 30 seconds
  }
};
```

### 8.2 External System Integration
```javascript
const integrationEndpoints = {
  // Data export capabilities
  exportToCSV: 'POST /api/v1/reports/export/csv',
  exportToPDF: 'POST /api/v1/reports/export/pdf',
  exportToJSON: 'POST /api/v1/reports/export/json',
  
  // Webhook capabilities  
  incomingWebhooks: 'POST /api/v1/webhooks/[service]',
  outgoingWebhooks: 'Configurable via admin panel',
  
  // API access for external tools
  apiKeys: 'Generated via /api/v1/admin/api-keys',
  rateLimiting: '1000 requests/hour per API key'
};
```

---

**This data architecture supports the complete War Room 4.3 enterprise platform with 12 services, 70+ endpoints, and enterprise-grade performance, security, and scalability.**

**Last Updated**: September 5, 2025  
**Ready for**: Operation V-Max 4.3 Implementation