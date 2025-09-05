# WAR ROOM FUNCTIONAL SPECIFICATION DOCUMENT (FSD)
**Version**: 2.0  
**Date**: September 2, 2025  
**Status**: Active Development - 4.0 Backend Integration  

## 1. SYSTEM ARCHITECTURE

### 1.1 High-Level Architecture
```
┌─────────────────────────────────────────────────────┐
│              FRONTEND (3.0 UI - React)               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Dashboard  │  │    SWOT     │  │   Alerts    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────┬───────────────────────────┘
                          │ HTTPS/WebSocket
┌─────────────────────────┴───────────────────────────┐
│         4.0 BACKEND (Encore on Leap.new)            │
│  ┌──────────────────────────────────────────────┐  │
│  │     INFORMATION ROUTER (8 Data Types)        │  │
│  └──────────────────────────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐   │
│  │   Auth      │  │Mentionlytics│  │Monitoring│   │
│  │  (Missing)  │  │  (Missing)  │  │ Service  │   │
│  └─────────────┘  └─────────────┘  └──────────┘   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐   │
│  │ Campaigns   │  │Intelligence │  │  Alerts  │   │
│  └─────────────┘  └─────────────┘  └──────────┘   │
└──────────────────────────────────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────┐
│              EXTERNAL SERVICES                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │Mentionlytics│  │   Twilio    │  │   OpenAI   │ │
│  │     API     │  │  SMS/WA     │  │   GPT-4    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└──────────────────────────────────────────────────────┘
```

### 1.2 Technology Stack

#### Frontend
- **Framework**: React 18.2.0 + TypeScript 5.0
- **Build Tool**: Vite 4.5.0
- **State Management**: Redux Toolkit 1.9.5
- **UI Framework**: Tailwind CSS 3.3.0
- **Animation**: Framer Motion 10.16.4
- **Charts**: Recharts 2.8.0
- **Maps**: React Simple Maps 3.0.0
- **WebSocket**: Native WebSocket API
- **HTTP Client**: Axios 1.6.2

#### Backend (4.0 on Encore)
- **Platform**: Encore via Leap.new (TypeScript)
- **Deployment**: Single domain on Encore only
- **Database**: PostgreSQL (Encore managed)
- **Cache**: Encore managed caching
- **Queue**: Encore's built-in queue system
- **Vector DB**: pgvector extension
- **Secrets**: Encore Infrastructure panel (NEVER hardcoded)

#### External Services
- **Social Monitoring**: Mentionlytics API
- **Communications**: Twilio (SMS/WhatsApp)
- **AI/ML**: OpenAI GPT-3.5/4
- **Analytics**: PostHog
- **Auth**: Supabase/JWT

### 1.3 Component Architecture

#### Core Components (62 Total)
```typescript
// Dashboard Components
├── Dashboard.tsx
├── SimpleDashboard.tsx
├── MainDashboard.tsx
├── CommandCenter.tsx
├── PhraseCloud.tsx
├── SentimentGauge.tsx
├── CompetitorAnalysis.tsx
├── LiveIntelligence.tsx

// Mentionlytics Components (15)
├── ShareOfVoiceChart.tsx
├── SentimentPieChart.tsx
├── RiskQualityIndicators.tsx
├── PlatformDominanceGrid.tsx
├── MomentumIndicators.tsx
├── InfluencerPowerMatrix.tsx
├── EmotionPieChart.tsx
├── DualPieCharts.tsx
├── CampaignSetupModal.tsx
├── CampaignMomentum.tsx

// Political Components
├── SWOTRadar.tsx
├── InteractivePoliticalMap.tsx
├── MentionlyticsPoliticalMap.tsx

// Alert & Monitoring
├── AlertCenter.tsx
├── NotificationSystem.tsx
├── CrisisDetector.tsx

// Communication
├── FloatingChatBar.tsx
├── TickerTape.tsx
```

## 2. DATA FLOW SPECIFICATION

### 2.1 Information Router - 8 Data Types

