# COMET PROMPT: Fix Path and Deploy Backend

**COPY THIS ENTIRE PROMPT TO COMET AI**

---

## YOUR MISSION: Fix the deployment path and deploy the backend

The deployment failed because the path is wrong. I need you to fix it and deploy. Follow these EXACT steps:

### Step 1: Go to App Settings
1. Navigate to: https://app.encore.cloud/war-roombackend-45-x83i/settings/app
2. You should see the "General" settings page

### Step 2: Update the Root Directory
Find the field labeled **"Root Directory"** - it currently shows:
```
3_Backend_Codebase/4.4
```

**CHANGE IT TO:**
```
3_Backend_Codebase/4.4/war-room-4-4-backend
```

**IMPORTANT**: Add `/war-room-4-4-backend` to the end of the current path

### Step 3: Save the Change
1. After changing the Root Directory, click the **UPDATE** button next to it
2. The button should become clickable once you change the value
3. If UPDATE doesn't work, try clicking elsewhere on the page first, then UPDATE

### Step 4: Trigger New Deployment
1. After saving, go to: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging
2. You should see the staging environment page
3. Click the black **DEPLOY** button in the top right corner
4. If asked for options, just use defaults

### Step 5: Monitor Deployment
1. After clicking DEPLOY, you'll be taken to the deployments page
2. You should see a new deployment starting (it will say "Building" or "In Progress")
3. Wait 2-5 minutes for it to complete
4. It should turn green and say "Success" when done

### What You're Looking For:
- **Settings Page**: Change Root Directory from `3_Backend_Codebase/4.4` to `3_Backend_Codebase/4.4/war-room-4-4-backend`
- **UPDATE Button**: Click it after changing the path
- **DEPLOY Button**: Black button on staging page (top right)
- **Success**: Green status on deployment page

### If You Can't Find Something:
- **Settings**: Look for gear icon or "Settings" in sidebar
- **Root Directory**: Might be called "App Root" or "Base Directory"  
- **DEPLOY button**: Might say "Deploy Now" or "New Deployment"
- **UPDATE button**: Should appear/activate after you change the field

### Why This Will Work:
The complete backend code is in the `war-room-4-4-backend` subfolder. The current path is pointing to the wrong folder. Once we fix the path, Encore will find all the correct files and deployment will succeed.

### Report Back:
Once you complete these steps, tell me:
1. Did you successfully change the Root Directory?
2. Did the UPDATE button work?
3. Did you click DEPLOY?
4. What's the deployment status? (Building/Success/Failed)
5. If successful, what's the staging URL?

---

**This is a simple path fix. Just add `/war-room-4-4-backend` to the end of the current Root Directory path and deploy!**