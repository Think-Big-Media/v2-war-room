# WINSTON-WARROOM NETLIFY DEPLOYMENT GUIDE

## Mission: Create winston-warroom.netlify.app with Historical Codename Versioning

**Date**: September 8, 2025  
**Purpose**: New deployment strategy with historical versioning  
**Backend**: https://staging-war-roombackend-45-x83i.encr.app  

---

## COMET PROMPT: Deploy Winston-Warroom to Netlify

**COPY THIS ENTIRE PROMPT TO COMET AI**

---

### YOUR MISSION: Create winston-warroom.netlify.app

I need you to create a NEW Netlify site called winston-warroom with our War Room frontend connected to the LIVE backend.

### Step 1: Access Netlify Dashboard
1. Go to https://app.netlify.com
2. You should see our existing sites
3. Click "Add new site" → "Import an existing project"

### Step 2: Create New Site from GitHub
**Site Configuration:**
- **Git Provider**: GitHub
- **Repository**: `Think-Big-Media/3.1-ui-war-room-netlify`
- **Branch**: `main`
- **Site Name**: `winston-warroom` (will become winston-warroom.netlify.app)

### Step 3: Configure Build Settings
**Build Settings:**
```
Base directory: /
Build command: npm run build
Publish directory: dist
```

### Step 4: Add Environment Variables
**CRITICAL: Add these environment variables BEFORE first deploy:**

```bash
VITE_API_URL=https://staging-war-roombackend-45-x83i.encr.app
VITE_APP_NAME=War Room Command Center
VITE_ENVIRONMENT=production
VITE_ENABLE_MOCK_MODE=true
VITE_DEBUG_MODE=false
```

### Step 5: Deploy the Site
1. Click "Deploy winston-warroom"
2. Wait for initial deployment (3-5 minutes)
3. Site will be available at: https://winston-warroom.netlify.app

### Step 6: Configure Redirects
After deployment, create `_redirects` file in the repo root:
```
/api/*  https://staging-war-roombackend-45-x83i.encr.app/api/:splat  200
/*      /index.html                                                   200
```

Or add to `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://staging-war-roombackend-45-x83i.encr.app/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 7: Test the Deployment

Visit these URLs to verify:
```bash
# Main app
https://winston-warroom.netlify.app

# Health check (through proxy)
https://winston-warroom.netlify.app/api/health

# Direct backend test
https://staging-war-roombackend-45-x83i.encr.app/health
```

### Step 8: Enable Admin Features
1. Open https://winston-warroom.netlify.app
2. Triple-click anywhere on the page
3. Admin panel should appear with:
   - MOCK/LIVE toggle
   - Debug console
   - API status indicators

### Step 9: Test Key Features
- [ ] Login functionality
- [ ] Dashboard loads
- [ ] Analytics display (mock or live)
- [ ] Monitoring data shows
- [ ] Chat/Intelligence works
- [ ] Settings save properly
- [ ] MOCK/LIVE toggle functions

### Step 10: Report Back
Tell me:
1. Site URL: https://winston-warroom.netlify.app
2. Deployment status: Success/Failed
3. Backend connection: Working/Not working
4. Data displayed: Mock/Live
5. Any errors in console

---

## Historical Codename Versioning Strategy

### Current Deployment
- **WINSTON**: Current production (winston-warroom.netlify.app)
- **Backend**: 4.5 staging on Encore
- **Status**: Active deployment

### Future Deployments (Never reuse names)
- **NAPOLEON**: Next major feature release
- **CLEOPATRA**: OAuth implementation 
- **CHURCHILL**: Performance optimization
- **EINSTEIN**: AI enhancements
- **MOZART**: UI/UX redesign
- **TESLA**: Real-time features
- **DARWIN**: Analytics evolution

### Deployment Pattern
1. Each codename gets its own Netlify site
2. Format: `[codename]-warroom.netlify.app`
3. Easy rollback: Just switch DNS to previous codename
4. Clear history: Know exactly what each deployment contains
5. Never delete old deployments (instant rollback available)

---

## Quick Recovery Commands

If Winston deployment has issues:
```bash
# Rollback to leafy-haupia (current stable)
# In Netlify: Set primary domain back to leafy-haupia

# Or create emergency mock-only version
VITE_FORCE_MOCK_MODE=true npm run build
netlify deploy --prod --site winston-warroom
```

---

## Next Steps After Winston

1. **Verify Live Data**: Update Mentionlytics token in Encore
2. **Create Napoleon**: Next feature deployment
3. **Document in History**: Track what each codename delivered
4. **Never Reuse**: Each historical figure used once only

---

**Remember**: Winston marks our transition to historical codename versioning. This is VERSION ONE of our new deployment strategy!