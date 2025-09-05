# WAR ROOM TECHNICAL IMPLEMENTATION GUIDE
**Version**: 2.0  
**Date**: September 2, 2025  
**Timeline**: Rapid via Leap.new  
**Approach**: Bridge 3.0 UI to 4.0 Backend on Encore  

## 🎯 IMPLEMENTATION PHILOSOPHY

**Key Fact**: 80% of the code already exists and works. We're WIRING, not BUILDING.

### What We're NOT Doing:
- ❌ Building new components (62 already exist)
- ❌ Creating new APIs (backend is live)
- ❌ Writing new services (Python scripts ready)
- ❌ Designing new UI (frontend 100% complete)

### What We ARE Doing:
- ✅ Connecting Mentionlytics API to live data
- ✅ Activating dormant Python services
- ✅ Fixing one-line routing bugs
- ✅ Adding missing data types to router
- ✅ Enabling existing Twilio integration
- ✅ Adding WebSocket heartbeat

## 📋 PRE-IMPLEMENTATION CHECKLIST

### Environment Setup for 4.0 Backend
```bash
# 1. Verify Encore Secrets (via Infrastructure panel)
# Required secrets:
# - MENTIONLYTICS_API_TOKEN
# - JWT_SECRET  
# - TWILIO_ACCOUNT_SID
# - TWILIO_AUTH_TOKEN
# - OPENAI_API_KEY
# - SUPABASE_URL
# - SUPABASE_ANON_KEY

# 2. Check 4.0 backend is live
curl https://[your-encore-app].encr.app/health
# Should return: {"status":"healthy"}

# 3. Update 3.0 UI backend URL
# In repositories/3.0-ui-war-room/src/config/apiConfig.ts:
# baseURL: 'https://[your-encore-app].encr.app'

# 4. Test with Comet AI browser in Leap.new
# Use Comet to verify endpoints before merging
```

## 🔧 PHASE 1: CRITICAL BUG FIXES (20 minutes)

### 1.1 Fix Account Setup Trigger
**File**: `repositories/3.0-ui-war-room/src/App.tsx`
**Current Issue**: CampaignSetupModal doesn't trigger on new user login
**Fix**: Add routing logic to check campaign setup status

```typescript
// In App.tsx, after authentication check
useEffect(() => {
  if (user && !user.campaignSetupComplete) {
    setShowCampaignSetup(true);
  }
}, [user]);

// Add the modal to the component tree
{showCampaignSetup && (
  <CampaignSetupModal
    isOpen={showCampaignSetup}
    onClose={() => setShowCampaignSetup(false)}
    onComplete={handleCampaignSetupComplete}
  />
)}
```

### 1.2 Connect SWOT Radar to Live Data
**File**: `repositories/3.0-ui-war-room/src/components/SWOTRadar.tsx`
**Current Issue**: Only shows mock data
**Fix**: Connect to Mentionlytics service

```typescript
// Replace mock data call
const { data } = await mentionlyticsService.getSWOTAnalysis();

// In mentionlyticsService.ts, add:
async getSWOTAnalysis() {
  if (this.isMockMode) {
    return mockSWOTData;
  }
  
  const [sentiment, mentions, competitors] = await Promise.all([
    this.getSentiment(),
    this.getMentions(),
    this.getCompetitors()
  ]);
  
  return transformToSWOT(sentiment, mentions, competitors);
}
```

### 1.3 Activate Ticker Tape SSE
**File**: `repositories/3.0-ui-war-room/src/components/TickerTape.tsx`
**Current Issue**: Static mock data
**Fix**: Connect to Server-Sent Events

```typescript
useEffect(() => {
  const eventSource = new EventSource('/api/sse/ticker');
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setTickerItems(prev => [...prev.slice(-50), data]);
  };
  
  eventSource.onerror = () => {
    console.log('SSE reconnecting...');
  };
  
  return () => eventSource.close();
}, []);
```

## 🔌 PHASE 2: DATA CONNECTIONS (30 minutes)

### 2.1 Wire Mentionlytics API
**File**: `repositories/3.0-ui-war-room/src/services/mentionlytics/mentionlyticsService.ts`

