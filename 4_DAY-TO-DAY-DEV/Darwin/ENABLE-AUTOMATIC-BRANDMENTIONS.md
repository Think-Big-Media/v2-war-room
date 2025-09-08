# 🚀 AUTOMATIC BRANDMENTIONS DATA - NO MANUAL WORK!

## THE SOLUTION: Direct BrandMentions → Backend Connection

### Option 1: Production Backend (BEST - Works 24/7)
If your Encore backend is deployed:
```
https://staging-war-roombackend-45-x83i.encr.app/api/v1/webhook/slack
```

### Option 2: Local Development with ngrok (For Testing)
```bash
# 1. Install ngrok (if not installed)
brew install ngrok

# 2. Start your local backend
cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/3_Backend_Codebase/4.5
encore run --port=4001

# 3. Expose your local backend to internet
ngrok http 4001

# 4. You'll get a URL like:
# https://abc123.ngrok.io
# Your webhook URL becomes:
# https://abc123.ngrok.io/api/v1/webhook/slack
```

## 📋 CONFIGURE BRANDMENTIONS (One-Time Setup)

1. **Log into BrandMentions**
2. **Go to Project Settings** → Integrations
3. **Remove/Disable Slack Integration** (we're replacing it)
4. **Add Webhook Integration:**
   - URL: `https://staging-war-roombackend-45-x83i.encr.app/api/v1/webhook/slack`
   - Method: POST
   - Format: JSON
   - Frequency: Real-time (or every hour)

## ✅ WHAT HAPPENS AUTOMATICALLY:

1. **6 PM CEST Daily**: BrandMentions finds 2,282 new mentions
2. **Instant**: Sends directly to your backend
3. **Backend**: Stores in `/tmp/brandmentions_data.json`
4. **Frontend**: Phrase cloud updates with REAL keywords
5. **You**: Do nothing - it's automatic!

## 🔍 VERIFY IT'S WORKING:

```bash
# Check backend logs
curl http://127.0.0.1:4001/api/v1/webhook/slack

# Check stored data
cat /tmp/brandmentions_data.json | jq '.mentions | length'

# Frontend should show:
# - Real Jack Harrison mentions
# - Real Sarah Mitchell mentions  
# - Real Faye Langford mentions
# - Keywords from actual social media posts
```

## 🚨 TROUBLESHOOTING:

**If BrandMentions can't remove Slack:**
- Keep Slack integration
- Add webhook as SECOND integration
- Both will receive data (no problem)

**If staging backend not deployed:**
- Deploy it: `encore app deploy`
- Or use ngrok for local testing

**If no data showing:**
- Check backend logs: `encore logs`
- Verify webhook endpoint: `curl [your-backend]/api/v1/webhook/slack`
- Check localStorage: Console → `localStorage.getItem('VITE_USE_MOCK_DATA')` should be "false"

## 🎯 THE END RESULT:

No more manual work! Every day at 6 PM CEST:
- BrandMentions automatically sends data
- Backend automatically receives and stores
- Frontend automatically displays real mentions
- You see real Jack Harrison, Sarah Mitchell, Faye Langford content
- Keywords update from actual social media

**This is how it should work - fully automatic!**