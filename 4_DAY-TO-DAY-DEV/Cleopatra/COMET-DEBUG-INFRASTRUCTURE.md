# COMET PROMPT: Debug Infrastructure Failure

**COPY THIS TO COMET**

---

## YOUR MISSION: Find and fix the infrastructure provisioning error

The deployment build succeeded but failed at "Provision Infrastructure". I need you to get the error logs and help fix it.

### Step 1: Get the Error Logs
1. Go to the failed deployment page
2. Click on **"Provision Infrastructure"** (the failed step)
3. Look for:
   - Error messages in red
   - Any mentions of "database", "migration", or "service"
   - Specific error codes or messages
4. Copy the EXACT error message

### Step 2: Common Infrastructure Issues & Fixes

**If error mentions "database" or "migration":**
- This means Encore is trying to set up a database
- Go to: https://app.encore.cloud/war-roombackend-45-x83i/infrastructure
- Check if database needs to be manually created
- Or the code might have database migrations that are failing

**If error mentions "invalid service" or "service not found":**
- There might be a service naming issue
- Check if all services in the code match Encore's requirements

**If error mentions "secrets" or "environment variables":**
- Go to: https://app.encore.cloud/war-roombackend-45-x83i/envs/staging/settings
- Click on "Secrets" section
- Make sure all required secrets are set

### Step 3: Quick Fixes to Try

**Option A: Simplify the Backend**
If there are database issues, we can temporarily remove database dependencies:
1. Tell me what the exact error is
2. We can modify the code to bypass the issue

**Option B: Check Service Names**
Encore requires service names to be lowercase and alphanumeric. Check if any service has:
- Capital letters
- Hyphens or underscores
- Special characters

**Option C: Remove Problem Service**
If one service is causing issues, we can:
1. Identify which service is failing
2. Temporarily remove it from the deployment
3. Deploy without it first

### Step 4: Report Back
Tell me:
1. **EXACT error message** from the Provision Infrastructure logs
2. Does it mention:
   - Database/migrations?
   - Service names?
   - Missing configurations?
   - Secrets/environment variables?
3. Any specific service name mentioned in the error?

### Alternative: Skip Infrastructure
If infrastructure keeps failing, we might need to:
1. Remove database dependencies temporarily
2. Simplify service configurations
3. Deploy a minimal version first

---

**Get me the EXACT error message from the "Provision Infrastructure" logs and I'll know how to fix it!**