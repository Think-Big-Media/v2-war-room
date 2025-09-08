# CONNECT WINSTON APP TO GITHUB - Manual Steps

## The winston-war-room app is created! Now connect it to GitHub:

### Step 1: Go to Encore Cloud Dashboard
https://app.encore.cloud/winston-war-room-9cui

### Step 2: Connect to GitHub
1. Click "Settings" in the app dashboard
2. Find "Version Control" or "GitHub Integration"
3. Click "Connect to GitHub"
4. Authorize Encore to access the repository
5. Select repository: `Think-Big-Media/v2-war-room`
6. Set branch: `main`
7. Set root directory: `3_Backend_Codebase/4.4/war-room-4-4-backend`

### Step 3: Deploy to Staging
1. Go back to the main dashboard
2. Click "Deploy" or "Create Deployment"
3. Choose "staging" environment
4. Click "Deploy Now"

### Step 4: Get the URL
After deployment completes (2-3 minutes), you'll get a URL like:
`https://staging-winston-war-room-9cui-xxxx.encr.app`

### Step 5: Tell me the URL
Once you have the staging URL, tell me and I'll immediately:
1. Update the frontend to use the new backend URL
2. Deploy to Netlify
3. Verify real data is flowing

## Why This Will Work:
- ✅ New app has NO cached files
- ✅ Will pull fresh code from GitHub (commit fbd58cf2)
- ✅ Code compiles successfully (tested locally)
- ✅ No more "process-brandmentions.ts" error
- ✅ Real data will flow: BrandMentions → Slack → Backend → Frontend

## What You'll See:
- Live Intelligence with 3,229 real mentions
- Competitor Analysis with actual data
- Brand Monitoring phrase cloud
- Real-time updates from Jack Harrison campaign

## ALTERNATIVE: Use Encore CLI
If the web UI doesn't work, we can try:
```bash
cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/3_Backend_Codebase/4.4/war-room-4-4-backend
encore app link winston-war-room-9cui --github-repo=Think-Big-Media/v2-war-room
```

But the web UI is usually easier and more reliable.