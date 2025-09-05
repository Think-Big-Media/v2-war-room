# 🚨 WAR ROOM - CONTINUITY & OPERATIONS PROTOCOL

**Version**: 2.0  
**Status**: ACTIVE  
**Last Updated**: September 2, 2025  
**Authority**: Chairman Gemini (Project Overseer)  
**Purpose**: To ensure zero loss of momentum and provide a clear, repeatable workflow for recovering from system crashes, managing Leap.new operations, and maintaining project velocity.

---

## 🤷‍♂️ THE PROBLEM THIS SOLVES

System crashes wipe the context of our AI CTOs. This protocol provides a standardized method to rapidly restore context and resume work. Furthermore, it establishes clear rules for prompting, changelogs, and communication to ensure a smooth, predictable, and resilient development cycle.

---

## 🔄 SECTION 1: CRASH RECOVERY WORKFLOW

If a crash occurs, follow these steps precisely.

### Step 1: 🔴 STOP & BREATHE

- **Action**: Do not try to continue from memory.
- **Action**: Ping Chairman Gemini (the Overseer) and state: **"Executing Continuity Protocol."**

### Step 2: 🟡 RESTORE CONTEXT

- **Action**: Upload the five key project documents to the AI CTOs:
  1. `_WORKFLOW.md`
  2. `_3.0-UI-STATUS.md`
  3. `_4.0-API-STATUS.md`
  4. `_SECURITY-ARCHITECTURE.md`
  5. `_DATA-ARCHITECTURE.md` or `_FSD.md`

- **Action**: Provide the CTOs with the following prompt:
  > "MANDATORY RE-SYNC. Ingest these five documents. Await a 'Continuity & State of the Mission' briefing from the Chairman/Overseer to restore full operational context."

### Step 3: 🟢 AWAIT GREENLIGHT

- **Action**: Chairman will provide the detailed briefing. If unavailable, use the latest entry in the `/changelog` directory as your source of truth.
- **Action**: Once the AI CTOs have confirmed they are re-synced, resume using the **Standardized Communication Format**.

---

## 🚀 SECTION 2: LEAP.NEW PROMPTING PROTOCOL

Adherence to this protocol is mandatory for all Leap.new interactions.

### Guiding Philosophy: "What, Not How"

Our goal is to define the desired outcome and let the AI determine the implementation, *except* for mission-critical details.

- **✅ DO**: Clearly state the goal (e.g., "Build a service to fetch Mentionlytics data"). Provide essential inputs and desired outputs.
- **❌ DON'T**: Specify low-level implementation details (e.g., "Use a for-loop to iterate through the array, then...").

### Non-Negotiable Specifics

Certain details are **NOT** left to interpretation. These MUST be included in the prompt:
- Exact API endpoint paths (e.g., `POST /api/v1/auth/login`)
- Required request/response data structures
- Specific security requirements (e.g., "Hash passwords with bcrypt, salt rounds: 12")
- Mandatory use of the **Production Blueprint** patterns from the Authentication Service
- Rate limiting specifications
- Error handling requirements

### Prompt Length & Structure

- **Word Count**: Keep prompts under **300 words** where possible
- **Splitting Prompts**: If a task is too complex for one prompt, split it into logical parts:
  - Example: "Prompt 3a: Build Google Ads service structure"
  - Example: "Prompt 3b: Implement OAuth2 flow with PKCE"

### Production Blueprint Reference

Every new service MUST inherit these patterns from the Authentication Service:
```
- Independent secret generation (crypto.randomBytes(64))
- Hashed sensitive data storage (bcrypt, salt rounds: 12)
- CORS configuration from auth service
- Strong input validation (Joi schemas)
- Rate limiting on all endpoints
- Comprehensive error handling with retry logic
- Mock data fallback for development
- Structured logging for all operations
```

---

## ✍️ SECTION 3: CONTINUOUS CHANGELOG PROTOCOL

This creates a manual, human-readable backup of our progress.

### Requirements

- **Frequency**: After every major action or approximately every 20-30 minutes of work
- **Location**: All changelogs saved in `/changelog` directory at project root
- **Naming Convention**: `YYYY-MM-DD-HHMM-[short_description].md`
  - Example: `2025-09-02-1130-mentionlytics-service-created.md`

### Changelog Entry Template

```markdown
# [Action Title]
**Date**: [YYYY-MM-DD HH:MM]
**Author**: [CC1/CC2/Chairman]
**Status**: [Complete/In Progress/Blocked]

## What Was Done
- Brief description of action taken
- Key decisions made
- Any deviations from plan

## Outcome
- Success/failure status
- Production readiness score (if applicable)
- Any issues encountered

## Next Immediate Step
- Clear action item for continuation
```

---

## 📋 SECTION 4: STANDARDIZED COMMUNICATION FORMAT

All operations follow this strict, emoji-coded format.

### Status Updates

```
🟢 COMPLETE: [Task name] - [Brief outcome]
🔄 IN PROGRESS: [Task name] - [Current step]
🔴 BLOCKED: [Task name] - [Blocker description]
⚠️ ISSUE: [Description] - [Impact assessment]
```

