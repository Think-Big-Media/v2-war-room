# WAR ROOM SECURITY ARCHITECTURE
**Version**: 4.3  
**Date**: September 5, 2025  
**Classification**: CONFIDENTIAL  
**Compliance**: GDPR, FEC, CCPA, SOC 2 Ready  
**Platform**: Encore (12-Service Enterprise Architecture)

---

## 🛡️ SECURITY OVERVIEW

### 1.1 Security Principles
1. **Zero Trust Architecture**: Never trust, always verify across all 12 services
2. **Defense in Depth**: Multiple security layers from API gateway to database
3. **Least Privilege**: Role-based access control with minimal permissions
4. **Encryption Everywhere**: Data protected in transit and at rest
5. **Audit Everything**: Complete trail of all actions across platform
6. **Secrets Management**: All credentials via Encore `secret()` functions only

### 1.2 Threat Model (Political Intelligence Platform)
```yaml
Primary Threats:
  - Nation-state actors targeting political intelligence
  - Competitor espionage and data theft
  - Crisis manipulation during critical events
  - DDoS attacks during election periods
  - Social engineering targeting high-value users
  - Insider threats and privilege escalation

Attack Vectors:
  - API exploitation across 70+ endpoints
  - Authentication bypass attempts
  - JWT token manipulation
  - WebSocket connection hijacking
  - Document upload malware
  - SQL injection via JSONB fields
  - External API credential theft
  - Real-time data stream poisoning

Critical Assets:
  - Political intelligence data
  - Crisis detection algorithms  
  - Campaign performance data
  - User authentication tokens
  - External API credentials
  - AI analysis results
```

---

## 2. AUTHENTICATION & AUTHORIZATION

### 2.1 Multi-Layer Authentication System
```typescript
interface SecurityLayers {
  // Layer 1: API Gateway Authentication
  gateway: {
    corsPolicy: 'Strict origin validation',
    rateLimiting: '100 requests/minute per IP',
    requestSigning: 'JWT required for all /api/v1/* routes'
  },
  
  // Layer 2: Service-Level Authentication  
  services: {
    jwtValidation: 'Every service validates tokens independently',
    tokenRefresh: 'Automatic refresh with sliding expiration',
    sessionManagement: 'Redis-based session tracking'
  },
  
  // Layer 3: Endpoint-Level Authorization
  endpoints: {
    roleBasedAccess: 'admin | manager | user | readonly',
    resourcePermissions: 'Owner/shared resource access control',
    auditLogging: 'All access attempts logged'
  }
}
```

### 2.2 JWT Implementation (4.3 Specification)
```typescript
interface JWTConfiguration {
  accessToken: {
    algorithm: 'HS256',
    secret: 'JWT_SECRET', // Base64-encoded in Encore secrets
    expiry: '15 minutes',
    payload: {
      userId: string,
      email: string,
      role: 'admin' | 'manager' | 'user' | 'readonly',
      permissions: string[],
      iat: number,
      exp: number
    }
  },
  
  refreshToken: {
    algorithm: 'HS256', 
    secret: 'JWT_REFRESH_SECRET', // Base64-encoded in Encore secrets
    expiry: '7 days',
    storage: 'Hashed in database with bcrypt',
    rotation: 'New refresh token on each use'
  }
}

// CRITICAL: JWT secrets MUST be Base64 encoded
const jwtSecrets = {
  access: 'd2FyLXJvb20tandzLWFjY2Vzcy1zZWNyZXQtMjAyNC1wcm9kdWN0aW9uLTI1Ni1iaXQtc2VjdXJpdHktbWluaW11bQ==',
  refresh: 'd2FyLXJvb20tandzLXJlZnJlc2gtc2VjcmV0LTIwMjQtcHJvZHVjdGlvbi0yNTYtYml0LXNlY3VyaXR5LW1pbmltdW0='
};
```

### 2.3 Password Security Implementation
```sql
-- User authentication table with security measures
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt, 12 salt rounds
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user', 'readonly')),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    two_factor_secret VARCHAR(32), -- TOTP secret if enabled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refresh token storage (hashed)
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL, -- bcrypt hashed
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);
```

---

## 3. API SECURITY (70+ Endpoint Protection)

