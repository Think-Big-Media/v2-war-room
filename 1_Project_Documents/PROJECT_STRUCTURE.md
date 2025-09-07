# 🏗️ War Room Platform - Project Structure

**Last Updated**: September 7, 2025  
**Version**: v2-war-room  
**Status**: RECOVERED - Critical documentation structure restored

---

## 📁 Complete Project Structure

```
v2-war-room/
├── 1_Project_Documents/           # Strategy & planning documentation
│   ├── 1_Strategy_and_Planning/   # Strategic planning and vision
│   ├── 3_Execution_and_Protocols/ # Development protocols and guidelines
│   ├── 4_Active_Development/      # Current development documentation  
│   └── 4_Changelogs/              # Version history and changes
├── 2_Frontend_Codebase/           # React frontend applications
│   └── 3.1-ui-war-room-netlify-clean/  # Primary frontend (production)
├── 3_Backend_Codebase/            # Encore backend services
│   ├── 4.3-encore-war-room/      # Backend v4.3 (archived)
│   └── 4.4-encore-war-room/      # Backend v4.4 (production)
├── 4_DAY-TO-DAY-DEV/              # Daily development work (by codename)
│   ├── Cleopatra/                 # Current: Triple-click admin system
│   ├── Napoleon/                  # Completed: Backend P0 foundation  
│   └── Churchill/                 # Future: Reserved for next P1 feature
├── 5_Future_Features/             # 🆕 RESTORED - Feature planning pipeline
│   ├── V2_Core_Features/          # Essential next-phase features
│   ├── V3_Advanced_Features/      # Future roadmap features
│   ├── Codename_Projects/         # Historical codename projects
│   │   ├── Marcus_Aurelius/       # Distributed monitoring (deferred)
│   │   ├── Churchill/             # Reserved for P1 feature
│   │   ├── Einstein/              # Reserved for AI features
│   │   └── Mozart/                # Reserved for UI/UX features  
│   ├── ICE_Analysis/              # Impact/Confidence/Ease scoring
│   └── Technical_Specifications/ # Detailed technical documentation
├── CLAUDE.md                      # Universal Claude operations system
├── _*.md                          # Detailed operational procedures
└── _RESTART.md                    # Crisis recovery protocols
```

---

## 🎯 Current Status - CLEOPATRA

**Active Codename**: Cleopatra (Triple-Click Admin System)  
**Phase**: Deployment & Documentation Recovery  
**Branch**: `cleopatra-admin-system`  
**Priority**: P0 (Critical infrastructure)

### **Historical Codename Pipeline**
- **Napoleon**: Backend P0 foundation ✅ COMPLETE
- **Cleopatra**: Triple-Click Admin System 🟡 DEPLOYING  
- **Marcus Aurelius**: Distributed Monitoring 📋 ICE ANALYZED (Deferred ICE: 168)
- **Churchill**: RESERVED for next P1 feature
- **Einstein**: RESERVED for advanced AI features
- **Mozart**: RESERVED for UI/UX enhancements

---

## 📂 Folder Descriptions

### **1_Project_Documents** - Strategy & Planning
Central hub for all project documentation, strategic planning, and development protocols.

**Structure**:
- `1_Strategy_and_Planning/` - Vision, roadmap, strategic decisions
- `3_Execution_and_Protocols/` - Development workflows, standards, protocols  
- `4_Active_Development/` - Current development documentation
- `4_Changelogs/` - Version history and release notes

### **2_Frontend_Codebase** - React Applications
All frontend codebases and related assets.

**Current**:
- `3.1-ui-war-room-netlify-clean/` - Production frontend (React + Vite)
  - **Deployment**: Netlify via GitHub (pending approval)
  - **Features**: Triple-click admin, MOCK/LIVE toggle, security hardening
  - **Status**: Enhanced with Cleopatra admin system

### **3_Backend_Codebase** - Encore Services  
Backend services built with Encore framework via Leap.new.

**Current**:
- `4.3-encore-war-room/` - Archived backend (v4.3)
- `4.4-encore-war-room/` - Production backend (v4.4)
  - **Deployment**: Encore cloud via Leap.new
  - **APIs**: Authentication, analytics, monitoring, campaigns, intelligence, alerting
  - **Status**: Fully deployed and operational

### **4_DAY-TO-DAY-DEV** - Daily Development  
Organized by historical codenames for focused development cycles.

