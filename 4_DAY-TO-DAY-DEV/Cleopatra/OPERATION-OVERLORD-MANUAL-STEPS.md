# OPERATION OVERLORD - Manual Deployment Steps

## ⚠️ CRITICAL: Create NEW Encore App (Not z9n2!)

Since Encore CLI needs interactive input, you need to execute these commands manually:

### Step 1: Navigate to 4.4 Directory
```bash
cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/3_Backend_Codebase/4.4
```

### Step 2: Create NEW Encore App
```bash
encore app create war-room-4-4-backend
```

When prompted:
- Select: "TypeScript" 
- Select: "Empty app"
- Confirm creation

### Step 3: Link to Encore Cloud
The app should auto-link. If not:
```bash
encore app link --force
```

Select: "war-room-4-4-backend" from the list

### Step 4: Deploy to Staging
```bash
git add -A
git commit -m "OPERATION OVERLORD: Deploy complete 4.4 backend to staging"
git push encore
```

### Step 5: Get Your URLs
After deployment completes, you'll get:
- Staging: `https://staging-war-room-4-4-backend-[id].encr.app`
- Production: `https://war-room-4-4-backend-[id].encr.app` (later)

### Step 6: Add Secrets in Encore Dashboard
Go to: https://app.encore.cloud/war-room-4-4-backend/settings/secrets

Add these secrets:
```
MENTIONLYTICS_API_TOKEN=0X44tHi275ZqqK2psB4U-Ph-dw2xRkq7T4QVkSBlUz32V0ZcgkXt2dQSni52-fhB7WZyZOoGBPcR23O9oND_h1DE
JWT_SECRET=your-secure-jwt-secret-here
META_ACCESS_TOKEN=your-meta-token
GOOGLE_ADS_API_KEY=your-google-key
OPENAI_API_KEY=your-openai-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
```

---

## 🎯 Why This Will Work:

1. **Clean Slate** - Brand new app, no z9n2 confusion
2. **Complete Backend** - All 8 services ready
3. **TypeScript Ready** - Proper configuration
4. **Staging First** - Safe deployment

---

## ✅ After Deployment, Tell Me:
1. The staging URL
2. Any errors during deployment
3. When secrets are configured

I will then:
1. Run validation tests
2. Update frontend with new URL
3. Prepare final SITREP

---

**IMPORTANT**: Do NOT use the old z9n2 app. Create NEW "war-room-4-4-backend" app!