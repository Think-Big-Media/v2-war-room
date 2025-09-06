# EPE FRAMEWORK - 6-STAGE AUTOMATED DEVELOPMENT PIPELINE

## 🎯 E-P-E-R-F-D WORKFLOW AUTOMATION

### **AUTO-TRIGGERS ON KEYWORDS:**
```javascript
const epeKeywords = [
  "build", "create", "implement", "develop", "add",
  "fix", "debug", "refactor", "optimize", "update"
];

// Framework automatically activates when user says:
// "Build a dashboard" → EPE workflow starts
// "Fix the authentication" → EPE workflow starts  
// "Add user management" → EPE workflow starts
```

---

## 📋 STAGE 1: EXPLORE (Research & Understanding)

### **MANDATORY EXPLORATION CHECKLIST:**
- ✅ **Search existing codebase** for similar patterns
- ✅ **Read relevant documentation** (internal + external)
- ✅ **Understand current architecture** and constraints
- ✅ **Identify dependencies** and integration points
- ✅ **Research best practices** for the specific feature
- ✅ **Map user requirements** to technical specifications

### **EXPLORATION TOOLS:**
```bash
# Codebase Analysis
grep -r "pattern" src/
find . -name "*.tsx" -exec grep "component" {} \;

# Documentation Review
ls docs/
cat README.md
cat ARCHITECTURE.md

# Dependency Check  
cat package.json | grep dependencies
npm ls --depth=0
```

### **EXPLORATION OUTPUT:**
- **Requirements Document**: What needs to be built
- **Technical Analysis**: How it integrates with existing code
- **Dependency Map**: What libraries/services are needed
- **Risk Assessment**: Potential blockers and challenges

---

## 🗺️ STAGE 2: PLAN (Design Solution Architecture)

### **PLANNING REQUIREMENTS:**
- ✅ **Create detailed task breakdown** (use TodoWrite tool)
- ✅ **Design component architecture** with clear interfaces
- ✅ **Plan data flow** (state management, API calls)
- ✅ **Define testing strategy** (unit, integration, E2E)
- ✅ **Identify potential edge cases** and error scenarios
- ✅ **Estimate complexity** and development time

### **PLANNING TEMPLATES:**
```typescript
// Component Planning Template
interface ComponentPlan {
  name: string;
  purpose: string;
  props: PropDefinition[];
  state: StateDefinition[];
  dependencies: string[];
  children: ComponentPlan[];
  tests: TestPlan[];
}

// API Planning Template  
interface APIPlan {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  request: RequestSchema;
  response: ResponseSchema;
  errorCases: ErrorCase[];
  authentication: AuthRequirement;
}
```

### **PLANNING OUTPUT:**
- **Implementation Roadmap**: Step-by-step development plan
- **Architecture Diagram**: Visual representation of solution
- **API Specifications**: Detailed endpoint documentation
- **Test Plan**: Comprehensive testing strategy

---

## ⚡ STAGE 3: EXECUTE (Implementation & Development)

### **EXECUTION PRINCIPLES:**
- ✅ **Foundation First**: Build from bottom-up (utils → components → pages)
- ✅ **One Component at a Time**: Complete each before moving to next
- ✅ **Test as You Go**: Write tests immediately after implementation
- ✅ **Frequent Commits**: Commit working code every 15-30 minutes
- ✅ **Mock Data First**: Use mock data until API is ready
- ✅ **Error Handling**: Implement error states from the start

### **EXECUTION WORKFLOW:**
```typescript
// 1. Create Types & Interfaces
interface User {
  id: string;
  email: string;
  name: string;
}

// 2. Create Utilities & Helpers
const formatUser = (user: User): FormattedUser => {
  return {
    ...user,
    displayName: user.name || user.email
  };
};

// 3. Create Custom Hooks
const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);
  
  return { user, loading };
};

// 4. Create Components
const UserProfile = ({ userId }: { userId: string }) => {
  const { user, loading } = useUser(userId);
  
  if (loading) return <Spinner />;
  if (!user) return <ErrorMessage />;
  
  return <div>{formatUser(user).displayName}</div>;
};

// 5. Create Tests
test('UserProfile displays user name', async () => {
  render(<UserProfile userId="123" />);
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### **EXECUTION CHECKPOINTS:**
- **After each component**: Run tests, check TypeScript errors
- **After each feature**: Test in browser, validate user experience  
- **Before each commit**: Lint code, run full test suite
- **End of session**: Deploy to staging, document progress

---

## 🔍 STAGE 4: REVIEW (Quality Assurance & Testing)

### **REVIEW CHECKLIST:**
- ✅ **Code Review**: Check for best practices, security, performance
- ✅ **Functionality Testing**: Verify all features work as expected
- ✅ **Edge Case Testing**: Test error scenarios and boundary conditions
- ✅ **Accessibility Testing**: Ensure WCAG compliance
- ✅ **Performance Testing**: Check load times, memory usage
- ✅ **Security Review**: Validate against OWASP Top 10

### **AUTOMATED TESTING PIPELINE:**
```bash
# Pre-commit Testing
npm run lint              # ESLint + Prettier
npm run type-check        # TypeScript validation
npm run test:unit         # Jest unit tests
npm run test:integration  # Component integration tests
npm run test:e2e         # Playwright end-to-end tests
npm run test:security    # Security vulnerability scan
npm run build            # Production build test
```

### **MANUAL TESTING PROCEDURES:**
- **User Flow Testing**: Complete primary user journeys
- **Browser Compatibility**: Test in Chrome, Firefox, Safari
- **Mobile Responsiveness**: Test on various screen sizes
- **Accessibility**: Test with keyboard navigation and screen readers
- **Performance**: Test with slow network and older devices

---

## ✨ STAGE 5: FEATURE (Enhancement & Polish)

### **ENHANCEMENT OPPORTUNITIES:**
- ✅ **User Experience Polish**: Micro-interactions, loading states
- ✅ **Performance Optimization**: Code splitting, lazy loading
- ✅ **Accessibility Improvements**: Better ARIA labels, keyboard navigation
- ✅ **Mobile Experience**: Touch-friendly interactions
- ✅ **Error Recovery**: Better error messages and recovery flows
- ✅ **Analytics Integration**: Track user interactions

### **POLISH CHECKLIST:**
```typescript
// Loading States
const [loading, setLoading] = useState(false);
return loading ? <Skeleton /> : <Content />;

