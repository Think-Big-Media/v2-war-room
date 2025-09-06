# DEBUGGING PROTOCOL - EVIDENCE-BASED TROUBLESHOOTING

## 🔍 SYSTEMATIC DEBUGGING METHODOLOGY

### **THE EVIDENCE-FIRST APPROACH:**
1. **NEVER GUESS** → Collect concrete evidence first
2. **REPRODUCE CONSISTENTLY** → Identify exact steps to trigger issue
3. **ISOLATE VARIABLES** → Change one thing at a time
4. **DOCUMENT EVERYTHING** → Track what works and what doesn't
5. **VALIDATE FIXES** → Prove the solution actually works

---

## 🚨 CRITICAL DEBUGGING SEQUENCE

### **STEP 1: INCIDENT RESPONSE (First 5 Minutes)**
- ✅ **Stop the bleeding** → Prevent further damage
- ✅ **Assess severity** → P0 (critical), P1 (high), P2 (medium), P3 (low)
- ✅ **Gather initial evidence** → Error messages, logs, user reports
- ✅ **Check recent changes** → What was deployed/changed recently?
- ✅ **Establish timeline** → When did the issue start?

```bash
# Emergency Response Commands
git log --oneline --since="24 hours ago"  # Recent changes
git diff HEAD~5 HEAD                       # Last 5 commits
git status                                 # Current state
tail -f /var/log/application.log          # Real-time logs
```

### **STEP 2: EVIDENCE COLLECTION (Next 10 Minutes)**
- ✅ **Reproduce the bug** → Document exact steps
- ✅ **Capture screenshots/videos** → Visual evidence
- ✅ **Collect error logs** → Full stack traces, not just summaries
- ✅ **Check system resources** → CPU, memory, disk usage
- ✅ **Verify environment** → Correct configuration, dependencies

```typescript
// Debugging Instrumentation
const debugLog = (context: string, data: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔍 [DEBUG] ${context}`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('Data:', JSON.stringify(data, null, 2));
    console.trace('Stack trace');
    console.groupEnd();
  }
};

// Error Boundary with Detailed Logging
class DebuggingErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Error Boundary Caught:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }
}
```

### **STEP 3: HYPOTHESIS FORMATION (Next 10 Minutes)**
- ✅ **List possible causes** → Rank by probability
- ✅ **Identify test cases** → How to prove/disprove each hypothesis
- ✅ **Consider related systems** → What else might be affected?
- ✅ **Check similar issues** → Search codebase, documentation, forums

```javascript
// Debugging Hypothesis Template
const debuggingHypotheses = [
  {
    hypothesis: "API endpoint is returning 500 errors",
    probability: "high",
    testMethod: "Check network tab, curl the endpoint directly",
    evidence: ["Error console shows 500", "Happens on API calls"]
  },
  {
    hypothesis: "Frontend state management issue", 
    probability: "medium",
    testMethod: "Check Redux DevTools, component state",
    evidence: ["UI not updating", "API calls succeed"]
  },
  {
    hypothesis: "Database connection timeout",
    probability: "low", 
    testMethod: "Check database logs, connection pool status",
    evidence: ["Intermittent failures", "High traffic periods"]
  }
];
```

### **STEP 4: SYSTEMATIC TESTING (Next 20 Minutes)**
- ✅ **Test highest probability hypothesis first**
- ✅ **Change ONE variable at a time**
- ✅ **Document each test result**
- ✅ **Verify negative cases** → Ensure fix doesn't break other things

```bash
# Systematic Testing Workflow
echo "Testing Hypothesis 1: API Endpoint Issue"
curl -v https://api.example.com/endpoint  # Direct API test
echo "Result: API returns 200 OK"         # Document result

echo "Testing Hypothesis 2: Frontend State"  
# Open React DevTools, check component state
echo "Result: State updates correctly"        # Document result

echo "Testing Hypothesis 3: Database Connection"
# Check database connection logs
echo "Result: Connection pool at 95% capacity" # Found the issue!
```

---

## 🛠️ DEBUGGING TOOLS & TECHNIQUES

### **FRONTEND DEBUGGING:**
```typescript
// React Component Debugging
const ComponentDebugger = ({ children, name }) => {
  useEffect(() => {
    console.log(`🔄 ${name} mounted`);
    return () => console.log(`🗑️ ${name} unmounted`);
  }, []);
  
  const [renderCount, setRenderCount] = useState(0);
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log(`🔄 ${name} rendered (${renderCount + 1} times)`);
  });
  
  return children;
};

// State Change Tracking
const useStateWithLogging = (initialValue, name) => {
  const [value, setValue] = useState(initialValue);
  
  const setValueWithLogging = (newValue) => {
    console.log(`📝 ${name} changing:`, {
      from: value,
      to: newValue,
      timestamp: Date.now()
    });
    setValue(newValue);
  };
  
  return [value, setValueWithLogging];
};