### Leap.new Workflow - THE COMPLETE THREE-PART SEQUENCE

**EVERY SERVICE CREATION MUST FOLLOW THIS EXACT ORDER:**

#### PART 1: MERGE/DEPLOY STATUS (for previous service)
```
🟢 MERGE & DEPLOY - Previous service passed all tests
🟠 HOLD FOR FIXES - Previous service needs corrections before deploy
🔴 DO NOT DEPLOY - Previous service has critical issues
⚪ FIRST SERVICE - No previous service to merge
```

#### PART 2: LEAP.NEW PROMPT
```
💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️ LEAP.NEW PROMPT START 💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SERVICE: [Service Name]
**Objective**: [Clear goal statement]
**Blueprint Compliance**: YES ✅
**Endpoints**: [List exact paths - MANDATORY]
**Security**: [Specific requirements - MANDATORY]
**Expected Score**: 9.0+/10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Prompt content - max 300 words]
[Include ALL non-negotiable specifics]

REPORT BACK: Provide a paragraph summary of what was implemented, any issues encountered, and confirmation of what's complete.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️ LEAP.NEW PROMPT END 💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️
```

#### PART 3: COMET VALIDATION PROMPT (IMMEDIATELY AFTER)
```
🌐 COMET VALIDATION PROMPT TEMPLATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Paste this into Comet in Leap.new]

In the current War Room API Backend project, we just ran a prompt to create [Service Name] with [X endpoints/features]. Before we merge and deploy, validate everything that was just created.

The service should have implemented:
- [List what the prompt asked for]
- [Key features like rate limiting, caching, etc.]
- [Security requirements from Production Blueprint]

Please thoroughly test what was just built:

VALIDATION CHECKLIST:
□ Test EVERY endpoint with real requests
  - Verify correct response structure
  - Check status codes (200, 401, 404, 500)
  - Confirm data types match specification
  
□ Console inspection
  - Zero errors in console
  - No warning messages
  - Check network tab for failed requests
  
□ Security verification
  - JWT authentication working
  - Rate limiting enforced
  - CORS headers present
  - No sensitive data exposed
  
□ Error handling
  - Test with invalid inputs
  - Verify graceful degradation
  - Check timeout behavior
  - Confirm mock data fallback works
  
□ Performance check
  - Response times < 200ms
  - No memory leaks
  - Pagination working correctly
  
□ Integration points
  - External API connections work
  - Database queries execute
  - Cache functioning (Redis)
  - WebSocket stable (if applicable)

Report back with:
- What's working correctly
- Any errors or issues found  
- Whether it's safe to merge
- Specific examples of responses you received
- Exact error messages if any
- Performance metrics observed

IMPORTANT: Be specific! Include actual response examples, exact error messages, and precise timings.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Example Comet Validation Prompt (Filled Out):
```
In the current War Room API Backend project, we just ran a prompt to create Mentionlytics Integration Service with 7 endpoints. Before we merge and deploy, validate everything that was just created.

