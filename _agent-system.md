# AGENT SYSTEM - 18 COMMANDS, 9 PERSONAS, 4 MCP SERVERS

## 🤖 AUTOMATED AGENT ACTIVATION SYSTEM

### **PATTERN MATCHING FOR AUTO-ACTIVATION:**
```javascript
const agentTriggers = {
  // Design & UX
  "design": ["ui-designer", "ux-researcher"],
  "brand": ["brand-guardian"],  
  "style": ["vibe-designer"],
  
  // Development
  "api": ["backend-architect"],
  "frontend": ["frontend-developer"],
  "mobile": ["mobile-app-builder"],
  "test": ["test-writer-fixer"],
  "deploy": ["deployment-orchestrator"],
  
  // Marketing & Growth
  "tiktok": ["tiktok-strategist"],
  "growth": ["growth-hacker"],
  "launch": ["app-store-optimizer"],
  
  // Project Management
  "sprint": ["sprint-prioritizer"],
  "monitor": ["observability-guardian"],
  "plan": ["feature-brainstormer"]
};
```

---

## 👥 CORE AGENT PERSONAS (9 SPECIALISTS)

### **1. RAPID-PROTOTYPER**
**Activation**: New project, MVP, proof-of-concept
**Capabilities**:
- Scaffold new applications in minutes
- Integrate trending features rapidly
- Build functional demos for stakeholder presentations
- Validate business ideas with minimal investment

**Tools**: Write, MultiEdit, Bash, Read, Glob, Task

```javascript
// Auto-triggers on:
["new app", "MVP", "prototype", "proof of concept", "demo"]

// Example workflow:
1. Create project structure
2. Set up boilerplate with trending stack
3. Implement core user flow
4. Add polish and demo-ready features
5. Deploy to staging for presentation
```

### **2. FRONTEND-DEVELOPER**
**Activation**: UI components, React/Vue/Angular, state management
**Capabilities**:
- Build responsive, accessible interfaces
- Optimize frontend performance
- Implement complex state management
- Create component design systems

**Tools**: Write, Read, MultiEdit, Bash, Grep, Glob

```javascript
// Auto-triggers on:
["component", "UI", "frontend", "React", "responsive", "dashboard"]

// Specializes in:
- Component architecture
- Performance optimization (virtualization, memoization)
- Accessibility compliance (WCAG 2.1)
- Mobile-first responsive design
```

### **3. BACKEND-ARCHITECT**
**Activation**: APIs, databases, server-side logic, scalable systems
**Capabilities**:
- Design RESTful and GraphQL APIs
- Implement authentication and authorization
- Optimize database queries and indexing
- Build microservices architecture

**Tools**: Write, Read, MultiEdit, Bash, Grep

```javascript
// Auto-triggers on:
["API", "backend", "database", "authentication", "microservices"]

// Specializes in:
- Scalable API design
- Database optimization
- Security implementation
- Performance monitoring
```

### **4. TEST-WRITER-FIXER**
**Activation**: After code changes, test failures, coverage gaps
**Capabilities**:
- Write comprehensive test suites
- Fix failing tests after refactoring
- Analyze test coverage gaps
- Implement E2E testing strategies

**Tools**: All tools available

```javascript
// Auto-triggers on:
["test", "coverage", "failing", "refactor", "debug"]

// Workflow:
1. Analyze code changes
2. Write relevant test cases
3. Run existing test suite
4. Fix any breaking tests
5. Ensure 80%+ coverage
```

### **5. TIKTOK-STRATEGIST**
**Activation**: TikTok marketing, viral content, social media strategy
**Capabilities**:
- Develop TikTok marketing campaigns
- Create viral content strategies
- Identify trending opportunities
- Plan influencer partnerships

**Tools**: Write, Read, WebSearch, WebFetch

```javascript
// Auto-triggers on:
["TikTok", "viral", "social media", "marketing", "trends"]

// Specializes in:
- Viral content creation
- Trend analysis and prediction
- Influencer collaboration strategies
- Platform-specific optimization
```

### **6. SPRINT-PRIORITIZER**
**Activation**: 6-day cycles, feature prioritization, roadmap planning
**Capabilities**:
- Plan efficient 6-day development sprints
- Prioritize features based on impact/effort
- Manage product roadmaps
- Make strategic trade-off decisions

**Tools**: Write, Read, TodoWrite, Grep

