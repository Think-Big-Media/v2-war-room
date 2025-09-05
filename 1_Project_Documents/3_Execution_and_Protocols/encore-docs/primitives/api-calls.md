# API Calls Between Services

In Encore.ts, making API calls between services is as simple as calling a function. This provides a monolith-like developer experience even when using multiple services.

## Basic Service-to-Service Calls

### Import and Call

```typescript
// Import the service client
import { users } from "~encore/clients";

// Call the service API like a function
export const getOrderWithUser = api(
  { method: "GET", path: "/orders/:id" },
  async ({ id }: { id: string }) => {
    // Get order from database
    const order = await getOrder(id);
    
    // Call users service to get user details
    const user = await users.getUser({ id: order.userId });
    
    return {
      order,
      user
    };
  }
);
```

## How It Works

During compilation, Encore:
1. Parses all API definitions across services
2. Generates type-safe clients
3. Makes them available via `~encore/clients`
4. Handles service discovery automatically

## Type Safety

All service calls are fully type-safe:

```typescript
// users service
export const getUser = api(
  { method: "GET", path: "/users/:id" },
  async ({ id }: { id: string }): Promise<User> => {
    return fetchUser(id);
  }
);

// orders service
import { users } from "~encore/clients";

// TypeScript knows the exact parameter and return types
const user = await users.getUser({ id: "123" }); // Returns User
const user2 = await users.getUser({ id: 123 }); // Error: id must be string
```

## Authentication Propagation

Authentication automatically propagates across service calls:

```typescript
// Service A (authenticated endpoint)
export const protectedEndpoint = api(
  { method: "GET", path: "/protected", auth: true },
  async () => {
    // Auth data automatically passed to Service B
    const result = await serviceB.someAPI();
    return result;
  }
);

// Service B
import { getAuthData } from "~encore/auth";

export const someAPI = api(
  { method: "GET", path: "/some-api" },
  async () => {
    // Can access the same auth data
    const auth = getAuthData();
    return { userId: auth?.userID };
  }
);
```

## Error Handling

Service calls can throw errors that propagate correctly:

```typescript
import { APIError } from "encore.dev/api";
import { users } from "~encore/clients";

export const createOrder = api(
  { method: "POST", path: "/orders" },
  async (params: CreateOrderParams) => {
    try {
      // Check if user exists
      const user = await users.getUser({ id: params.userId });
      
      // Create order
      return createOrderForUser(user);
      
    } catch (error) {
      if (error instanceof APIError && error.code === "not_found") {
        throw APIError.notFound("User not found");
      }
      throw error;
    }
  }
);
```

## Parallel Calls

Make multiple service calls in parallel:

```typescript
import { users, products, inventory } from "~encore/clients";

export const getOrderDetails = api(
  { method: "GET", path: "/orders/:id/details" },
  async ({ id }: { id: string }) => {
    const order = await getOrder(id);
    
    // Parallel service calls
    const [user, productDetails, stock] = await Promise.all([
      users.getUser({ id: order.userId }),
      products.getProducts({ ids: order.productIds }),
      inventory.checkStock({ productIds: order.productIds })
    ]);
    
    return {
      order,
      user,
      products: productDetails,
      availability: stock
    };
  }
);
```

## Circuit Breaking

Encore automatically implements circuit breaking for service calls:

```typescript
import { users } from "~encore/clients";

export const resilientEndpoint = api(
  { method: "GET", path: "/resilient" },
  async () => {
    try {
      // If users service fails repeatedly, 
      // circuit breaker will open automatically
      const user = await users.getUser({ id: "123" });
      return { user };
      
    } catch (error) {
      // Handle circuit breaker open state
      return { 
        user: null, 
        fallback: true 
      };
    }
  }
);
```

## Timeout Configuration

Configure timeouts for service calls:

```typescript
import { users } from "~encore/clients";
import { withTimeout } from "encore.dev/api";

export const timeoutExample = api(
  { method: "GET", path: "/timeout-test" },
  async () => {
    // Set custom timeout for this call
    const user = await withTimeout(
      users.getUser({ id: "123" }), 
      { timeout: 5000 } // 5 seconds
    );
    
    return user;
  }
);
```

## Service Discovery

Service discovery is automatic:

```typescript
// No need to configure URLs or ports
import { users, orders, products } from "~encore/clients";

// Encore handles:
// - Local development (different ports)
// - Preview environments
// - Production (load balancing, failover)
```

