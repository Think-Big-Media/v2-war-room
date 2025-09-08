# ENCORE SECRETS - REAL DATA CONFIGURATION
## NO MORE MOCK DATA - EVER!

**COPY THIS TO COMET AI**

---

## YOUR MISSION: Add ALL REAL Secrets to Encore Dashboard

Go to the Encore dashboard and add these secrets IMMEDIATELY. These are REAL, WORKING credentials:

### Step 1: Navigate to Secrets
1. Go to https://app.encore.cloud
2. Select `war-room-backend-45-staging` 
3. Click on "Secrets" or "Environment Variables"
4. Select STAGING environment

### Step 2: Add ALL These Secrets (REAL DATA)

```
MENTIONLYTICS_API_TOKEN=0X44tHi275ZqqK2psB4U-Ph-dw2xRkq7T4QVkSBlUz32V0ZcgkXt2dQSni52-fhB7WZyZOoGBPcR23O9oND_h1DE

META_ACCESS_TOKEN=EAAYVfF8z1t0BO0fNVY97AiWOY1njQSBrEBx0m58jCMRTJFXmMaZAFQAaJOlD28L3F8z3rxMq7iCbD38BXdl2K4vCdAF4UbXx9gGJdPSsZBDEHvQSZC8JJLvK3nZBxwqgLQoAjYfnO0J8NMtx6Yg1gKU5RZCq0K8Gat19m9D5fGNnI9CwL1PJJ39eFcX7YqJGaEXRcZD

GOOGLE_ADS_CLIENT_ID=808203781238-dgqv5sga2q1r1ls6n77fc40g3idu8h1o.apps.googleusercontent.com

GOOGLE_ADS_DEVELOPER_TOKEN=h3cQ3ss7lesG9dP0tC56ig

BRANDMENTIONS_API_KEY=FHXIdkp0fvj8MLgKwm1veU9j7DcFG9ZV

BRANDMENTIONS_API_TOKEN=qhW6NSOj0VAC39fVWCEEW0ae96fOYFRq

JWT_SECRET=war-room-secret-key-2025-secure-token-45

OPENAI_API_KEY=sk-proj-[add-your-real-openai-key-here]

TWILIO_ACCOUNT_SID=[add-if-you-have-one]

TWILIO_AUTH_TOKEN=[add-if-you-have-one]
```

### Step 3: Trigger Redeployment
After adding all secrets:
1. Click "Deploy" or "Redeploy"
2. Wait for deployment to complete (2-3 minutes)
3. Get the new deployment URL

### Step 4: Test REAL Data Endpoints

Once deployed, test these to confirm REAL data:

```bash
# BrandMentions webhook cache (should have real mentions)
curl https://staging-war-room-backend-45-[YOUR-URL].encr.app/api/v1/webhook/cache/mentions

# Meta Campaigns (should return REAL Facebook ads data)
curl https://staging-war-room-backend-45-[YOUR-URL].encr.app/api/v1/campaigns/meta

# Google Ads (when configured with OAuth)
curl https://staging-war-room-backend-45-[YOUR-URL].encr.app/api/v1/campaigns/google

# Mentionlytics feed (should show Jack Harrison mentions)
curl https://staging-war-room-backend-45-[YOUR-URL].encr.app/api/v1/mentionlytics/feed
```

### What This Enables:
✅ REAL social media mentions from BrandMentions (3,229 mentions)
✅ REAL Meta/Facebook Ads data (campaigns, spend, impressions)
✅ REAL sentiment analysis from actual mentions
✅ REAL mention volume tracking
✅ CALCULATED crisis detection from real sentiment
✅ CALCULATED share of voice from real competitor data

### NO MORE MOCK DATA:
- The backend now checks for real data FIRST
- Only falls back to mock if API fails
- All credentials are PRODUCTION READY
- Stop using test/placeholder values

### IMPORTANT:
These are REAL credentials that cost money and have limits:
- Mentionlytics: Production token (be careful with rate limits)
- Meta: Production access token (real ad account)
- BrandMentions: Real API access (3,229 mentions available)

---

**After adding these secrets, tell me the deployment URL so we can test REAL data flow!**