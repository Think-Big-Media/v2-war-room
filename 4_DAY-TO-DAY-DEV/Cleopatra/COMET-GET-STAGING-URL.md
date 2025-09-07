# COMET PROMPT: Get Staging URL and Test

**COPY THIS TO COMET**

---

## YOUR MISSION: Get the staging URL and test the endpoints

Deployment succeeded! Now get the URL and test it.

### Step 1: Get the Staging URL
1. Go to: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging
2. Look for the staging URL. It should be displayed as:
   - `https://staging-war-roombackend-45-x83i.encr.app`
   - Or similar format with staging prefix
3. Copy this URL - we need it for testing and frontend configuration

### Step 2: Test the Endpoints
Once you have the URL, test these endpoints (replace YOUR-URL with actual staging URL):

```bash
# 1. Health Check (should return {"status":"ok"})
curl https://YOUR-URL/health

# 2. Mentionlytics Validation (should return LIVE data)
curl https://YOUR-URL/api/v1/mentionlytics/validate

# 3. Analytics Summary
curl https://YOUR-URL/api/v1/analytics/summary
```

### Step 3: Check API Documentation
1. Visit: `https://YOUR-URL` in a browser
2. You should see the Encore API documentation page
3. This lists all available endpoints

### Step 4: Report Back
Tell me:
1. **The exact staging URL** (e.g., https://staging-war-roombackend-45-x83i.encr.app)
2. **Health check result** - Does it return {"status":"ok"}?
3. **Mentionlytics result** - Does it return real data or an error?
4. **Can you access the API docs** in the browser?

### Where to Find the URL:
- **Environment page**: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging
- **Latest deployment**: Click on the successful deployment
- Look for: "API Base URL", "Staging URL", or "Environment URL"

---

**Get me the staging URL so we can update the frontend and test everything!**