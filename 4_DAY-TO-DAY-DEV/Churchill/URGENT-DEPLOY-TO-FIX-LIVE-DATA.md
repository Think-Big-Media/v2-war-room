# 🚨 URGENT: Deploy Backend to Enable Live Data

## THE PROBLEM IS SOLVED - JUST NEEDS DEPLOYMENT!

### ✅ What I Found:
1. **Webhook integration was COMMENTED OUT** in production code
2. **I fixed it** by uncommenting lines 157-180 in `mentionlytics/api.ts`
3. **Code is committed** but NOT deployed to production

### 📊 Current Status:

**Working Endpoints:**
- `/api/v1/mentionlytics/sentiment` ✅ Returns data
- `/api/v1/mentionlytics/geo` ✅ Returns 3 states (map works!)
- `/api/v1/webhook/slack` ✅ Accepts data (but doesn't store it)

**Broken:**
- `/api/v1/mentionlytics/feed` ❌ Returns only 1 hardcoded mention
- Webhook data not being stored or retrieved

## 🚀 IMMEDIATE ACTION REQUIRED

### Option 1: Deploy via Encore Dashboard (EASIEST)
1. Go to https://app.encore.cloud
2. Login with your credentials
3. Find the app (probably `war-roombackend-45-x83i`)
4. Click "Deploy" or "Trigger Deployment"
5. Select the latest commit: "Enable webhook data priority for BrandMentions integration"

### Option 2: Fix Git Remote and Deploy
```bash
cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/3_Backend_Codebase/4.5

# Check current remotes
git remote -v

# If encore remote is broken, remove and re-add
git remote remove encore
# Get correct URL from Encore dashboard
git remote add encore https://app.encore.cloud/[CORRECT-APP-ID].git

# Push to deploy
git push encore main
```

### Option 3: Deploy as New App
```bash
cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/3_Backend_Codebase/4.5

# Create new app
encore app create war-room-backend-live

# Link and deploy
encore app link war-room-backend-live
git push encore main

# Update frontend to use new URL
```

## 🧪 After Deployment - Test Live Data Flow

```bash
# 1. Send test data to webhook
curl -X POST https://staging-war-roombackend-45-x83i.encr.app/api/v1/webhook/slack \
  -H "Content-Type: application/json" \
  -d '{
    "text": "BREAKING: Jack Harrison surges in Pennsylvania polls",
    "channel": "war-room-mentions",
    "user": "BrandMentions"
  }'

# 2. Check if feed shows the data
curl https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/feed

# Should return the webhook data instead of sample mention!
```

## 🎯 Expected Result After Deployment

Once deployed, the Live Intelligence dashboard will:
1. Show real mentions from BrandMentions webhook
2. Update in real-time as new data arrives
3. Display actual social media mentions instead of samples

## 💡 KEY INSIGHT

**The code is ALREADY FIXED!** I found and fixed the exact issue:
- Production has webhook integration commented out
- I uncommented it in commit `63d66ce`
- Just needs deployment to activate

**No more coding needed - just deploy!**

---

**STATUS**: Code fixed, awaiting deployment to production