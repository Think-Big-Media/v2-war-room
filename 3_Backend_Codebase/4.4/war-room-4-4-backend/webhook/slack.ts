import { api } from "encore.dev/api";

// Slack message format from BrandMentions
interface SlackMessage {
  token?: string;
  team_id?: string;
  channel_id?: string;
  channel_name?: string;
  user_id?: string;
  user_name?: string;
  text: string;
  timestamp?: string;
  trigger_word?: string;
}

// Parsed mention from Slack message
interface ParsedMention {
  id: string;
  text: string;
  author: string;
  platform: string;
  sentiment: "positive" | "negative" | "neutral";
  url?: string;
  timestamp: string;
}

// In-memory cache for Slack mentions
let slackMentionsCache: ParsedMention[] = [];

// POST /api/v1/webhook/slack - Receive mentions from Slack
export const receiveSlackMention = api(
  { expose: true, method: "POST", path: "/api/v1/webhook/slack" },
  async (message: SlackMessage) => {
    console.log("Received Slack webhook:", message.text);
    
    // Parse the BrandMentions format from Slack
    // Example: "New mention: Jack Harrison mentioned on Twitter - 'Great speech!' [Positive] https://twitter.com/..."
    const mention = parseSlackMessage(message);
    
    if (mention) {
      // Add to cache
      slackMentionsCache.unshift(mention);
      
      // Keep only last 100 mentions in memory
      if (slackMentionsCache.length > 100) {
        slackMentionsCache = slackMentionsCache.slice(0, 100);
      }
      
      console.log(`Cached mention: ${mention.platform} - ${mention.sentiment}`);
    }
    
    // Slack expects a response
    return {
      text: "Mention received and processed",
      response_type: "in_channel"
    };
  }
);

// GET /api/v1/webhook/slack/mentions - Get cached Slack mentions
export const getSlackMentions = api(
  { expose: true, method: "GET", path: "/api/v1/webhook/slack/mentions" },
  async () => {
    return {
      mentions: slackMentionsCache,
      count: slackMentionsCache.length,
      lastUpdated: slackMentionsCache[0]?.timestamp || null
    };
  }
);

// Helper function to parse Slack message into mention format
function parseSlackMessage(message: SlackMessage): ParsedMention | null {
  const text = message.text;
  
  // Skip if not a mention notification
  if (!text.includes("mention") && !text.includes("Jack Harrison")) {
    return null;
  }
  
  // Extract platform (Twitter, Reddit, etc.)
  const platformMatch = text.match(/on (Twitter|Facebook|Reddit|Instagram|LinkedIn|News)/i);
  const platform = platformMatch ? platformMatch[1] : "Unknown";
  
  // Extract sentiment
  const sentimentMatch = text.match(/\[(Positive|Negative|Neutral)\]/i);
  const sentiment = sentimentMatch 
    ? sentimentMatch[1].toLowerCase() as "positive" | "negative" | "neutral"
    : "neutral";
  
  // Extract URL if present
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  const url = urlMatch ? urlMatch[0] : undefined;
  
  // Extract the actual mention text (between quotes if present)
  const mentionTextMatch = text.match(/"([^"]+)"|'([^']+)'/);
  const mentionText = mentionTextMatch 
    ? (mentionTextMatch[1] || mentionTextMatch[2])
    : text;
  
  return {
    id: `slack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text: mentionText,
    author: message.user_name || "Slack User",
    platform,
    sentiment,
    url,
    timestamp: new Date().toISOString()
  };
}

// GET /api/v1/webhook/slack/test - Test endpoint
export const testSlackWebhook = api(
  { expose: true, method: "GET", path: "/api/v1/webhook/slack/test" },
  async () => {
    // Add a test mention
    const testMention: ParsedMention = {
      id: `test-${Date.now()}`,
      text: "Jack Harrison's healthcare plan is exactly what Pennsylvania needs!",
      author: "TestUser",
      platform: "Twitter",
      sentiment: "positive",
      url: "https://twitter.com/test/status/123",
      timestamp: new Date().toISOString()
    };
    
    slackMentionsCache.unshift(testMention);
    
    return {
      message: "Test mention added",
      mention: testMention,
      totalMentions: slackMentionsCache.length
    };
  }
);