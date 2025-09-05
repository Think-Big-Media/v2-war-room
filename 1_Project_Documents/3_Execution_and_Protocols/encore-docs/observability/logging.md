# Encore Structured Logging for TypeScript

## Overview

Encore provides a robust structured logging system that combines free-form messages with type-safe key-value pairs, enabling comprehensive application observability.

## Key Features

### Logging Levels

Encore supports multiple log levels:
- `error`
- `warn`
- `info`
- `debug`
- `trace`

### Basic Usage

```typescript
import log from "encore.dev/log";

// Simple logging
log.info("log message", { is_subscriber: true });
log.error(err, "something went terribly wrong!");
```

### Advanced Logging Patterns

#### Persistent Logger

Create a logger with consistent metadata:

```typescript
const logger = log.with({ is_subscriber: true });
logger.info("user logged in", { login_method: "oauth" });
```

#### Contextual Logging

```typescript
// Log with multiple context fields
log.info("payment processed", {
  user_id: "12345",
  amount: 99.99,
  currency: "USD",
  payment_method: "stripe"
});
```

#### Error Logging

```typescript
try {
  await processPayment();
} catch (error) {
  log.error(error, "payment processing failed", {
    user_id: userId,
    amount: paymentAmount
  });
  throw error;
}
```

## Integration Features

- Automatically integrated with distributed tracing
- Logs are included in active traces
- Simplifies application debugging

## Live Log Streaming

Stream logs directly to your terminal across environments:

```bash
$ encore logs --env=prod
```

### Filtering Logs

```bash
# Filter by service
$ encore logs --service=payment

# Filter by level
$ encore logs --level=error

# Follow logs in real-time
$ encore logs --follow
```

## Structured Data Examples

### User Activity Logging

```typescript
const userLogger = log.with({ 
  service: "user-management",
  component: "authentication" 
});

userLogger.info("user login attempt", {
  user_id: user.id,
  ip_address: req.ip,
  user_agent: req.headers['user-agent'],
  success: true
});
```

### API Performance Logging

```typescript
const apiLogger = log.with({ service: "api-gateway" });

apiLogger.info("api request completed", {
  method: req.method,
  path: req.path,
  duration_ms: duration,
  status_code: response.status,
  user_id: req.user?.id
});
```

## Best Practices

- Use structured logging for better log analysis
- Include relevant context in log metadata
- Leverage different log levels appropriately
- Use persistent loggers for repeated context
- Avoid logging sensitive information (passwords, tokens)
- Include correlation IDs for request tracing

## Benefits

- Computer-parsable log format
- Easy filtering and searching
- Simplified debugging
- Comprehensive application insights
- Automatic trace correlation