# 🔄 DOCUMENTATION MAINTENANCE PROTOCOL
**Purpose**: Ensure all "CURRENT" documents stay current without manual reminders  
**Target**: Every 15-20 minutes during active development  
**Critical**: New Claude instances must be able to onboard immediately  

---

## 🚨 SELF-REMINDER SYSTEM

### **AUTOMATIC TRIGGER PHRASES**
When any Claude instance sees these phrases in conversation, it MUST check and update documentation:

- **"we just"** → Update changelogs and current status
- **"we completed"** → Update CURRENT-* documents  
- **"that's done"** → Create changelog entry
- **"we fixed"** → Update current status and add to changelogs
- **"we changed"** → Update all affected CURRENT documents
- **"we moved"** → Update file locations and current structure
- **"we decided"** → Update current workflow and strategy documents

### **TIME-BASED REMINDERS**
- **Every 15-20 minutes**: Check if any work has been done that needs documenting
- **Every hour**: Review all CURRENT-* documents for accuracy
- **End of session**: Create comprehensive changelog entry

---

## 📋 CURRENT DOCUMENTS THAT MUST STAY CURRENT

### **Critical "CURRENT" Files** (Update every 15-20 min)
```
1_Project_Documents/3_Execution_and_Protocols/CURRENT-WORKFLOW.md
1_Project_Documents/3_Execution_and_Protocols/CURRENT-STATUS.md (create if needed)
1_Project_Documents/1_Strategy_and_Planning/CURRENT-PRIORITIES.md (create if needed)
```

### **Architecture Documents** (Update when changes made)
```
2_Architecture_and_Design/DATA-ARCHITECTURE.md
2_Architecture_and_Design/SECURITY-ARCHITECTURE.md  
2_Architecture_and_Design/TECHNICAL-IMPLEMENTATION-GUIDE.md
2_Architecture_and_Design/FSD.md
```

### **Changelog System** (Update every 15-20 min)
```
4_Changelogs/2025-09-05/[timestamp]-[brief-description].md
```

---

## 🤖 CLAUDE SELF-MONITORING CHECKLIST

### **Before Every Response, Ask Yourself:**
□ Have we made any changes in the last 15-20 minutes?
□ Do any CURRENT-* documents need updating?
□ Should I create a changelog entry for what we just did?
□ Are file paths and references still accurate?
□ Would a new Claude instance understand the current state?

### **After Every Major Action, Do This:**
1. **Create Changelog Entry** - What was accomplished, when, and why
2. **Update CURRENT-WORKFLOW.md** - Reflect the new reality
3. **Check References** - Ensure all document links still work
4. **Update Status** - What's the current state of the project

---

## 📝 CHANGELOG ENTRY TEMPLATE

```markdown
# [ACTION DESCRIPTION]
**Time**: [HH:MM]
**Duration**: [X minutes]  
**Status**: COMPLETE/IN PROGRESS/BLOCKED

## What Was Done
- [Specific action taken]
- [Files modified]
- [Decisions made]

## Current State
- [What's different now]
- [Next logical step]

## For New Claude Instances
- [Key context needed]
- [Current priority]
- [What to work on next]
```

---

## 🔄 CURRENT-STATUS.md TEMPLATE

Create this file and update every 15-20 minutes:

```markdown
# WAR ROOM CURRENT STATUS
**Last Updated**: [YYYY-MM-DD HH:MM]
**Session Duration**: [X hours]
**Current Claude Instance**: Active

## Right Now We Are
- [Current primary activity]
- [Files being worked on]
- [Immediate next step]

## Just Completed (Last 20 mins)
- [Recent accomplishments]
- [Files modified]
- [Problems solved]

## Next 3 Actions
1. [Immediate next task]
2. [Following task]  
3. [After that]

## For New Claude Instance
**If I crash, the new Claude should**:
1. [First thing to do]
2. [Current priority to continue]
3. [Where to find latest work]

**Current Context**:
- [Key decisions made today]
- [Important discoveries]
- [Anything critical to know]
```

---

## 🎯 IMPLEMENTATION STRATEGY

### **For Current Claude Session**
1. **Set Mental Timer**: Every 15-20 minutes, check if documentation needs updating
2. **Pattern Recognition**: When user says completion phrases, update docs
3. **Proactive Updates**: Don't wait for user to ask, just do it
4. **Cross-Reference**: Always check if changes affect other documents

### **For New Claude Instances**
1. **First Action**: Read all CURRENT-* documents
2. **Check Timestamps**: Look for outdated information
3. **Review Recent Changelogs**: Understand what happened recently
4. **Update Immediately**: Bring all current documents up to date

---

## 🚨 EMERGENCY ONBOARDING PROTOCOL

### **If Claude Crashes Mid-Session**
New Claude instance should **immediately**:

1. **Read This Protocol First** - `/1_Project_Documents/3_Execution_and_Protocols/DOCUMENTATION-MAINTENANCE-PROTOCOL.md`

2. **Check Current Status** - `/1_Project_Documents/3_Execution_and_Protocols/CURRENT-*.md`

3. **Read Latest Changelogs** - `/1_Project_Documents/4_Changelogs/2025-09-05/`

4. **Review Root Documents** - `/CLAUDE.md` and `/README.md`

5. **Update All Current Documents** - Bring everything up to date

6. **Create Recovery Entry** - Document the crash and recovery process

---

## 🔧 AUTOMATION TRIGGERS

### **When These Happen, Update Docs:**
- ✅ Task completed → Update CURRENT-WORKFLOW.md + Create changelog
- 📁 File moved/renamed → Update all references in current docs
- 🔧 Configuration changed → Update relevant architecture docs
- 🚀 New feature built → Update current status and workflow
- 🐛 Bug fixed → Create changelog entry
- 📋 Plan changed → Update current priorities and workflow
- 🗂️ Files reorganized → Update all current file references

### **Set These Mental Alarms:**
- **15-minute check**: "Do current docs reflect reality?"
- **30-minute deep check**: "Would a new Claude understand current state?"
- **Hour milestone**: "What changelog entry should I create?"
- **Major completion**: "What current docs need updating?"

---

## 💡 SELF-REMINDER PHRASES

### **Build These Into Responses:**
- "Let me also update the current status to reflect this change..."
- "I should create a changelog entry for what we just accomplished..."
- "Let me make sure the current workflow document reflects this..."
- "A new Claude instance would need to know about this change..."

### **Internal Questions to Ask:**
- "What changed in the last 15 minutes?"
- "Are all current documents accurate?"
- "Would the current docs help a new Claude onboard immediately?"
- "What would I want to know if I just started this session?"

---

## 🎯 SUCCESS METRICS

**This protocol is working if:**
- ✅ All CURRENT-* documents have timestamps within last 20 minutes
- ✅ New Claude instances can onboard in <5 minutes
- ✅ No user reminders needed for documentation updates
- ✅ Changelog entries exist for all significant work
- ✅ Current documents accurately reflect project reality

**This protocol is failing if:**
- ❌ User has to remind Claude to update documentation
- ❌ CURRENT documents are >1 hour old
- ❌ New Claude instances ask "what's the current state?"
- ❌ Documentation conflicts with actual project state

---

**CRITICAL REMINDER: This protocol must be followed by every Claude instance. If you're reading this as a new Claude, your first task is to update all CURRENT-* documents to reflect the actual current state of the project.**