# URGENT: Deploy CORS Fix to Backend

## For Comet Browser

### The Problem
Frontend at https://war-room-3-1-ui.netlify.app cannot fetch data from backend due to CORS blocking.

### The Fix
Added CORS middleware to allow frontend access.

### Deploy Instructions

1. Go to: https://app.encore.cloud/war-roombackend-45-x83i
2. Click "Deploy"
3. Wait for deployment to complete

### What This Fixes
- Live Intelligence will show real mentions
- Competitor Analysis will get data
- All API calls will work

### Files Added
- `common/cors.go` - Global CORS middleware

Once deployed, the frontend will automatically start showing real data!