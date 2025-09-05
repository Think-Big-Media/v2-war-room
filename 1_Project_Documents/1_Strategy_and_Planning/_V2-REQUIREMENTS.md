# V2 WAR ROOM REQUIREMENTS
**Status**: ACTIVE DEVELOPMENT - 4.0 Backend Integration  
**Approach**: Bridge 3.0 UI with 4.0 Backend on Encore  
**Date**: September 2, 2025 - Updated  
**Platform**: Encore via Leap.new (Backend Only)  
**Frontend**: 3.0 UI connecting to 4.0 Backend

---

## 🎯 PROJECT MISSION

Create a comprehensive political campaign intelligence platform that provides:
- **Real-time Social Media Monitoring** with sentiment analysis and crisis detection
- **Campaign Management** across Meta Business and Google Ads platforms
- **Intelligence Hub** with AI-powered insights and analytics
- **Alert System** with SMS/WhatsApp notifications for critical events
- **Professional Dashboard** with KPIs, performance metrics, and competitor analysis

---

## 🏗️ ARCHITECTURE REQUIREMENTS

### Core Technology Stack
- **Backend (4.0)**: Encore TypeScript on Leap.new
- **Frontend (3.0)**: React 18 + TypeScript + Vite + TailwindCSS (existing)
- **Authentication**: JWT (needs implementation in 4.0)
- **Real-time**: WebSocket with 30-second heartbeat (implemented in 4.0)
- **State Management**: Redux Toolkit (3.0 UI ready)
- **External APIs**: Mentionlytics (needs connection), Twilio, OpenAI
- **Deployment**: Encore only (no separate frontend hosting)
- **Secrets**: Encore Infrastructure panel (NEVER hardcoded)

### System Architecture Principles
- **Platform Consolidation**: All components hosted on Leap.new
- **API-First Design**: Complete REST API with TypeScript interfaces
- **Real-time Capabilities**: WebSocket connections with automatic reconnection
- **Mock/Live Toggle**: Development-friendly with production fallbacks
- **Enterprise Security**: OAuth 2.0, JWT refresh, role-based permissions

---

## 📋 DETAILED FEATURE REQUIREMENTS

### 1. AUTHENTICATION SYSTEM
**Status**: Specification Complete - Ready for Implementation

#### Core Features:
- **OAuth 2.0 Integration**: Meta Business + Google Ads connections
- **JWT Authentication**: Access tokens (15min) + refresh tokens (7 days)
- **User Management**: Registration, profile management, role-based access
- **Session Management**: Multi-device sessions with revocation capability
- **Security Features**: 2FA support, password reset, email verification

#### API Endpoints (19 total):
```typescript
// Authentication endpoints
POST /auth/login              // Email/password login
POST /auth/register           // New user registration
POST /auth/oauth/google       // Google OAuth callback
POST /auth/oauth/meta         // Meta Business OAuth callback
POST /auth/refresh            // JWT refresh token rotation
GET  /auth/profile           // User profile data
POST /auth/logout            // Secure logout
// ... (12 additional endpoints)
```

