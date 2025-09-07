# COMET PROMPT: Deploy War Room Backend 4.5 to Encore Cloud

**COPY THIS ENTIRE PROMPT TO COMET AI**

---

## YOUR MISSION: Deploy War Room Backend to Encore Cloud

I need you to help me deploy the War Room backend to Encore Cloud. Follow these steps EXACTLY:

### Step 1: Access Encore Cloud
1. Go to https://app.encore.cloud
2. Sign in with my credentials (I'll handle the login)
3. Click "Create new application"

### Step 2: Create New Application
**IMPORTANT: Name it exactly as shown to avoid confusion with existing deployments**

- **Application Name**: `war-room-backend-45-staging`
- **Description**: "War Room 4.5 Staging - Complete Backend with All Services"
- **Import from**: GitHub
- **Repository**: `Think-Big-Media/v2-war-room`
- **App Root Path**: `/3_Backend_Codebase/4.4` (yes, use the 4.4 folder for 4.5 deployment)
- **Environment**: Create STAGING environment first

### Step 3: Configure Build Settings
- **Language**: TypeScript
- **Node Version**: 18 or latest LTS
- **Build Command**: (use Encore defaults)
- **Install Command**: (use Encore defaults)

### Step 4: Add ALL Environment Secrets
**CRITICAL: Add these secrets in the Encore dashboard BEFORE first deployment**

Click on "Secrets" or "Environment Variables" section and add:

```
MENTIONLYTICS_API_TOKEN=0X44tHi275ZqqK2psB4U-Ph-dw2xRkq7T4QVkSBlUz32V0ZcgkXt2dQSni52-fhB7WZyZOoGBPcR23O9oND_h1DE

JWT_SECRET=war-room-secret-key-2025-secure-token-45

META_ACCESS_TOKEN=EAAYVfF8z1t0BO0fNVY97AiWOY1njQSBrEBx0m58jCMRTJFXmMaZAFQAaJOlD28L3F8z3rxMq7iCbD38BXdl2K4vCdAF4UbXx9gGJdPSsZBDEHvQSZC8JJLvK3nZBxwqgLQoAjYfnO0J8NMtx6Yg1gKU5RZCq0K8Gat19m9D5fGNnI9CwL1PJJ39eFcX7YqJGaEXRcZD

GOOGLE_ADS_API_KEY=AIzaSyB8KjC6D6Y9hZ3xL5W2mN4qR7tV1pX0fA8

OPENAI_API_KEY=sk-proj-eXaMpLeKeYhErEbUtNoTrEaL

TWILIO_ACCOUNT_SID=ACexample1234567890abcdef

TWILIO_AUTH_TOKEN=example9876543210fedcba

GOOGLE_CLIENT_ID=your-google-oauth-client-id

GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

DATABASE_URL=will-be-auto-configured-by-encore
```

**NOTE**: Some of these are placeholder values. The critical ones that MUST work:
- MENTIONLYTICS_API_TOKEN (this is REAL and WORKING)
- JWT_SECRET (use the one provided or generate your own)

### Step 5: Deploy to Staging
1. Click "Deploy" or "Create Application"
2. Wait for initial deployment (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://staging-war-room-backend-45-[random].encr.app`

### Step 6: Verify Deployment
After deployment completes, test these endpoints:

```bash
# Health Check (should return {"status":"ok"})
curl https://staging-war-room-backend-45-[YOUR-URL].encr.app/health

# Mentionlytics Validation (should return real data)
curl https://staging-war-room-backend-45-[YOUR-URL].encr.app/api/v1/mentionlytics/validate

# Auth Test (should return auth error, not 404)
curl -X POST https://staging-war-room-backend-45-[YOUR-URL].encr.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

### Step 7: Report Back
Once deployed, tell me:
1. The staging URL you received
2. Results of the health check
3. Any errors or issues you encountered

### What This Backend Includes:
- ✅ Complete Auth system with JWT
- ✅ Analytics service with metrics
- ✅ Monitoring service for social mentions
- ✅ Campaigns service (Meta + Google Ads)
- ✅ Intelligence service with AI chat
- ✅ Alerting service for crisis detection
- ✅ Health checks
- ✅ Mentionlytics LIVE data integration

### Common Issues & Solutions:

**If you see "Build Failed":**
- Check the build logs for TypeScript errors
- Ensure the app root path is correct: `/3_Backend_Codebase/4.4`

**If you see "Secrets not configured":**
- Go to the Secrets section in Encore dashboard
- Add each secret one by one
- Secrets should appear as masked values (••••••)

**If deployment is stuck:**
- Cancel and retry
- Make sure GitHub connection is authorized
- Check that you selected the correct branch (main)

### Why We're Using "4.5" Name:
- Avoids confusion with existing 4.4 deployments
- Clean slate deployment
- Same code, new instance
- Easier to track in Encore dashboard

### IMPORTANT NOTES:
1. **DO NOT** try to modify code during deployment
2. **DO NOT** skip adding secrets - add them BEFORE deploying
3. **DO** make sure to use STAGING environment first
4. **DO** copy the deployment URL once ready

---

**Once you've completed this deployment, we'll update the frontend to point to this new backend URL and finally have everything working with LIVE data!**