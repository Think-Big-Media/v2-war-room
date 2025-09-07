# DISASTER RECOVERY PLAYBOOK
## 15-Minute Recovery Guarantee

**Date**: September 7, 2025  
**Promise**: Full system recovery in under 15 minutes  
**Covers**: Frontend, Backend, Database, Secrets  

---

## 🚨 EMERGENCY CONTACTS

**Primary Technical Lead**: Claude (You're here!)  
**Backend Dashboard**: https://app.encore.cloud  
**Frontend Dashboard**: https://app.netlify.com  
**GitHub Repo**: https://github.com/Think-Big-Media/3.1-ui-war-room-netlify  

---

## 🔴 SCENARIO 1: FRONTEND CRASH/BROKEN DEPLOYMENT

### Symptoms:
- White screen of death
- Build failures
- Broken UI after deployment
- JavaScript errors

### Recovery Steps (5 minutes):

#### Option A: Netlify Instant Rollback
1. Go to https://app.netlify.com
2. Select `leafy-haupia-bf303b` site
3. Click "Deploys" tab
4. Find last working deployment (green checkmark)
5. Click "..." menu → "Publish deploy"
6. **DONE** - Site rolled back in 30 seconds

#### Option B: Git Branch Recovery
```bash
# If Netlify rollback fails
cd /path/to/frontend
git checkout release/v3.1-stable  # Our stable branch
git push origin release/v3.1-stable:main --force
# Netlify auto-deploys from main
```

### Test Recovery:
```bash
curl https://leafy-haupia-bf303b.netlify.app/health
# Should return: OK
```

---

## 🔴 SCENARIO 2: BACKEND API FAILURES

### Symptoms:
- APIs returning HTML instead of JSON
- 500 errors on all endpoints
- "Encore application not found"
- Secrets not working

### Recovery Steps (10 minutes):

#### Option A: Encore Environment Clone
1. Go to https://app.encore.cloud/winston-4-4-backend
2. Click "Environments" → Find working environment
3. Click "..." → "Clone Environment"
4. Name it: `recovery-[date]`
5. Update frontend to point to new URL:
   ```toml
   # netlify.toml
   to = "https://recovery-[date].encr.app/api/:splat"
   ```
6. Deploy frontend with new backend URL

#### Option B: Redeploy from Local
```bash
cd /path/to/4.4/war-room-4-4-backend
encore deploy --env=staging
# Get new URL from output
# Update netlify.toml
# Redeploy frontend
```

#### Option C: Emergency Mock Mode
```javascript
// In frontend .env
VITE_FORCE_MOCK_MODE=true
# Redeploy - all data will be mock but site works
```

### Test Recovery:
```bash
curl https://[backend-url]/health
# Should return JSON: {"status":"healthy"}
```

---

## 🔴 SCENARIO 3: DATABASE CORRUPTION/LOSS

### Symptoms:
- Data not persisting
- Login failures
- Empty dashboard
- Database connection errors

### Recovery Steps (8 minutes):

1. **Access Encore Dashboard**:
   ```
   https://app.encore.cloud/winston-4-4-backend/environments/staging/databases
   ```

2. **Restore from Snapshot**:
   - Click on affected database
   - Go to "Backups" tab
   - Select most recent snapshot
   - Click "Restore"
   - Choose "Restore to new database"
   - Update connection string in environment

3. **If No Snapshots Available**:
   ```sql
   -- Emergency schema recreation
   -- Run in Encore SQL console
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   CREATE TABLE campaigns (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     name VARCHAR(255),
     data JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Insert test admin user
   INSERT INTO users (email) VALUES ('admin@warroom.ai');
   ```

---

## 🔴 SCENARIO 4: SECRETS/API KEYS COMPROMISED

### Symptoms:
- Unauthorized API usage
- Rate limit exceeded
- Suspicious activity
- Keys exposed in logs

### Recovery Steps (10 minutes):

1. **Immediate Revocation**:
   - Mentionlytics: https://app.mentionlytics.com/api-keys
   - Meta: https://developers.facebook.com/apps
   - Google: https://console.cloud.google.com/apis/credentials
   - OpenAI: https://platform.openai.com/api-keys

2. **Generate New Keys**:
   - Create new keys in each platform
   - Document in password manager

3. **Update Encore Secrets**:
   ```bash
   # Via dashboard
   https://app.encore.cloud/winston-4-4-backend/settings/secrets
   
   # Update each secret
   MENTIONLYTICS_API_TOKEN = [new_token]
   META_ACCESS_TOKEN = [new_token]
   # etc...
   ```

4. **Force Backend Restart**:
   - Encore dashboard → Environment → Restart

---

## 🔴 SCENARIO 5: COMPLETE SYSTEM FAILURE

### Symptoms:
- Everything is down
- Multiple services failing
- Cannot access any dashboards
- Total outage

### Recovery Steps (15 minutes):

1. **Deploy Emergency Mock-Only Version**:
   ```bash
   # Frontend with forced mock mode
   cd /tmp
   git clone https://github.com/Think-Big-Media/3.1-ui-war-room-netlify
   cd 3.1-ui-war-room-netlify
   
   # Force mock mode
   echo "VITE_FORCE_MOCK_MODE=true" > .env.production
   
   # Deploy to emergency Netlify site
   npx netlify-cli deploy --prod --site emergency-warroom
   ```

2. **Notify Stakeholders**:
   - "System in maintenance mode"
   - "Mock data active for demos"
   - "Full recovery in progress"

3. **Systematic Recovery**:
   - [ ] Restore backend first
   - [ ] Verify API endpoints
   - [ ] Restore database
   - [ ] Update secrets
   - [ ] Reconnect frontend
   - [ ] Switch off mock mode

---

## 📦 BACKUP INVENTORY

### Daily Automatic Backups:
- **Database**: Encore automatic snapshots (24-hour retention)
- **Code**: GitHub (all branches preserved)
- **Secrets**: Local encrypted backup (`~/.warroom-secrets.gpg`)
- **Configuration**: This documentation

### Manual Backup Commands:
```bash
# Backup secrets locally (encrypted)
encore secret list --env=staging | gpg -c > ~/.warroom-secrets-$(date +%Y%m%d).gpg

# Backup database
encore db backup --env=staging --output=backup-$(date +%Y%m%d).sql

# Backup entire frontend
tar -czf frontend-backup-$(date +%Y%m%d).tar.gz /path/to/frontend
```

---

## ✅ RECOVERY VALIDATION CHECKLIST

After any recovery, verify:
- [ ] Frontend loads without errors
- [ ] Can log in successfully
- [ ] Dashboard displays data
- [ ] Chat responds
- [ ] Can upload documents
- [ ] Settings save properly
- [ ] MOCK/LIVE toggle works
- [ ] No console errors
- [ ] API returns JSON not HTML
- [ ] Data persists after refresh

---

## 🔧 PREVENTIVE MEASURES

### To Avoid Future Disasters:

1. **Before Every Deployment**:
   - Create git branch/tag
   - Test locally first
   - Check secrets configured
   - Verify JSON responses

2. **Weekly Maintenance**:
   - Test backup restoration
   - Review error logs
   - Update dependencies
   - Check API rate limits

3. **Monthly Audit**:
   - Rotate API keys
   - Review access logs
   - Update documentation
   - Test full recovery

---

## 📞 ESCALATION PATH

If recovery fails after 15 minutes:
1. Check Winston folder for specific guides
2. Review Cleopatra folder for previous solutions
3. Try Leap.new fresh deployment
4. Consider mock-only emergency mode
5. Document new issue for future reference

---

**Remember**: The goal is RECOVERY, not perfection. Get the system running first, then investigate root cause.