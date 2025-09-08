# BRANDMENTIONS WEBHOOK SOLUTION - Get Real Data NOW!

## Project Details:
- **Project ID**: 820539904
- **Project Name**: Jack Harrison
- **Mentions**: 3,229 real social mentions
- **API Key**: qhW6NSOj0VAC39fVWCEEW0ae96fOYFRq (from Zapier)

## Quick Solution: Use Zapier Webhook

Since you have Zapier integration working, let's use that!

### Step 1: Create Zapier Zap
1. **Trigger**: BrandMentions - New Mention
2. **Project**: Jack Harrison (820539904)
3. **Action**: Webhook - POST
4. **URL**: `https://staging-war-roombackend-45-x83i.encr.app/api/v1/webhook/mentions`
5. **Data**: Send all mention data

### Step 2: Add Webhook Endpoint to Backend
Create a new endpoint that receives BrandMentions data via webhook and stores it.

```typescript
// webhook/api.ts
export const receiveMentions = api<{ mentions: any[] }, { success: boolean }>(
  { expose: true, method: "POST", path: "/api/v1/webhook/mentions" },
  async ({ mentions }) => {
    // Store mentions in memory or database
    storeMentions(mentions);
    return { success: true };
  }
);
```

### Step 3: Test with Manual Export
1. In BrandMentions, export recent mentions as JSON
2. POST to our webhook endpoint
3. Frontend pulls from stored data

## Alternative: Enhanced Mock Data

Since we can see your real data, let's update the mock to match:

```typescript
// Real data from your dashboard
const realMentions = [
  {
    id: "1",
    text: "LAPDOG HUSBAND IS A TRILLIONAIRE HEIR - Did they hurt you? I'm fine, thanks to you...",
    author: "www.meganovel.com",
    platform: "Web",
    sentiment: "neutral",
    reach: 4940,
    timestamp: "08 Sept, 5:17 AM"
  },
  {
    id: "2", 
    text: "I'm pretty sure I got involved in a scam and now I'm very nervous",
    author: "www.reddit.com",
    platform: "Reddit",
    sentiment: "negative",
    reach: 9010,
    timestamp: "08 Sept, 5:11 AM"
  },
  {
    id: "3",
    text: "He's just standing there... Location: Pennsylvania",
    author: "www.reddit.com", 
    platform: "Reddit",
    sentiment: "neutral",
    reach: 9010,
    timestamp: "08 Sept, 5:11 AM"
  }
];

const campaignStats = {
  totalMentions: 3229,
  sentiment: {
    positive: 35,
    negative: 25,
    neutral: 40
  },
  topPlatforms: {
    twitter: 125,
    facebook: 96,
    reddit: 1829,
    news: 822
  }
};
```

## Immediate Action Plan:

1. **Update mock data** to match your real BrandMentions data
2. **Set up Zapier webhook** for continuous updates
3. **Launch winston-warroom** with realistic data
4. **Add "LIVE DATA" badge** when webhook is active

The data EXISTS - we just need to display it properly!