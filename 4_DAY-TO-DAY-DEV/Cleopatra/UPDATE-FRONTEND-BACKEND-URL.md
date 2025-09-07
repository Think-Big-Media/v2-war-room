# 🔗 UPDATE FRONTEND WITH NEW BACKEND URL

## The New Backend URL:
```
https://staging-war-roombackend-45-x83i.encr.app
```

## Where to Update in Leafy Haupia (Netlify):

### Option 1: Environment Variable (BEST)
1. Go to Netlify Dashboard: https://app.netlify.com
2. Find your site: `leafy-haupia-bf303b`
3. Go to **Site Settings** → **Environment Variables**
4. Update or add:
   ```
   VITE_ENCORE_API_URL=https://staging-war-roombackend-45-x83i.encr.app
   ```
   OR
   ```
   VITE_API_BASE_URL=https://staging-war-roombackend-45-x83i.encr.app
   ```
5. **Trigger a redeploy** for changes to take effect

### Option 2: Update in Code Files
Look for these files in your frontend repo:
- `.env.production`
- `src/config/api.js` or `src/config/index.js`
- `src/constants/api.constants.js`
- `netlify.toml` (if using redirects)

### Option 3: Netlify Redirects (if using)
In `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://staging-war-roombackend-45-x83i.encr.app/api/:splat"
  status = 200
  force = true
```

## Quick Test After Update:
1. Deploy the changes
2. Open browser DevTools → Network tab
3. Navigate your app
4. Look for API calls going to: `staging-war-roombackend-45-x83i.encr.app`
5. Check the MOCK/LIVE toggle

## What Will Happen:
- Frontend will start calling the new Encore backend
- Health endpoint will work immediately
- Auth might need real credentials
- Mentionlytics needs real API key for full functionality

## If You Can't Find Where to Update:
1. Search frontend code for the OLD backend URLs:
   - `war-room-backend`
   - `encr.app`
   - `lp.dev`
   - `localhost:4000`

2. Replace with:
   ```
   https://staging-war-roombackend-45-x83i.encr.app
   ```

## Important Notes:
- **NO TRAILING SLASH** on the URL
- **HTTPS** is required (not http)
- **CORS** should be handled by Encore automatically
- **Test in incognito** to avoid cache issues

---

**This won't break anything - it's just changing which backend the frontend talks to!**