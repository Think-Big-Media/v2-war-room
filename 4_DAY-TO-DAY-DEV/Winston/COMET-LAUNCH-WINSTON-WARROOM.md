# COMET PROMPT: Launch winston-warroom.netlify.app

**COPY THIS ENTIRE PROMPT TO COMET AI**

---

## YOUR MISSION: Create winston-warroom.netlify.app from Winston Preview

I need you to create a new Netlify site called winston-warroom from our existing Winston preview. Follow these steps exactly:

### Step 1: Access Netlify
1. Go to https://app.netlify.com
2. Login if needed (I'll handle authentication)

### Step 2: Find the Winston Preview
Look for one of these:
- Deploy preview: `68bd51bc102fd200082c46bf--leafy-haupia-bf303b.netlify.app`
- Or any recent deploy from the `leafy-haupia-bf303b` site
- It should have the admin panel (triple-click feature)

### Step 3: Create New Site
**Method A - If you can promote the preview:**
1. Find the Winston preview deploy
2. Look for "Promote to production" or similar option
3. Instead, create new site from this deploy

**Method B - Create from GitHub:**
1. Click **"Add new site"** → **"Import an existing project"**
2. Connect to GitHub
3. Select repository: `Think-Big-Media/war-room-frontend`
4. Choose branch: `winston` or `churchill` (whichever has the admin features)
5. **IMPORTANT - Site Settings:**
   - **Site name**: `winston-warroom` (exactly this)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Step 4: Add Environment Variable (CRITICAL)
Before deploying, add this environment variable:
- **Key**: `VITE_API_URL`
- **Value**: `https://staging-war-roombackend-45-x83i.encr.app`
- **Deploy contexts**: All (Production, Deploy preview, Branch deploys)

### Step 5: Deploy the Site
1. Click **"Deploy site"** or **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Site will be available at: `https://winston-warroom.netlify.app`

### Step 6: Verify It Works
Once deployed, test these:
1. Go to https://winston-warroom.netlify.app
2. **Triple-click the logo** (top left)
3. Admin panel should appear
4. Look for MOCK/LIVE toggle
5. Open browser console (F12) and run:
   ```javascript
   fetch('https://staging-war-roombackend-45-x83i.encr.app/health')
     .then(r => r.json())
     .then(console.log)
   ```
   Should see all services healthy

### What You're Creating:
- **Site name**: winston-warroom
- **URL**: https://winston-warroom.netlify.app
- **Features**: Admin panel, MOCK/LIVE toggle, all Winston features
- **Backend**: Connected to staging-war-roombackend-45-x83i.encr.app

### Common Issues & Fixes:

**If site name taken:**
Try: `winston-warroom-v2` or `warroom-winston`

**If build fails:**
Check build settings:
- Node version: 18 or higher
- Build command: `npm run build`
- Publish directory: `dist`

**If no admin panel:**
Make sure you're using the Winston/Churchill branch that has the triple-click feature

**If backend not connecting:**
Verify VITE_API_URL environment variable is set correctly (no trailing slash)

### Report Back:
Tell me:
1. Is the site deployed at winston-warroom.netlify.app?
2. Does triple-click show admin panel?
3. Does the health check work in console?
4. Any errors or issues?

---

**This will create a clean, versioned deployment with all features working. The expired Mentionlytics token won't break anything - it will just show mock data instead of live data.**