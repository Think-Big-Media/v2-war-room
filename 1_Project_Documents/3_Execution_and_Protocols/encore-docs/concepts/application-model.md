# Encore Application Model

## Overview

Encore uses static analysis to understand your application by creating a comprehensive graph that represents how your systems and services communicate. This application model is the foundation of Encore's powerful developer experience.

## How It Works

### Static Analysis Pipeline

```
Your Code → Parser → AST → Application Model → Infrastructure
```

1. **Code Parsing**: Encore parses your TypeScript code
2. **AST Analysis**: Builds an Abstract Syntax Tree
3. **Model Generation**: Creates a complete application model
4. **Infrastructure Provisioning**: Uses model to set up infrastructure

### What Gets Analyzed

```typescript
// This simple code...
export const api = api(
  { method: "GET", path: "/users/:id" },
  async ({ id }) => { ... }
);

// ...becomes a rich model with:
// - API endpoint definition
// - Request/response types
// - Authentication requirements
// - Service dependencies
// - Database connections
```

## The Application Graph

Your application is represented as a directed graph:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│  API Gateway │────▶│   Services   │
└─────────────┘     └─────────────┘     └─────────────┘
                            │                    │
                            ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │     Auth     │     │   Database   │
                    └─────────────┘     └─────────────┘
```

### Graph Components

- **Services**: Logical groupings of functionality
- **APIs**: Endpoints and their contracts
- **Resources**: Databases, caches, queues
- **Dependencies**: Service-to-service calls
- **Configuration**: Secrets, environment variables

## Benefits of the Application Model

### 1. 100% Accuracy
Traditional documentation drifts from reality. Encore's model is always accurate because it's derived directly from your code.

### 2. Automatic Documentation
```typescript
// Your code automatically generates:
// - OpenAPI specifications
// - Architecture diagrams
// - Service dependency maps
// - API documentation
```

### 3. Infrastructure as Code (Without Writing Infrastructure Code)
```typescript
// This code...
const db = new SQLDatabase("users");

// ...automatically provisions:
// - Database instance
// - Connection pooling
// - Backup configuration
// - Monitoring setup
```

### 4. Compile-Time Validation
```typescript
// Service A
export const userAPI = api(
  { method: "GET", path: "/user/:id" },
  async ({ id }: { id: string }) => {
    return { id, name: "John" };
  }
);

// Service B
import { userAPI } from "~encore/clients";

// This would fail at compile time if types don't match
const user = await userAPI({ id: 123 }); // Error: id must be string
```

## Standardization Philosophy

### The Problem
Developers make dozens of decisions when creating backend applications:
- Which framework?
- How to structure code?
- How to handle authentication?
- How to manage configuration?
- How to set up testing?

These decisions often stem from personal preference, leading to:
- Inconsistent codebases
- Difficult onboarding
- Technical debt
- Integration challenges

### Encore's Solution
Encore provides opinions on these decisions while maintaining flexibility:

```typescript
// Standard service structure
service/
├── encore.service.ts  // Service definition (standard)
├── api.ts            // API endpoints (standard)
├── db.ts            // Database queries (standard)
└── custom-logic.ts   // Your business logic (flexible)
```

## Modern Best Practices Built-In

### Automatic Implementation of:
- **12-Factor App** principles
- **Microservices** patterns
- **Event-driven** architecture
- **CQRS** when appropriate
- **Circuit breakers** for resilience
- **Distributed tracing** for observability

### Example: Circuit Breaker
```typescript
// Encore automatically adds circuit breakers
const response = await externalService.call();
// If service fails repeatedly, circuit opens automatically
```

## Developer Experience Benefits

### 1. Visual Service Topology
The application model generates real-time service maps:
```
┌──────────┐      ┌──────────┐
│  Users   │─────▶│  Orders  │
└──────────┘      └──────────┘
     │                 │
     ▼                 ▼
┌──────────┐      ┌──────────┐
│    DB    │      │    DB    │
└──────────┘      └──────────┘
```

### 2. API Explorer
- Interactive API testing
- Auto-generated from your code
- Always up-to-date
- Includes authentication

### 3. Dependency Tracking
```typescript
// Encore knows that OrderService depends on UserService
// Updates to UserService API will show impact on OrderService
```

## Infrastructure Generation

The application model drives infrastructure provisioning:

### Development
```bash
encore run
# Automatically provisions:
# - Local PostgreSQL
# - Redis cache
# - Message queues
# - Service discovery
```

### Production
```bash
encore deploy
# Automatically configures:
# - Load balancers
# - Auto-scaling
# - Database clusters
# - CDN distribution
# - Monitoring
```

## Open Source Foundation

The entire system is [Open Source](https://github.com/encoredev/encore):
- Transparent implementation
- Community contributions
- No vendor lock-in
- Extensible architecture

### Contributing
```bash
git clone https://github.com/encoredev/encore
cd encore
# Add new features to the application model
```

## Extending the Model

### Custom Resources
```typescript
// Define custom infrastructure
export class CustomResource {
  constructor(name: string, config: Config) {
    // Encore will include in application model
  }
}
```

### Metadata Annotations
```typescript
// Add metadata to influence model
export const api = api(
  { 
    method: "GET", 
    path: "/users",
    metadata: {
      rateLimit: 100,
      cache: true
    }
  },
  async () => { ... }
);
```

## Real-World Example

```typescript
// This complete service definition...
import { Service } from "encore.dev/service";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { api } from "encore.dev/api";

export default new Service("users");

const db = new SQLDatabase("users", {
  migrations: "./migrations"
});

export const createUser = api(
  { method: "POST", path: "/users", expose: true },
  async (params: CreateUserParams): Promise<User> => {
    const user = await db.queryRow<User>`
      INSERT INTO users (name, email)
      VALUES (${params.name}, ${params.email})
      RETURNING *
    `;
    return user!;
  }
);

// ...generates a complete application model including:
// - Service topology
// - API documentation
// - Database schema
// - Deployment configuration
// - Monitoring setup
// - Security policies
```

## Summary

The Encore Application Model:
1. **Understands** your code through static analysis
2. **Generates** accurate documentation and diagrams
3. **Provisions** infrastructure automatically
4. **Validates** at compile time
5. **Standardizes** best practices
6. **Maintains** accuracy as code evolves

This model is the foundation that enables Encore to provide a revolutionary developer experience while maintaining the flexibility to build any type of application.