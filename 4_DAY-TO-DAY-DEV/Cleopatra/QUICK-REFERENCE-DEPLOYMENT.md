# 🚀 QUICK REFERENCE - War Room Backend Deployment

## Encore App Details
- **App Name**: war-roombackend-45
- **App ID**: war-roombackend-45-x83i  
- **Environment**: staging
- **Status**: ✅ DEPLOYED SUCCESSFULLY

## Important URLs
- **Encore Dashboard**: https://app.encore.cloud/war-roombackend-45-x83i
- **Staging Environment**: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging
- **Deployments**: https://app.encore.cloud/war-roombackend-45-x83i/deploys
- **Secrets**: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging/settings

## Staging URL
**PENDING FROM COMET** - Will be in format: `https://staging-war-roombackend-45-x83i.encr.app`

## Test Commands (once we have URL)
```bash
# Health check
curl https://[STAGING-URL]/health

# Mentionlytics LIVE data
curl https://[STAGING-URL]/api/v1/mentionlytics/validate

# Analytics
curl https://[STAGING-URL]/api/v1/analytics/summary
```

## All Configured Secrets
✅ MENTIONLYTICS_API_TOKEN  
✅ JWT_SECRET  
✅ META_ACCESS_TOKEN  
✅ GOOGLE_ADS_API_KEY  
✅ OPENAI_API_KEY  
✅ TWILIO_ACCOUNT_SID  
✅ TWILIO_AUTH_TOKEN  
✅ GOOGLE_CLIENT_ID  
✅ GOOGLE_CLIENT_SECRET  
✅ EMAIL_API_KEY  
✅ DATABASE_URL (auto)  

## GitHub Configuration
- **Repository**: Think-Big-Media/v2-war-room
- **Branch**: main
- **App Root**: `3_Backend_Codebase/4.4/war-room-4-4-backend`

## For Next Time - 15 Minute Deploy
1. Create Encore app
2. Add ALL secrets first
3. Connect GitHub (grant org permissions)
4. Set correct app root path
5. Deploy

---

**Waiting for staging URL from Comet to complete testing**