# Authentication

Encore provides a flexible authentication system that integrates seamlessly with your API endpoints.

## Overview

Authentication in Encore involves:
1. Defining an authentication handler
2. Validating credentials
3. Protecting API endpoints
4. Accessing auth data in your code

## Setting Up Authentication

### Create an Auth Handler

Create an auth handler in your application:

```typescript
// auth/auth.ts
import { Header, Gateway, APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

// Define what parameters to extract from the request
interface AuthParams {
  authorization: Header<"Authorization">;
}

// Define the authentication data structure
interface AuthData {
  userID: string;
  email: string;
  role: "admin" | "user";
}

// Create the authentication handler
export const auth = authHandler<AuthParams, AuthData>(
  async (params) => {
    const token = params.authorization;
    
    // Validate the token (example)
    if (!token || !token.startsWith("Bearer ")) {
      throw APIError.unauthenticated("Invalid authorization header");
    }
    
    const jwt = token.substring(7); // Remove "Bearer " prefix
    
    // Verify JWT and extract user data (implement your logic)
    const userData = await verifyJWT(jwt);
    
    if (!userData) {
      throw APIError.unauthenticated("Invalid token");
    }
    
    // Return the authenticated user data
    return {
      userID: userData.id,
      email: userData.email,
      role: userData.role,
    };
  }
);
```

### Configure the API Gateway

Register your auth handler with the gateway:

```typescript
// auth/gateway.ts
import { Gateway } from "encore.dev/api";
import { auth } from "./auth";

export const gateway = new Gateway({
  authHandler: auth,
});
```

## Protecting Endpoints

### Require Authentication

Set `auth: true` on endpoints that require authentication:

```typescript
import { api } from "encore.dev/api";

// This endpoint requires authentication
export const getProfile = api(
  { method: "GET", path: "/profile", auth: true },
  async () => {
    // Only authenticated users can access this
    return { profile: "data" };
  }
);

// This endpoint is public
export const getPublicInfo = api(
  { method: "GET", path: "/public" },
  async () => {
    return { info: "public data" };
  }
);
```

## Accessing Auth Data

### In API Endpoints

Use `getAuthData()` to access authentication data:

```typescript
import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

export const getCurrentUser = api(
  { method: "GET", path: "/me", auth: true },
  async () => {
    const authData = getAuthData()!; // Non-null because auth: true
    
    return {
      userID: authData.userID,
      email: authData.email,
      role: authData.role,
    };
  }
);
```

### In Service Functions

Auth data is available in any function called from an authenticated endpoint:

```typescript
// services/user.ts
import { getAuthData } from "~encore/auth";

export async function getUserPreferences() {
  const authData = getAuthData();
  
  if (!authData) {
    throw new Error("Not authenticated");
  }
  
  // Fetch preferences for the authenticated user
  const prefs = await db.queryRow`
    SELECT * FROM preferences 
    WHERE user_id = ${authData.userID}
  `;
  
  return prefs;
}
```

## JWT Authentication Example

Complete JWT implementation:

```typescript
// auth/jwt.ts
import jwt from "jsonwebtoken";
import { APIError } from "encore.dev/api";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface JWTPayload {
  id: string;
  email: string;
  role: "admin" | "user";
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

export function createJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}
```

### Login Endpoint

```typescript
import { api } from "encore.dev/api";
import { createJWT } from "./jwt";

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const login = api(
  { method: "POST", path: "/auth/login", expose: true },
  async (params: LoginParams): Promise<LoginResponse> => {
    // Verify credentials (implement your logic)
    const user = await verifyCredentials(params.email, params.password);
    
    if (!user) {
      throw APIError.unauthenticated("Invalid credentials");
    }
    
    // Create JWT token
    const token = createJWT({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
);
```

## API Key Authentication

Alternative authentication using API keys:

