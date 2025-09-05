# WAR ROOM ERROR HANDLING GUIDE
**Version**: 1.0  
**Date**: September 1, 2025  
**Purpose**: Comprehensive Error Recovery and Circuit Breaker Patterns  
**Philosophy**: Fail Gracefully, Recover Automatically, Learn Continuously  

## 1. ERROR HANDLING PHILOSOPHY

### Core Principles
1. **User Experience First**: Never show raw errors to users
2. **Graceful Degradation**: Fallback to mock data when services fail
3. **Automatic Recovery**: Self-healing systems with retry logic
4. **Complete Observability**: Log everything, alert on patterns
5. **Learn from Failures**: Each error improves the system

### Error Categories
```typescript
enum ErrorSeverity {
  CRITICAL = 'critical',  // System down, data loss risk
  HIGH = 'high',         // Major feature broken
  MEDIUM = 'medium',     // Degraded experience
  LOW = 'low',          // Minor inconvenience
  INFO = 'info'         // Worth noting, not urgent
}

enum ErrorType {
  NETWORK = 'network',
  AUTHENTICATION = 'auth',
  VALIDATION = 'validation',
  RATE_LIMIT = 'rate_limit',
  EXTERNAL_SERVICE = 'external',
  DATABASE = 'database',
  BUSINESS_LOGIC = 'business',
  UNKNOWN = 'unknown'
}
```

## 2. CIRCUIT BREAKER PATTERN

### 2.1 Circuit Breaker Implementation
```typescript
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime?: Date;
  private nextAttempt?: Date;
  
  constructor(
    private readonly threshold = 5,
    private readonly timeout = 60000, // 1 minute
    private readonly resetTimeout = 120000 // 2 minutes
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt?.getTime()) {
        throw new CircuitOpenError('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.threshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
        console.log('Circuit breaker CLOSED - service recovered');
      }
    }
  }
  
  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = new Date();
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = new Date(Date.now() + this.timeout);
      console.error('Circuit breaker OPEN - too many failures');
      
      // Schedule automatic recovery attempt
      setTimeout(() => {
        this.state = 'HALF_OPEN';
        console.log('Circuit breaker HALF_OPEN - testing recovery');
      }, this.resetTimeout);
    }
  }
}
```

### 2.2 Service-Specific Circuit Breakers
```typescript
// Circuit breakers for each external service
const circuitBreakers = {
  mentionlytics: new CircuitBreaker(5, 60000, 120000),
  twilio: new CircuitBreaker(3, 30000, 60000),
  openai: new CircuitBreaker(5, 60000, 180000),
  encore: new CircuitBreaker(10, 30000, 60000)
};

// Usage example
async function fetchMentionlyticsData() {
  try {
    return await circuitBreakers.mentionlytics.execute(async () => {
      const response = await fetch('/api/mentionlytics/sentiment');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });
  } catch (error) {
    if (error instanceof CircuitOpenError) {
      // Fallback to mock data
      console.log('Mentionlytics circuit open, using mock data');
      return mockMentionlyticsData;
    }
    throw error;
  }
}
```

## 3. RETRY STRATEGIES

### 3.1 Exponential Backoff with Jitter
```typescript
class RetryManager {
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      initialDelay = 1000,
      maxDelay = 30000,
      factor = 2,
      jitter = true
    } = options;
    
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxAttempts) {
          throw new MaxRetriesExceededError(
            `Failed after ${maxAttempts} attempts`,
            lastError
          );
        }
        
        // Calculate delay with exponential backoff
        let delay = Math.min(
          initialDelay * Math.pow(factor, attempt - 1),
          maxDelay
        );
        
        // Add jitter to prevent thundering herd
        if (jitter) {
          delay = delay * (0.5 + Math.random() * 0.5);
        }
        
        console.log(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`);
        await this.sleep(delay);
      }
    }
    
    throw lastError!;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 3.2 Intelligent Retry Logic