// Network Request Debugging
const debuggedFetch = async (url, options) => {
  console.log(`🌐 Requesting: ${url}`, options);
  const start = performance.now();
  
  try {
    const response = await fetch(url, options);
    const duration = performance.now() - start;
    
    console.log(`✅ Response (${duration}ms):`, {
      status: response.status,
      headers: Object.fromEntries(response.headers),
      url: response.url
    });
    
    return response;
  } catch (error) {
    console.error(`❌ Request failed (${performance.now() - start}ms):`, error);
    throw error;
  }
};
```

### **BACKEND DEBUGGING:**
```typescript
// API Endpoint Debugging
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`📥 ${req.method} ${req.path}`, {
    headers: req.headers,
    query: req.query,
    body: req.body,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`📤 Response ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Database Query Debugging  
const debuggedQuery = async (query, params) => {
  console.log(`🗄️ SQL Query:`, { query, params });
  const start = performance.now();
  
  try {
    const result = await db.query(query, params);
    const duration = performance.now() - start;
    
    console.log(`✅ Query Success (${duration}ms):`, {
      rowCount: result.rowCount,
      fields: result.fields?.map(f => f.name)
    });
    
    return result;
  } catch (error) {
    console.error(`❌ Query Failed (${performance.now() - start}ms):`, error);
    throw error;
  }
};
```

---

## 🎯 COMMON BUG PATTERNS & SOLUTIONS

### **ASYNC/AWAIT ISSUES:**
```typescript
// ❌ Common Mistake: Not awaiting async operations
const fetchUserData = async () => {
  const user = await getUser();
  const profile = getUserProfile(user.id); // Missing await!
  return { user, profile };
};

// ✅ Correct: Proper async handling  
const fetchUserData = async () => {
  const user = await getUser();
  const profile = await getUserProfile(user.id);
  return { user, profile };
};

// 🔍 Debugging: Log async operations
const fetchUserDataDebug = async () => {
  console.log('🔄 Fetching user...');
  const user = await getUser();
  console.log('✅ User fetched:', user.id);
  
  console.log('🔄 Fetching profile...');
  const profile = await getUserProfile(user.id);
  console.log('✅ Profile fetched:', profile);
  
  return { user, profile };
};
```

### **STATE MANAGEMENT BUGS:**
```typescript
// ❌ Common Mistake: Direct state mutation
const updateUser = (user) => {
  user.name = "New Name"; // Mutating state directly!
  setUser(user);
};

// ✅ Correct: Immutable updates
const updateUser = (user) => {
  setUser(prev => ({
    ...prev,
    name: "New Name"
  }));
};

// 🔍 Debugging: State change tracking
const useDebugState = (initialState, label) => {
  const [state, setState] = useState(initialState);
  
  const setStateWithDebug = (newState) => {
    console.log(`📝 ${label} State Change:`, {
      previous: state,
      next: newState,
      timestamp: Date.now()
    });
    setState(newState);
  };
  
  return [state, setStateWithDebug];
};
```

### **API INTEGRATION BUGS:**
```typescript
// ❌ Common Mistake: No error handling
const fetchData = async () => {
  const response = await fetch('/api/data');
  const data = await response.json(); // Could fail!
  return data;
};

// ✅ Correct: Comprehensive error handling
const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error('Response is not JSON');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('🚨 API Error:', error);
    throw error;
  }
};

// 🔍 Debugging: Request/Response logging
const fetchDataWithLogging = async (url) => {
  console.log(`🌐 Making request to: ${url}`);
  
  try {
    const response = await fetch(url);
    console.log(`📡 Response received:`, {
      status: response.status,
      headers: Object.fromEntries(response.headers),
      ok: response.ok
    });
    
    const data = await response.json();
    console.log(`📦 Data parsed:`, data);
    
    return data;
  } catch (error) {
    console.error(`❌ Request failed:`, error);
    throw error;
  }
};
```

---

## 📊 PERFORMANCE DEBUGGING

### **FRONTEND PERFORMANCE:**
```typescript
// React Performance Debugging
const useRenderTracker = (componentName) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());
  
  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    console.log(`🎨 ${componentName} render #${renderCount.current}`, {
      timeSinceLastRender,
      timestamp: now
    });
    
    lastRenderTime.current = now;
  });
};

// Memory Leak Detection
const useMemoryTracker = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (performance.memory) {
        console.log('💾 Memory usage:', {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        });
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
};
```

### **NETWORK PERFORMANCE:**
```typescript
// Network Request Performance Monitoring
const performanceMonitor = {
  startTimer(label) {
    const timer = {
      label,
      start: performance.now(),
      marks: []
    };
    
    this.timers = this.timers || new Map();
    this.timers.set(label, timer);
    
    return {
      mark: (markName) => {
        timer.marks.push({
          name: markName,
          time: performance.now() - timer.start
        });
      },
      end: () => {
        const duration = performance.now() - timer.start;
        console.log(`⏱️ ${label} completed in ${duration.toFixed(2)}ms`, {
          marks: timer.marks,
          totalDuration: duration
        });
        this.timers.delete(label);
        return duration;
      }
    };
  }
};

// Usage Example
const fetchWithPerformanceTracking = async (url) => {
  const timer = performanceMonitor.startTimer(`Fetch ${url}`);
  
  try {
    timer.mark('request-start');
    const response = await fetch(url);
    timer.mark('response-received');
    
    const data = await response.json();
    timer.mark('data-parsed');
    
    return data;
  } finally {
    timer.end();
  }
};
```

---

## 🔧 DEBUGGING CHECKLIST

### **BEFORE DEBUGGING:**
- [ ] Can you reproduce the issue consistently?
- [ ] Do you have error messages or stack traces?
- [ ] When did the issue start appearing?
- [ ] What changed recently?
- [ ] Is this affecting all users or specific users?

### **DURING DEBUGGING:**
- [ ] Are you testing one hypothesis at a time?
- [ ] Are you documenting each test and result?
- [ ] Are you checking both success and failure cases?
- [ ] Have you verified your assumptions?
- [ ] Are you looking at the actual data/logs, not just summaries?

### **AFTER DEBUGGING:**
- [ ] Does your fix actually solve the root cause?
- [ ] Have you tested the fix in multiple scenarios?
- [ ] Will this prevent similar issues in the future?
- [ ] Have you documented the issue and solution?
- [ ] Are there monitoring/alerting improvements needed?

---

**This debugging protocol ensures systematic, evidence-based problem solving that prevents recurring issues and builds team knowledge.**