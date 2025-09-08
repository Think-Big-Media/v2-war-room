# 🔧 BACKEND FIX GUIDE - HTML to JSON Resolution
**Issue**: Backend serving HTML instead of JSON  
**Solution**: Incremental debugging with step-by-step Leap.new prompts  
**Total Time**: ~10 minutes  
**Authority**: Chairman Gemini approved incremental approach

---

## 🚨 THE PROBLEM

### Current Behavior
```bash
curl https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/api/v1/health
# Returns:
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>War Room 3.0 Political Intelligence Platform Backend</title>
    <script src="https://leap.new/scripts/preview.js"></script>
    ...
```

### Expected Behavior
```bash
curl https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/api/v1/health
# Should return:
{
  "status": "ok",
  "timestamp": "2025-09-02T15:30:00Z",
  "services": ["auth", "campaigns", "monitoring"]
}
```

### Root Cause
Leap.new includes a React preview UI that intercepts all routes. The admin service is serving static HTML files before API routes can be processed.

---

## 🔬 INCREMENTAL DEBUGGING APPROACH

**Philosophy**: Test after each change. Find exactly what's broken vs. working.

### Step 1: Baseline Testing (2 minutes)
```bash
# Test root path
curl -I https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/
# Expected: 200 OK (but should be 404 after fix)

# Test health endpoint
curl -H "Accept: application/json" \
  https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/api/v1/health
# Current: HTML, Expected: JSON

# Test auth health
curl -H "Accept: application/json" \
  https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/auth/health
# Current: HTML, Expected: JSON

# Test non-existent endpoint
curl -H "Accept: application/json" \
  https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/doesnotexist
# Current: HTML, Expected: 404 JSON
```

**Result**: Document what returns HTML vs what might already work

---

### Step 2: Minimal Fix - Disable UI Only (2 minutes)
**Goal**: Just turn off the HTML serving, don't change anything else

💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️ LEAP.NEW PROMPT START 💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SERVICE: Admin Static File Serving
**Objective**: Disable React preview UI completely
**Critical Issue**: Backend serves HTML instead of JSON for all routes

MINIMAL CHANGE: Disable the static file serving in the admin service.
Remove or comment out any HTML/React serving code.
Keep all API endpoints exactly as they are.

The admin service should NOT serve any HTML, CSS, or JS files.
All routes should pass through to API handlers.

Test: /api/v1/health should return JSON, not HTML.

Expected Score: 9.5+/10 (simple fix)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️ LEAP.NEW PROMPT END 💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️

**After applying**, immediately test:
```bash
curl -H "Accept: application/json" \
  https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/api/v1/health
```

**Expected Outcomes**:
- ✅ Returns JSON health response
- ⚠️ Still returns HTML (proceed to Step 3)

---

### Step 3: Router Priority Fix (2 minutes)
**Goal**: Ensure API routes are handled before any catch-all handlers

💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️ LEAP.NEW PROMPT START 💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SERVICE: Route Handling Priority
**Objective**: Fix route handler order
**Issue**: API routes not being processed