```typescript
// Retry only on retryable errors
function isRetryable(error: any): boolean {
  // Network errors
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
    return true;
  }
  
  // HTTP status codes
  const status = error.response?.status;
  if (status === 429 || status === 503 || status >= 500) {
    return true;
  }
  
  // Rate limiting
  if (error.message?.includes('rate limit')) {
    return true;
  }
  
  // Don't retry on client errors
  if (status >= 400 && status < 500) {
    return false;
  }
  
  return false;
}

// Smart retry with error analysis
async function smartRetry<T>(fn: () => Promise<T>): Promise<T> {
  const retry = new RetryManager();
  
  return retry.executeWithRetry(fn, {
    maxAttempts: 3,
    shouldRetry: (error, attempt) => {
      if (!isRetryable(error)) {
        console.log('Error is not retryable:', error.message);
        return false;
      }
      
      // Check if we have retry-after header
      const retryAfter = error.response?.headers['retry-after'];
      if (retryAfter) {
        const delay = parseInt(retryAfter) * 1000;
        console.log(`Respecting retry-after: ${delay}ms`);
        return { retry: true, delay };
      }
      
      return true;
    }
  });
}
```

## 4. FALLBACK MECHANISMS

### 4.1 Cascading Fallbacks
```typescript
class FallbackChain {
  private fallbacks: Array<() => Promise<any>> = [];
  
  add(fallback: () => Promise<any>) {
    this.fallbacks.push(fallback);
    return this;
  }
  
  async execute(): Promise<any> {
    const errors: Error[] = [];
    
    for (const fallback of this.fallbacks) {
      try {
        const result = await fallback();
        if (result !== null && result !== undefined) {
          return result;
        }
      } catch (error) {
        errors.push(error);
        console.log(`Fallback failed: ${error.message}`);
      }
    }
    
    throw new AllFallbacksFailedError(errors);
  }
}

// Usage example
async function getSentimentData() {
  const fallbackChain = new FallbackChain()
    .add(() => fetchFromMentionlytics())      // Primary
    .add(() => fetchFromCache())              // Cache
    .add(() => fetchFromBackupAPI())          // Backup API
    .add(() => generateMockData())            // Mock data
    .add(() => getDefaultSentiment());        // Static default
  
  return fallbackChain.execute();
}
```

### 4.2 Feature Flags for Degradation
```typescript
class FeatureFlags {
  private flags = new Map<string, boolean>();
  
  // Automatically disable features during outages
  async checkHealth() {
    const healthChecks = [
      { feature: 'live_mentionlytics', check: this.checkMentionlytics },
      { feature: 'sms_alerts', check: this.checkTwilio },
      { feature: 'ai_analysis', check: this.checkOpenAI },
      { feature: 'vector_search', check: this.checkPgVector }
    ];
    
    for (const { feature, check } of healthChecks) {
      try {
        await check();
        this.enable(feature);
      } catch {
        this.disable(feature);
        console.warn(`Feature disabled: ${feature}`);
      }
    }
  }
  
  isEnabled(feature: string): boolean {
    return this.flags.get(feature) ?? false;
  }
  
  // Usage in components
  renderFeature(feature: string, component: ReactNode): ReactNode {
    if (!this.isEnabled(feature)) {
      return <DegradedFeature feature={feature} />;
    }
    return component;
  }
}
```

## 5. ERROR RECOVERY PROCEDURES

### 5.1 Automatic Recovery
```typescript
class AutoRecovery {
  private recoveryStrategies = new Map<ErrorType, RecoveryStrategy>();
  
  constructor() {
    this.registerStrategies();
  }
  
  private registerStrategies() {
    // Network errors - retry with backoff
    this.recoveryStrategies.set(ErrorType.NETWORK, {
      recover: async (error) => {
        await this.waitForNetwork();
        return { retry: true };
      }
    });
    
    // Auth errors - refresh token
    this.recoveryStrategies.set(ErrorType.AUTHENTICATION, {
      recover: async (error) => {
        const newToken = await this.refreshAuthToken();
        return { retry: true, context: { token: newToken } };
      }
    });
    
    // Rate limit - wait and retry
    this.recoveryStrategies.set(ErrorType.RATE_LIMIT, {
      recover: async (error) => {
        const waitTime = this.extractWaitTime(error);
        await this.sleep(waitTime);
        return { retry: true };
      }
    });
    
    // Database connection - reconnect
    this.recoveryStrategies.set(ErrorType.DATABASE, {
      recover: async (error) => {
        await this.reconnectDatabase();
        return { retry: true };
      }
    });
  }
  
  async recover(error: AppError): Promise<RecoveryResult> {
    const strategy = this.recoveryStrategies.get(error.type);
    
    if (!strategy) {
      console.error('No recovery strategy for error type:', error.type);
      return { retry: false };
    }
    
    try {
      return await strategy.recover(error);
    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
      return { retry: false, fallback: true };
    }
  }
}
```

