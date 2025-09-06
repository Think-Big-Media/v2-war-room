# War Room Backend Systems - Multi-Version Architecture

**Status**: 🟢 Version 4.4 Production Deployed  
**Working Backend**: https://war-room-backend-d2qou4c82vjupa5k36ug.lp.dev  
**Deployment Platform**: Leap.new → Encore Cloud  
**Development Framework**: Encore.ts microservices  

## 🎯 Overview

War Room backend architecture implements a microservices pattern using Encore.ts framework, deployed through Leap.new platform with automatic staging and production environments. The system provides authentication, chat capabilities, and Google Ads integration for political campaign management.

## 📁 Version Architecture

```
3_Backend_Codebase/
├── 4.3/                    # Napoleon P0 - Core Foundation
│   ├── auth/               # Authentication microservice
│   ├── chat/               # Chat system microservice  
│   ├── google-ads/         # Google Ads integration
│   ├── health/             # Health monitoring
│   └── encore.app          # Encore configuration
├── 4.4/                    # Cleopatra - OAuth Enhancement
│   ├── encore.gen/         # Generated Encore clients
│   └── .encore/            # Build artifacts
└── README.md               # This file
```

## 🚀 Current Deployment Status

### ✅ Working Backend (v4.4)
- **URL**: https://war-room-backend-d2qou4c82vjupa5k36ug.lp.dev
- **Platform**: Leap.new deployment
- **Status**: Fully functional with complete Napoleon P0 + Cleopatra OAuth
- **Features**: Multi-tenant authentication, chat system, Google Ads API

### ❌ Broken Backend (Previous)
- **URL**: https://war-room-backend-foundation-z9n2.encr.app  
- **Platform**: Direct Encore deployment
- **Status**: 500 errors - configuration issues
- **Issue**: Deployment configuration problems, use Leap.new instead

## 🏗️ Architecture Overview

### Microservices Pattern
Each service is self-contained with its own:
- **Database migrations** - PostgreSQL schema management
- **API endpoints** - RESTful service interfaces  
- **Business logic** - Core functionality implementation
- **Type definitions** - TypeScript interfaces and types

### Service Breakdown

#### 1. Authentication Service (`auth/`)
```typescript
// Core endpoints
POST /auth/register    // User registration
POST /auth/login       // User authentication  
POST /auth/refresh     // Token refresh
GET  /auth/verify      // Token verification
```

**Features:**
- Multi-tenant organization support
- JWT token management with refresh
- User API credentials management
- PostgreSQL user/organization tables

#### 2. Chat Service (`chat/`)
```typescript  
// Chat endpoints
POST /chat/send-message    // Send chat message
GET  /chat/history         // Retrieve chat history
```

**Features:**
- Persistent chat message storage
- User context and conversation threading
- Real-time message handling capability

#### 3. Google Ads Service (`google-ads/`)
```typescript
// Google Ads endpoints  
GET  /google-ads/auth-start     // OAuth flow initiation
GET  /google-ads/auth-callback  // OAuth callback handler
GET  /google-ads/campaigns      // List campaigns
GET  /google-ads/performance    // Performance metrics
GET  /google-ads/insights       // Campaign insights
```

**Features:**
- OAuth2 Google Ads API integration
- Campaign data caching system
- Performance metrics aggregation

#### 4. Health Service (`health/`)
```typescript
// Health monitoring
GET /health    // System health status
```

**Features:**
- Service health monitoring
- Database connection verification
- API availability checking

## 🔧 Development Workflow

### Local Development Setup
```bash
# Navigate to latest version
cd 3_Backend_Codebase/4.4

# Install dependencies  
npm install

# Start development server
encore run

# Run with specific port
encore run --port=4001

# Generate client code
encore gen client
```

### Database Management
```bash
# Apply migrations
encore db migrate

# Reset database (development only)
encore db reset

# Connect to database
encore db shell
```

### Deployment Process
1. **Develop in Leap.new** - Online microservices builder
2. **Auto-deploy to Encore** - Staging environment first
3. **Manual promotion** - Production deployment via Encore Cloud
4. **Frontend connection** - Update VITE_ENCORE_API_URL

## 🗄️ Database Schema

### Core Tables
```sql
-- Users table (auth service)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    org_id INTEGER REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Organizations table (auth service)
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages table (chat service)
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- OAuth tokens table (google-ads service)
CREATE TABLE oauth_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP
);
```

## 🔐 Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost/warroom

# Google Ads API
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret  
GOOGLE_ADS_REDIRECT_URI=your_redirect_uri
GOOGLE_ADS_DEVELOPER_TOKEN=your_dev_token

# JWT Authentication
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Encore Configuration
ENCORE_ENV=development  # or production
```

## 🧪 Testing

### Health Check
```bash
# Test backend connectivity
curl https://war-room-backend-d2qou4c82vjupa5k36ug.lp.dev/health

# Expected response
{
  "status": "ok",
  "services": ["auth", "chat", "google-ads", "health"],
  "database": "connected"
}
```

### API Testing
```bash
# Test authentication
curl -X POST https://war-room-backend-d2qou4c82vjupa5k36ug.lp.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Test chat (with auth token)
curl -X GET https://war-room-backend-d2qou4c82vjupa5k36ug.lp.dev/chat/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Performance & Monitoring

### Built-in Monitoring
- **Encore Cloud Dashboard** - Real-time metrics and logs
- **Health endpoints** - Service availability monitoring  
- **Database monitoring** - Connection and query performance
- **API response times** - Endpoint performance tracking

### Scaling Configuration
- **Auto-scaling** - Handled by Encore Cloud platform
- **Load balancing** - Automatic request distribution
- **Database pooling** - PostgreSQL connection optimization
- **Caching layer** - Redis for Google Ads API responses

## 🚨 Troubleshooting

### Common Issues

**500 Internal Server Error:**
- Check Encore Cloud deployment logs
- Verify environment variables are set
- Test database connectivity
- Confirm service dependencies

**Authentication Failures:**
- Verify JWT_SECRET configuration
- Check token expiration settings
- Confirm user registration flow

**Google Ads API Issues:**
- Validate OAuth2 configuration
- Check API quotas and limits
- Verify developer token status

**Database Connection Issues:**
- Confirm DATABASE_URL format
- Check PostgreSQL server status
- Verify migration completion

## 🔗 Integration Points

### Frontend Connection
```typescript
// Frontend API configuration
const API_BASE = process.env.VITE_ENCORE_API_URL;
// Current: https://war-room-backend-d2qou4c82vjupa5k36ug.lp.dev
```

### Admin System Integration
The backend provides complete API testing through the frontend's hidden admin system:
- **Triple-click logo activation** reveals admin interface
- **DebugSidecar** provides direct API endpoint testing
- **Health monitoring** shows real-time backend status
- **Environment switching** between MOCK and LIVE data

## 📚 Related Documentation

- **Frontend Codebase**: `../2_Frontend_Codebase/README.md`
- **Deployment Guide**: `../_DEPLOYMENT-REALITY-CHECK.md`  
- **Napoleon P0 Implementation**: `../4_DAY-TO-DAY-DEV/Napoleon/`
- **Cleopatra OAuth**: `../4_DAY-TO-DAY-DEV/Cleopatra/`
- **Encore Documentation**: https://encore.dev/docs

---

**War Room Backend - Napoleon P0 Foundation + Cleopatra OAuth Enhancement - Microservices architecture for rapid political campaign management.**