# COMET PROMPT: Update Mentionlytics Token in Encore

**COPY THIS TO COMET TO UPDATE THE TOKEN**

---

## YOUR MISSION: Update the Mentionlytics API token in Encore

I have a new working Mentionlytics token that needs to be added to our backend.

### Step 1: Go to Encore Secrets
Navigate to: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging/settings

Then click on the "Secrets" tab.

### Step 2: Update MENTIONLYTICS_API_TOKEN
1. Find the secret named `MENTIONLYTICS_API_TOKEN`
2. Click the edit button (pencil icon) next to it
3. Replace the old value with this new token:
```
HGkgGwzjKkbzZTW5V3G3wfVKqXicXmUCXNaJiJKSu-RUTGmtHcRKyh05hAGLFcR-P_CCegnr8MADgPPT31YgdKQz
```
4. Click Save or Update

### Step 3: Wait for Auto-Restart
After saving, the service should automatically restart (takes about 30-60 seconds).

### Step 4: Verify It Works
Once restarted, test the connection by visiting:
```
https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/validate
```

You should see:
```json
{"hasApiKey": true, "status": "connected"}
```

### Step 5: Test Live Data
Check if we're getting real data:
```
https://staging-war-roombackend-45-x83i.encr.app/api/v1/mentionlytics/sentiment
```

### Report Back:
Tell me:
1. Was the token updated successfully?
2. Does the validate endpoint show "connected"?
3. Are we getting data from the sentiment endpoint?

---

**This token is from a valid trial account at roderick.batterboost.com and should work!**