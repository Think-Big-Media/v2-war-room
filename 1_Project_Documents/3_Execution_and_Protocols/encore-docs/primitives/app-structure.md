# Encore App Structure

## Overview

Encore uses a monorepo design, recommending "one Encore app for your entire backend application" to build a comprehensive application model.

### Key Principles
- Supports both monolithic and microservices architectures
- Provides a monolith-style developer experience for microservices
- Enables cross-service type-safety and IDE auto-complete

## Service Definition

To create a service:
1. Add an `encore.service.ts` file in a directory
2. Export a service instance using `new Service()`

```typescript
import { Service } from "encore.dev/service";
export default new Service("my-service");
```

## Project Structure Patterns

### 1. Single-Service Application
Ideal for beginners or simple applications:

```
/my-app
├── package.json
├── encore.app
├── encore.service.ts
├── api.ts
└── db.ts
```

**Example `encore.service.ts`:**
```typescript
import { Service } from "encore.dev/service";
export default new Service("my-app");
```

### 2. Multi-Service Application
Separate services in different directories:

```
/my-app
├── package.json
├── encore.app
├── hello/
│   ├── encore.service.ts
│   └── hello.ts
└── world/
    ├── encore.service.ts
    └── world.ts
```

**Example service definition:**
```typescript
// hello/encore.service.ts
import { Service } from "encore.dev/service";
export default new Service("hello");
```

### 3. Large Applications with Multiple Systems
Organize services into logical system directories:

```
/my-trello-clone
├── package.json
├── encore.app
├── trello/
│   ├── board/
│   │   ├── encore.service.ts
│   │   └── board.ts
│   └── card/
│       ├── encore.service.ts
│       └── card.ts
├── premium/
│   ├── payment/
│   │   ├── encore.service.ts
│   │   └── payment.ts
│   └── subscription/
│       ├── encore.service.ts
│       └── subscription.ts
└── usr/
    ├── org/
    │   ├── encore.service.ts
    │   └── org.ts
    └── user/
        ├── encore.service.ts
        └── user.ts
```

## Package Management

### Recommended: Single Root Package.json
Benefits include:
- Consistent dependency versions across services
- Simplified TypeScript configuration
- Easy sharing of types and utilities
- Reduced npm install overhead

```json
{
  "name": "my-encore-app",
  "version": "0.1.0",
  "scripts": {
    "test": "vitest"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "vitest": "^0.29.0"
  }
}
```

### Service-Level Dependencies (When Needed)
For specific service requirements:

```
/my-app
├── package.json
├── service1/
│   ├── package.json
│   ├── encore.service.ts
│   └── service1.ts
└── service2/
    ├── encore.service.ts
    └── service2.ts
```

## File Naming Conventions

### Service Files
- `encore.service.ts` - Service definition (required)
- `*.ts` - Business logic files
- `migrations/` - Database migrations
- `*.test.ts` - Test files

### Common Patterns
```
/user-service
├── encore.service.ts
├── user.ts              # Main business logic
├── auth.ts              # Authentication logic
├── types.ts             # Shared types
├── migrations/
│   └── 001_create_users.up.sql
└── user.test.ts         # Tests
```

## Cross-Service Communication

### Type-Safe Service Calls
```typescript
// In service A
import * as userService from "../user/user";

export const getProfile = api(
  { expose: true, method: "GET", path: "/profile/:id" },
  async ({ id }: { id: string }) => {
    const user = await userService.getUser({ id });
    return { profile: user };
  }
);
```

### Shared Types
Create a `types/` directory for shared interfaces:

```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

// user/user.ts
import { User } from "../types/user";

export const getUser = api(
  { expose: true, method: "GET", path: "/user/:id" },
  async ({ id }: { id: string }): Promise<User> => {
    // Implementation
  }
);
```

## Configuration Files

### `encore.app`
Application configuration file (JSON):
```json
{
  "id": "my-app-123"
}
```

### `tsconfig.json`
TypeScript configuration:
```json
{
  "extends": "@encore/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": ".",
    "outDir": "./dist"
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## Best Practices

### 1. Service Organization
- Group related functionality in services
- Keep services focused and cohesive
- Use clear, descriptive service names

### 2. File Structure
- Keep related files together
- Use consistent naming conventions
- Separate concerns (API, business logic, tests)

### 3. Dependencies
- Prefer root-level package.json
- Minimize external dependencies
- Use TypeScript for type safety

### 4. Service Boundaries
- Design services around business capabilities
- Minimize tight coupling between services
- Use well-defined interfaces for communication

This structure enables Encore to automatically understand your application architecture and generate infrastructure, documentation, and tooling accordingly.