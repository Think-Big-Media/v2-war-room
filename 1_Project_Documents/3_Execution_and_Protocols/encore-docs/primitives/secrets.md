# Secrets Management

Encore provides built-in secrets management to securely handle sensitive information like API keys, tokens, and credentials.

## Defining Secrets

Use the `secret()` function to define secrets in your code:

```typescript
import { secret } from "encore.dev/config";

// Define secrets as top-level variables
const databasePassword = secret("DatabasePassword");
const apiKey = secret("ExternalAPIKey");
const jwtSecret = secret("JWTSecret");
```

## Using Secrets

Call the secret as a function to retrieve its value:

```typescript
import { secret } from "encore.dev/config";

const githubToken = secret("GitHubAPIToken");

export async function fetchGitHubData() {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${githubToken()}`,
    },
  });
  
  return response.json();
}
```

## Setting Secret Values

### Via Encore Cloud Dashboard

1. Open [Encore Cloud Dashboard](https://app.encore.dev)
2. Navigate to **Settings** → **Secrets**
3. Add secrets for each environment:
   - Production
   - Development
   - Preview
   - Local

### Via CLI

```bash
# Set a secret for production
encore secret set --type production DatabasePassword

# Set for development environment
encore secret set --type development DatabasePassword

# Set for preview environments
encore secret set --type preview DatabasePassword

# Set for local development
encore secret set --type local DatabasePassword
```

Environment type shortcuts:
- `prod` → production
- `dev` → development
- `pr` → preview

### Local Override File

Create `.secrets.local` file in your project root:

```json
{
  "DatabasePassword": "local-dev-password",
  "GitHubAPIToken": "ghp_localDevToken123",
  "JWTSecret": "local-jwt-secret-key"
}
```

**Important**: Add `.secrets.local` to `.gitignore`:
```gitignore
.secrets.local
*.secrets.local
```

## Secret Validation

Encore validates secrets at compile time:

```typescript
const apiKey = secret("APIKey");

// Compile-time check ensures secret exists
export const useAPI = api(
  { method: "GET", path: "/data" },
  async () => {
    const key = apiKey(); // Will fail compilation if not set
    return fetchWithKey(key);
  }
);
```

## Environment-Specific Secrets

Different values per environment:

```typescript
const dbUrl = secret("DatabaseURL");

// Local: postgresql://localhost/myapp
// Dev: postgresql://dev.db.example.com/myapp
// Prod: postgresql://prod.db.example.com/myapp
```

## Common Secret Patterns

### Database Credentials

```typescript
import { secret } from "encore.dev/config";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const dbPassword = secret("DBPassword");
const dbHost = secret("DBHost");
const dbUser = secret("DBUser");

// Use secrets in connection string
const connectionString = () => 
  `postgresql://${dbUser()}:${dbPassword()}@${dbHost()}/myapp`;
```

### API Keys

```typescript
const stripeKey = secret("StripeAPIKey");
const sendgridKey = secret("SendGridAPIKey");
const twilioKey = secret("TwilioAPIKey");

export class PaymentService {
  private stripe = new Stripe(stripeKey());
  
  async processPayment(amount: number) {
    return this.stripe.charges.create({
      amount,
      currency: "usd",
    });
  }
}
```

### JWT Secrets

```typescript
import jwt from "jsonwebtoken";
import { secret } from "encore.dev/config";

const jwtSecret = secret("JWTSecret");