### 5.2 Self-Healing Systems
```typescript
class SelfHealingMonitor {
  private healthChecks = new Map<string, HealthCheck>();
  private healingActions = new Map<string, HealingAction>();
  
  async monitor() {
    setInterval(async () => {
      for (const [service, check] of this.healthChecks) {
        try {
          const health = await check();
          
          if (!health.healthy) {
            await this.heal(service, health);
          }
        } catch (error) {
          await this.heal(service, { error });
        }
      }
    }, 30000); // Check every 30 seconds
  }
  
  private async heal(service: string, health: HealthStatus) {
    const action = this.healingActions.get(service);
    
    if (!action) {
      console.error(`No healing action for ${service}`);
      return;
    }
    
    console.log(`Attempting to heal ${service}...`);
    
    try {
      await action(health);
      console.log(`${service} healed successfully`);
    } catch (error) {
      console.error(`Failed to heal ${service}:`, error);
      await this.escalate(service, error);
    }
  }
  
  private async escalate(service: string, error: any) {
    // Alert operations team
    await this.sendAlert({
      severity: 'HIGH',
      service,
      error: error.message,
      action: 'Manual intervention required'
    });
  }
}
```

## 6. USER-FACING ERROR MESSAGES

### 6.1 Error Message Templates
```typescript
const errorMessages = {
  [ErrorType.NETWORK]: {
    title: 'Connection Issue',
    message: 'We\'re having trouble connecting. Please check your internet connection.',
    action: 'Retry',
    icon: '🌐'
  },
  
  [ErrorType.AUTHENTICATION]: {
    title: 'Authentication Required',
    message: 'Your session has expired. Please log in again.',
    action: 'Log In',
    icon: '🔐'
  },
  
  [ErrorType.RATE_LIMIT]: {
    title: 'Slow Down',
    message: 'You\'re making requests too quickly. Please wait a moment.',
    action: 'Got It',
    icon: '⏱️'
  },
  
  [ErrorType.EXTERNAL_SERVICE]: {
    title: 'Service Temporarily Unavailable',
    message: 'One of our services is temporarily down. We\'re using cached data.',
    action: 'Continue',
    icon: '🔧'
  },
  
  [ErrorType.VALIDATION]: {
    title: 'Invalid Input',
    message: 'Please check your input and try again.',
    action: 'Fix It',
    icon: '✏️'
  },
  
  [ErrorType.UNKNOWN]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Our team has been notified.',
    action: 'Try Again',
    icon: '😕'
  }
};
```

### 6.2 Error Boundary Component
```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    errorReporter.log(error, errorInfo);
    
    // Track in analytics
    analytics.track('Error Boundary Triggered', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetError={() => this.setState({ hasError: false })}
        />
      );
    }
    
    return this.props.children;
  }
}

// Friendly error UI
function ErrorFallback({ error, resetError }) {
  const errorType = classifyError(error);
  const message = errorMessages[errorType];
  
  return (
    <div className="error-fallback">
      <div className="error-icon">{message.icon}</div>
      <h2>{message.title}</h2>
      <p>{message.message}</p>
      <button onClick={resetError}>{message.action}</button>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="error-details">
          <summary>Error Details</summary>
          <pre>{error.stack}</pre>
        </details>
      )}
    </div>
  );
}
```

## 7. ERROR LOGGING & MONITORING

### 7.1 Structured Error Logging
```typescript
class ErrorLogger {
  private queue: ErrorLog[] = [];
  private batchSize = 10;
  private flushInterval = 5000;
  
  log(error: Error, context?: any) {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      level: this.getErrorLevel(error),
      type: this.classifyError(error),
      message: error.message,
      stack: error.stack,
      context,
      
      // Enrichment
      userId: getCurrentUserId(),
      sessionId: getSessionId(),
      campaignId: getCampaignId(),
      browser: getBrowserInfo(),
      url: window.location.href,
      
      // Metrics
      memoryUsage: performance.memory?.usedJSHeapSize,
      connectionType: navigator.connection?.effectiveType
    };
    
    this.queue.push(errorLog);
    
    // Immediate flush for critical errors
    if (errorLog.level === 'critical') {
      this.flush();
    }
  }
  
  private async flush() {
    if (this.queue.length === 0) return;
    
    const batch = this.queue.splice(0, this.batchSize);
    
    try {
      await fetch('/api/errors/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch)
      });
    } catch (error) {
      // Store locally if can't send
      this.storeLocally(batch);
    }
  }
}
```

