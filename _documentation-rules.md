# DOCUMENTATION RULES - NEVER CREATE RANDOM .MD FILES

## 🚨 CRITICAL DOCUMENTATION DISCIPLINE

### **NEVER CREATE .MD FILES UNLESS:**
1. **User explicitly says "document this"** or "create documentation"
2. **User specifically requests a markdown file**
3. **It's a required project file** (README.md only in root)
4. **System requires it** (this restoration process only)

### **THE PROBLEM WITH RANDOM .MD FILES:**
- **Root Pollution** → Clutters project root with unnecessary files
- **Information Scatter** → Important info spread across too many files
- **Maintenance Burden** → More files to keep updated
- **Search Confusion** → Hard to find the right information
- **Version Control Noise** → Git history filled with doc updates

---

## 📁 STRUCTURED DOCUMENTATION ARCHITECTURE

### **APPROVED DOCUMENTATION STRUCTURE:**
```bash
project-root/
├── README.md                    # ONLY .md file allowed in root
├── CLAUDE.md                    # Claude-specific config (root exception)
├── _*.md                        # Underscore files for detailed procedures
├── /docs/
│   ├── /architecture/           # System design, technical decisions
│   ├── /api/                    # API documentation, endpoints
│   ├── /features/               # Feature documentation
│   ├── /testing/                # Test documentation, coverage
│   ├── /decisions/              # ADRs (Architecture Decision Records)  
│   ├── /planning/               # Project planning, roadmaps
│   ├── /guides/                 # How-to guides, tutorials
│   ├── /context/                # Session summaries (Patrick Hack)
│   └── /daily-summaries/        # Automated daily reports
├── /4_DAY-TO-DAY-DEV/          # Working files by historical codename
│   ├── /Napoleon/              # Completed historical feature
│   ├── /Cleopatra/             # Current working feature  
│   └── /Churchill/             # Next planned feature
└── /.claude/                   # Claude-specific configuration
```

### **WHEN USER SAYS "DOCUMENT" - ASK FIRST:**
```javascript
const documentationRequest = {
  userSays: "Document this feature",
  
  claudeResponse: [
    "Where should I save this documentation?",
    "Suggested locations:",
    "- /docs/features/[feature-name].md - Feature documentation",
    "- /docs/api/[endpoint-name].md - API documentation", 
    "- /docs/architecture/[component].md - Technical design",
    "- /docs/guides/[how-to].md - User guides",
    "- Custom path?"
  ],
  
  waitForConfirmation: true,
  neverAssumeLocation: true
};
```

---

## 🎯 DOCUMENTATION TYPES & PURPOSES

### **ROOT LEVEL FILES (Minimal):**
```javascript
const rootLevelFiles = {
  "README.md": {
    purpose: "Project overview, quick start, basic info",
    audience: "New users, contributors, stakeholders",
    maxLength: "2 pages",
    updateFrequency: "Major releases only"
  },
  
  "CLAUDE.md": {
    purpose: "Claude operational configuration",
    audience: "Claude Code sessions",
    maxLength: "Quick reference only", 
    updateFrequency: "As needed"
  },
  
  "_*.md": {
    purpose: "Detailed procedures referenced by CLAUDE.md",
    audience: "Claude Code sessions", 
    naming: "Descriptive underscore prefix",
    examples: ["_programming-rules.md", "_security-standards.md"]
  }
};
```

### **STRUCTURED DOCUMENTATION FOLDERS:**
```javascript
const documentationFolders = {
  "/docs/architecture/": {
    purpose: "Technical system design, component relationships",
    examples: ["database-schema.md", "api-architecture.md", "component-hierarchy.md"],
    audience: "Developers, architects"
  },
  
  "/docs/features/": {
    purpose: "Feature specifications, user stories, acceptance criteria", 
    examples: ["user-authentication.md", "admin-dashboard.md", "triple-click-system.md"],
    audience: "Product managers, developers, testers"
  },
  
  "/docs/api/": {
    purpose: "API endpoint documentation, request/response formats",
    examples: ["auth-endpoints.md", "user-management.md", "admin-api.md"], 
    audience: "Frontend developers, integration partners"
  },
  
  "/docs/testing/": {
    purpose: "Test plans, coverage reports, QA procedures",
    examples: ["test-strategy.md", "e2e-scenarios.md", "manual-test-checklist.md"],
    audience: "QA engineers, developers"
  }
};
```

---

## 📝 DOCUMENTATION CREATION WORKFLOW

### **STEP 1: USER REQUEST ANALYSIS**
```javascript
const requestAnalysis = {
  explicitRequest: {
    examples: ["Document the authentication system", "Create API docs"],
    action: "Ask for location, then create documentation"
  },
  
  implicitRequest: {
    examples: ["Explain how this works", "What does this code do?"], 
    action: "Provide explanation, don't create file unless asked"
  },
  
  taskCompletion: {
    examples: ["I finished implementing the feature"],
    action: "Offer to document, don't automatically create"
  }
};
```

