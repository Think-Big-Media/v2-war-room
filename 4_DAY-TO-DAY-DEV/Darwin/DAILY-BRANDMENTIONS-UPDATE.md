# 📅 TEMPORARY: Daily BrandMentions Update Process
## (Until Mentionlytics Integration is Ready)

### ⚠️ THIS IS TEMPORARY
- **Purpose**: Bridge solution until Mentionlytics API is integrated
- **Duration**: ~2-4 weeks estimated
- **Easy Removal**: All temporary code is clearly marked with `// TEMPORARY: BrandMentions`

### 🔄 DAILY UPDATE PROCESS (6 PM CEST)

#### Option A: Semi-Automatic (Current)
1. **BrandMentions** sends to Slack at 6 PM CEST
2. **Copy from Slack** to webhook.site
3. **Run update script**:
   ```bash
   cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/4_DAY-TO-DAY-DEV/Darwin
   ./daily-brandmentions-update.sh
   ```

#### Option B: Fully Automatic (If you configure webhook)
1. Configure BrandMentions webhook to:
   ```
   https://staging-war-roombackend-45-x83i.encr.app/api/v1/webhook/slack
   ```
2. Data flows automatically every day
3. No manual intervention needed

### 📦 WHAT'S TEMPORARY (Easy to Remove):

1. **Backend webhook endpoint** (`/api/v1/webhook/slack`)
   - Location: `/3_Backend_Codebase/4.5/mentionlytics/webhook.ts`
   - Remove when: Mentionlytics API is ready

2. **Webhook processor tool**
   - Location: `/4_DAY-TO-DAY-DEV/Darwin/webhook-data-processor.html`
   - Remove when: Not needed anymore

3. **Temporary data storage**
   - Location: `/tmp/brandmentions_data.json`
   - Auto-cleans: Every 24 hours

### 🔄 SWITCHING TO MENTIONLYTICS (Future):

When ready to switch:
```javascript
// In mentionlyticsService.ts
// Change line 76-83 from BrandMentions API to:
const response = await axios.get('https://api.mentionlytics.com/...', {
  headers: { 'Authorization': `Bearer ${MENTIONLYTICS_API_KEY}` }
});
```

That's it! Everything else stays the same.

### 📋 DAILY CHECKLIST:

- [ ] 6 PM CEST: Check Slack for BrandMentions report
- [ ] Copy webhook data if using Option A
- [ ] Run update script or verify automatic update
- [ ] Check phrase cloud shows new keywords
- [ ] Verify Jack Harrison, Sarah Mitchell, Faye Langford mentions

### 🔧 QUICK FIXES:

**No data showing?**
```bash
# Check backend is running
curl http://127.0.0.1:4001/api/v1/webhook/slack

# Check data exists
cat /tmp/brandmentions_data.json | jq '.mentions | length'

# Force refresh frontend
localStorage.setItem('VITE_USE_MOCK_DATA', 'false')
location.reload()
```

**Want to test with sample data?**
```bash
./send-test-mention.sh
```

### 🟢 REMOVAL PLAN (When Mentionlytics is Ready):

1. **Update service**: Switch to Mentionlytics API
2. **Remove webhook**: Delete `/mentionlytics/webhook.ts`
3. **Clean tools**: Delete `/Darwin/` folder
4. **Update env**: Add `VITE_MENTIONLYTICS_API_KEY`
5. **Done**: System uses Mentionlytics directly

---

**Remember**: This is temporary! We're not making permanent changes.
Everything can be removed in 5 minutes when Mentionlytics is ready.