### 7.2 Error Analytics
```typescript
class ErrorAnalytics {
  // Track error patterns
  async analyzePatterns() {
    const errors = await this.getRecentErrors();
    
    const patterns = {
      byType: this.groupBy(errors, 'type'),
      byUser: this.groupBy(errors, 'userId'),
      byTime: this.groupByTime(errors),
      byEndpoint: this.groupBy(errors, 'endpoint')
    };
    
    // Detect anomalies
    for (const [type, count] of Object.entries(patterns.byType)) {
      const baseline = await this.getBaseline(type);
      
      if (count > baseline * 2) {
        await this.alert({
          type: 'ERROR_SPIKE',
          errorType: type,
          count,
          baseline
        });
      }
    }
    
    return patterns;
  }
}
```

## 8. DEBUGGING TOOLS

### 8.1 Error Reproduction
```typescript
class ErrorReproducer {
  // Capture state for error reproduction
  captureState(error: Error) {
    return {
      error: {
        message: error.message,
        stack: error.stack
      },
      state: {
        redux: store.getState(),
        localStorage: { ...localStorage },
        sessionStorage: { ...sessionStorage },
        cookies: document.cookie
      },
      network: {
        requests: this.captureNetworkRequests(),
        responses: this.captureNetworkResponses()
      },
      user: {
        actions: this.getUserActions(),
        path: this.getUserPath()
      }
    };
  }
  
  // Replay error scenario
  async replay(capturedState: CapturedState) {
    // Restore state
    store.dispatch(restoreState(capturedState.state.redux));
    
    // Replay network requests
    for (const request of capturedState.network.requests) {
      await this.replayRequest(request);
    }
    
    // Replay user actions
    for (const action of capturedState.user.actions) {
      await this.replayAction(action);
    }
  }
}
```

## 9. COMMON ERROR SCENARIOS

### 9.1 Mentionlytics API Failure
```typescript
// Scenario: Mentionlytics API is down
async function handleMentionlyticsFailure() {
  // 1. Circuit breaker opens
  // 2. Fallback to cached data
  // 3. If no cache, use mock data
  // 4. Show degraded mode indicator
  // 5. Retry every 60 seconds
  
  try {
    return await fetchMentionlyticsData();
  } catch (error) {
    // Check cache
    const cached = await getCachedMentionlyticsData();
    if (cached && cached.age < 3600000) { // 1 hour
      showNotification('Using cached data');
      return cached.data;
    }
    
    // Use mock data
    showNotification('Using sample data - live data temporarily unavailable');
    return mockMentionlyticsData;
  }
}
```

### 9.2 WebSocket Disconnection
```typescript
// Scenario: WebSocket connection lost
class WebSocketReconnector {
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  
  async handleDisconnection() {
    // 1. Show connection lost indicator
    showConnectionStatus('disconnected');
    
    // 2. Queue messages locally
    this.startMessageQueue();
    
    // 3. Attempt reconnection with backoff
    while (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      await this.sleep(delay);
      
      try {
        await this.reconnect();
        showConnectionStatus('connected');
        await this.flushMessageQueue();
        break;
      } catch {
        this.reconnectAttempts++;
      }
    }
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      // 4. Fall back to polling
      this.startPolling();
    }
  }
}
```

## 10. ERROR HANDLING CHECKLIST

### Development
- [ ] All promises have .catch handlers
- [ ] Error boundaries wrap components
- [ ] Network requests have timeout
- [ ] Retry logic for transient failures
- [ ] Fallback UI for all error states
- [ ] User-friendly error messages
- [ ] Error logging configured
- [ ] Circuit breakers for external services

### Production
- [ ] Error monitoring dashboard
- [ ] Alert thresholds configured
- [ ] Incident response runbooks
- [ ] Error budget defined
- [ ] Rollback procedures ready
- [ ] Status page configured
- [ ] Customer communication templates
- [ ] Post-mortem process defined

---

**Remember**: Errors are inevitable. How we handle them defines the user experience. Every error is an opportunity to make the system more resilient.

*"The best error is the one the user never sees."*