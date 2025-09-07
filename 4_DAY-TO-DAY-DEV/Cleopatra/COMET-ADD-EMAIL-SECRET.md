# COMET PROMPT: Add EMAIL_API_KEY Secret

**COPY THIS TO COMET**

---

## YOUR MISSION: Add the missing EMAIL_API_KEY secret and redeploy

The deployment failed because `EMAIL_API_KEY` is missing. Let's add it and deploy again.

### Step 1: Go to Secrets Page
Navigate to: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging/settings

Then click on the **"Secrets"** tab or section.

### Step 2: Add the Missing Secret
1. Look for an **"Add Secret"** or **"New Secret"** button (might be a + icon)
2. Click it
3. Add:
   - **Key**: `EMAIL_API_KEY`
   - **Value**: `dummy-email-key-for-testing-12345`
4. Click **Save** or **Add**

**Note**: We're using a dummy value for now just to get it deployed. We can update it with a real email API key later if needed.

### Step 3: Verify Secret is Added
After adding, you should see `EMAIL_API_KEY` in the list of secrets (it will show as masked ••••••)

### Step 4: Redeploy
1. Go back to: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging
2. Click the **DEPLOY** button (top right, black button)
3. Select the latest commit if asked
4. Deployment should start

### Step 5: Monitor New Deployment
1. Watch the deployment progress
2. It should pass:
   - ✅ Build & Test
   - ✅ Provision Infrastructure (this should work now!)
   - ✅ Deploy Release
3. Total time: 2-5 minutes

### What's Happening:
- The code expects an `EMAIL_API_KEY` environment variable
- Encore checks all required secrets before provisioning
- Once we add it, infrastructure provisioning will succeed
- Then the actual deployment will complete

### Alternative Values for EMAIL_API_KEY:
If the dummy value doesn't work, try one of these:
- `sk-dummy-email-key-2025`
- `resend_api_key_placeholder`
- `sendgrid_api_key_placeholder`
- `test-email-api-key`

### Report Back:
Tell me:
1. Did you successfully add the EMAIL_API_KEY secret?
2. Did you trigger a new deployment?
3. Did it pass "Provision Infrastructure" this time?
4. What's the final deployment status?
5. If successful, what's the staging URL?

---

**Simple fix: Add EMAIL_API_KEY secret, then redeploy. Should work immediately!**