#### Data Models:
```typescript
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin' | 'platform_admin';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### 2. DASHBOARD SERVICE
**Status**: Specification Complete - Frontend Analysis Done

#### Core Features:
- **KPI Summary**: Sentiment, mention volume, share of voice, crisis risk
- **Live Intelligence**: Real-time social media feed with engagement metrics
- **Competitor Analysis**: Share of voice tracking with competitor insights
- **Campaign Performance**: Unified Meta + Google Ads performance metrics
- **SWOT Analysis**: Strengths, weaknesses, opportunities, threats tracking

#### API Endpoints (3 total):
```typescript
GET /api/dashboard/summary           // Main dashboard KPIs
GET /api/dashboard/competitors       // Competitor analysis data  
GET /api/dashboard/campaignPerformance // Unified campaign metrics
```

#### Key Data Structures:
```typescript
interface DashboardSummary {
  sentiment: { positive: number; negative: number; neutral: number; trendPct: number };
  mentionVolume: { total24h: number; deltaPct: number };
  shareOfVoice: { pct: number; leadingCompetitor: string; reach: number };
  crisis: { level: "LOW"|"MEDIUM"|"HIGH"; activeThreats: number };
  liveIntelligence: LivePost[];
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
}
```

### 3. REAL-TIME MONITORING SYSTEM
**Status**: Architecture Defined - WebSocket Specifications Complete

#### Core Features:
- **Live Mentions Stream**: Real-time social media posts with sentiment analysis
- **Crisis Detection**: Automated threat level assessment with alert triggers
- **Trending Topics**: Dynamic topic tracking with geographic distribution
- **Platform Performance**: Twitter, Facebook, Reddit, News source monitoring
- **30-Second Heartbeat**: Reliable connection maintenance with auto-reconnection

#### WebSocket Implementation:
```typescript
// Connection: wss://backend.leap.new/api/monitoring/stream
// Authentication: JWT token in connection headers
// Heartbeat: 30-second interval PING/PONG
// Message Types: HEARTBEAT, live_post, trend_update, crisis_alert
```

#### Real-time Data Models:
```typescript
interface LivePost {
  author: string;
  timestamp: string;
  reach: number;
  text: string;
  sentiment: "POSITIVE"|"NEGATIVE"|"NEUTRAL";
  likes: number;
  shares: number;
  comments: number;
}
```

### 4. CAMPAIGN MANAGEMENT SYSTEM
**Status**: External API Integration Mapped

#### Core Features:
- **Meta Business Integration**: Campaign CRUD, audience management, performance tracking
- **Google Ads Integration**: Campaign optimization, keyword management, conversion tracking
- **Unified Dashboard**: Cross-platform performance comparison and insights
- **AI Recommendations**: Automated optimization suggestions based on performance data
- **Budget Management**: Real-time spend tracking with automated alerts

#### API Endpoints (8 total):
```typescript
GET  /api/campaigns                    // List all campaigns
POST /api/campaigns                    // Create new campaign
GET  /api/campaigns/:id               // Campaign details
PUT  /api/campaigns/:id               // Update campaign
POST /api/campaigns/:id/actions       // Pause/resume/budget actions
GET  /api/campaigns/recommendations   // AI-powered recommendations
GET  /api/campaigns/performance       // Unified performance data
GET  /api/campaigns/meta             // Meta-specific campaigns
```

#### External API Requirements:
- **Meta Business API v19.0**: OAuth scope (ads_management, business_management)
- **Google Ads API v20**: OAuth scope (adwords), conversion tracking setup
- **Rate Limiting**: Respect API limits with retry logic and caching
- **Error Handling**: Graceful fallbacks when APIs are unavailable

### 5. INTELLIGENCE HUB
**Status**: Analytics Framework Defined

#### Core Features:
- **Saved Queries**: Persistent search and analysis configurations
- **Geographic Analytics**: Regional mention distribution and performance
- **Influencer Tracking**: Key opinion leader identification and reach analysis
- **Sentiment Analytics**: Historical sentiment trends with breakdown analysis
- **Custom Reports**: Automated report generation with scheduling

#### API Endpoints (2 total):
```typescript
GET /api/intelligence/queries     // Saved query management
GET /api/intelligence/analytics   // Analytics and insights data
```

### 6. ALERT CENTER & NOTIFICATIONS
**Status**: Notification System Specified

#### Core Features:
- **Multi-Channel Alerts**: SMS, WhatsApp, Email notifications
- **Crisis Escalation**: Automated alert escalation based on severity levels
- **Alert Categories**: Political news, team alerts, system notifications
- **Notification Preferences**: User-configurable alert thresholds and delivery methods
- **Delivery Tracking**: Confirmation and delivery status monitoring

#### API Endpoints (5 total):
```typescript
GET  /api/alerts                      // List alerts with filtering
POST /api/alerts/:id/actions         // Mark as read/dismissed
POST /api/notifications/sms          // Send SMS alert
POST /api/notifications/whatsapp     // Send WhatsApp message
GET  /api/notifications/preferences  // User notification settings
```

#### External Integrations:
- **Twilio SMS**: Text message delivery with delivery confirmations
- **Twilio WhatsApp**: WhatsApp Business API integration
- **SendGrid Email**: HTML email templates with analytics

### 7. SETTINGS & INTEGRATIONS
**Status**: OAuth Flow Requirements Documented

#### Core Features:
- **Integration Management**: Meta and Google Ads connection status
- **OAuth Flow Handling**: Secure connection and disconnection processes
- **User Preferences**: Profile, notifications, security, regional settings
- **API Status Monitoring**: Real-time monitoring of external service health
- **Permission Management**: Required scope verification and renewal

#### API Endpoints (12 total):
```typescript
GET  /api/integrations/status                    // Connection status
POST /api/integrations/meta/oauth/start         // Meta OAuth initiation
GET  /api/integrations/meta/oauth/callback      // Meta OAuth callback
POST /api/integrations/google-ads/oauth/start   // Google OAuth initiation
GET  /api/integrations/google-ads/oauth/callback // Google OAuth callback
PATCH /api/settings/profile                     // Profile updates
PATCH /api/settings/notifications               // Notification preferences  
// ... (5 additional endpoints)
```

---

## 🎯 UI/UX REQUIREMENTS

### AppShell Architecture
Based on Comet analysis of existing frontend:

#### Navigation Structure:
- **Top Navigation**: Dashboard, Real-time Monitoring, Campaign Control, Intelligence Hub, Alert Center, Settings
- **Persistent Chat Dock**: Bottom-anchored chat interface across all routes
- **Responsive Layout**: Mobile-first design with collapsible navigation

#### Design System Requirements:
```typescript
// Color tokens extracted from existing frontend
const designTokens = {
  colors: {
    sentiment: { positive: '#10B981', negative: '#EF4444', neutral: '#6B7280' },
    platform: { meta: '#1877F2', google: '#4285F4', twitter: '#1DA1F2' },
    crisis: { low: '#F59E0B', medium: '#F97316', high: '#EF4444' }
  },
  spacing: { s: '8px', m: '12px', l: '16px', xl: '24px', '2xl': '32px' },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' }
};
```

### Component Migration Requirements:
1. **Dashboard Components**: KPI cards, sentiment charts, competitor analysis
2. **Real-time Components**: Live mentions stream, trending topics, platform performance
3. **Campaign Components**: Campaign table, performance metrics, recommendation cards  
4. **Form Components**: Settings forms, OAuth connection interfaces
5. **Modal Components**: Campaign setup wizard (673-line critical component)

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Leap Backend Creation (60-90 minutes)
- **Core Services**: Authentication, Dashboard, Monitoring, Campaigns
- **Database Setup**: PostgreSQL migrations and Redis configuration
- **External APIs**: Meta, Google, Mentionlytics, Twilio integration
- **WebSocket Server**: Real-time connections with heartbeat system

### Phase 2: Leap Frontend Shell (60-90 minutes)  
- **Project Setup**: React + TypeScript + Vite + TailwindCSS
- **AppShell Implementation**: Navigation, routing, layout system
- **State Management**: Redux Toolkit + React Query setup
- **Design System**: Component library with extracted design tokens

### Phase 3: Component Migration (3-4 hours)
- **Systematic Transfer**: Feature-by-feature component migration
- **Quality Validation**: Each component tested and validated
- **Integration Testing**: End-to-end data flow verification
- **Performance Optimization**: Caching, lazy loading, optimization

### Phase 4: Production Deployment (1-2 hours)
- **Environment Configuration**: Production secrets and API keys
- **OAuth Setup**: Meta and Google Ads production callback URLs
- **Performance Testing**: Load testing and optimization
- **Monitoring Setup**: Error tracking and performance monitoring

---

## ✅ SUCCESS CRITERIA

### Technical Requirements:
- ✅ All 50+ API endpoints functional with proper error handling
- ✅ WebSocket connections stable with 30-second heartbeat
- ✅ OAuth 2.0 flows working for Meta and Google Ads
- ✅ External API integrations with fallback strategies
- ✅ Real-time crisis detection with SMS/WhatsApp alerts
- ✅ Campaign management with live performance data
- ✅ Professional UI matching existing design system
- ✅ Mobile-responsive design across all components

### Business Requirements:
- ✅ Complete political campaign intelligence platform
- ✅ Real-time social media monitoring with sentiment analysis
- ✅ Multi-platform campaign management (Meta + Google)
- ✅ Crisis detection with automated alert escalation
- ✅ Professional dashboard suitable for enterprise clients
- ✅ Scalable architecture for future feature additions

### Operational Requirements:
- ✅ Unified deployment on Leap.new platform
- ✅ Mock/Live data toggle for development workflow
- ✅ Comprehensive error handling and logging
- ✅ Performance optimization with caching strategies
- ✅ Security compliance with OAuth 2.0 standards
- ✅ Documentation for ongoing maintenance and support

---

## 📈 FUTURE ROADMAP

### Immediate Next Features (V2.1):
- **Mobile Applications**: iOS and Android native apps
- **Advanced Analytics**: Predictive modeling and trend forecasting
- **AI Automation**: Automated campaign optimization and content generation
- **Multi-language Support**: International campaign management

### Long-term Vision (V3.0):
- **White-label Platform**: Reseller and agency partnerships
- **Enterprise Features**: Multi-tenant architecture and custom branding
- **Advanced AI**: Natural language querying and automated insights
- **Global Expansion**: Support for international political systems

---

**This document represents the complete requirements for V2 War Room development. All implementation will follow these specifications to deliver an enterprise-grade political campaign intelligence platform on the Leap.new unified hosting platform.**