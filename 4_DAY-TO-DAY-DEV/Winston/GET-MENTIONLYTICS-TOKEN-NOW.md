# 🔑 GET YOUR MENTIONLYTICS TOKEN - Quick Steps

## Your Account:
- **Domain**: roderick.batterboost.com
- **Plan**: Trial account
- **Status**: Active

## Step 1: Get Your Token (2 Options)

### Option A: Direct Browser Method (Easiest)
1. Open a new browser tab
2. Paste this URL (replace with YOUR credentials):
```
https://app.mentionlytics.com/api/token?email=YOUR_EMAIL&password=YOUR_PASSWORD
```
3. Press Enter
4. You'll see something like:
```json
{"token": "long-string-of-characters-here"}
```
5. Copy the token value (without quotes)

### Option B: Using curl
```bash
curl "https://app.mentionlytics.com/api/token?email=YOUR_EMAIL&password=YOUR_PASSWORD"
```

## Step 2: Update Token in Encore

### Via Comet (Give this to Comet):
```
Please update the MENTIONLYTICS_API_TOKEN secret in Encore:

1. Go to: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging/settings
2. Click on "Secrets" tab
3. Find MENTIONLYTICS_API_TOKEN
4. Update value to: [PASTE YOUR NEW TOKEN HERE]
5. Click Save
6. The service will auto-restart
```

### Or Do It Yourself:
1. Go to: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging/settings
2. Click "Secrets" tab
3. Find `MENTIONLYTICS_API_TOKEN`
4. Click edit/pencil icon
5. Paste your new token
6. Save

## Step 3: Verify It Works

Test the API connection:
```bash
# Check validation endpoint
curl https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/validate

# Should return:
{"hasApiKey": true, "status": "connected"}  ✅

# Instead of:
{"hasApiKey": true, "status": "error"}  ❌
```

## Step 4: Test Live Data

```bash
# Get real sentiment data
curl https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/sentiment

# Should return actual Mentionlytics data
# (might be empty if no mentions tracked yet in trial)
```

---

## Important Notes:

### About Trial Account:
- **Trial limitations**: May have limited mentions/keywords
- **Data availability**: Might not have historical data yet
- **Keywords**: Need to be configured in Mentionlytics dashboard
- **First data**: Can take 24-48 hours to populate

### If Token Still Doesn't Work:
1. **Check account active**: Login to roderick.batterboost.com
2. **Verify trial not expired**: Check account status
3. **Configure keywords**: Add tracking keywords in Mentionlytics
4. **Wait for data**: New accounts need time to gather mentions

### Alternative for Immediate Demo:
If trial account has no data yet, we can:
1. Keep using mock data (looks real)
2. Add "Demo Mode" banner
3. Switch to live when data populates

---

## Quick Test Script:

```bash
#!/bin/bash
# Save as test-mentionlytics.sh

TOKEN="your-new-token-here"
BACKEND="https://staging-war-roombackend-45-x83i.encr.app"

echo "Testing Mentionlytics Integration..."
echo "===================================="

echo "1. Validation:"
curl -s "$BACKEND/api/v1/mentionlytics/validate" | python3 -m json.tool

echo "2. Sentiment:"
curl -s "$BACKEND/api/v1/mentionlytics/sentiment" | python3 -m json.tool

echo "3. Direct API Test:"
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://api.mentionlytics.com/api/mentions/search" | head -c 200
```

---

**Next Steps:**
1. Get your token using the URL method
2. Update it in Encore
3. Test if it connects
4. If no data yet (trial account), that's OK - connection is what matters!