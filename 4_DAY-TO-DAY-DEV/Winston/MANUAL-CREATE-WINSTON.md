# MANUAL STEPS - Create winston-war-room App

## Run these commands in your terminal:

### Step 1: Create the new app
```bash
# Go to a temporary directory
cd /tmp

# Create the winston-war-room app
encore app create winston-war-room
```

When prompted:
- Choose "Empty app"
- This creates the app in Encore Cloud

### Step 2: Link our existing backend
```bash
# Go back to our backend
cd /Users/rodericandrews/Obsidian/Master/_Projects/_War-Room-AI/v2-war-room/3_Backend_Codebase/4.4/war-room-4-4-backend

# Force link to the new app
encore app link winston-war-room --force
```

### Step 3: Deploy
```bash
# Push to Encore (this will deploy)
git push encore main --force
```

### Step 4: Get the URL
After deployment completes, the URL will be something like:
`https://staging-winston-war-room-xxxx.encr.app`

### Step 5: Tell me the URL
Once you have the URL, tell me and I'll update the frontend immediately.

## Why this works:
- Creates fresh app without cached files
- Links to our GitHub repo with the fixed code
- Deploys the version WITHOUT the deleted file