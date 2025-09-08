# CREATE NEW ENCORE APP - Nuclear Option

## The Problem
Encore Cloud is STUCK with old cached code that includes a deleted file:
`/workspace/3_Backend_Codebase/4.4/war-room-4-4-backend/webhook/process-brandmentions.ts`

This file was DELETED in commits:
- `1be422f1` - First deletion attempt
- `77ec6390` - Complete removal of BrandMentions webhook

But Encore's workspace still has it!

## Solution: Create NEW Encore App

### For Comet Browser:

1. **Go to Encore Cloud**
   https://app.encore.cloud

2. **Create New App**
   - Click "Create app"
   - Name: `war-room-winston` (or any new name)
   
3. **Connect to GitHub**
   - Repository: `Think-Big-Media/v2-war-room`
   - Branch: `main`
   - Path: `3_Backend_Codebase/4.4/war-room-4-4-backend`

4. **Deploy**
   - Should pull fresh code WITHOUT the deleted file
   - Will compile successfully

## What's in the Latest Code:
- ✅ NO `process-brandmentions.ts` (deleted)
- ✅ NO BrandMentions webhook (removed)  
- ✅ YES crisis endpoint (added)
- ✅ Uses Slack for mentions

## Update Frontend
Once new app is deployed, update frontend to use new URL:
- New URL will be something like: `https://staging-war-room-winston-xxxx.encr.app`