```typescript
import { Header, APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

interface ApiKeyAuth {
  apiKey: Header<"X-API-Key">;
}

interface ApiKeyData {
  clientID: string;
  permissions: string[];
}

export const apiKeyAuth = authHandler<ApiKeyAuth, ApiKeyData>(
  async (params) => {
    const key = params.apiKey;
    
    if (!key) {
      throw APIError.unauthenticated("Missing API key");
    }
    
    // Look up API key in database
    const client = await db.queryRow`
      SELECT id, permissions 
      FROM api_clients 
      WHERE api_key = ${key} AND active = true
    `;
    
    if (!client) {
      throw APIError.unauthenticated("Invalid API key");
    }
    
    return {
      clientID: client.id,
      permissions: client.permissions,
    };
  }
);
```

## Role-Based Access Control

Implement RBAC in your endpoints:

```typescript
import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

// Helper function to check roles
function requireRole(role: string) {
  const authData = getAuthData();
  
  if (!authData || authData.role !== role) {
    throw APIError.permissionDenied("Insufficient permissions");
  }
}

// Admin-only endpoint
export const adminEndpoint = api(
  { method: "POST", path: "/admin/users", auth: true },
  async (params: CreateUserParams) => {
    requireRole("admin");
    
    // Only admins can create users
    return createUser(params);
  }
);
```

## Testing Authentication

### Mocking Auth in Tests

```typescript
import { describe, test, expect, vi } from "vitest";
import * as auth from "~encore/auth";
import { getCurrentUser } from "./api";

describe("Auth Tests", () => {
  test("getCurrentUser returns auth data", async () => {
    // Mock the auth data
    vi.spyOn(auth, "getAuthData").mockReturnValue({
      userID: "test-user",
      email: "test@example.com",
      role: "user",
    });
    
    const result = await getCurrentUser();
    
    expect(result.userID).toBe("test-user");
    expect(result.email).toBe("test@example.com");
  });
});
```

### Testing Protected Endpoints

```typescript
import { describe, test, expect } from "vitest";
import { api } from "./api";

describe("Protected Endpoints", () => {
  test("requires authentication", async () => {
    // Test without auth
    await expect(api.protectedEndpoint({}))
      .rejects
      .toThrow("unauthenticated");
    
    // Test with auth
    const result = await api.protectedEndpoint({}, {
      authData: {
        userID: "test",
        email: "test@example.com",
        role: "user",
      },
    });
    
    expect(result).toBeDefined();
  });
});
```

## Cross-Service Authentication

Auth data automatically propagates across service calls:

```typescript
// users service
import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { posts } from "~encore/clients";

export const getUserPosts = api(
  { method: "GET", path: "/my-posts", auth: true },
  async () => {
    const authData = getAuthData()!;
    
    // Auth data automatically propagates to posts service
    const userPosts = await posts.listByUser({
      userID: authData.userID,
    });
    
    return userPosts;
  }
);
```

## Security Best Practices

1. **Always use HTTPS** in production
2. **Store secrets securely** using Encore's secrets management
3. **Implement rate limiting** for auth endpoints
4. **Use strong JWT secrets** and rotate them regularly
5. **Validate and sanitize** all inputs
6. **Log authentication attempts** for security monitoring
7. **Implement token refresh** for long-lived sessions
8. **Use secure cookies** for web applications

## Common Patterns

### Refresh Tokens

```typescript
export const refresh = api(
  { method: "POST", path: "/auth/refresh", expose: true },
  async ({ refreshToken }: { refreshToken: string }) => {
    // Verify refresh token
    const userData = await verifyRefreshToken(refreshToken);
    
    if (!userData) {
      throw APIError.unauthenticated("Invalid refresh token");
    }
    
    // Issue new access token
    const accessToken = createJWT(userData);
    
    return { accessToken };
  }
);
```

### Session Management

```typescript
// Store sessions in database
export const createSession = async (userID: string) => {
  const sessionID = generateSessionID();
  
  await db.exec`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${sessionID}, ${userID}, NOW() + INTERVAL '7 days')
  `;
  
  return sessionID;
};
```

## Related Topics

- [API Endpoints](defining-apis.md)
- [Secrets Management](Environment%20Setup/encore-docs/primitives/secrets.md)
- [Testing](testing.md)
- [Middleware](middleware.md)