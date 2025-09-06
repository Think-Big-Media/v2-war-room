# PROGRAMMING RULES - DRY PRINCIPLES & MODULARITY

## 🎯 FOUNDATION-FIRST DEVELOPMENT SEQUENCE

### **MANDATORY ORDER:**
1. **Foundation Layer** - Core utilities, types, constants
2. **Service Layer** - API clients, data services
3. **Component Layer** - Reusable UI components
4. **Page Layer** - Route components
5. **Integration Layer** - Connect everything
6. **Testing Layer** - Comprehensive coverage

### **CHECKPOINT REQUIREMENTS:**
- ✅ Each layer builds on previous
- ✅ No forward dependencies (lower layers can't import higher)
- ✅ Each layer has defined interfaces
- ✅ Mock data available for all layers during development

---

## 🔄 DRY PRINCIPLES (DON'T REPEAT YOURSELF)

### **CODE REUSE HIERARCHY:**
1. **Constants** → Single source of truth
2. **Utilities** → Pure functions for common operations
3. **Hooks** → Stateful logic reuse
4. **Components** → UI pattern reuse
5. **Services** → Business logic reuse

### **ANTI-PATTERNS TO AVOID:**
- ❌ Copy-paste code blocks
- ❌ Hardcoded strings/numbers in multiple places
- ❌ Duplicate API calls
- ❌ Repeated validation logic
- ❌ Similar components without abstraction

---

## 🏗️ MODULAR ARCHITECTURE

### **FILE ORGANIZATION:**
```
src/
├── constants/          # App-wide constants
├── types/              # TypeScript definitions
├── utils/              # Pure utility functions
├── hooks/              # Custom React hooks
├── services/           # API and data services
├── components/         # Reusable UI components
│   ├── common/         # Basic components (Button, Input)
│   ├── forms/          # Form-specific components
│   └── layout/         # Layout components
├── pages/              # Route components
└── contexts/           # React contexts
```

### **IMPORT RULES:**
- ✅ Import from index files (`from './components'`)
- ✅ Use relative imports within same module
- ✅ Absolute imports for cross-module dependencies
- ❌ Deep imports (`from './components/forms/UserForm/validation'`)

---

## 🛡️ ERROR HANDLING STANDARDS

### **ERROR BOUNDARY PATTERN:**
```typescript
// Every major section gets error boundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

### **API ERROR HANDLING:**
```typescript
const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const execute = async (apiCall: () => Promise<any>) => {
    try {
      setLoading(true);
      setError(null);
      return await apiCall();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { execute, loading, error };
};
```

### **VALIDATION PATTERN:**
```typescript
// Single validation schema per form
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

// Reusable validation hook
const useValidation = (schema: ZodSchema) => {
  const validate = (data: any) => {
    try {
      return { success: true, data: schema.parse(data) };
    } catch (error) {
      return { success: false, errors: error.errors };
    }
  };
  return { validate };
};
```

---

## 🎨 COMPONENT PATTERNS

### **COMPOUND COMPONENT PATTERN:**
```typescript
// Card.tsx
const Card = ({ children }) => (
  <div className="card">{children}</div>
);

Card.Header = ({ children }) => (
  <div className="card-header">{children}</div>
);

Card.Body = ({ children }) => (
  <div className="card-body">{children}</div>
);

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

### **RENDER PROP PATTERN:**
```typescript
const DataFetcher = ({ render, url }) => {
  const { data, loading, error } = useFetch(url);
  return render({ data, loading, error });
};

// Usage
<DataFetcher 
  url="/api/users" 
  render={({ data, loading }) => 
    loading ? <Spinner /> : <UserList users={data} />
  } 
/>
```

---

## ⚡ PERFORMANCE RULES

### **OPTIMIZATION CHECKLIST:**
- ✅ Memoize expensive calculations (`useMemo`)
- ✅ Memoize callback functions (`useCallback`)
- ✅ Split large components into smaller ones
- ✅ Lazy load routes (`React.lazy`)
- ✅ Optimize images (WebP, proper sizing)
- ✅ Use React.memo for pure components

### **BUNDLE OPTIMIZATION:**
```typescript
// Lazy loading
const Dashboard = React.lazy(() => import('./Dashboard'));

// Dynamic imports for large libraries
const loadChartLibrary = () => import('chart.js');

// Code splitting by route
const routes = [
  { path: '/', component: React.lazy(() => import('./Home')) },
  { path: '/dashboard', component: React.lazy(() => import('./Dashboard')) }
];
```

---

## 🧪 TESTING INTEGRATION

### **TESTING PYRAMID:**
1. **Unit Tests** (70%) - Pure functions, hooks, utilities
2. **Integration Tests** (20%) - Component interactions
3. **E2E Tests** (10%) - Critical user flows

### **MOCK DATA PATTERN:**
```typescript
// __mocks__/data.ts
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User'
};

// Hook with mock support
export const useAuth = (mockData?: User) => {
  if (process.env.NODE_ENV === 'test' && mockData) {
    return { user: mockData, loading: false };
  }
  // Real implementation
};
```

---

## 🔧 DEVELOPMENT WORKFLOW

### **FEATURE DEVELOPMENT STEPS:**
1. **Create types** for new data structures
2. **Create constants** for magic numbers/strings
3. **Create utilities** for data processing
4. **Create hooks** for stateful logic
5. **Create components** for UI
6. **Create pages** that use components
7. **Add tests** for each layer
8. **Integration testing**

### **REFACTORING TRIGGERS:**
- 🚨 Copy-paste detected (extract to utility/component)
- 🚨 Function >50 lines (break into smaller functions)
- 🚨 Component >200 lines (split into smaller components)
- 🚨 File >400 lines (split into multiple files)
- 🚨 Nested ternary operators (extract to function)

---

**These rules ensure maintainable, scalable, and efficient code architecture.**