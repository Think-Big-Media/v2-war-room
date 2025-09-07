# 🚀 WINSTON-WARROOM NETLIFY SETUP

## Creating winston-warroom.netlify.app from Winston Preview

### Step 1: Create New Netlify Site from Winston Preview

#### Option A: Via Netlify CLI (Recommended)
```bash
# Clone the Winston preview locally
git clone https://github.com/Think-Big-Media/war-room-frontend winston-warroom
cd winston-warroom

# Deploy to new Netlify site
netlify init
# Choose: Create & configure a new site
# Team: Your team
# Site name: winston-warroom

netlify deploy --prod
```

#### Option B: Via Netlify Dashboard
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub: `Think-Big-Media/war-room-frontend`
4. Select branch: `winston` or `churchill` (whichever has the features)
5. Site name: `winston-warroom`
6. Deploy

#### Option C: Fork the Preview (If Available)
1. Go to the Winston preview: https://68bd51bc102fd200082c46bf--leafy-haupia-bf303b.netlify.app
2. In Netlify dashboard, find this deploy
3. Look for "Promote to production" or "Create new site from this deploy"
4. Name it: `winston-warroom`

### Step 2: Configure Backend Connection

1. **Go to Site Settings** → **Environment Variables**
2. **Add/Update**:
   ```
   VITE_API_URL=https://staging-war-roombackend-45-x83i.encr.app
   ```
3. **Deploy contexts**: Set for all (Production, Deploy Previews, Branch deploys)

### Step 3: Set Custom Domain

1. **Go to** Site Settings → Domain Management
2. **Add custom domain**: `winston-warroom.netlify.app`
3. It will automatically be available (Netlify subdomain)

### Step 4: Verify Features

After deployment, test:
- [ ] Site loads at winston-warroom.netlify.app
- [ ] Triple-click logo opens admin panel
- [ ] MOCK/LIVE toggle is visible
- [ ] Backend health check works

### Step 5: Test Backend Connection

```bash
# Open browser console at winston-warroom.netlify.app
# Run these in console:

// Test health endpoint
fetch('https://staging-war-roombackend-45-x83i.encr.app/health')
  .then(r => r.json())
  .then(console.log)

// Should see all services healthy
```

---

## Environment Variables Reference

### Required Variables:
```
VITE_API_URL=https://staging-war-roombackend-45-x83i.encr.app
```

### Optional (if needed):
```
VITE_ENABLE_MOCK=true
VITE_ENABLE_ADMIN=true
VITE_DEBUG_MODE=true
```

---

## Quick Commands

### Check Current Deploy:
```bash
# See what's deployed
curl https://winston-warroom.netlify.app
```

### Force Redeploy:
```bash
# From Netlify dashboard
# Deploys → Trigger deploy → Clear cache and deploy site
```

### Check API Connection:
```bash
# Test backend is connected
curl https://staging-war-roombackend-45-x83i.encr.app/health
```

---

## Troubleshooting

### If MOCK/LIVE Toggle Missing:
- Ensure you're using the Winston version (has admin features)
- Check that triple-click is working
- Verify in code that AdminDashboard component exists

### If Backend Not Connecting:
- Check browser console for CORS errors
- Verify VITE_API_URL has no trailing slash
- Test backend directly with curl
- Clear browser cache

### If Site Not Loading:
- Check Netlify build logs
- Verify all dependencies installed
- Check for build errors in package.json scripts

---

## Success Criteria

✅ winston-warroom.netlify.app is live  
✅ Triple-click admin panel works  
✅ MOCK/LIVE toggle visible  
✅ Backend health endpoint responding  
✅ Can switch between MOCK and LIVE modes  

---

## Next: Fix LIVE Data

Once winston-warroom is deployed:
1. Debug why Mentionlytics API is failing
2. Fix API connection in backend
3. Test LIVE data flows through
4. Document the fix for future deployments