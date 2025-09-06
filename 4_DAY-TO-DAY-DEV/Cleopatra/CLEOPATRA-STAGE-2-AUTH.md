# CLEOPATRA STAGE 2: USER AUTHENTICATION & OAUTH SYSTEM

## MISSION: Multi-Tenant User Authentication with Google OAuth

**Build comprehensive user authentication system with Google OAuth integration. Focus: Real users sign up, connect Google accounts, access personalized data.**

### CORE ENDPOINTS TO IMPLEMENT:

**1. User Registration:**
```
POST /api/v1/auth/register
Body: { email, password, organizationName?, userRole? }
Response: { user, organization, sessionToken }
```

**2. Google OAuth Flow:**
```  
GET /api/v1/auth/google/login
Response: Redirect to Google OAuth consent screen

POST /api/v1/auth/google/callback
Body: { authCode, state }
Response: { user, sessionToken, refreshToken }
```

**3. Session Management:**
```
GET /api/v1/auth/me (with Bearer token)
POST /api/v1/auth/refresh (with refreshToken) 
POST /api/v1/auth/logout
```

### ARCHITECTURE REQUIREMENTS:

**Security:** JWT access tokens (1 hour) + refresh tokens (30 days), PKCE flow, state parameter CSRF protection

**Database Integration:** Use existing multi-tenant schema (organizations, users, user_api_credentials tables from Phase 1)

**OAuth Scopes:** `openid profile email` for Google authentication

**Multi-Tenant:** New users create/join organizations, proper role assignments (admin/user/viewer)

**Environment:** DATA_MODE toggle for mock/live OAuth testing, all secrets via Encore secrets management

Extend existing authentication framework built in Napoleon Stage 1. Maintain backward compatibility with all existing endpoints.