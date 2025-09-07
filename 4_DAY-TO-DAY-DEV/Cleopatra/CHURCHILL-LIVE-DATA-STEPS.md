# CHURCHILL: Get LIVE Data Working NOW

## ✅ What We've Done:
1. Created `churchill-live-data` branch for SAFE testing (not production!)
2. Updated frontend to use yesterday's Leap.new backend: `war-room-backend-foundation-d2tdhv482vjq88rgfm3g.lp.dev`
3. Pushed to GitHub - will create preview URL on Netlify

## 🔴 What YOU Need to Do NOW:

### Step 1: Check Netlify for Preview URL
1. Go to Netlify dashboard
2. Look for build from `churchill-live-data` branch
3. It will create a preview URL like: `churchill-live-data--leafy-haupia.netlify.app`
4. This is SAFE to test - NOT production!

### Step 2: Deploy Mentionlytics to Leap.new
1. Go to https://leap.new
2. Open "War Room Backend Foundation" (the one from yesterday)
3. Click "Sync from GitHub" or "Pull latest"
4. You should see a new `mentionlytics` service appear
5. Deploy/Update the mentionlytics service

### Step 3: Test LIVE Data
Once both are deployed:
1. Open the Churchill preview URL (NOT production)
2. Triple-click logo to open admin panel
3. Toggle from MOCK to LIVE
4. You should see real Mentionlytics data!

## 🎯 The Backend Situation Explained:

We have 3 backends causing confusion:
- **OLD**: `war-room-3-backend-d2msjrk82vjjq794glog.lp.dev` (abandoned)
- **Encore z9n2**: `staging-war-room-backend-foundation-z9n2.encr.app` (not responding properly)
- **Yesterday's Leap**: `war-room-backend-foundation-d2tdhv482vjq88rgfm3g.lp.dev` (using this one!)

The Churchill branch uses yesterday's Leap backend because:
1. It's the most recent one you created
2. We can deploy to it via Leap.new dashboard
3. The Mentionlytics code is ready in GitHub

## 🚨 Why No LIVE Data Yet:
1. Mentionlytics service needs to be deployed via Leap.new dashboard (manual step)
2. Backend URLs were mismatched between versions
3. We needed a SAFE preview branch to test (now we have Churchill!)

## ✅ Success Looks Like:
- Churchill preview URL shows LIVE Mentionlytics data
- MOCK/LIVE toggle works
- No risk to production (leafy-haupia)
- Client sees real sentiment analysis TODAY

---
**Next Action**: Check Netlify for Churchill preview URL, then deploy Mentionlytics in Leap.new