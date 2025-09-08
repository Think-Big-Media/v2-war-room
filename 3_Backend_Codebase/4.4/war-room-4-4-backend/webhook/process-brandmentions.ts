import { api } from "encore.dev/api";

// Store mentions in memory
export let brandMentionsData: any = {
  social: [],
  web: [],
  lastUpdated: null
};

// POST /api/v1/webhook/brandmentions - Receive BrandMentions data
export const receiveBrandMentions = api(
  { expose: true, method: "POST", path: "/api/v1/webhook/brandmentions" },
  async (payload: any) => {
    console.log("Received BrandMentions webhook!");
    
    // Store the data
    if (payload.social) {
      brandMentionsData.social = payload.social;
    }
    if (payload.web) {
      brandMentionsData.web = payload.web;
    }
    brandMentionsData.lastUpdated = new Date().toISOString();
    
    console.log(`Stored ${payload.social?.length || 0} social and ${payload.web?.length || 0} web mentions`);
    
    return {
      success: true,
      message: "Data received and stored",
      counts: {
        social: payload.social?.length || 0,
        web: payload.web?.length || 0
      }
    };
  }
);

// GET /api/v1/mentions/live - Get live mentions for dashboard
export const getLiveMentions = api(
  { expose: true, method: "GET", path: "/api/v1/mentions/live" },
  async () => {
    // Transform BrandMentions data for dashboard
    const mentions = [];
    
    // Add social mentions
    if (brandMentionsData.social) {
      brandMentionsData.social.forEach((item: any) => {
        mentions.push({
          id: `social-${Date.now()}-${Math.random()}`,
          text: item.title || item.text || "No content",
          author: item.name || item.username || "Unknown",
          platform: "Social Media",
          url: item.url,
          date: item.date,
          sentiment: analyzeSentiment(item.text || item.title || "")
        });
      });
    }
    
    // Add web mentions
    if (brandMentionsData.web) {
      brandMentionsData.web.forEach((item: any) => {
        mentions.push({
          id: `web-${Date.now()}-${Math.random()}`,
          text: item.text || item.title || "No content",
          author: "Web Source",
          platform: "Web",
          url: item.url,
          date: item.date,
          sentiment: analyzeSentiment(item.text || item.title || "")
        });
      });
    }
    
    return {
      mentions,
      totalCount: mentions.length,
      lastUpdated: brandMentionsData.lastUpdated,
      sentiment: calculateOverallSentiment(mentions)
    };
  }
);

// Simple sentiment analysis
function analyzeSentiment(text: string): "positive" | "negative" | "neutral" {
  const positive = ["good", "great", "excellent", "win", "success", "leading", "support"];
  const negative = ["bad", "fail", "loss", "against", "crisis", "problem", "issue"];
  
  const textLower = text.toLowerCase();
  const posScore = positive.filter(word => textLower.includes(word)).length;
  const negScore = negative.filter(word => textLower.includes(word)).length;
  
  if (posScore > negScore) return "positive";
  if (negScore > posScore) return "negative";
  return "neutral";
}

// Calculate overall sentiment
function calculateOverallSentiment(mentions: any[]) {
  const sentiments = mentions.map(m => m.sentiment);
  const positive = sentiments.filter(s => s === "positive").length;
  const negative = sentiments.filter(s => s === "negative").length;
  const neutral = sentiments.filter(s => s === "neutral").length;
  
  return {
    positive: Math.round((positive / mentions.length) * 100) || 0,
    negative: Math.round((negative / mentions.length) * 100) || 0,
    neutral: Math.round((neutral / mentions.length) * 100) || 0
  };
}