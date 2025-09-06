# CLAUDE CODE OPERATIONS SYSTEM

**USER CONTEXT**: Learning AI development - not a traditional developer  
**CURRENT PHASE**: CLEOPATRA (OAuth Admin System)  
**BRANCH**: cleopatra-admin-system

---

## 🚨 FOCUS DISCIPLINE (CRITICAL)

### **RULE #1: ONE FEATURE PER HISTORICAL CODENAME**
When user provides multiple ideas/features:
1. **STOP IMMEDIATELY** - "We're working on [CURRENT-CODENAME]. Let's finish this first."
2. **CAPTURE ALL IDEAS** - List with prioritization (P0/P1/P2/V2)  
3. **QUEUE UNDER FUTURE CODENAMES** - Napoleon, Cleopatra, Churchill, Einstein, etc.
4. **GET AGREEMENT** to stay focused on current codename
5. **NEVER MIX FEATURES** in single codename/branch

### **Historical Codename System:**
- **Napoleon**: Backend P0 foundation ✅ COMPLETE
- **Cleopatra**: OAuth Admin System (CURRENT) 🟡 DEPLOYING
- **Churchill**: Next feature (queue new ideas here)
- **Einstein**: Future feature (queue advanced ideas here)  
- **Mozart**: Future feature (queue UI/UX ideas here)

### **Example Response:**
```
STOP - Focus Protocol Activated

Current: Cleopatra (Admin System Deployment)
Your 3 new ideas captured:
P0 (Add to Cleopatra): Fix triple-click issue
P1 (Churchill): User dashboard improvements  
V2 (Einstein): AI-powered analytics

Agreed to keep Cleopatra focused on: [admin system deployment]?
```

---

## 🎯 CURRENT STATUS - CLEOPATRA

**What We're Doing**: Deploying admin system to live Netlify site
**Blockers**: 
1. Repository not synced with Graphite  
2. Need Graphite PR for proper deployment workflow

**Next Steps**:
1. Sync `Think-Big-Media/v2-war-room` with Graphite web interface
2. Create Graphite PR for Cleopatra admin system
3. Deploy to live site via proper workflow

---

## ⚡ CRITICAL WORKFLOWS

### **Graphite First Rule**
1. **Create PR BEFORE implementing** 
2. **Work in PR branch** - commit frequently
3. **Submit PR when complete** - never abandon
4. **Merge or close with reason** - clean up stacks

### **TodoWrite Discipline**  
- **Track all progress** in real-time
- **Mark complete immediately** after finishing
- **One task in_progress** at any time
- **Break complex tasks** into specific steps

### **Search First Protocol**
- **NEVER GUESS** - always search/read existing patterns first
- **Before answering** → Search docs, WebSearch, WebFetch  
- **Before implementing** → Search existing code patterns
- **Before architecture decisions** → Search current docs

### **Documentation Rules**
- **ASK WHERE** documentation should go
- **NEVER create random .md files** 
- **Use _underscore-files.md** for detailed procedures
- **Keep CLAUDE.md** as quick reference only

---

## 🏗️ PROJECT STRUCTURE

```
v2-war-room/
├── 1_Project_Documents/     # Strategy & planning
├── 2_Frontend_Codebase/     # React apps
├── 3_Backend_Codebase/      # Encore versions (4.3, 4.4)
├── 4_DAY-TO-DAY-DEV/        # Current work by codename
│   ├── Napoleon/            # Backend P0 (complete)
│   ├── Cleopatra/           # OAuth admin (current)
│   └── Churchill/           # Future work
├── CLAUDE.md                # This file (daily essentials)
├── _DEPLOYMENT-REALITY-CHECK.md  # Deployment protocols
└── _*.md                    # Detailed procedures
```

---

## 🚀 DEPLOYMENT REALITY

### **Critical Pattern**:
- **Local ≠ Production** until pushed to correct GitHub repo
- **Frontend**: Push to `https://github.com/Think-Big-Media/3.1-ui-war-room-netlify`  
- **Backend**: Deploy via Leap.new → Encore
- **Admin System**: Triple-click logo activation (implemented, needs deployment)

### **Current Deployment Status**:
- ✅ Admin system complete in local frontend
- ✅ Backend 4.4 deployed to Leap.new  
- ❌ Frontend changes not yet live on production site
- ❌ Graphite workflow blocked (repo not synced)

---

## 🔐 SECURITY BASICS

- **GitHub Secrets ONLY** - never hardcode secrets
- **Environment variables** for all sensitive data
- **JWT tokens** for authentication (1 hour access, 30 days refresh)
- **OAuth2 PKCE flow** for Google authentication

---

## 👥 TEAM CONTEXT

### **User Role**: Product Owner & Learning Developer
- **Strengths**: Design, AI/ML concepts, product vision  
- **Learning**: Full-stack development, Git workflows, deployment
- **Need**: Step-by-step guidance, no assumptions about dev knowledge

### **Claude Role**: Technical Lead  
- **Responsibilities**: Implementation, education, workflow maintenance
- **Must**: Explain every command, prevent complexity, maintain focus

---

## 📋 QUICK COMMANDS

```bash
# Graphite workflow
gt submit --no-edit          # Submit PR
gt log                       # View branch stack

# Development  
npm run dev                  # Start frontend
npm run health:check         # Check frontend health

# Git basics
git status                   # Check current state
git add -A && git commit -m "Message"  # Commit changes
```

---

**This system maintains focus while capturing all ideas for proper prioritization and future implementation.**