ENSURE the API route handlers are registered BEFORE any catch-all routes.
Check the order of route registration:
1. /api/v1/health should be first
2. /auth/health should be second  
3. All /api/* routes before any wildcard handlers
4. Remove any /* catch-all that serves HTML

The issue might be in the main app routing configuration.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️ LEAP.NEW PROMPT END 💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️

**After applying**, test again:
```bash
curl -H "Accept: application/json" \
  https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/api/v1/health
```

**Expected Outcomes**:
- ✅ Returns JSON health response (SUCCESS!)
- ⚠️ Still returns HTML (proceed to Step 4)

---

### Step 4: Environment Check (1 minute)
**Goal**: Verify we're testing the right deployment

```bash
# Check if deployment is stuck
curl -I https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/

# Check response headers
curl -H "Accept: application/json" -v \
  https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/api/v1/health \
  2>&1 | head -20
```

**If deployment is old**: May need to wait for Encore to deploy changes

---

### Step 5: Nuclear Option - Recreation (2 minutes)
**Goal**: If environment is corrupted, recreate from working template

💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️ LEAP.NEW PROMPT START 💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ENVIRONMENT: Fresh API-Only Backend
**Objective**: Create pure JSON API backend
**Issue**: Current backend serves HTML, needs fresh start

CREATE a minimal health service that returns ONLY JSON:
```typescript
export const health = api(
  { expose: true, method: "GET", path: "/api/v1/health" },
  async (): Promise<{ status: string; timestamp: string }> => {
    return {
      status: "ok",
      timestamp: new Date().toISOString()
    };
  }
);
```

DO NOT include any static file serving or preview UI.
This should be a pure API backend only.

Test endpoint: /api/v1/health must return JSON only.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️ LEAP.NEW PROMPT END 💚🏃‍♂️💚🏃‍♂️💚🏃‍♂️

---

## 🎯 VERIFICATION CHECKLIST

After each step, run this complete test:

```bash
#!/bin/bash
echo "🔍 Backend Fix Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Health endpoint
echo "📍 Testing /api/v1/health:"
HEALTH_RESULT=$(curl -s -H "Accept: application/json" \
  "https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/api/v1/health")
echo "$HEALTH_RESULT"

if echo "$HEALTH_RESULT" | grep -q "<!DOCTYPE"; then
  echo "❌ Still returning HTML"
else
  echo "✅ Returns JSON!"
fi

# Test 2: Auth endpoint  
echo -e "\n📍 Testing /auth/health:"
AUTH_RESULT=$(curl -s -H "Accept: application/json" \
  "https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/auth/health")
echo "$AUTH_RESULT"

if echo "$AUTH_RESULT" | grep -q "<!DOCTYPE"; then
  echo "❌ Still returning HTML"
else
  echo "✅ Returns JSON!"
fi

# Test 3: Root path (should 404)
echo -e "\n📍 Testing root path:"
curl -s -I "https://war-room-3-backend-d2msjrk82vjjq794glog.lp.dev/" | head -n 1

echo -e "\n📊 Summary:"
if echo "$HEALTH_RESULT" | grep -q "status.*ok"; then
  echo "🎉 SUCCESS: Backend is returning JSON!"
else
  echo "⚠️  Still needs fixing. Try next step."
fi
```

---

## 🔮 EXPERT INSIGHTS (40 Years Experience)

### Why This Happens
1. **Default Behavior**: Leap.new assumes you want a preview UI
2. **Route Priority**: Static serving often comes before API routes
3. **Catch-All Routes**: Wildcard handlers capture everything

### Common Mistakes
1. **Over-complicating**: Trying to fix with complex routing
2. **Not testing incrementally**: Big changes without verification
3. **Wrong environment**: Testing old deployment
4. **Missing headers**: Not sending Accept: application/json

### Success Patterns
1. **Minimal changes first**: Just disable what's wrong
2. **Test immediately**: Don't make multiple changes
3. **Use proper headers**: Always include Accept header
4. **Check deployment**: Verify changes actually deployed

### When to Give Up and Recreate
- After 3 failed fix attempts
- When environment is corrupted
- When changes aren't deploying

### Recovery Strategy
- Keep existing secrets and database
- Just recreate the API handlers
- Test one endpoint at a time
- Copy over complex services only after basic health works

---

## 📋 QUICK REFERENCE

### Test Commands
```bash
# Quick health test
curl -H "Accept: application/json" [backend-url]/api/v1/health

# Full verification
./test-backend-json.sh

# Check deployment status
# Visit Encore dashboard at https://app.encore.dev
```

### Success Indicators
- JSON response from health endpoint
- No HTML tags in API responses
- Proper HTTP status codes (200, 404, etc.)
- Content-Type: application/json headers

### Failure Indicators
- Still receiving HTML with <!DOCTYPE>
- 500 errors on all endpoints
- Encore deployment stuck or failed
- No response or timeouts

---

*This guide ensures systematic, incremental resolution of the HTML/JSON issue without breaking existing functionality.*