# Pub/Sub Messaging

Pub/Sub (Publishers & Subscribers) enables asynchronous, event-driven communication between services.

## Core Concepts

### What is Pub/Sub?

Pub/Sub is a messaging pattern where:
- **Publishers** emit events without knowing who will receive them
- **Subscribers** listen for events without knowing who sent them
- **Topics** act as channels for specific event types

```
Publisher → Topic → Subscriber(s)
```

## Creating Topics

Define topics as package-level variables:

```typescript
import { Topic } from "encore.dev/pubsub";

// Define the event interface
export interface UserSignupEvent {
  userID: string;
  email: string;
  timestamp: Date;
}

// Create a topic
export const userSignups = new Topic<UserSignupEvent>("user-signups", {
  deliveryGuarantee: "at-least-once",
});
```

### Topic Configuration Options

```typescript
const myTopic = new Topic<EventType>("topic-name", {
  // Delivery guarantee
  deliveryGuarantee: "at-least-once", // or "exactly-once"
  
  // Message ordering
  orderingAttribute: "userID", // Messages with same userID delivered in order
  
  // Retention
  messageRetention: 7 * 24 * 60 * 60, // 7 days in seconds
});
```

## Publishing Events

### Basic Publishing

```typescript
import { userSignups } from "./topics";

export const createUser = api(
  { method: "POST", path: "/users" },
  async (params: CreateUserParams) => {
    // Create user in database
    const user = await saveUser(params);
    
    // Publish event
    const messageID = await userSignups.publish({
      userID: user.id,
      email: user.email,
      timestamp: new Date(),
    });
    
    console.log(`Published message: ${messageID}`);
    
    return user;
  }
);
```

### Publishing Multiple Events

```typescript
// Publish multiple events at once
const messageIDs = await Promise.all([
  userSignups.publish({ userID: "1", email: "user1@example.com", timestamp: new Date() }),
  userSignups.publish({ userID: "2", email: "user2@example.com", timestamp: new Date() }),
  userSignups.publish({ userID: "3", email: "user3@example.com", timestamp: new Date() }),
]);
```

### Publishing with Attributes

```typescript
import { Attribute } from "encore.dev/pubsub";

interface OrderEvent {
  orderID: string;
  amount: number;
  priority: Attribute<"high" | "normal" | "low">;
  region: Attribute<string>;
}

const orderEvents = new Topic<OrderEvent>("orders", {
  deliveryGuarantee: "at-least-once",
});

// Publish with attributes
await orderEvents.publish({
  orderID: "123",
  amount: 99.99,
  priority: "high",
  region: "us-east",
});
```

## Creating Subscriptions

### Basic Subscription

```typescript
import { Subscription } from "encore.dev/pubsub";
import { userSignups } from "./topics";

// Create a subscription
const _ = new Subscription(userSignups, "send-welcome-email", {
  handler: async (event: UserSignupEvent) => {
    console.log(`New user signup: ${event.email}`);
    
    // Send welcome email
    await sendWelcomeEmail(event.email);
  },
});
```

### Subscription Configuration

```typescript
const subscription = new Subscription(myTopic, "subscription-name", {
  handler: async (event) => {
    // Process event
  },
  
  // Retry configuration
  retry: {
    maxRetries: 10,
    minBackoff: 10, // seconds
    maxBackoff: 300, // seconds
  },
  
  // Concurrency control
  maxConcurrency: 5, // Process max 5 messages in parallel
  
  // Message filtering (if topic has attributes)
  filter: {
    priority: "high",
    region: ["us-east", "us-west"],
  },
});
```

## Delivery Guarantees

### At-Least-Once Delivery

Default guarantee - messages may be delivered multiple times:

```typescript
const topic = new Topic<Event>("events", {
  deliveryGuarantee: "at-least-once",
});

// Handler must be idempotent
const subscription = new Subscription(topic, "process", {
  handler: async (event) => {
    // Check if already processed
    const processed = await checkProcessed(event.id);
    if (processed) return;
    
    // Process event
    await processEvent(event);
    
    // Mark as processed
    await markProcessed(event.id);
  },
});
```

### Exactly-Once Delivery

Stronger guarantee but with performance limitations:

```typescript
const criticalTopic = new Topic<CriticalEvent>("critical", {
  deliveryGuarantee: "exactly-once",
});

// Handler can assume single delivery
const subscription = new Subscription(criticalTopic, "process-once", {
  handler: async (event) => {
    // Process without idempotency checks
    await processCriticalEvent(event);
  },
});
```

## Error Handling

### Retry Policy

```typescript
const subscription = new Subscription(topic, "retry-example", {
  handler: async (event) => {
    try {
      await processEvent(event);
    } catch (error) {
      // Throw to trigger retry
      throw error;
    }
  },
  
  retry: {
    maxRetries: 5,
    minBackoff: 10, // Start with 10 second delay
    maxBackoff: 600, // Max 10 minute delay
  },
});
```

### Dead Letter Queue

After max retries, messages go to DLQ:

```typescript
// Subscribe to dead letter queue
const dlqSubscription = new Subscription(topic, "handle-dlq", {
  handler: async (event) => {
    // Log failed event
    console.error("Failed to process:", event);
    
    // Alert operations team
    await sendAlert({
      type: "DLQ_MESSAGE",
      event,
    });
  },
  
  // This subscription handles DLQ messages
  dlq: true,
});
```

