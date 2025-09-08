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
  [key: string]: any; // Accept any Zapier payload structure
}

// Webhook endpoint to receive BrandMentions data from Zapier
// COMPLETELY REMOVABLE: Just delete this webhook folder when Mentionlytics is ready
export const receiveBrandMentions = api<WebhookPayload, { success: boolean; message: string }>(
  { expose: true, method: "POST", path: "/api/v1/webhook/brandmentions" },
  async (payload) => {
    console.log("Received BrandMentions data via webhook");
    
    try {
      // Store the data in cache
      if (payload.mentions) {
        mentionsCache.mentions = payload.mentions;
      }
      
      if (payload.sentiment) {
        mentionsCache.sentiment = payload.sentiment;
      }
      
      mentionsCache.lastUpdated = new Date().toISOString();
      
      return {
        success: true,
        message: `Received ${payload.mentions?.length || 0} mentions`
      };
    } catch (error) {
      console.error("Error processing webhook:", error);
      return {
        success: false,
        message: "Error processing webhook data"
      };
    }
  }
);

// Get cached mentions (called by the mentionlytics service)
export const getCachedMentions = api<{}, { mentions: any[]; lastUpdated: string | null }>(
  { expose: false, method: "GET", path: "/webhook/cache/mentions" },
  async () => {
    return {
      mentions: mentionsCache.mentions,
      lastUpdated: mentionsCache.lastUpdated
    };
  }
);

// Get cached sentiment (called by the mentionlytics service)
export const getCachedSentiment = api<{}, { sentiment: any; lastUpdated: string | null }>(
  { expose: false, method: "GET", path: "/webhook/cache/sentiment" },
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