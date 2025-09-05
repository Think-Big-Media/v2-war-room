# Distributed Tracing in Encore

## Overview

Distributed tracing is a powerful observability technique that helps developers understand complex application behaviors across multiple services. Encore provides an automated tracing solution with unique capabilities:

## Key Concepts

### What is Distributed Tracing?

"Tracing is a revolutionary way to gain insight into what your applications are doing. It works by capturing the series of events as they occur during the execution of your code."

### Trace Propagation

Traces work by:
- Generating a unique trace ID
- Propagating this ID across different system components
- Correlating events to create an end-to-end view of request processing

## Encore's Tracing Features

### Comprehensive Insights

Encore captures detailed trace information including:
- Stack traces
- Structured logging
- HTTP requests
- Network connection details
- API calls
- Database queries

### Automatic Instrumentation

"Encore automatically captures traces for your entire application – in all environments."

Benefits of automatic tracing:
- No manual instrumentation required
- Consistent trace collection
- Zero-configuration setup
- Complete request lifecycle visibility

### Development and Production Support

Traces can be viewed in:
- Local Development Dashboard
- Encore Cloud dashboard for production environments

## Trace Data Collection

### Request/Response Capture

Encore automatically captures:
- Request payloads
- Response data
- Headers and metadata
- Timing information

### Database Operations

Automatic tracking of:
- SQL queries
- Query parameters
- Execution times
- Connection details

### Service Communications

Monitor:
- Inter-service API calls
- Message passing
- External API requests
- Network latency

## Sensitive Data Handling

"Encore's tracing automatically captures request and response payloads to simplify debugging."

### Data Redaction

For sensitive information like passwords or PII, Encore supports:
- Marking sensitive fields in API schemas
- Automatically redacting confidential data
- Maintaining trace utility while protecting privacy

Example of sensitive field marking:
```typescript
interface LoginRequest {
  username: string;
  password: string & Sensitive; // Automatically redacted in traces
}
```

## Viewing Traces

### Local Development
1. Start your application with `encore run`
2. Access the Development Dashboard
3. Navigate to the Traces section
4. View real-time trace data

### Production Environment
1. Deploy to Encore Cloud
2. Access the Cloud dashboard
3. Use trace filtering and search
4. Analyze performance patterns

## Trace Analysis

### Performance Monitoring
- Identify slow operations
- Analyze request patterns
- Monitor service dependencies
- Track error rates

### Debugging Capabilities
- Complete request flow visualization
- Error stack traces with context
- Database query analysis
- Service interaction mapping

## Best Practices

- Leverage automatic tracing for comprehensive system insights
- Use trace data for debugging and performance optimization
- Carefully mark sensitive fields to protect confidential information
- Regularly review traces for performance bottlenecks
- Use traces to understand service dependencies

## Additional Resources

- [API Schemas Documentation](/docs/ts/primitives/defining-apis#sensitive-data)
- Local Development Dashboard
- Encore Cloud Dashboard
- Performance monitoring guides