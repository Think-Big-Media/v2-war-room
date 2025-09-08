# WINSTON-WARROOM NETLIFY DEPLOYMENT - FINAL

## Quick Deploy to See Your REAL Data!

### Prerequisites:
✅ Backend deployed with webhook endpoint
✅ Zapier sending data (or about to)
✅ Ready to see real Jack Harrison mentions

---

## NETLIFY DEPLOYMENT STEPS

### Option A: Use Existing Winston Preview
If you already have a Winston preview at `68bd51bc102fd200082c46bf--leafy-haupia-bf303b.netlify.app`:
1. Go to Netlify dashboard
2. Find that deployment
3. Promote to production
4. Update environment variable:
   ```
   VITE_API_URL=https://staging-war-roombackend-45-x83i.encr.app
   ```

### Option B: Create New winston-warroom Site

#### Step 1: Clone Frontend Repository
```bash
cd /tmp
git clone https://github.com/Think-Big-Media/3.1-ui-war-room-netlify.git winston-warroom
cd winston-warroom
```

#### Step 2: Update Configuration
Create `.env.production`:
```bash
VITE_API_URL=https://staging-war-roombackend-45-x83i.encr.app
VITE_APP_NAME=Jack Harrison War Room
VITE_ENVIRONMENT=production
VITE_ENABLE_MOCK_MODE=false
```

#### Step 3: Deploy to Netlify
```bash
# Install Netlify CLI if needed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Create new site
netlify init
# Choose: Create & configure a new site
# Team: Your team
# Site name: winston-warroom

# Deploy
npm run build
netlify deploy --prod --dir=dist
```

### Option C: Deploy via Netlify Dashboard
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub
4. Select: `Think-Big-Media/3.1-ui-war-room-netlify`
5. Configure:
   - Site name: `winston-warroom`
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables:
   ```
   VITE_API_URL=https://staging-war-roombackend-45-x83i.encr.app
   ```
7. Deploy!

---

## TEST YOUR DEPLOYMENT

### 1. Visit Your Site
```
https://winston-warroom.netlify.app
```

### 2. Check Data Flow
- Should see mentions loading
- If Zapier is connected, real mentions appear
- If not, graceful mock data shows

### 3. Triple-Click for Admin
- Triple-click anywhere on page
- Admin panel appears
- Toggle MOCK/LIVE mode

---

## ZAPIER CONNECTION TEST

### Send Test Data:
```bash
curl -X POST https://staging-war-roombackend-45-x83i.encr.app/api/v1/webhook/brandmentions \
  -H "Content-Type: application/json" \
  -d '{
    "mentions": [{
      "id": "test-1",
      "text": "Jack Harrison leading in Pennsylvania polls!",
      "author": "Political Observer",
      "platform": "Twitter",
      "sentiment": "positive",
      "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'"
    }]
  }'
```

If this works, your Zapier → Webhook → Frontend pipeline is ready!

---

## SUCCESS CHECKLIST

✅ Backend webhook deployed
✅ Winston-warroom.netlify.app live
✅ Frontend connected to backend
✅ Zapier sending real data
✅ 3,229 mentions displaying!

---

## CELEBRATE! 🎉

You now have REAL social media monitoring for Jack Harrison's Senate campaign!