```typescript
enum DataType {
  GENERAL_NEWS = 'general_news',
  KEYWORD_MENTIONS = 'keyword_mentions',
  ACCOUNT_METRICS = 'account_metrics',
  CRISIS_ALERTS = 'crisis_alerts',
  STRATEGIC_INTEL = 'strategic_intel',
  DOCUMENT_VECTORS = 'document_vectors',
  AUDIT_LOG = 'audit_log',
  INFLUENCER_INSIGHTS = 'influencer_insights'
}

interface RoutingTable {
  [DataType.GENERAL_NEWS]: ['TickerTape'],
  [DataType.KEYWORD_MENTIONS]: ['PhraseCloud', 'TickerTape', 'SWOTRadar'],
  [DataType.ACCOUNT_METRICS]: ['DashboardKPIs', 'PerformanceMetrics'],
  [DataType.CRISIS_ALERTS]: ['AlertCenter', 'SMS', 'WhatsApp', 'SWOTRadar'],
  [DataType.STRATEGIC_INTEL]: ['SWOTRadar', 'IntelligenceFeed', 'TickerTape'],
  [DataType.DOCUMENT_VECTORS]: ['VectorDB', 'ChatInterface', 'DocumentViewer'],
  [DataType.AUDIT_LOG]: ['ComplianceDB', 'AdminPanel', 'SecurityMonitor'],
  [DataType.INFLUENCER_INSIGHTS]: ['InfluencerPowerMatrix', 'Dashboard']
}
```

### 2.2 Real-Time Communication

#### WebSocket Protocol
```typescript
interface WebSocketMessage {
  type: DataType;
  payload: any;
  timestamp: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metadata: {
    source: string;
    reliability: number;
    ttl?: number;
  };
}

// Heartbeat every 30 seconds
setInterval(() => {
  ws.send(JSON.stringify({ type: 'HEARTBEAT' }));
}, 30000);

// Reconnection with exponential backoff
let reconnectDelay = 1000;
const maxDelay = 30000;

function reconnect() {
  setTimeout(() => {
    connect();
    reconnectDelay = Math.min(reconnectDelay * 2, maxDelay);
  }, reconnectDelay);
}
```

#### Server-Sent Events (SSE)
```typescript
// Ticker Tape updates
const eventSource = new EventSource('/api/sse/ticker');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateTickerTape(data);
};
```

## 3. API ENDPOINTS

### 3.1 RESTful API Structure

#### Authentication
```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
GET    /api/v1/auth/profile
PUT    /api/v1/auth/profile
POST   /api/v1/auth/logout
```

#### Campaign Management
```
GET    /api/v1/campaigns
POST   /api/v1/campaigns
GET    /api/v1/campaigns/:id
PUT    /api/v1/campaigns/:id
DELETE /api/v1/campaigns/:id
POST   /api/v1/campaigns/:id/setup
```

#### Mentionlytics Integration
```
GET    /api/v1/mentionlytics/sentiment?period=7days
GET    /api/v1/mentionlytics/geo
GET    /api/v1/mentionlytics/mentions?limit=50&page_no=0
GET    /api/v1/mentionlytics/influencers
GET    /api/v1/mentionlytics/share-of-voice
GET    /api/v1/mentionlytics/trends
POST   /api/v1/mentionlytics/webhook
```

#### Crisis Management
```
GET    /api/v1/alerts
POST   /api/v1/alerts
PUT    /api/v1/alerts/:id/acknowledge
POST   /api/v1/alerts/:id/escalate
GET    /api/v1/crisis/status
POST   /api/v1/crisis/trigger
```

#### Communications
```
POST   /api/v1/notifications/sms
POST   /api/v1/notifications/whatsapp
GET    /api/v1/notifications/preferences
PUT    /api/v1/notifications/preferences
GET    /api/v1/notifications/history
```

#### Reports & Export
```
POST   /api/v1/reports/generate
GET    /api/v1/reports/:id/download
GET    /api/v1/reports/templates
POST   /api/v1/export/pdf
POST   /api/v1/export/csv
```

### 3.2 Rate Limiting