### 3.1 Endpoint Security Matrix
```typescript
const endpointSecurity = {
  // Public endpoints (no auth required)
  public: [
    'GET /api/v1/health',
    'POST /api/v1/auth/login',
    'POST /api/v1/auth/register'
  ],
  
  // User endpoints (valid JWT required)
  authenticated: [
    'GET /api/v1/auth/me',
    'POST /api/v1/auth/refresh',
    'GET /api/v1/mentionlytics/*',
    'GET /api/v1/campaigns/*',
    'GET /api/v1/intelligence/*',
    'GET /api/v1/reports/*'
  ],
  
  // Manager endpoints (manager+ role required)
  manager: [
    'POST /api/v1/campaigns/*',
    'PUT /api/v1/campaigns/*',
    'POST /api/v1/documents/upload',
    'POST /api/v1/alerts/create'
  ],
  
  // Admin endpoints (admin role required)
  admin: [
    'ALL /api/v1/admin/*',
    'DELETE /api/v1/users/*',
    'POST /api/v1/settings/data-mode',
    'GET /api/v1/audit/*'
  ]
};
```

### 3.2 Rate Limiting Strategy
```typescript
const rateLimits = {
  // Authentication endpoints (stricter limits)
  'POST /api/v1/auth/login': '20 requests/hour per IP',
  'POST /api/v1/auth/register': '10 requests/hour per IP',
  'POST /api/v1/auth/refresh': '100 requests/hour per user',
  
  // General API endpoints
  '/api/v1/*': '100 requests/minute per user',
  
  // Sensitive operations
  'POST /api/v1/documents/upload': '50 uploads/day per user',
  '/api/v1/admin/*': '500 requests/hour per admin',
  
  // Real-time endpoints
  '/api/v1/mentionlytics/feed': '1000 requests/hour per user',
  'WebSocket connections': '10 concurrent per user'
};
```

### 3.3 Input Validation & Sanitization
```typescript
// Joi validation schemas for all endpoints
const validationSchemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required()
  }),
  
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  }),
  
  documentUpload: Joi.object({
    file: Joi.binary().max(10 * 1024 * 1024), // 10MB limit
    filename: Joi.string().pattern(/^[a-zA-Z0-9._-]+\.(pdf|docx|txt)$/).required()
  }),
  
  // JSONB field validation to prevent injection
  metadata: Joi.object().pattern(
    Joi.string(), 
    Joi.alternatives(Joi.string(), Joi.number(), Joi.boolean())
  )
};
```

---

## 4. DATA SECURITY

### 4.1 Encryption Strategy
```typescript
interface EncryptionLayers {
  // Transit encryption
  tls: {
    version: 'TLS 1.3',
    cipherSuites: 'AES-256-GCM, ChaCha20-Poly1305',
    certificateAuthority: 'Let\'s Encrypt',
    hstsEnabled: true
  },
  
  // At-rest encryption  
  database: {
    encryption: 'AES-256 database-level encryption',
    sensitiveFields: 'Additional field-level encryption for PII',
    backups: 'Encrypted backups with separate key management'
  },
  
  // Application-level encryption
  application: {
    passwords: 'bcrypt with 12 salt rounds',
    refreshTokens: 'bcrypt hashed before storage', 
    apiKeys: 'AES-256 encrypted with service-specific keys',
    documents: 'Client-side encryption before upload'
  }
}
```

### 4.2 Sensitive Data Handling
```sql
-- PII and sensitive data protection
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive fields
ALTER TABLE users ADD COLUMN phone_encrypted BYTEA;
UPDATE users SET phone_encrypted = pgp_sym_encrypt(phone_number, 'encryption_key')
WHERE phone_number IS NOT NULL;

-- Document content encryption
CREATE TABLE encrypted_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename_hash VARCHAR(255) NOT NULL,
    content_encrypted BYTEA NOT NULL, -- AES-256 encrypted
    encryption_key_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.3 Data Classification
```yaml
Classification Levels:
  PUBLIC:
    - System health status
    - Public API documentation
    - General platform information
    
  INTERNAL:
    - User registration data
    - Basic performance metrics
    - Non-sensitive configuration
    
  CONFIDENTIAL:
    - Campaign performance data
    - Social media analytics
    - User behavior patterns
    
  RESTRICTED:
    - Crisis detection algorithms
    - Political intelligence analysis
    - User authentication credentials
    - External API tokens