The service should have implemented:
- 7 endpoints under /api/v1/mentionlytics/*
- Rate limiting at 100 requests/minute  
- Mock data fallback when MENTIONLYTICS_API_TOKEN is missing
- Caching with 5-minute TTL
- Production Blueprint compliance (JWT auth, error handling, logging)

Please thoroughly test what was just built:
[Continue with checklist...]
```

#### 4. POST-VALIDATION COMET ANALYSIS
```
📊 COMET ANALYSIS RESULTS: [Service Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Production Score**: [X.X/10]
**Browser Validation**: ✅ PASSED / ⚠️ ISSUES / ❌ FAILED
**Console Errors**: [None/List]
**Endpoints Tested**: [X/Y working]
**Security Compliance**: [YES/NO]
**Performance**: [Response times]
**Merge Decision**: 🟢 READY / 🟠 FIX FIRST / 🔴 REJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Detailed findings from both AI analysis and browser testing]
```

### Decision Point Template

```
🤔 DECISION REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Issue**: [Description]
**Options**:
  A) [Option with pros/cons]
  B) [Option with pros/cons]
**Recommendation**: [A or B with reasoning]
**Deadline**: [Time constraint]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🤔 SECTION 5: PROACTIVE OVERSIGHT QUESTIONS

**"What Am I Not Asking?"** - Critical questions for staying ahead of issues.

### Technical Debt & Quality

1. **"Are we incurring any invisible technical debt by moving this fast? If so, where is it documented?"**
   - *Why it matters*: Speed is good, but hidden shortcuts now can cost weeks of refactoring later. We must track any debt we knowingly accept.

2. **"What is our current test coverage percentage, and which critical paths remain untested?"**
   - *Why it matters*: Untested code is a liability. We need metrics, not assumptions.

### Integration & Coordination

3. **"Is our integration test plan (CC1's task) keeping pace with the new backend services being built (CC2's task)?"**
   - *Why it matters*: A feature isn't "done" until it's tested. A backlog of untested services creates a massive bottleneck.

4. **"Are the API contracts between frontend and backend documented and version-controlled?"**
   - *Why it matters*: Contract mismatches are the #1 cause of integration failures.

### Scalability & Performance

5. **"What is the primary scalability bottleneck for the service we just built? Where will it break first if we 10x the user load?"**
   - *Why it matters*: We need to anticipate success. Knowing the weakest link *before* it breaks allows planning.

6. **"Have we load-tested the WebSocket connections? What's our maximum concurrent connection limit?"**
   - *Why it matters*: Real-time features fail catastrophically under load without proper testing.

### Security & Compliance

7. **"Have we established and documented a formal policy for rotating the secrets and API keys in Encore?"**
   - *Why it matters*: A 90-day rotation policy is standard practice and prevents compromised keys from becoming permanent backdoors.

8. **"Are we tracking and addressing the security findings from COMET audits in a systematic way?"**
   - *Why it matters*: Security debt compounds faster than technical debt.

### User Value & Product

9. **"From a user's perspective, what is the single most important outcome of this new service? Is CC1 planning how to surface this value in the UI?"**
   - *Why it matters*: This connects technical work directly to user value. Features solve user problems, not technical ones.

10. **"What's our rollback strategy if a deployed service fails in production?"**
    - *Why it matters*: Hope is not a strategy. Every deployment needs a reverse gear.

### Project Management

11. **"Are we maintaining a clear critical path to MVP? What can be deferred without impacting launch?"**
    - *Why it matters*: Scope creep kills projects. We must ruthlessly prioritize.

12. **"What external dependencies could block us, and what's our mitigation plan for each?"**
    - *Why it matters*: External APIs, third-party services, and vendor delays are common failure points.

---

## 📊 SUCCESS METRICS

This protocol is successful when:
- ✅ System crashes result in < 15 minutes of lost productivity
- ✅ All services achieve 9.0+ production readiness on first COMET audit
- ✅ Changelog provides complete project history without gaps
- ✅ No critical issues discovered in production that weren't caught in development
- ✅ Team maintains velocity of 1 major service per day

---

## 🚦 ESCALATION TRIGGERS

Immediately escalate to Chairman when:
- 🔴 Production readiness score < 7.0 on any service
- 🔴 Security vulnerability discovered in deployed code
- 🔴 Integration tests failing for > 2 hours
- 🔴 External API rate limits or quotas exceeded
- 🔴 Team blocked on a decision for > 30 minutes

## 🎨 SECTION 6: UI SHELL DEVELOPMENT PROTOCOL

*Added Version 2.1 - Critical frontend-backend separation lessons learned*

### The Frontend-Backend Architecture Rule

**NEVER AGAIN**: Mix UI components with backend services. Today's health crisis was caused by putting frontend admin components in backend services.

#### Frontend Components (React/TypeScript ONLY):
```typescript
// These belong in Leap.new UI Shell project:
- AdminDashboard.tsx     // Full-page admin interface
- AdminPanel.tsx         // Bottom debugging overlay  
- DebugSidecar.tsx       // Right-side panel (180px)
- useAdminMode.ts        // Admin state management
- useDataMode.ts         // Mock/Live data toggle
```

#### Backend Endpoints (Data Provider ONLY):
```typescript
// These belong in Leap.new API project:
- GET /api/v1/admin/stats    // Provides data to frontend
- GET /api/v1/health         // System health data
// NO UI COMPONENTS EVER
```

### UI Shell Creation Sequence

#### Phase 1: Shell Foundation (15 minutes)
1. **Create new Leap.new project** for UI Shell
2. **Execute 6 Shell Prompts** from `_4.0-UI-SHELL-EXECUTION.md`
3. **Test admin mode** (triple-click logo activation)
4. **Deploy to Encore** and verify functionality

#### Phase 2: Local Development (After shell creation)
1. **Export to GitHub** from Leap.new
2. **Clone locally** for enhanced development
3. **Migrate 3.0 components** progressively
4. **Test thoroughly** before pushing back

#### Phase 3: Integration (Final step)
1. **Push enhancements** back to GitHub
2. **Verify Encore deployment** via Leap.new
3. **Connect to backend APIs** for data flow

### Production Backup Recovery Protocol

**LESSON LEARNED**: Use Chairman's "30-Second Fix" instead of nuclear reset:

```bash
# In Encore Dashboard:
1. Delete corrupted preview environment
2. Clone from healthy production environment  
3. Verify health endpoints return 200 OK
# Recovery time: 30 seconds vs 15+ minutes
```

### Updated Context Restoration (Section 1.2)

Add these documents to crash recovery context restoration:
- `_4.0-UI-SHELL-EXECUTION.md` (UI Shell development guide)
- `EncoreNuggets.md` (Platform-specific deployment wisdom)

---

## 📝 REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.1 | 2025-09-02 | CC1 | Added UI Shell Development Protocol, frontend-backend separation |
| 2.0 | 2025-09-02 | Chairman Gemini | Complete protocol established |
| 1.0 | 2025-09-01 | Team | Initial concepts |

---

**This protocol is mandatory for all team members. Deviations require explicit approval from Chairman Gemini.**

*"Disruptions are inevitable. Our response is what defines us."* - Chairman Gemini