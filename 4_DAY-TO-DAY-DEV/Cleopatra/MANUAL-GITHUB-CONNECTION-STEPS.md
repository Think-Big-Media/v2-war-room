# 🔗 MANUAL GITHUB CONNECTION - Quick Steps

## You Need to Do This Manually (2 minutes):

### Step 1: Open Encore Cloud
Go to: https://app.encore.cloud/war-roombackend-45-x83i/settings/integrations/github

### Step 2: Connect GitHub
1. Click **"Connect GitHub Repository"**
2. You'll see a GitHub authorization screen
3. **IMPORTANT**: Grant access to "Think-Big-Media" organization

### Step 3: If Repository Doesn't Appear
Go to: https://github.com/settings/applications
1. Find "Encore" in the list
2. Click on it
3. Under "Organization access", find "Think-Big-Media"
4. Click "Grant" or "Request access"
5. Return to Encore and refresh

### Step 4: Configure the Connection
Once you see `Think-Big-Media/v2-war-room`:
- **Repository**: `Think-Big-Media/v2-war-room`
- **Branch**: `main`
- **App Root**: `/3_Backend_Codebase/4.4`
- Click **"Save and Deploy"**

### Step 5: Deployment Starts Automatically
- Watch the progress at: https://app.encore.cloud/war-roombackend-45-x83i/deploys
- Takes 2-5 minutes
- You'll get a URL like: `https://staging-war-roombackend-45-x83i.encr.app`

## What's Already Done:
✅ App created: `war-roombackend-45-x83i`  
✅ All secrets configured  
✅ Code pushed to GitHub (commit `b674f9a7`)  
✅ Everything ready - just needs GitHub connection

## Once Connected, Test With:
```bash
# Replace [YOUR-URL] with actual staging URL
curl https://staging-war-roombackend-45-x83i.encr.app/health
curl https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/validate
```

## If You Have Issues:
- **Can't see Think-Big-Media org?** → Grant access in GitHub settings
- **Deploy button grayed out?** → Make sure branch and path are set
- **Build fails?** → Check build logs, but code should be fine (we tested it)

---

**This is the ONLY manual step needed. Once GitHub is connected, everything else is automatic!**