```typescript
// Remove mock mode fallback - we're going LIVE
class MentionlyticsService {
  constructor() {
    this.apiToken = import.meta.env.VITE_MENTIONLYTICS_API_TOKEN;
    this.baseURL = 'https://api.mentionlytics.com/v1';
    // REMOVE: this.isMockMode checks
  }
  
  // Add pagination handling
  async getMentions(page = 0) {
    const response = await fetch(
      `${this.baseURL}/mentions?limit=50&page_no=${page}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Mentionlytics API error: ${response.status}`);
    }
    
    return response.json();
  }
}
```

### 2.2 Add Missing Data Types to Router
**File**: `repositories/3.0-ui-war-room/src/services/informationRouter.ts`

```typescript
export enum InfoType {
  GENERAL = 'general',
  KEYWORDS = 'keywords', 
  ACCOUNT = 'account',
  CRISIS = 'crisis',
  STRATEGIC = 'strategic',
  // ADD THESE THREE:
  DOCUMENT_VECTORS = 'document_vectors',
  AUDIT_LOG = 'audit_log',
  INFLUENCER_INSIGHTS = 'influencer_insights'
}

// Update routing table
const routingTable = {
  [InfoType.DOCUMENT_VECTORS]: ['VectorDB', 'ChatInterface'],
  [InfoType.AUDIT_LOG]: ['ComplianceDB', 'AdminPanel'],
  [InfoType.INFLUENCER_INSIGHTS]: ['InfluencerPowerMatrix', 'Dashboard']
};
```

### 2.3 Connect WebSocket with Heartbeat
**File**: `repositories/3.0-ui-war-room/src/services/websocket.ts`

```typescript
class WebSocketService {
  private ws: WebSocket | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectDelay = 1000;
  
  connect() {
    this.ws = new WebSocket('wss://war-room-3-backend.lp.dev/ws');
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.startHeartbeat();
      this.reconnectDelay = 1000; // Reset delay
    };
    
    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.scheduleReconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'HEARTBEAT' }));
      }
    }, 30000); // 30 seconds
  }
  
  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }
  
  private scheduleReconnect() {
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
    }, this.reconnectDelay);
  }
}
```

## 📱 PHASE 3: COMMUNICATIONS (15 minutes)

### 3.1 Enable SMS via Twilio
**File**: `repositories/3.0-api-war-room/src/services/notifications.ts`

```typescript
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(to: string, message: string) {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('SMS send failed:', error);
    return { success: false, error: error.message };
  }
}
```

### 3.2 Enable WhatsApp Notifications
```typescript
export async function sendWhatsApp(to: string, message: string) {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });
    
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('WhatsApp send failed:', error);
    return { success: false, error: error.message };
  }
}
```

### 3.3 Activate Crisis Detection
**File**: `workflows/crisis-detection/main.py`

```python
# This service is COMPLETE - just needs to be started
import subprocess
import sys

def start_crisis_detection():
    """Start the crisis detection service"""
    # Service already exists at workflows/crisis-detection/
    subprocess.run([
        sys.executable,
        "workflows/crisis-detection/crisis_detector.py"
    ])

# In crisis_detector.py - already complete, just activate:
if __name__ == "__main__":
    detector = CrisisDetector()
    detector.start()  # This runs the monitoring loop
```

## 🧪 PHASE 4: TESTING & VALIDATION (15 minutes)

### 4.1 Test Mentionlytics Connection
```javascript
// In browser console:
const response = await fetch('/api/mentionlytics/sentiment');
console.log(await response.json());
// Should return real sentiment data

// Test pagination:
const mentions = await fetch('/api/mentionlytics/mentions?page_no=0');
console.log(await mentions.json());
// Should return max 50 results
```

### 4.2 Test WebSocket Heartbeat
```javascript
// In browser DevTools Network tab:
// 1. Filter by WS
// 2. Click on WebSocket connection
// 3. Messages tab should show HEARTBEAT every 30 seconds
```

