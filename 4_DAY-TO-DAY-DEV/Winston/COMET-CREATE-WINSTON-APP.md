# COMET PROMPT - Create Winston Encore App

## Copy this prompt for Comet browser:

Go to https://app.encore.cloud and create a new app with these settings:

1. Click "Create app"
2. App name: winston
3. Choose "Link to existing codebase"
4. Connect to GitHub repository:
   - Repository: Think-Big-Media/v2-war-room
   - Branch: main
   - Root directory: 3_Backend_Codebase/4.4/war-room-4-4-backend
5. Click "Create app"
6. Once created, click "Deploy to staging"
7. Copy the deployment URL (will be something like https://staging-winston-xxxx.encr.app)
8. Return here with the URL

---

## What this does:
- Creates fresh Encore app without cached files
- Pulls latest code from GitHub (commit 77ec6390)
- Deploys backend that actually compiles
- Gets us a working backend URL for the frontend