# 🚀 ENABLE LIVE DATA IN WAR ROOM DASHBOARD

## Quick Steps to See Live Data:

### 1. Open the Dashboard
Go to: https://war-room-3-1-ui.netlify.app

### 2. Open Browser Console
- Chrome/Edge: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- Go to the "Console" tab

### 3. Enable Live Data Mode
Copy and paste this command in the console:
```javascript
localStorage.setItem('VITE_USE_MOCK_DATA', 'false');
location.reload();
```

### 4. Verify Live Data is Active
After reload, you should see:
- Real mentions in Live Intelligence sections
- Data from the backend API
- "LIVE" indicators showing active data

## To Switch Back to Mock Data:
```javascript
localStorage.setItem('VITE_USE_MOCK_DATA', 'true');
location.reload();
```

## To Check Current Mode:
```javascript
console.log('Data Mode:', localStorage.getItem('VITE_USE_MOCK_DATA') === 'true' ? 'MOCK' : 'LIVE');
```

## Current Backend Status:
- **Health Check**: ✅ https://staging-war-roombackend-45-x83i.encr.app/health
- **Mentions Feed**: ✅ https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/feed
- **Data Source**: Currently returning sample data (needs BrandMentions webhook)

## Next Steps for Real BrandMentions Data:
1. Set up webhook endpoint in backend
2. Configure Slack/Zapier to POST mentions to webhook
3. Store mentions in backend database
4. Frontend will automatically display real data

## Testing the API Directly:
```bash
# Test health check
curl https://staging-war-roombackend-45-x83i.encr.app/health

# Test mentions feed
curl https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/feed
```

---
*Last Updated: September 8, 2025*