### **STEP 2: LOCATION CONFIRMATION**
```javascript
const locationConfirmation = {
  askUser: "Where should I save this documentation?",
  
  provideOptions: [
    "/docs/features/ - Feature documentation",
    "/docs/api/ - API endpoints", 
    "/docs/architecture/ - Technical design",
    "/docs/testing/ - Test documentation",
    "/docs/guides/ - How-to guides",
    "Custom location?"
  ],
  
  waitForApproval: true,
  neverAssumeDefault: true
};
```

### **STEP 3: STRUCTURED CREATION**
```javascript
const documentCreation = {
  useTemplate: true,
  includeMetadata: {
    created: "Date and author",
    lastUpdated: "Maintenance tracking",
    purpose: "Why this document exists",
    audience: "Who should read this"
  },
  
  structuredContent: {
    overview: "High-level summary",
    details: "Technical specifics", 
    examples: "Practical usage",
    references: "Related documentation"
  }
};
```

---

## 🔍 DOCUMENTATION MAINTENANCE

### **UPDATE TRIGGERS:**
```javascript
const updateTriggers = {
  codeChanges: {
    trigger: "Major feature modifications",
    action: "Update relevant feature docs",
    automation: "Detect through commit analysis"
  },
  
  apiChanges: {
    trigger: "Endpoint modifications", 
    action: "Update API documentation",
    automation: "OpenAPI spec generation"
  },
  
  architectureChanges: {
    trigger: "System design modifications",
    action: "Update architecture docs", 
    automation: "Manual review required"
  }
};
```

### **DEPRECATION PROTOCOL:**
```javascript
const documentDeprecation = {
  identifyOutdated: "Regular review of document relevance",
  markDeprecated: "Add deprecation notice with replacement",
  archiveOld: "Move to /docs/archive/ after 6 months",
  cleanupProcess: "Quarterly documentation cleanup"
};
```

---

## 🚫 ANTI-PATTERNS TO AVOID

### **DOCUMENTATION MISTAKES:**
```javascript
const documentationMistakes = {
  rootPollution: {
    wrong: "Creating SETUP.md, DEPLOYMENT.md, FEATURES.md in root",
    right: "Use /docs/guides/, /docs/deployment/, /docs/features/"
  },
  
  duplicateInformation: {
    wrong: "Same info in multiple .md files", 
    right: "Single source of truth with cross-references"
  },
  
  assumeLocation: {
    wrong: "Creating documentation without asking where",
    right: "Always confirm location with user first"
  },
  
  overDocumentation: {
    wrong: "Creating .md file for every small feature",
    right: "Document significant features that need explanation"
  }
};
```

### **CORRECT ALTERNATIVES:**
```javascript
const correctAlternatives = {
  insteadOfManyFiles: {
    wrong: ["auth.md", "login.md", "signup.md", "password.md"],
    right: ["/docs/features/authentication-system.md (comprehensive)"]
  },
  
  insteadOfRootClutter: {
    wrong: ["API.md", "TESTING.md", "DEPLOYMENT.md in root"],
    right: ["/docs/api/", "/docs/testing/", "/docs/deployment/"]
  },
  
  insteadOfRedundancy: {
    wrong: ["Same setup instructions in 3 different files"],
    right: ["Single setup guide with references from other docs"]
  }
};
```

---

## 📊 DOCUMENTATION METRICS

### **QUALITY INDICATORS:**
```javascript
const documentationQuality = {
  discoverability: "Can users find the right information quickly?",
  accuracy: "Is the documentation up to date with code?",
  completeness: "Does it answer the questions users have?", 
  maintainability: "Is it easy to keep current?",
  
  successMetrics: {
    searchTime: "< 30 seconds to find relevant info",
    accuracyRate: "> 95% of docs match current code",
    updateFrequency: "Updated within 1 week of code changes",
    userSatisfaction: "Docs help accomplish tasks"
  }
};
```

### **REGULAR REVIEW PROCESS:**
```javascript
const reviewProcess = {
  weekly: "Check if recent code changes need doc updates",
  monthly: "Review documentation structure and organization",
  quarterly: "Archive outdated docs, identify gaps",
  annually: "Comprehensive documentation strategy review"
};
```

---

## 🎯 BEST PRACTICES SUMMARY

### **DO:**
- ✅ **Ask where to save** documentation before creating
- ✅ **Use structured folders** (/docs/category/) 
- ✅ **Create comprehensive files** covering related topics
- ✅ **Update existing docs** instead of creating new ones
- ✅ **Use templates** for consistency
- ✅ **Include metadata** (purpose, audience, date)

### **DON'T:**
- ❌ **Create random .md files** without user request
- ❌ **Pollute project root** with documentation files
- ❌ **Duplicate information** across multiple files
- ❌ **Assume default locations** without confirmation
- ❌ **Over-document** minor features or changes
- ❌ **Create without purpose** or clear audience

---

**These documentation rules ensure clean project structure, findable information, and maintainable knowledge base without unnecessary file proliferation.**