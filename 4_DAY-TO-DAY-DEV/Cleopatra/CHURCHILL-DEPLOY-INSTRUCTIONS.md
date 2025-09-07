# CHURCHILL: Deploy Mentionlytics Service to Leap.new

## Current Status
✅ Mentionlytics service code pushed to GitHub main branch
✅ API token added to Encore secrets
⏳ Awaiting manual deployment in Leap.new

## Deploy Steps for User

### 1. Open Leap.new
Go to: https://leap.new

### 2. Open War Room Backend Project
- Find your War Room Backend project
- It should show the 4.3 backend version

### 3. Deploy the New Service
**Option A: If Leap shows the Mentionlytics service**
- Click on the Mentionlytics service
- Click "Deploy" or "Update"
- Wait for deployment to complete

**Option B: If Leap doesn't show the service yet**
- Click "Sync from GitHub" or "Pull latest"
- Once synced, the Mentionlytics service should appear
- Deploy the service

### 4. Verify Deployment
Once deployed, these endpoints should work:
- `GET /api/v1/mentionlytics/validate` - Check API connection
- `GET /api/v1/mentionlytics/sentiment` - Get sentiment data
- `GET /api/v1/mentionlytics/geographic` - Get geographic distribution
- `GET /api/v1/mentionlytics/mentions` - Get mentions feed

## What the Service Does
The Mentionlytics service provides LIVE data for:
- Brand sentiment analysis (positive/negative/neutral)
- Geographic distribution of mentions
- Real-time mentions feed
- Validates API token is working

## Test Command
After deployment, run this to verify:
```bash
curl -X GET "https://war-room-backend-d2qou4c82vjupa5k36ug.lp.dev/api/v1/mentionlytics/validate"
```

Should return:
```json
{
  "status": "connected",
  "service": "mentionlytics",
  "timestamp": "..."
}
```

## Frontend Integration
Once deployed, the frontend's MOCK/LIVE toggle will:
- **MOCK mode**: Use sample data (working now)
- **LIVE mode**: Use real Mentionlytics data (after deployment)

## Troubleshooting
If deployment fails:
1. Check API token is correctly set in Encore secrets
2. Ensure the service appears in Leap.new
3. Try "Sync from GitHub" again
4. Check deployment logs for errors

---
**Operation Churchill Status**: Code ready, awaiting Leap.new deployment