# 🚀 DEPLOY BRANDMENTIONS - GET REAL SOCIAL DATA NOW!

## Quick Deployment for Jack Harrison Campaign Monitoring

### Step 1: Add BrandMentions API Key to Encore
1. Go to: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging/settings
2. Click "Secrets" tab
3. Add this secret:
```
BRANDMENTIONS_API_KEY=qhW6NSOj0VAC39fVWCEEW0ae96fOYFRq
```
4. Save it

### Step 2: Trigger New Deployment
1. In Encore dashboard, click "Deploy"
2. Select latest commit: "WINSTON: Replace NewsAPI with BrandMentions"
3. Deploy (takes 2-3 minutes)

### Step 3: Test REAL Social Data

```bash
# Check BrandMentions connection
curl https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/validate

# Should return:
{
  "status": "connected",
  "hasApiKey": true,
  "brandMentionsActive": true
}

# Get REAL social mentions about Jack Harrison
curl https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/feed

# Get REAL sentiment from social media
curl https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/sentiment
```

## What You'll Get:

### Real Social Media Data:
- Twitter mentions of "Jack Harrison"
- Facebook posts about the campaign
- Reddit discussions
- News coverage
- Blog mentions
- Forum discussions

### Campaign Intelligence:
- Sentiment tracking (how people feel about Jack)
- Geographic distribution (which PA counties are talking)
- Competitor mentions (Sarah Mitchell tracking)
- Crisis detection (negative sentiment spikes)
- Influencer identification

### Dashboard Will Show:
- **Live mentions feed**: Real tweets and posts
- **Sentiment gauge**: Actual positive/negative ratio
- **Geographic heatmap**: Pennsylvania focus
- **Crisis alerts**: When sentiment drops
- **Trending topics**: What people are saying

## Next: Winston Frontend

Once backend is deployed with BrandMentions:
1. Create winston-warroom.netlify.app
2. Connect to staging backend
3. See REAL campaign data flowing!

## Success Indicators:
✅ `brandMentionsActive: true` in validate endpoint
✅ Real social media posts in feed
✅ Actual sentiment percentages
✅ Jack Harrison mentions appearing
✅ Pennsylvania geographic data

---

**This is REAL social media monitoring for the Jack Harrison Senate campaign!**