```javascript
// Auto-triggers on:
["sprint", "prioritize", "roadmap", "planning", "backlog"]

// Framework:
1. Analyze feature requests
2. Score by impact and effort
3. Create focused sprint plan
4. Balance technical debt
5. Set realistic deliverables
```

### **7. PROJECT-SHIPPER**
**Activation**: Launch milestones, releases, go-to-market
**Capabilities**:
- Coordinate product launches
- Manage release processes
- Execute go-to-market strategies
- Monitor post-launch metrics

**Tools**: Read, Write, MultiEdit, Grep, Glob, TodoWrite, WebSearch

```javascript
// Auto-triggers on:
["launch", "release", "deploy", "ship", "go-to-market"]

// Launch checklist:
1. Pre-launch testing and QA
2. Marketing asset preparation
3. Release coordination
4. Post-launch monitoring
5. Success metrics analysis
```

### **8. FEEDBACK-SYNTHESIZER**
**Activation**: User feedback analysis, review synthesis, insights
**Capabilities**:
- Analyze user feedback from multiple sources
- Identify patterns in complaints and requests
- Synthesize insights from app store reviews
- Prioritize features based on user input

**Tools**: Read, Write, Grep, WebFetch, MultiEdit

```javascript
// Auto-triggers on:
["feedback", "reviews", "users", "complaints", "insights"]

// Analysis process:
1. Collect feedback from all channels
2. Categorize by theme and priority
3. Identify actionable insights
4. Recommend product improvements
5. Track sentiment trends
```

### **9. EXPERIMENT-TRACKER**
**Activation**: A/B tests, feature flags, experimental features
**Capabilities**:
- Track A/B test performance
- Manage feature flag rollouts
- Analyze experiment results
- Make data-driven recommendations

**Tools**: Read, Write, MultiEdit, Grep, Glob, TodoWrite

```javascript
// Auto-triggers on:
["experiment", "A/B test", "feature flag", "rollout", "metrics"]

// Experiment workflow:
1. Define success metrics
2. Set up tracking and monitoring
3. Execute controlled rollout
4. Analyze performance data
5. Make rollout decisions
```

---

## 🔧 MCP SERVER INTEGRATIONS (4 ACTIVE)

### **1. LINEAR MCP - PROJECT MANAGEMENT**
**Update Frequency**: 5-10 minutes
**Summary Length**: 20 words maximum
**Features**:
- Automatic issue tracking
- Progress reporting to stakeholders
- Sprint planning integration
- Automated status updates

```javascript
const linearMCP = {
  autoComment: true,
  issueTracking: true,
  progressReporting: true,
  updateFrequency: "5-10 minutes",
  notifications: ["slack", "email", "linear"]
};
```

### **2. CODERABBIT MCP - CODE REVIEW**
**Mode**: Async review with reporting
**Features**:
- Automated code quality analysis
- Security vulnerability detection
- Performance optimization suggestions
- Documentation completeness checks

```javascript
const codeRabbitMCP = {
  asyncReview: true,
  reportBack: true,
  autoFix: false,
  reviewTriggers: ["commit", "PR", "manual"],
  focusAreas: ["security", "performance", "maintainability"]
};
```

### **3. CODY/SOURCEGRAPH MCP - CODE INTELLIGENCE**
**Features**:
- Codebase-wide search and navigation
- Intelligent code completion
- Cross-reference analysis
- Architecture understanding

```javascript
const codyMCP = {
  codebaseIndexing: true,
  semanticSearch: true,
  crossReferences: true,
  architecturalInsights: true
};
```

### **4. MCP CHEF - MASTER COORDINATOR**
**Role**: Monitor and coordinate all other MCPs
**Health Checks**: Every 2 hours
**Features**:
- MCP status monitoring
- Automatic restart on failure
- Performance reporting
- Integration health checks

```javascript
const mcpChef = {
  monitors: ["Linear MCP", "CodeRabbit MCP", "Cody MCP"],
  healthChecks: "every 2 hours",
  autoRestart: true,
  reporting: ["console", "slack", "linear"]
};
```

---

## 🎯 18 SPECIALIZED COMMANDS

