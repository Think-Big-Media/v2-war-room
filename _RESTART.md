# 🚀 CLAUDE CODE CRASH RECOVERY - START HERE

**When Cursor/Claude crashes, read this file FIRST before doing anything else.**

## IMMEDIATE ORIENTATION (DO THIS FIRST)

### 1. Read Current Status Documents
```bash
# Check these files in order:
1. _DEPLOYMENT-REALITY-CHECK.md (root) - Critical deployment patterns
2. 4_DAY-TO-DAY-DEV/latest-folder/ - Current work location
3. CLAUDE.md (root) - Universal operational system
4. README.md (root) - Project overview

# FOR ENCORE WORK - ALWAYS CHECK THESE FIRST:
5. /encore-docs/ - Official docs
6. /EncoreNuggets.md
```

### 2. Identify Current Phase
```bash
# Look for latest codename by date in 4_DAY-TO-DAY-DEV/:
For example in early September it was "Winston". Check codenames.md for likely next or read dates in folder. All work and notes goes in here - never the root etc.
- Next historical name = Future work
```

### 3. Check Git Status
```bash
git status
git log --oneline -5
# Understand: What branch? What's uncommitted? What was last working?
```

## CURRENT PROJECT STATE (UPDATE THIS SECTION WHEN PHASE CHANGES)

**Current Phase**: CLEOPATRA (Multi-Tenant OAuth Authentication)  
**Status**: Implementation Complete, Ready for Deployment  
**Location**: `3_Backend_Codebase/4.4/` (production-ready code)  
**Next Step**: Deploy to Encore as version 4.4  

### Critical Files to Check:
- `4_DAY-TO-DAY-DEV/Cleopatra/CLEOPATRA-IMPLEMENTATION-COMPLETE.md` - Full status
- `3_Backend_Codebase/4.4/` - Complete backend implementation
- `_DEPLOYMENT-REALITY-CHECK.md` - Why we don't develop locally

### What Was Just Completed:
- Multi-tenant Google OAuth authentication
- Role-based user system (admin/manager/analyst/viewer)
- Dual-pipeline mock/live architecture
- Database migrations for organizations and roles
- All Napoleon auth endpoints enhanced with organization context

### Immediate Next Action:
**Deploy 4.4 backend to Encore production** (not Leap.new - can't open existing projects there)

## STANDARD RECOVERY WORKFLOW

### Step 1: Read & Understand (5 minutes)
```bash
# Don't start coding immediately!
1. Read _DEPLOYMENT-REALITY-CHECK.md (understand local development trap)
2. Read latest phase documentation in 4_DAY-TO-DAY-DEV/
3. FOR ENCORE WORK: Check EncoreNuggets + encore-docs FIRST
4. Check git branch and recent commits
5. Understand: Where were we? What's the next logical step?
```

### Step 2: Validate Current State (5 minutes)
```bash
# Ask yourself:
- Is current work complete or mid-development?
- Are we in local development trap? (need Docker, can't test, etc.)
- Should we be deploying instead of developing?
- What does user actually need right now?
```

### Step 3: TodoWrite Planning (Always)
```bash
# Before taking action:
1. Create TodoWrite list based on current status
2. Mark completed items from documentation
3. Identify next 2-3 specific actions
4. Get user confirmation on direction
```

## EMERGENCY DECISION TREE

### If User Says "resume" or "continue":
1. **Check latest status document** in current phase folder
2. **Identify if work is complete** or mid-development
3. **If complete**: Focus on deployment/next phase
4. **If mid-development**: Understand what was being built

### If User Says "crashed" or "start over":
1. **Don't assume anything broken** - check actual status first
2. **Read crash recovery docs** before suggesting solutions
3. **Identify if this is deployment issue** vs development issue
4. **Prevent local development trap** - check _DEPLOYMENT-REALITY-CHECK.md

### If User Says "deploy" or "test":
1. **Check _DEPLOYMENT-REALITY-CHECK.md** for deployment patterns
2. **Never suggest local Docker setup** - use production deployment
3. **Encore direct deployment** preferred over Leap.new for existing code
4. **Focus on production environment** testing

## COMMON MISTAKES TO AVOID

### ❌ Don't Do This:
- Start coding without reading current status
- Suggest local development when deployment needed
- Assume previous work was lost or broken
- Try to set up Docker/local environment
- Use Leap.new for existing codebases (can't import)

### ✅ Do This Instead:
- Read status documents first
- Understand current phase and progress
- Focus on deployment when work is complete
- Use Encore direct deployment for 4.4 backend
- Validate with user before major changes

## PROJECT-SPECIFIC PATTERNS

### Backend Development:
- **Never develop backend locally** (Docker dependency trap)
- **ALWAYS CHECK ENCORE DOCS + ENCORENUGGETS FIRST** - Prevent repeated mistakes
- **Use Encore CLI + Cloud deployment** (git push encore)
- **Leap.new only for greenfield projects** (can't import existing)

### Frontend Development:
- **Local development OK** (no Docker dependency)
- **Deploy to Vercel/Netlify** for testing
- **Connect to deployed Encore backend**

### Multi-Session Work:
- **Each historical codename is one focused feature**
- **Napoleon = Backend P0, Cleopatra = OAuth, etc.**
- **Don't mix features in same codename/branch**
- **Review previous codename completion before starting next**

## QUICK START COMMANDS

```bash
# Immediate orientation
cat _DEPLOYMENT-REALITY-CHECK.md
ls -la 4_DAY-TO-DAY-DEV/
git status

# Check current work
find 4_DAY-TO-DAY-DEV/ -name "*.md" -mtime -1 | head -5
cat 3_Backend_Codebase/4.4/test-oauth-flow.md

# If deploying Cleopatra 4.4 backend
cd 3_Backend_Codebase/4.4
# Check EncoreNuggets first for lessons learned!
cat ../../1_Project_Documents/3_Execution_and_Protocols/EncoreNuggets/README.md
git push encore  # Encore deployment per docs
```

---

**Remember: This file should be updated each time we complete a major phase or change direction. Keep it current so crash recovery is immediate and accurate.**