## Testing Service Calls

### Unit Testing with Mocks

```typescript
import { vi, describe, test, expect } from "vitest";
import { users } from "~encore/clients";
import { myAPI } from "./api";

// Mock the service client
vi.mock("~encore/clients", () => ({
  users: {
    getUser: vi.fn()
  }
}));

describe("Service Calls", () => {
  test("handles user service response", async () => {
    // Setup mock response
    users.getUser.mockResolvedValue({
      id: "123",
      name: "Test User"
    });
    
    const result = await myAPI();
    
    expect(users.getUser).toHaveBeenCalledWith({ id: "123" });
    expect(result.userName).toBe("Test User");
  });
});
```

### Integration Testing

```typescript
describe("Integration", () => {
  test("real service calls", async () => {
    // In tests, all services run together
    const result = await orders.createOrder({
      userId: "test-user",
      productId: "test-product"
    });
    
    // Services have isolated test databases
    expect(result.orderId).toBeDefined();
  });
});
```

## Monitoring Service Calls

The Encore dashboard automatically provides:
- Service dependency maps
- Request traces across services
- Latency metrics per service call
- Error rates and circuit breaker status

## Advanced Patterns

### Service Aggregation

```typescript
// API Gateway pattern
export const aggregateData = api(
  { method: "GET", path: "/dashboard", expose: true },
  async () => {
    // Aggregate data from multiple services
    const [metrics, alerts, status] = await Promise.all([
      analytics.getMetrics(),
      monitoring.getAlerts(),
      health.getStatus()
    ]);
    
    return {
      metrics,
      alerts, 
      status,
      timestamp: new Date()
    };
  }
);
```

### Saga Pattern

```typescript
// Distributed transaction with compensations
export const processOrder = api(
  { method: "POST", path: "/process-order" },
  async (params: OrderParams) => {
    const steps = [];
    
    try {
      // Step 1: Reserve inventory
      const reservation = await inventory.reserve(params.items);
      steps.push({ service: "inventory", action: "reserve", id: reservation.id });
      
      // Step 2: Charge payment
      const payment = await payments.charge(params.payment);
      steps.push({ service: "payments", action: "charge", id: payment.id });
      
      // Step 3: Create shipment
      const shipment = await shipping.create(params.shipping);
      steps.push({ service: "shipping", action: "create", id: shipment.id });
      
      return { success: true, orderId: shipment.orderId };
      
    } catch (error) {
      // Compensate in reverse order
      for (const step of steps.reverse()) {
        await compensate(step);
      }
      throw error;
    }
  }
);
```

### Event-Driven Communication

```typescript
// Combine synchronous and asynchronous communication
import { pubsub } from "encore.dev/pubsub";

const orderCreated = new pubsub.Topic<OrderCreatedEvent>("order-created");

export const createOrder = api(
  { method: "POST", path: "/orders" },
  async (params: CreateOrderParams) => {
    // Synchronous call for validation
    const user = await users.getUser({ id: params.userId });
    
    // Create order
    const order = await saveOrder(params);
    
    // Asynchronous event for other services
    await orderCreated.publish({
      orderId: order.id,
      userId: user.id,
      timestamp: new Date()
    });
    
    return order;
  }
);
```

## Best Practices

1. **Keep service interfaces small** - Minimize coupling between services
2. **Handle failures gracefully** - Always have fallback strategies
3. **Use async where possible** - Don't block on non-critical service calls
4. **Monitor dependencies** - Track which services depend on each other
5. **Version your APIs** - Support backward compatibility
6. **Cache when appropriate** - Reduce inter-service traffic
7. **Document service contracts** - Make expectations clear

## Performance Optimization

### Caching Service Responses

```typescript
import { Cache } from "encore.dev/cache";

const userCache = new Cache<User>("users", {
  ttl: 300 // 5 minutes
});

export const getCachedUser = async (id: string) => {
  // Check cache first
  const cached = await userCache.get(id);
  if (cached) return cached;
  
  // Call service if not cached
  const user = await users.getUser({ id });
  
  // Cache the result
  await userCache.set(id, user);
  
  return user;
};
```

## Summary

Service-to-service communication in Encore:
- Feels like calling local functions
- Provides complete type safety
- Handles service discovery automatically
- Includes built-in resilience patterns
- Offers comprehensive monitoring
- Scales from monolith to microservices seamlessly