### 4.3 Test Crisis Alert Flow
```bash
# Trigger test crisis
curl -X POST https://war-room-3-backend.lp.dev/api/crisis/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Test crisis alert", "severity": "HIGH"}'

# Check SMS was sent (check Twilio dashboard)
# Check WhatsApp was sent (check phone)
# Check Alert Center shows notification
```

### 4.4 Test Account Setup Flow
```javascript
// 1. Clear localStorage
localStorage.clear();

// 2. Login as new user
// 3. CampaignSetupModal should appear automatically

// 4. Complete setup
// 5. Verify data saved:
console.log(localStorage.getItem('campaignSetup'));
```

## 🚀 PHASE 5: DEPLOYMENT (10 minutes)

### 5.1 Build Frontend
```bash
cd repositories/3.0-ui-war-room
npm run build
# Output in dist/ folder
```

### 5.2 Deploy to Vercel
```bash
# Automatic deployment via Git push
git add -A
git commit -m "feat: Wire MVP - connect all services"
git push origin main

# Vercel auto-deploys from main branch
# Check: https://war-room-ui.vercel.app
```

### 5.3 Verify Backend
```bash
# Backend already live on Encore
curl https://war-room-3-backend.lp.dev/health
# Should return: {"status":"healthy","services":["all","active"]}
```

### 5.4 Start Python Services
```bash
# SSH to server or use process manager
pm2 start workflows/crisis-detection/crisis_detector.py --interpreter python3
pm2 start workflows/crisis-detection/automation_engine.py --interpreter python3
pm2 save
```

## ✅ POST-IMPLEMENTATION VERIFICATION

### Checklist
- [ ] Mentionlytics shows live data (not mock)
- [ ] Account Setup triggers on new user login
- [ ] SWOT Radar updates with real metrics
- [ ] Ticker Tape scrolls live news
- [ ] Crisis alerts send SMS
- [ ] WhatsApp notifications work
- [ ] WebSocket maintains connection (30s heartbeat)
- [ ] All 8 data types route correctly
- [ ] PDF reports generate
- [ ] File upload works

### Quick Smoke Test
```javascript
// Run in browser console
async function smokeTest() {
  const tests = [
    { name: 'Mentionlytics API', url: '/api/mentionlytics/sentiment' },
    { name: 'WebSocket', test: () => new WebSocket('wss://war-room-3-backend.lp.dev/ws').readyState },
    { name: 'Crisis Detection', url: '/api/crisis/status' },
    { name: 'Auth', url: '/api/auth/profile' }
  ];
  
  for (const test of tests) {
    if (test.url) {
      const response = await fetch(test.url);
      console.log(`${test.name}: ${response.ok ? '✅' : '❌'}`);
    } else {
      console.log(`${test.name}: ${test.test() ? '✅' : '❌'}`);
    }
  }
}

smokeTest();
```

## 🔥 COMMON ISSUES & FIXES

### Issue: Mentionlytics returns 401
**Fix**: Check API token in .env file

### Issue: WebSocket disconnects frequently
**Fix**: Verify heartbeat is sending every 30 seconds

### Issue: SMS not sending
**Fix**: Check Twilio credentials and phone number format

### Issue: Account Setup not triggering
**Fix**: Clear localStorage and check user object has campaignSetupComplete field

### Issue: SWOT Radar empty
**Fix**: Verify Mentionlytics has data for the campaign keywords

## 📊 PERFORMANCE TARGETS

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Page Load | < 3s | Chrome DevTools |
| API Response | < 500ms | Network tab |
| WebSocket Latency | < 100ms | WS messages |
| Crisis Alert | < 5s | End-to-end test |
| PDF Generation | < 5s | Time download |

## 🎉 SUCCESS CRITERIA

**MVP is COMPLETE when:**
1. All live data flows (no mock data)
2. Crisis alerts trigger SMS/WhatsApp
3. Account Setup modal appears for new users
4. WebSocket stays connected with heartbeat
5. All 8 data types route to components
6. Python services are running
7. No critical errors in console
8. Deployment successful to staging

---

**Remember**: We're WIRING, not BUILDING. The code exists. Connect it. Test it. Ship it.

*Time to complete: 90 minutes*  
*Complexity: Low (it's mostly configuration)*  
*Risk: Minimal (fallback to mock if needed)*