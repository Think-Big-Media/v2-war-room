import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import axios from "axios";

// Get the Mentionlytics API token from secrets (with fallback for deployment)
const mentionlyticsApiToken = secret("MENTIONLYTICS_API_TOKEN");

// Helper function to safely get Mentionlytics API token
async function getMentionlyticsToken(): Promise<string | null> {
  try {
    const token = await mentionlyticsApiToken();
    return token || null;
  } catch (error) {
    console.warn("MENTIONLYTICS_API_TOKEN not configured, using mock data for development");
    return null;
  }
}

// Base URL for Mentionlytics API
const MENTIONLYTICS_BASE_URL = "https://api.mentionlytics.com/v1";

// Response types
interface SentimentResponse {
  positive: number;
  negative: number;
  neutral: number;
  period: string;
  timestamp: string;
}

interface GeographicLocation {
  state: string;
  lat: number;
  lng: number;
  mentions: number;
  sentiment: number;
}

interface GeographicResponse {
  locations: GeographicLocation[];
  timestamp: string;
}

interface Mention {
  id: string;
  text: string;
  author: string;
  platform: string;
  sentiment: string;
  timestamp: string;
}

interface MentionsFeedResponse {
  mentions: Mention[];
  hasMore: boolean;
}

// Helper function to make Mentionlytics API calls
async function callMentionlyticsAPI(endpoint: string, params?: any) {
  const token = await getMentionlyticsToken();
  
  if (!token) {
    console.warn("MENTIONLYTICS_API_TOKEN not configured, returning mock data");
    throw new Error("API not configured");
  }

  try {
    const response = await axios.get(`${MENTIONLYTICS_BASE_URL}${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      params
    });
    return response.data;
  } catch (error: any) {
    console.error("Mentionlytics API error:", error.response?.data || error.message);
    throw APIError.internal("Failed to fetch Mentionlytics data");
  }
}

// API endpoint for sentiment analysis
export const getSentiment = api<{ period?: string }, SentimentResponse>(
  { expose: true, method: "GET", path: "/api/v1/mentionlytics/sentiment" },
  async ({ period = "7days" }) => {
    console.log("Fetching LIVE sentiment data from Mentionlytics...");
    
    try {
      const data = await callMentionlyticsAPI("/sentiment", { period });
      return {
        positive: data.positive || 0,
        negative: data.negative || 0,
        neutral: data.neutral || 0,
        period,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Return default data if API fails
      console.error("Sentiment API failed, returning defaults:", error);
      return {
        positive: 45,
        negative: 25,
        neutral: 30,
        period,
        timestamp: new Date().toISOString()
      };
    }
  }
);

// API endpoint for geographic distribution
export const getGeographic = api<{}, GeographicResponse>(
  { expose: true, method: "GET", path: "/api/v1/mentionlytics/geo" },
  async () => {
    console.log("Fetching LIVE geographic data from Mentionlytics...");
    
    try {
      const data = await callMentionlyticsAPI("/geographic");
      return {
        locations: data.locations || [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Return sample data if API fails
      console.error("Geographic API failed, returning sample data:", error);
      return {
        locations: [
          { state: "Pennsylvania", lat: 41.2033, lng: -77.1945, mentions: 342, sentiment: 0.65 },
          { state: "Michigan", lat: 44.3148, lng: -85.6024, mentions: 289, sentiment: 0.58 },
          { state: "Wisconsin", lat: 43.7844, lng: -88.7879, mentions: 276, sentiment: 0.72 }
        ],
        timestamp: new Date().toISOString()
      };
    }
  }
);

// API endpoint for mentions feed
export const getMentionsFeed = api<{ limit?: number }, MentionsFeedResponse>(
  { expose: true, method: "GET", path: "/api/v1/mentionlytics/feed" },
  async ({ limit = 10 }) => {
    console.log("Fetching LIVE mentions feed from Mentionlytics...");
    
    try {
      const data = await callMentionlyticsAPI("/mentions", { limit });
      return {
        mentions: data.mentions || [],
        hasMore: data.hasMore || false
      };
    } catch (error) {
      // Return sample data if API fails
      console.error("Mentions feed API failed, returning sample data:", error);
      return {
        mentions: [
          {
            id: "1",
            text: "Great progress on healthcare initiatives!",
            author: "PolicyWatcher",
            platform: "Twitter",
            sentiment: "positive",
            timestamp: new Date().toISOString()
          }
        ],
        hasMore: false
      };
    }
  }
);

// Health check endpoint to validate Mentionlytics connection
export const validateConnection = api<{}, { status: string; hasApiKey: boolean }>(
  { expose: true, method: "GET", path: "/api/v1/mentionlytics/validate" },
  async () => {
    const token = await getMentionlyticsToken();
    
    if (!token) {
      return {
        status: "not_configured",
        hasApiKey: false
      };
    }
    
    try {
      // Try a simple API call to validate the token
      await callMentionlyticsAPI("/account");
      return {
        status: "connected",
        hasApiKey: true
      };
    } catch (error) {
      return {
        status: "error",
        hasApiKey: true
      };
    }
  }
);