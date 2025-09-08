import { api, APIError } from "encore.dev/api";
import { secret } from "encore.dev/config";
import axios from "axios";

// Get the Mentionlytics API token from secrets (with fallback for deployment)
const mentionlyticsApiToken = secret("MENTIONLYTICS_API_TOKEN");

// Get the NewsAPI key from secrets
const newsApiKey = secret("NEWSAPI_KEY");

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

// Helper function to safely get NewsAPI key
async function getNewsApiKey(): Promise<string | null> {
  try {
    const key = await newsApiKey();
    return key || null;
  } catch (error) {
    console.warn("NEWSAPI_KEY not configured");
    return null;
  }
}

// Base URL for Mentionlytics API
const MENTIONLYTICS_BASE_URL = "https://api.mentionlytics.com/v1";

// Base URL for NewsAPI
const NEWSAPI_BASE_URL = "https://newsapi.org/v2";

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

// API endpoint for sentiment analysis - Now uses NewsAPI as primary source
export const getSentiment = api<{ period?: string }, SentimentResponse>(
  { expose: true, method: "GET", path: "/api/v1/mentionlytics/sentiment" },
  async ({ period = "7days" }) => {
    console.log("Fetching LIVE sentiment data...");
    
    // Try NewsAPI first for real data
    const newsKey = await getNewsApiKey();
    if (newsKey) {
      try {
        console.log("Using NewsAPI for REAL sentiment analysis!");
        const response = await axios.get(`${NEWSAPI_BASE_URL}/everything`, {
          params: {
            q: 'politics OR government OR election',
            sortBy: 'relevancy',
            pageSize: 100,
            apiKey: newsKey
          }
        });
        
        // Analyze sentiment from real news articles
        let positive = 0, negative = 0, neutral = 0;
        response.data.articles.forEach((article: any) => {
          const sentiment = analyzeSentiment(article.title + ' ' + (article.description || ''));
          if (sentiment === 'positive') positive++;
          else if (sentiment === 'negative') negative++;
          else neutral++;
        });
        
        const total = positive + negative + neutral;
        return {
          positive: Math.round((positive / total) * 100),
          negative: Math.round((negative / total) * 100),
          neutral: Math.round((neutral / total) * 100),
          period,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error("NewsAPI sentiment failed, falling back:", error);
      }
    }
    
    // Fallback to Mentionlytics if NewsAPI fails
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
      // Return default data if all APIs fail
      console.error("All APIs failed, returning defaults:", error);
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

// API endpoint for mentions feed - Now uses NewsAPI as primary source
export const getMentionsFeed = api<{ limit?: number }, MentionsFeedResponse>(
  { expose: true, method: "GET", path: "/api/v1/mentionlytics/feed" },
  async ({ limit = 10 }) => {
    console.log("Fetching LIVE mentions feed...");
    
    // Try NewsAPI first for real data
    const newsKey = await getNewsApiKey();
    if (newsKey) {
      try {
        console.log("Using NewsAPI for REAL news data!");
        const response = await axios.get(`${NEWSAPI_BASE_URL}/everything`, {
          params: {
            q: 'politics OR government OR election',
            sortBy: 'publishedAt',
            pageSize: limit,
            apiKey: newsKey
          }
        });
        
        // Transform NewsAPI articles to mentions format
        const mentions: Mention[] = response.data.articles.map((article: any, index: number) => ({
          id: `news-${index}`,
          text: article.title + (article.description ? ` - ${article.description}` : ''),
          author: article.source?.name || 'News Source',
          platform: 'News',
          sentiment: analyzeSentiment(article.title + ' ' + (article.description || '')),
          timestamp: article.publishedAt
        }));
        
        return {
          mentions,
          hasMore: response.data.totalResults > limit
        };
      } catch (error) {
        console.error("NewsAPI failed, falling back:", error);
      }
    }
    
    // Fallback to Mentionlytics if NewsAPI fails
    try {
      const data = await callMentionlyticsAPI("/mentions", { limit });
      return {
        mentions: data.mentions || [],
        hasMore: data.hasMore || false
      };
    } catch (error) {
      // Return sample data if all APIs fail
      console.error("All APIs failed, returning sample data:", error);
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

// Simple sentiment analyzer for news titles
function analyzeSentiment(text: string): string {
  const positive = ['success', 'win', 'great', 'good', 'positive', 'growth', 'improve', 'better', 'victory'];
  const negative = ['fail', 'loss', 'bad', 'negative', 'crisis', 'decline', 'worse', 'defeat', 'scandal'];
  
  const lowerText = text.toLowerCase();
  const hasPositive = positive.some(word => lowerText.includes(word));
  const hasNegative = negative.some(word => lowerText.includes(word));
  
  if (hasPositive && !hasNegative) return 'positive';
  if (hasNegative && !hasPositive) return 'negative';
  return 'neutral';
}

// Health check endpoint to validate API connections
export const validateConnection = api<{}, { status: string; hasApiKey: boolean; newsApiActive?: boolean }>(
  { expose: true, method: "GET", path: "/api/v1/mentionlytics/validate" },
  async () => {
    const token = await getMentionlyticsToken();
    const newsKey = await getNewsApiKey();
    
    // Check NewsAPI first (primary data source)
    if (newsKey) {
      try {
        const response = await axios.get(`${NEWSAPI_BASE_URL}/everything`, {
          params: {
            q: 'test',
            pageSize: 1,
            apiKey: newsKey
          }
        });
        return {
          status: "connected",
          hasApiKey: true,
          newsApiActive: true
        };
      } catch (error) {
        console.error("NewsAPI validation failed:", error);
      }
    }
    
    // Fallback to Mentionlytics check
    if (!token) {
      return {
        status: "not_configured",
        hasApiKey: false,
        newsApiActive: false
      };
    }
    
    try {
      // Try a simple API call to validate the token
      await callMentionlyticsAPI("/account");
      return {
        status: "connected",
        hasApiKey: true,
        newsApiActive: false
      };
    } catch (error) {
      return {
        status: "error",
        hasApiKey: true,
        newsApiActive: false
      };
    }
  }
);