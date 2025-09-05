# Encore TypeScript Middleware Guide

## Overview

Middleware in Encore.ts is a powerful mechanism for "writing reusable code that runs before, after, or both before and after the handling of API requests".

## Key Concepts

### Middleware Functions

```typescript
import { middleware } from "encore.dev/api";

export default new Service("myService", {
  middlewares: [
    middleware({ target: { auth: true } }, async (req, next) => {
      // Pre-processing logic
      const resp = await next(req);
      // Post-processing logic
      return resp;
    })
  ]
});
```

### Core Characteristics

- Runs in a chain of middleware functions
- Can process requests before and after API handler execution
- Supports targeting specific endpoint types

### Request Handling

Middleware can access different request types:
- Typed API endpoints via `req.requestMeta`
- Streaming endpoints via `req.stream`
- Raw endpoints via `req.rawRequest` and `req.rawResponse`

### Data Passing

You can pass data between middleware and API handlers using `req.data`:

```typescript
const mw = middleware(async (req, next) => {
  req.data.myMiddlewareData = { some: "data" };
  return await next(req);
});

export const endpoint = api(
  { expose: true, method: "GET", path: "/example" },
  async () => {
    const callMeta = currentRequest() as APICallMeta;
    const middlewareData = callMeta.middlewareData?.myMiddlewareData;
  }
);
```

### Middleware Ordering

Middlewares execute in the order they are defined in the service configuration.

### Targeting APIs

Middleware can be precisely targeted using options like:
- `tags`: Apply to endpoints with specific tags
- `expose`: Target exposed/non-exposed endpoints
- `auth`: Apply to authenticated/non-authenticated endpoints
- `isRaw`: Target raw endpoints
- `isStream`: Target streaming endpoints

## Common Middleware Patterns

### Authentication Middleware

```typescript
const authMiddleware = middleware(
  { target: { auth: true } },
  async (req, next) => {
    const token = req.headers?.authorization;
    if (!token) {
      throw APIError.unauthenticated("missing token");
    }
    
    const user = await validateToken(token);
    req.data.user = user;
    
    return await next(req);
  }
);
```

### Logging Middleware

```typescript
const loggingMiddleware = middleware(async (req, next) => {
  const start = Date.now();
  console.log(`${req.method} ${req.path} started`);
  
  const resp = await next(req);
  
  const duration = Date.now() - start;
  console.log(`${req.method} ${req.path} completed in ${duration}ms`);
  
  return resp;
});
```

### Rate Limiting Middleware

```typescript
const rateLimitMiddleware = middleware(async (req, next) => {
  const clientIP = req.headers?.['x-forwarded-for'] || req.remoteAddr;
  
  if (await isRateLimited(clientIP)) {
    throw APIError.resourceExhausted("rate limit exceeded");
  }
  
  return await next(req);
});
```

## Best Practices

- Use `target` option for performance optimization
- Leverage middleware for cross-cutting concerns like logging, authentication, and tracing
- Keep middleware focused and composable
- Order middleware thoughtfully based on dependencies
- Use `req.data` for passing context between middleware and handlers