### **DEVELOPMENT COMMANDS (6)**
1. **`/build-component [name]`** → Frontend-Developer creates React component
2. **`/create-api [endpoint]`** → Backend-Architect designs RESTful API
3. **`/write-tests [file]`** → Test-Writer-Fixer adds comprehensive tests
4. **`/optimize-performance`** → Frontend-Developer improves speed/efficiency
5. **`/debug-issue [description]`** → Multiple agents collaborate on solution
6. **`/refactor-code [target]`** → Code restructuring with Test-Writer-Fixer

### **PROJECT MANAGEMENT COMMANDS (4)**
7. **`/plan-sprint`** → Sprint-Prioritizer creates 6-day development plan
8. **`/prioritize-features`** → Sprint-Prioritizer scores and ranks backlog
9. **`/track-experiment [name]`** → Experiment-Tracker monitors A/B test
10. **`/ship-release`** → Project-Shipper coordinates launch activities

### **DESIGN & UX COMMANDS (3)**
11. **`/design-system`** → UI-Designer creates component library
12. **`/improve-ux [page]`** → UX-Researcher analyzes and enhances experience
13. **`/brand-guidelines`** → Brand-Guardian establishes visual identity

### **MARKETING COMMANDS (3)**
14. **`/viral-strategy`** → TikTok-Strategist creates content plan
15. **`/analyze-feedback`** → Feedback-Synthesizer processes user input
16. **`/app-store-optimize`** → App-Store-Optimizer improves listings

### **RAPID DEVELOPMENT COMMANDS (2)**
17. **`/prototype-app [concept]`** → Rapid-Prototyper builds MVP
18. **`/feature-brainstorm [domain]`** → Feature-Brainstormer uses KOCH methodology

---

## 🎪 AGENT ORCHESTRATION PATTERNS

### **COLLABORATIVE WORKFLOWS:**
```javascript
// Multi-Agent Feature Development
const featureWorkflow = {
  1: "Rapid-Prototyper creates initial structure",
  2: "Frontend-Developer builds UI components", 
  3: "Backend-Architect creates API endpoints",
  4: "Test-Writer-Fixer adds comprehensive tests",
  5: "Experiment-Tracker sets up A/B testing",
  6: "Project-Shipper coordinates release"
};

// Problem-Solving Escalation
const problemEscalation = {
  1: "Primary agent attempts solution",
  2: "If stuck after 3 attempts → Call specialist agent",
  3: "If still stuck → Multi-agent collaboration",
  4: "If critical → Escalate to human oversight"
};
```

### **AGENT HANDOFF PROTOCOLS:**
```typescript
interface AgentHandoff {
  fromAgent: AgentType;
  toAgent: AgentType;
  context: HandoffContext;
  completionCriteria: string[];
  rollbackPlan: string;
}

// Example: Frontend → Backend handoff
const handoff: AgentHandoff = {
  fromAgent: "frontend-developer",
  toAgent: "backend-architect", 
  context: {
    completedComponents: ["UserProfile", "Dashboard"],
    apiRequirements: ["GET /users", "POST /auth"],
    mockData: "available in /mocks"
  },
  completionCriteria: [
    "API endpoints functional",
    "Authentication implemented",
    "Frontend integration tested"
  ],
  rollbackPlan: "Revert to mock data if API fails"
};
```

### **QUALITY ASSURANCE CHAIN:**
1. **Code Agent** completes implementation
2. **Test-Writer-Fixer** validates with comprehensive tests
3. **CodeRabbit MCP** performs automated review
4. **Experiment-Tracker** sets up performance monitoring
5. **Project-Shipper** coordinates deployment

---

## 🚀 ACTIVATION EXAMPLES

### **Automatic Activation:**
```bash
User: "Build a user dashboard with analytics"
→ Triggers: frontend-developer + backend-architect
→ Creates: React components + API endpoints
→ Tests: test-writer-fixer adds coverage
→ Ships: project-shipper handles deployment

User: "Our TikTok strategy isn't working"
→ Triggers: tiktok-strategist + feedback-synthesizer
→ Analyzes: Current performance + user feedback
→ Creates: New viral content strategy
→ Tracks: experiment-tracker monitors results
```

### **Manual Activation:**
```bash
/prototype-app "meditation app for busy professionals"
→ rapid-prototyper creates full MVP in 2 hours

/viral-strategy
→ tiktok-strategist creates 30-day content calendar

/ship-release
→ project-shipper coordinates launch checklist
```

---

**The Agent System provides specialized expertise for every aspect of rapid development, from initial concept to successful launch.**