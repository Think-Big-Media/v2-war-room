# CONNECT WINSTON TO GITHUB - Required First!

## The Problem:
The Deploy screen shows "No branches found matching 'main'" because the winston-war-room app isn't connected to GitHub yet.

## Solution - Do This Now:

### Step 1: Go to App Settings
1. From the winston-war-room dashboard, click **"Settings"** (usually in left sidebar or top menu)
2. Look for **"Version Control"** or **"GitHub"** or **"Source Control"**

### Step 2: Connect GitHub Repository
1. Click **"Connect GitHub"** or **"Add Repository"**
2. Authorize Encore to access your GitHub (if prompted)
3. Select:
   - Organization/Owner: **Think-Big-Media**
   - Repository: **v2-war-room**
   - Click **"Connect"**

### Step 3: Configure Repository Settings
1. After connecting, configure:
   - Default Branch: **main**
   - Root Directory: **3_Backend_Codebase/4.4/war-room-4-4-backend**
   - Click **"Save"**

### Step 4: Go Back to Deploy
1. Return to the Deploy screen
2. Now you should see the **main** branch available
3. Select **staging** environment
4. Select **main** branch
5. Click **DEPLOY**

## Why This Happens:
The winston-war-room app was created via CLI but needs manual GitHub connection through the web UI.

## After Deployment:
Once deployed (2-3 minutes), you'll get a URL like:
`https://staging-winston-war-room-9cui.encr.app`

Tell me the URL and I'll immediately update the frontend!