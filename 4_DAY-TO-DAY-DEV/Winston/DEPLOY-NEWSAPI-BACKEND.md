# DEPLOY BACKEND WITH NEWSAPI - REAL DATA NOW!

## Quick Deployment Steps

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Add NewsAPI Key to Encore
1. Go to: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging/settings
2. Click "Secrets" tab
3. Add this secret:
```
NEWSAPI_KEY=7c372a3045d14f949dbf87676c2d2e22
```

### Step 3: Trigger Redeploy in Encore
1. Go to Environment overview
2. Click "Deploy" or "Redeploy"
3. Select latest commit (WINSTON: Add NewsAPI integration)
4. Deploy will take 2-3 minutes

### Step 4: Test REAL Data Endpoints

```bash
# Validate API connections (should show newsApiActive: true)
curl https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/validate

# Get REAL news mentions
curl https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/feed

# Get REAL sentiment from actual news
curl https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/sentiment
```

### What You'll See:
- **REAL headlines** from BBC, CNN, etc.
- **REAL timestamps** (articles from today!)
- **REAL sentiment** analyzed from actual news
- **12,909+ articles** about politics available

### Frontend Will Show:
- Live news feed in monitoring section
- Real sentiment percentages
- Actual article titles and sources
- Current timestamps

## Success Indicators:
✅ `/validate` shows `newsApiActive: true`
✅ `/feed` returns real news articles
✅ `/sentiment` shows percentages based on real headlines
✅ No more "sample data" messages in logs

## Next: Create Winston Frontend
Once backend is deployed with NewsAPI, create winston-warroom.netlify.app to display the real data!