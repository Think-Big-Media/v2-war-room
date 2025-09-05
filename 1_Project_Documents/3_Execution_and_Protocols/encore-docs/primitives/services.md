# Defining Services

Encore.ts simplifies building applications with multiple services, eliminating the typical complexity of microservice development.

## What is a Service?

In Encore, a service is a logical grouping of related functionality. Each service:
- Has its own package/directory
- Can expose APIs
- Can have its own database
- Runs as part of your application

## Creating a Service

To create an Encore service:

1. Create a directory for your service
2. Add a file named `encore.service.ts` in that directory
3. Export a service instance

### Basic Example

```typescript
// hello/encore.service.ts
import { Service } from "encore.dev/service";

export default new Service("hello");
```

### Service Structure

```
your-app/
├── users/                    # Users service
│   ├── encore.service.ts     # Service definition
│   ├── api.ts                # API endpoints
│   └── db.ts                 # Database queries
├── products/                 # Products service
│   ├── encore.service.ts
│   ├── api.ts
│   └── models.ts
└── package.json
```

## Service Configuration

### Basic Configuration

```typescript
import { Service } from "encore.dev/service";

export default new Service("my-service");
```

### Advanced Configuration

```typescript
import { Service } from "encore.dev/service";

// Service with configuration options
export default new Service("my-service", {
  // Optional configuration
});
```

## Service Communication

Services can call each other's APIs:

```typescript
// users/api.ts
import { api } from "encore.dev/api";

export const get = api(
  { method: "GET", path: "/users/:id" },
  async ({ id }: { id: string }) => {
    // Return user data
    return { id, name: "John Doe" };
  }
);
```

```typescript
// orders/api.ts
import { api } from "encore.dev/api";
import { get as getUser } from "~encore/clients/users";

export const createOrder = api(
  { method: "POST", path: "/orders" },
  async (params: CreateOrderParams) => {
    // Call the users service
    const user = await getUser({ id: params.userId });
    
    // Create order for user
    return { 
      orderId: "123",
      userName: user.name 
    };
  }
);
```

## Service Best Practices

### 1. Single Responsibility
Each service should have a clear, single purpose:
- ✅ `users` - User management
- ✅ `payments` - Payment processing
- ❌ `utils` - Too generic

### 2. Service Boundaries
Keep services loosely coupled:
- Communicate via APIs
- Don't share databases between services
- Keep shared types minimal

### 3. Service Naming
Use clear, descriptive names:
- Use lowercase
- Use hyphens for multi-word names
- Be consistent across your application

### 4. Directory Structure
Organize service code logically:
```
service-name/
├── encore.service.ts  # Service definition
├── api.ts            # Public API endpoints
├── internal.ts       # Internal functions
├── db.ts            # Database queries
├── types.ts         # Type definitions
└── tests/           # Service tests
```

## Service Discovery

Encore automatically handles service discovery. You don't need to:
- Configure service URLs
- Set up load balancers
- Manage service registries

Just import and call:
```typescript
import { apiClient } from "~encore/clients/other-service";
```

## Local Development

When running locally with `encore run`:
- All services start automatically
- Services can communicate locally
- Hot reload works across services
- Shared development database

## Production Deployment

In production:
- Services can be deployed independently
- Automatic load balancing
- Built-in service mesh
- Zero-downtime deployments

## Monitoring Services

The Encore dashboard provides:
- Service topology view
- Request traces across services
- Service-specific metrics
- Error tracking per service

## Related Topics

- [API Endpoints](defining-apis.md)
- [Databases](databases.md)
- [Authentication](auth.md)
- [Testing](testing.md)