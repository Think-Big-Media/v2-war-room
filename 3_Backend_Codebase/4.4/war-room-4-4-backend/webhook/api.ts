import { api } from "encore.dev/api";

// In-memory cache for mentions (temporary storage)
// When Mentionlytics is ready, we just remove this entire webhook folder
let mentionsCache: any = {
  mentions: [],
  sentiment: { positive: 0, negative: 0, neutral: 0 },
  lastUpdated: null
};

interface WebhookPayload {
  mentions?: any[];
  sentiment?: any;
  project?: any;
  // Remove index signature - Encore doesn't support it
  data?: any; // Generic field for any additional data
}

// BrandMentions webhook REMOVED - Now using Slack integration
// All mentions come through Slack #war-room-mentions channel
// This eliminates the compilation error with the duplicate file

// Get cached mentions (called by the mentionlytics service)
export const getCachedMentions = api<{}, { mentions: any[]; lastUpdated: string | null }>(
  { expose: true, method: "GET", path: "/api/v1/webhook/cache/mentions" },
  async () => {
    return {
      mentions: mentionsCache.mentions,
      lastUpdated: mentionsCache.lastUpdated
    };
  }
);

// Get cached sentiment (called by the mentionlytics service)
export const getCachedSentiment = api<{}, { sentiment: any; lastUpdated: string | null }>(
  { expose: true, method: "GET", path: "/api/v1/webhook/cache/sentiment" },
  async () => {
    return {
      sentiment: mentionsCache.sentiment,
      lastUpdated: mentionsCache.lastUpdated
    };
  }
);

// Health check for webhook
export const webhookHealth = api<{}, { status: string; hasData: boolean }>(
  { expose: true, method: "GET", path: "/api/v1/webhook/health" },
  async () => {
    return {
      status: "active",
      hasData: mentionsCache.mentions.length > 0
    };
  }
);