## Ordered Topics

Ensure message order for related events:

```typescript
const userEvents = new Topic<UserEvent>("user-events", {
  deliveryGuarantee: "at-least-once",
  orderingAttribute: "userID", // Order by user
});

// Messages for same userID delivered in order
await userEvents.publish({ userID: "123", type: "login" });
await userEvents.publish({ userID: "123", type: "update" });
await userEvents.publish({ userID: "123", type: "logout" });
```

## Common Patterns

### Event Sourcing

```typescript
interface DomainEvent {
  aggregateID: string;
  eventType: string;
  eventData: any;
  timestamp: Date;
  version: number;
}

const eventStore = new Topic<DomainEvent>("event-store", {
  deliveryGuarantee: "exactly-once",
  orderingAttribute: "aggregateID",
});

// Publish domain events
export async function updateUser(userID: string, changes: any) {
  await eventStore.publish({
    aggregateID: userID,
    eventType: "UserUpdated",
    eventData: changes,
    timestamp: new Date(),
    version: await getNextVersion(userID),
  });
}
```

### Saga Pattern

```typescript
// Order saga orchestration
const orderSaga = new Subscription(orderEvents, "order-saga", {
  handler: async (event) => {
    switch (event.step) {
      case "order_created":
        await inventoryService.reserve(event.items);
        await orderEvents.publish({ ...event, step: "inventory_reserved" });
        break;
        
      case "inventory_reserved":
        await paymentService.charge(event.payment);
        await orderEvents.publish({ ...event, step: "payment_processed" });
        break;
        
      case "payment_processed":
        await shippingService.ship(event.shipping);
        await orderEvents.publish({ ...event, step: "order_completed" });
        break;
    }
  },
});
```

### Fan-Out Pattern

```typescript
const userSignupTopic = new Topic<UserSignupEvent>("user-signup");

// Multiple subscribers for single event
new Subscription(userSignupTopic, "send-email", {
  handler: async (event) => await sendWelcomeEmail(event),
});

new Subscription(userSignupTopic, "create-profile", {
  handler: async (event) => await createUserProfile(event),
});

new Subscription(userSignupTopic, "analytics", {
  handler: async (event) => await trackSignup(event),
});

new Subscription(userSignupTopic, "crm-sync", {
  handler: async (event) => await syncToCRM(event),
});
```

## Testing Pub/Sub

### Unit Testing Publishers

```typescript
import { vi, describe, test, expect } from "vitest";
import { userSignups } from "./topics";

describe("User Creation", () => {
  test("publishes signup event", async () => {
    // Mock the publish method
    const publishSpy = vi.spyOn(userSignups, "publish");
    
    // Create user
    await createUser({ email: "test@example.com" });
    
    // Verify event published
    expect(publishSpy).toHaveBeenCalledWith({
      userID: expect.any(String),
      email: "test@example.com",
      timestamp: expect.any(Date),
    });
  });
});
```

### Testing Subscriptions

```typescript
describe("Welcome Email Subscription", () => {
  test("sends email on signup", async () => {
    const mockSendEmail = vi.fn();
    
    // Create subscription with mock handler
    const subscription = new Subscription(userSignups, "test", {
      handler: async (event) => {
        await mockSendEmail(event.email);
      },
    });
    
    // Simulate event
    await subscription.handler({
      userID: "123",
      email: "test@example.com",
      timestamp: new Date(),
    });
    
    expect(mockSendEmail).toHaveBeenCalledWith("test@example.com");
  });
});
```

## Monitoring

The Encore dashboard provides:
- Topic throughput metrics
- Subscription lag monitoring
- Error rates and retry counts
- Dead letter queue size
- Message flow visualization

## Best Practices

1. **Make handlers idempotent** - Handle duplicate deliveries gracefully
2. **Keep events small** - Store references, not large payloads
3. **Version your events** - Support backward compatibility
4. **Use dead letter queues** - Handle permanent failures
5. **Monitor subscription lag** - Ensure timely processing
6. **Document event schemas** - Make contracts clear
7. **Test error scenarios** - Verify retry and DLQ behavior

## Performance Considerations

### Batching

```typescript
// Batch process events for efficiency
const batchSubscription = new Subscription(topic, "batch-process", {
  handler: async (events: Event[]) => {
    // Process multiple events at once
    await batchProcess(events);
  },
  
  batchSize: 100, // Process 100 at a time
  batchTimeout: 5000, // Or after 5 seconds
});
```

### Parallel Processing

```typescript
const parallelSubscription = new Subscription(topic, "parallel", {
  handler: async (event) => {
    await processEvent(event);
  },
  
  maxConcurrency: 10, // Process 10 messages in parallel
});
```

## Summary

Encore's Pub/Sub provides:
- **Type-safe** event definitions
- **Automatic** infrastructure provisioning
- **Built-in** retry and error handling
- **Flexible** delivery guarantees
- **Comprehensive** monitoring
- **Simple** testing patterns

Perfect for:
- Decoupling services
- Event-driven architectures
- Asynchronous workflows
- Fan-out processing
- Event sourcing
- Saga orchestration