```

---

## 5. EXTERNAL API SECURITY

### 5.1 Third-Party Integration Security
```typescript
const externalApiSecurity = {
  mentionlytics: {
    tokenStorage: 'Encore secret("MENTIONLYTICS_API_TOKEN")',
    tokenRotation: 'Manual 90-day rotation policy',
    rateLimitRespected: '100 requests/minute',
    errorHandling: 'No token exposure in error messages',
    monitoring: 'API usage and error rate tracking'
  },
  
  metaBusiness: {
    oauthImplementation: 'OAuth 2.0 with PKCE',
    tokenStorage: 'Encrypted refresh tokens in database',
    tokenRefresh: 'Automatic refresh before expiry',
    scopeMinimization: 'Minimal required permissions only',
    webhookSecurity: 'Signature validation required'
  },
  
  googleAds: {
    oauthImplementation: 'OAuth 2.0 with PKCE',
    developerToken: 'Encore secret("GOOGLE_ADS_DEVELOPER_TOKEN")',
    clientCredentials: 'Encrypted storage with key rotation',
    auditLogging: 'All API calls logged for compliance'
  },
  
  openAI: {
    tokenStorage: 'Encore secret("OPENAI_API_KEY")', 
    usageMonitoring: 'Cost and rate limit tracking',
    contentFiltering: 'Input sanitization before API calls',
    outputValidation: 'Response validation and sanitization'
  }
};
```

### 5.2 API Key Management
```typescript
class SecureApiManager {
  async rotateApiKey(service: string, newKey: string, userId: string) {
    // Validate new key
    await this.validateApiKey(service, newKey);
    
    // Store old key for rollback
    await this.backupCurrentKey(service);
    
    // Update in Encore secrets
    await encoreSecrets.update(service, newKey);
    
    // Test connectivity
    await this.testServiceConnectivity(service);
    
    // Audit log
    await auditService.log('api_key_rotation', { service, userId });
  }
  
  async validateApiKey(service: string, key: string): Promise<boolean> {
    const validators = {
      mentionlytics: /^[A-Za-z0-9_-]{40,}$/,
      meta: /^EAA[A-Za-z0-9]{100,}$/,
      googleAds: /^[A-Za-z0-9_-]{20,}$/,
      openai: /^sk-[A-Za-z0-9]{40,}$/
    };
    
    return validators[service]?.test(key) || false;
  }
}
```

---

## 6. REAL-TIME SECURITY

### 6.1 WebSocket Security
```typescript
interface WebSocketSecurity {
  authentication: {
    connectionAuth: 'JWT token required for initial connection',
    messageAuth: 'Token validation on sensitive messages',
    sessionTracking: 'Active connection tracking per user'
  },
  
  authorization: {
    channelAccess: 'Role-based channel subscriptions',
    messageFiltering: 'User permissions filter outgoing messages',
    rateLimiting: 'Max 100 messages/minute per connection'
  },
  
  dataProtection: {
    messageEncryption: 'TLS 1.3 for all WebSocket traffic',
    sensitiveDataFiltering: 'PII removed from real-time feeds',
    auditLogging: 'Connection events and message metadata logged'
  }
}
```

### 6.2 Crisis Event Security
```typescript
class CrisisSecurityManager {
  async validateCrisisEvent(event: CrisisEvent, userId: string): Promise<boolean> {
    // Validate event source
    if (!await this.isAuthorizedSource(event.source)) {
      await auditService.logSecurity('unauthorized_crisis_source', { event, userId });
      return false;
    }
    
    // Check for manipulation indicators
    if (await this.detectManipulation(event)) {
      await auditService.logSecurity('crisis_manipulation_detected', { event, userId });
      await alertService.notifySecurityTeam(event);
      return false;
    }
    
    // Rate limit crisis creation
    if (await this.exceedsCrisisRateLimit(userId)) {
      await auditService.logSecurity('crisis_rate_limit_exceeded', { userId });
      return false;
    }
    
    return true;
  }
}
```

---

## 7. COMPLIANCE & AUDIT

### 7.1 Comprehensive Audit System
```sql
-- Complete audit trail for all platform operations
CREATE TABLE security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id),
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    action VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    request_id UUID,
    session_id UUID,
    severity VARCHAR(20) DEFAULT 'info', -- info, warning, error, critical
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automated audit triggers for sensitive operations
CREATE OR REPLACE FUNCTION security_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO security_audit_logs (
        event_type, resource_type, resource_id, action, details, severity
    ) VALUES (
        'data_modification',
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id)::TEXT,
        TG_OP,
        jsonb_build_object(
            'old_values', CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD) END,
            'new_values', CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) END
        ),
        CASE 
            WHEN TG_TABLE_NAME IN ('users', 'refresh_tokens') THEN 'warning'
            WHEN TG_TABLE_NAME = 'crisis_events' THEN 'critical'
            ELSE 'info'
        END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_users_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION security_audit_trigger();

CREATE TRIGGER audit_crisis_events_trigger
    AFTER INSERT OR UPDATE OR DELETE ON crisis_events  
    FOR EACH ROW EXECUTE FUNCTION security_audit_trigger();
```

### 7.2 Compliance Framework
```yaml
GDPR Compliance:
  - Data minimization: Collect only necessary data
  - Consent management: Explicit consent for data processing
  - Right to deletion: User data deletion within 30 days
  - Data portability: Export user data in JSON format
  - Breach notification: 72-hour breach notification process

