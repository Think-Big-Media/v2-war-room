# 🔧 FIX DEPLOYMENT - Wrong Path Issue

## THE PROBLEM:
We have nested backend folders:
```
3_Backend_Codebase/4.4/
├── encore.app (partial backend)
├── alerting/
├── analytics/
└── war-room-4-4-backend/  <-- COMPLETE BACKEND IS HERE
    ├── encore.app
    ├── alerting/
    ├── analytics/
    └── (all other services)
```

## SOLUTION: Update Root Directory

### Option 1: Update in Encore Cloud (Recommended)
1. Go to: https://app.encore.cloud/war-roombackend-45-x83i/settings/app
2. Change **Root Directory** from:
   - Current: `3_Backend_Codebase/4.4`
   - Change to: `3_Backend_Codebase/4.4/war-room-4-4-backend`
3. Click UPDATE (should be enabled now)
4. This will trigger a new deployment

### Option 2: Remove Duplicate Structure
If Option 1 doesn't work, we need to clean up the structure:

```bash
# Remove the outer duplicate files (keeping the nested complete backend)
cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/3_Backend_Codebase/4.4

# Remove outer service folders (keep war-room-4-4-backend)
rm -rf alerting analytics auth campaigns health intelligence mentionlytics monitoring
rm -f encore.app package.json tsconfig.json

# Move everything from war-room-4-4-backend up one level
mv war-room-4-4-backend/* .
mv war-room-4-4-backend/.* . 2>/dev/null
rmdir war-room-4-4-backend

# Commit and push
git add -A
git commit -m "Fix: Flatten backend structure for Encore deployment"
git push origin main
```

### Option 3: Quick Path Fix
Just update the path in Encore to point to the correct nested folder:
- From: `3_Backend_Codebase/4.4`
- To: `3_Backend_Codebase/4.4/war-room-4-4-backend`

## Why This Happened:
We accidentally created a backend inside a backend. The complete, working backend is in the `war-room-4-4-backend` subfolder.

## What Will Work:
Once Encore points to the correct folder (`3_Backend_Codebase/4.4/war-room-4-4-backend`), it will find:
- ✅ Complete encore.app
- ✅ All service folders
- ✅ Proper TypeScript config
- ✅ All the code that works

---

**Try Option 1 first - just update the Root Directory path in Encore Cloud settings!**