**Current**:
- `Cleopatra/` - Triple-click admin system (current focus)
- `Napoleon/` - Backend foundation (completed)
- `Churchill/` - Reserved for next P1 feature

### **5_Future_Features** - Feature Pipeline 🆕 RESTORED
Comprehensive feature planning and ICE analysis system.

**Components**:
- `Codename_Projects/` - Individual feature projects with full documentation
- `ICE_Analysis/` - Impact/Confidence/Ease scoring for prioritization  
- `Technical_Specifications/` - Detailed technical documentation and templates
- `V2_Core_Features/` - Essential next-phase features
- `V3_Advanced_Features/` - Future roadmap planning

---

## 🚀 Deployment Architecture

### **Frontend Deployment**
- **Source**: `/2_Frontend_Codebase/3.1-ui-war-room-netlify-clean/`
- **Target**: Netlify via GitHub repository
- **GitHub Repo**: `https://github.com/Think-Big-Media/3.1-ui-war-room-netlify`
- **Status**: Enhanced locally, pending deployment approval

### **Backend Deployment**  
- **Source**: `/3_Backend_Codebase/4.4-encore-war-room/`
- **Target**: Encore cloud via Leap.new
- **API Base**: `war-room-3-backend-d2msjrk82vjjq794glog.lp.dev`
- **Status**: Deployed and operational

---

## 🔄 Development Workflow

### **Historical Codename System**
1. **Focus Discipline**: One codename = one focused feature
2. **Sequential Development**: Complete current before starting next  
3. **No Feature Mixing**: Never combine multiple features in single codename
4. **Comprehensive Documentation**: Full ICE analysis and technical specs

### **Branch Strategy**
- `main` - Production ready code
- `[codename]-[feature]` - Feature development branches (e.g., `cleopatra-admin-system`)
- Graphite workflow for PR management

### **Documentation Standards**
- **Never create random .md files** - Always ask location first
- **Use templates** in `/5_Future_Features/Technical_Specifications/`
- **ICE analysis required** for all P1+ features
- **Historical codenames** for all major features

---

## 📋 File Organization Guidelines

### **Naming Conventions**
- **Historical codenames**: Napoleon, Cleopatra, Marcus Aurelius, Churchill, Einstein, Mozart
- **Feature branches**: `[codename]-[description]` (e.g., `cleopatra-admin-system`)
- **Documentation**: Use templates from `/5_Future_Features/Technical_Specifications/`

### **File Placement Rules**
- **Strategy documents** → `/1_Project_Documents/1_Strategy_and_Planning/`
- **Technical protocols** → `/1_Project_Documents/3_Execution_and_Protocols/`
- **Feature planning** → `/5_Future_Features/Codename_Projects/[codename]/`
- **ICE analysis** → `/5_Future_Features/ICE_Analysis/`
- **Daily development** → `/4_DAY-TO-DAY-DEV/[codename]/`

---

## 🚨 Critical Recovery Notes

### **Documentation Loss Assessment**
- **Discovered**: September 7, 2025 - Most 1_Project_Documents folders were empty
- **Root Cause**: Unknown - likely filesystem sync issue or accidental deletion
- **Recovery Action**: Structure recreated with current system knowledge
- **Status**: Core documentation structure restored

### **What Was Recovered**
- ✅ Complete project folder structure documented
- ✅ 5_Future_Features folder created with templates
- ✅ Marcus Aurelius project fully documented with ICE analysis
- ✅ Historical codename system clarified
- ✅ Current status and priorities documented

### **What May Need Recreation**
- [ ] Original strategy documents (if they existed)
- [ ] Historical changelogs (if they existed)  
- [ ] Previous ICE analyses (if they existed)
- [ ] Legacy project documentation (if needed)

---

## 🔍 Next Steps

### **Immediate (Current Sprint)**
1. **Complete Cleopatra deployment** - Finish admin system deployment
2. **Document current state** - Preserve all current work
3. **Create GitHub PR** - Get Cleopatra changes into production repo
4. **Validate structure** - Ensure all critical documentation is captured

### **Future (Next Sprint)**  
1. **Plan Churchill feature** - Next P1 user-facing feature
2. **Archive Cleopatra** - Move completed work to archived status
3. **ICE analysis pipeline** - Regular feature evaluation process
4. **Documentation maintenance** - Prevent future loss of critical documents

---

**Recovery Status**: CRITICAL STRUCTURE RESTORED  
**Next Review**: After Cleopatra completion  
**Maintained By**: Universal Claude Operations System