# CRITICAL: Sync Encore with GitHub

## The Problem
Encore Cloud is using OLD cached code with the broken file:
- `/workspace/3_Backend_Codebase/4.4/war-room-4-4-backend/webhook/process-brandmentions.ts`

This file was DELETED in our latest commits but Encore doesn't see it!

## Solution - Connect Encore to GitHub

### For Comet Browser:

1. **Go to Encore Cloud Settings**
   - https://app.encore.cloud/war-roombackend-45-x83i/settings

2. **Connect to GitHub Repository**
   - Repository: `Think-Big-Media/v2-war-room`
   - Branch: `main`
   - Path: `3_Backend_Codebase/4.4/war-room-4-4-backend`

3. **Force Pull Latest Code**
   - Current commit should be: `58d3e657`
   - This commit has the file DELETED

4. **Deploy Again**
   - Should now compile without errors

## What's Fixed in Latest Code:
- ✅ Removed: `webhook/process-brandmentions.ts` (the problematic file)
- ✅ Added: `mentionlytics/crisis.ts` (fixes 404 error)
- ✅ Fixed: All compilation errors

## Alternative: Create New Encore App
If syncing doesn't work, create a new Encore app from the GitHub repo:
1. Create new app in Encore
2. Connect to GitHub: `Think-Big-Media/v2-war-room`
3. Set path: `3_Backend_Codebase/4.4/war-room-4-4-backend`
4. Deploy