```typescript
const rateLimits = {
  '/api/v1/auth/*': '5 requests per 15 minutes',
  '/api/v1/mentionlytics/*': '100 requests per minute',
  '/api/v1/notifications/sms': '10 messages per hour',
  '/api/v1/notifications/whatsapp': '100 messages per day',
  '/api/v1/reports/generate': '5 requests per minute',
  '/api/v1/export/*': '10 requests per minute'
};
```

## 4. DATABASE SCHEMA

### 4.1 Core Tables

```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  candidate_name VARCHAR(255),
  party VARCHAR(50),
  keywords TEXT[],
  opponents JSONB,
  setup_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  type VARCHAR(50) NOT NULL,
  priority VARCHAR(20) NOT NULL,
  title VARCHAR(255),
  content TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  acknowledged_at TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Audit Log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  resource VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  result VARCHAR(20),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vector Storage for Documents
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  title VARCHAR(255),
  content TEXT,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 5. SECURITY SPECIFICATION

### 5.1 Authentication Flow

```typescript
// JWT Token Structure
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  campaignId?: string;
  exp: number;
  iat: number;
}

// Refresh Token Rotation
const refreshToken = async (oldToken: string) => {
  // Validate old token
  // Generate new access token (15 min)
  // Generate new refresh token (7 days)
  // Invalidate old refresh token
  // Return new token pair
};
```

### 5.2 API Security

- **CORS**: Whitelist specific domains
- **HTTPS**: TLS 1.3 minimum
- **Headers**: Security headers (CSP, HSTS, X-Frame-Options)
- **Input Validation**: Joi/Yup schemas
- **SQL Injection**: Parameterized queries only
- **XSS Prevention**: React default escaping + DOMPurify

## 6. PERFORMANCE REQUIREMENTS

### 6.1 Response Time Targets

| Operation | Target | Maximum |
|-----------|--------|----------|
| Page Load | < 1s | 3s |
| API Response | < 200ms | 1s |
| WebSocket Message | < 50ms | 200ms |
| PDF Generation | < 5s | 30s |
| SMS Delivery | < 5s | 15s |
| Search Results | < 500ms | 2s |

### 6.2 Scalability Targets

- **Concurrent Users**: 10,000
- **Messages/Second**: 1,000
- **Storage**: 1TB documents
- **Uptime**: 99.9%

## 7. MONITORING & OBSERVABILITY

### 7.1 Metrics Collection

```typescript
interface Metrics {
  // Performance
  responseTime: Histogram;
  throughput: Counter;
  errorRate: Gauge;
  
  // Business
  activeUsers: Gauge;
  alertsTriggered: Counter;
  messagesProcessed: Counter;
  
  // System
  cpuUsage: Gauge;
  memoryUsage: Gauge;
  databaseConnections: Gauge;
}
```

### 7.2 Logging Strategy

- **Application Logs**: Winston/Pino
- **Access Logs**: Morgan
- **Error Tracking**: Sentry
- **Analytics**: PostHog
- **APM**: DataDog/New Relic

## 8. DEPLOYMENT SPECIFICATION

### 8.1 Environments

| Environment | URL | Purpose |
|-------------|-----|----------|
| Development | localhost:5174 | Local development |
| Staging | staging.warroom.app | Testing & QA |
| Production | app.warroom.app | Live system |

### 8.2 CI/CD Pipeline

```yaml
# GitHub Actions Workflow
steps:
  - lint
  - test (unit, integration)
  - build
  - security scan
  - deploy to staging
  - smoke tests
  - deploy to production (manual approval)
  - health check
```

## 9. DISASTER RECOVERY

### 9.1 Backup Strategy

- **Database**: Daily snapshots, 30-day retention
- **Documents**: S3 with versioning
- **Configuration**: Git repository
- **Secrets**: Encrypted backup in separate region

### 9.2 Recovery Targets

- **RTO (Recovery Time Objective)**: 4 hours
- **RPO (Recovery Point Objective)**: 1 hour

This FSD serves as the technical blueprint for War Room implementation and maintenance.