FEC Compliance (Political Context):
  - Campaign finance reporting: Track all paid content
  - Source transparency: Clear attribution for all content
  - Data retention: 7-year retention for political communications
  - Audit trails: Complete trail for all political activities

SOC 2 Type II:
  - Security: Multi-layer security implementation
  - Availability: 99.9% uptime with monitoring
  - Processing Integrity: Data validation and integrity checks
  - Confidentiality: Encryption and access controls
  - Privacy: Privacy controls and consent management
```

---

## 8. SECURITY MONITORING & INCIDENT RESPONSE

### 8.1 Security Monitoring System
```typescript
interface SecurityMonitoring {
  realTimeAlerts: {
    failedLogins: 'Alert after 5 failed attempts per IP',
    suspiciousActivity: 'Unusual API usage patterns',
    rateLimitViolations: 'Repeated rate limit violations',
    adminAccess: 'All admin action notifications',
    dataExfiltration: 'Large data export attempts'
  },
  
  behavioralAnalysis: {
    userPatterns: 'Baseline normal user behavior',
    anomalDetection: 'Machine learning-based anomaly detection',
    threatIntelligence: 'External threat feed integration',
    geolocationTracking: 'Unusual location access alerts'
  },
  
  systemHealthSecurity: {
    serviceIntegrity: 'Service tampering detection',
    configurationDrift: 'Security configuration changes',
    vulnerabilityScanning: 'Daily automated security scans',
    dependencyMonitoring: 'Third-party library vulnerability tracking'
  }
}
```

### 8.2 Incident Response Plan
```yaml
Security Incident Classification:
  P0 - Critical:
    - Active data breach
    - System compromise
    - Authentication system failure
    - Crisis manipulation attack
    Response Time: Immediate (< 15 minutes)
    
  P1 - High:  
    - Suspicious user activity
    - API abuse patterns
    - Failed security controls
    - Unauthorized access attempts
    Response Time: < 1 hour
    
  P2 - Medium:
    - Security configuration issues
    - Compliance violations  
    - Audit log anomalies
    Response Time: < 4 hours
    
  P3 - Low:
    - Security policy violations
    - Minor configuration drift
    - User education needs
    Response Time: < 24 hours

Incident Response Team:
  - Incident Commander: Overall response coordination
  - Security Engineer: Technical investigation and remediation
  - Platform Engineer: System recovery and hardening  
  - Legal/Compliance: Regulatory notification and compliance
  - Communications: Internal and external communications
```

---

## 9. SECURITY TESTING & VALIDATION

### 9.1 Security Testing Strategy
```typescript
const securityTesting = {
  // Automated Security Testing
  staticAnalysis: {
    tools: ['ESLint Security Plugin', 'Semgrep', 'CodeQL'],
    frequency: 'Every commit',
    coverage: 'All TypeScript code and configurations'
  },
  
  dynamicTesting: {
    tools: ['OWASP ZAP', 'Burp Suite', 'Custom API fuzzing'],
    frequency: 'Weekly automated, monthly manual',
    scope: 'All 70+ API endpoints'
  },
  
  dependencyScanning: {
    tools: ['Snyk', 'npm audit', 'GitHub Security Advisories'],
    frequency: 'Daily',
    action: 'Automatic PRs for high/critical vulnerabilities'
  },
  
  // Manual Security Testing
  penetrationTesting: {
    internal: 'Monthly red team exercises',
    external: 'Quarterly third-party penetration testing',
    scope: 'Full platform security assessment'
  },
  
  codeReview: {
    process: 'Mandatory security review for all changes',
    checklist: 'Security-focused code review checklist',
    tools: 'Automated security review comments'
  }
};
```

### 9.2 Security Metrics & KPIs
```typescript
const securityMetrics = {
  // Preventive Metrics
  vulnerabilityCount: 'Open security vulnerabilities by severity',
  patchingTime: 'Average time to patch critical vulnerabilities',
  securityTestCoverage: 'Percentage of code covered by security tests',
  
  // Detective Metrics  
  securityIncidents: 'Number and severity of security incidents',
  falsePositiveRate: 'Security alert false positive percentage',
  detectionTime: 'Average time to detect security incidents',
  
  // Responsive Metrics
  incidentResponseTime: 'Average response time by incident severity',
  recoveryTime: 'Average time to recover from security incidents',
  complianceScore: 'Percentage compliance with security standards'
};
```

---

**This security architecture provides enterprise-grade protection for the War Room 4.3 political intelligence platform, ensuring the highest levels of security, compliance, and auditability across all 12 services and 70+ endpoints.**

**Last Updated**: September 5, 2025  
**Security Classification**: CONFIDENTIAL  
**Next Review**: October 5, 2025