export function createToken(payload: any): string {
  return jwt.sign(payload, jwtSecret(), {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): any {
  return jwt.verify(token, jwtSecret());
}
```

### OAuth Credentials

```typescript
const googleClientId = secret("GoogleOAuthClientId");
const googleClientSecret = secret("GoogleOAuthClientSecret");

export const oauthConfig = {
  clientId: googleClientId(),
  clientSecret: googleClientSecret(),
  redirectUri: "https://myapp.com/auth/callback",
};
```

## Secret Rotation

Best practices for rotating secrets:

1. **Add new secret version**:
```bash
encore secret set --type production APIKey_v2
```

2. **Update code to support both**:
```typescript
const apiKeyV1 = secret("APIKey");
const apiKeyV2 = secret("APIKey_v2");

function getAPIKey() {
  // Try new key first, fallback to old
  try {
    return apiKeyV2();
  } catch {
    return apiKeyV1();
  }
}
```

3. **Deploy and verify**
4. **Remove old secret**

## Security Best Practices

### 1. Never Commit Secrets
```typescript
// ❌ NEVER DO THIS
const apiKey = "sk_live_abcd1234";

// ✅ DO THIS
const apiKey = secret("APIKey");
```

### 2. Use Descriptive Names
```typescript
// ❌ Too generic
const key = secret("Key");

// ✅ Descriptive
const stripeWebhookSecret = secret("StripeWebhookSecret");
```

### 3. Limit Secret Scope
```typescript
// Keep secrets in specific services
// users/secrets.ts
const userDbPassword = secret("UserDBPassword");

// orders/secrets.ts  
const orderDbPassword = secret("OrderDBPassword");
```

### 4. Audit Secret Usage
```typescript
// Log secret access for auditing
const sensitiveKey = secret("SensitiveAPIKey");

export function useSensitiveAPI() {
  console.log("Accessing sensitive API");
  const key = sensitiveKey();
  // Use key
}
```

## Testing with Secrets

### Mock Secrets in Tests

```typescript
import { vi } from "vitest";
import * as config from "encore.dev/config";

describe("Secret Tests", () => {
  beforeEach(() => {
    vi.spyOn(config, "secret").mockImplementation(
      (name: string) => () => `mock-${name}`
    );
  });
  
  test("uses mocked secret", () => {
    const apiKey = secret("APIKey");
    expect(apiKey()).toBe("mock-APIKey");
  });
});
```

### Test Environment Secrets

Set test-specific secrets:

```bash
# Set secrets for test environment
encore secret set --type local TestAPIKey
encore secret set --type local TestDBPassword
```

## Secret Storage Security

Encore encrypts secrets using:
- **Google Cloud KMS** for Encore Cloud
- **AES-256** for local development
- **Environment-specific encryption keys**

### How Secrets Are Stored

1. **Encore Cloud**: Encrypted in Google Secret Manager
2. **Local Development**: Encrypted in `.encore` directory
3. **Self-Hosted**: Your choice of secret manager

## Debugging Secrets

### Check if Secret is Set

```typescript
const apiKey = secret("APIKey");

export function checkSecrets() {
  try {
    const key = apiKey();
    console.log("APIKey is set");
  } catch (error) {
    console.error("APIKey is not set");
  }
}
```

### List All Secrets

```bash
# List secrets for an environment
encore secret list --env production
```

### View Secret Metadata

```bash
# Get info about a secret (not the value)
encore secret info APIKey
```

## Migration from Environment Variables

Migrating from traditional env vars:

```typescript
// Before (using process.env)
const apiKey = process.env.API_KEY;

// After (using Encore secrets)
import { secret } from "encore.dev/config";
const apiKey = secret("APIKey");

// Use the secret
const key = apiKey();
```

## Common Issues and Solutions

### Secret Not Found

```
Error: secret "APIKey" not found
```

**Solution**: Set the secret using CLI or dashboard

### Secret Access in Non-API Code

```typescript
// Secrets can be used anywhere in your service
class BackgroundJob {
  private apiKey = secret("APIKey");
  
  async run() {
    const key = this.apiKey();
    // Use key
  }
}
```

### Different Secrets Per Service

```typescript
// Service A
const serviceAKey = secret("ServiceA_APIKey");

// Service B  
const serviceBKey = secret("ServiceB_APIKey");
```

## Summary

Encore's secrets management:
- **Secure**: Encrypted storage and transmission
- **Simple**: Define and use with one function
- **Validated**: Compile-time checking
- **Flexible**: Different values per environment
- **Auditable**: Track secret usage
- **Testable**: Easy mocking for tests