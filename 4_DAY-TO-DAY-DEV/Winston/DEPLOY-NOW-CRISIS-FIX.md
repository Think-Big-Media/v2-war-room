# DEPLOY NOW - Crisis Endpoint Fix

## Comet Browser Instructions

### Step 1: Go to Encore Cloud
https://app.encore.cloud/war-roombackend-45-x83i

### Step 2: Click Deploy
The crisis endpoint has been added to fix the 404 error.

### What This Fixes:
✅ Crisis endpoint 404 error will be gone
✅ Frontend will stop showing errors in console
✅ Dashboard will load cleanly

### Files Changed:
- Added: `mentionlytics/crisis.ts` - Returns empty alerts array
- Removed: Duplicate webhook file that was causing compilation errors

Once deployed, refresh https://war-room-3-1-ui.netlify.app and the 404 errors will be gone!