// Error States
const [error, setError] = useState<string | null>(null);
if (error) return <ErrorBoundary error={error} onRetry={retry} />;

// Empty States  
if (data.length === 0) return <EmptyState />;

// Optimistic Updates
const handleLike = async (postId: string) => {
  setOptimisticLike(postId); // Immediate UI update
  try {
    await likePost(postId);
  } catch (error) {
    setOptimisticLike(postId, false); // Revert on error
  }
};

// Micro-interactions
const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};
```

### **ANALYTICS & MONITORING:**
```typescript
// Feature Usage Tracking
const trackFeatureUsage = (feature: string, action: string) => {
  analytics.track(`${feature}_${action}`, {
    timestamp: Date.now(),
    userId: getCurrentUserId(),
    sessionId: getSessionId()
  });
};

// Performance Monitoring
const measurePerformance = (operation: string, fn: () => Promise<any>) => {
  const start = performance.now();
  return fn().finally(() => {
    const duration = performance.now() - start;
    analytics.track('performance', { operation, duration });
  });
};
```

---

## 📝 STAGE 6: DOCUMENT (Knowledge Capture & Handoff)

### **DOCUMENTATION REQUIREMENTS:**
- ✅ **Code Comments**: Document complex logic and business rules
- ✅ **API Documentation**: Update OpenAPI specs for new endpoints
- ✅ **Component Documentation**: Storybook stories with examples
- ✅ **User Documentation**: Update help docs and tutorials
- ✅ **Developer Documentation**: Architecture decisions and patterns
- ✅ **Deployment Documentation**: Update deployment procedures

### **DOCUMENTATION TEMPLATES:**
```typescript
/**
 * UserProfile Component
 * 
 * Displays user information with real-time status updates
 * 
 * @param userId - Unique identifier for the user
 * @param showStatus - Whether to display online/offline status
 * @param onEdit - Callback when user clicks edit button
 * 
 * @example
 * <UserProfile 
 *   userId="123" 
 *   showStatus={true}
 *   onEdit={(user) => openEditModal(user)}
 * />
 */
const UserProfile = ({ userId, showStatus, onEdit }) => {
  // Implementation
};

// Storybook Story
export const Default = {
  args: {
    userId: "123",
    showStatus: true,
    onEdit: action('edit')
  }
};

// API Documentation
/**
 * GET /api/users/:id
 * 
 * Retrieves user profile information
 * 
 * @param id - User ID (UUID format)
 * @returns User object with profile data
 * @throws 404 - User not found
 * @throws 403 - Insufficient permissions
 */
```

### **KNOWLEDGE TRANSFER:**
- **Architecture Decision Records (ADRs)**: Document why choices were made
- **Runbooks**: Step-by-step operational procedures
- **Troubleshooting Guides**: Common issues and solutions
- **Performance Benchmarks**: Expected metrics and thresholds
- **Security Considerations**: Threat models and mitigations

---

## 🎯 EPE AUTOMATION TRIGGERS

### **SMART CONTEXT DETECTION:**
```javascript
// Auto-detects development intent
const contextClassifier = {
  "new feature": ["build", "create", "add new"],
  "bug fix": ["fix", "debug", "resolve", "issue"],
  "enhancement": ["improve", "optimize", "refactor"],
  "integration": ["connect", "integrate", "sync"],
  "maintenance": ["update", "upgrade", "migrate"]
};

// Automatically applies appropriate EPE variant
const epeVariants = {
  newFeature: "Full 6-stage EPE process",
  bugFix: "Explore → Plan → Execute → Review (abbreviated)",
  enhancement: "Plan → Execute → Feature → Review",
  integration: "Explore → Plan → Execute → Document"
};
```

### **WORKFLOW OPTIMIZATION:**
- **Parallel Execution**: Run tests while implementing next component
- **Incremental Delivery**: Deploy working features immediately  
- **Continuous Integration**: Automated quality checks at each stage
- **Rapid Iteration**: Quick feedback loops with stakeholders

---

**The EPE Framework ensures systematic, high-quality development with automatic quality assurance and comprehensive documentation.**