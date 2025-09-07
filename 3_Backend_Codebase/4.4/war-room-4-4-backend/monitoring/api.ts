import { api } from "encore.dev/api";

// Response types
interface SocialMention {
  id: string;
  platform: string;
  text: string;
  author: string;
  url: string;
  sentiment: "positive" | "negative" | "neutral";
  engagement: number;
  reach: number;
  timestamp: string;
}

interface MonitoringMentionsResponse {
  mentions: SocialMention[];
  total: number;
  platforms: {
    twitter: number;
    facebook: number;
    instagram: number;
    tiktok: number;
    youtube: number;
  };
  timestamp: string;
}

interface SentimentAnalysis {
  overall: {
    positive: number;
    negative: number;
    neutral: number;
    score: number;
  };
  platforms: Array<{
    platform: string;
    positive: number;
    negative: number;
    neutral: number;
    score: number;
  }>;
  trending: {
    direction: "up" | "down" | "stable";
    change: number;
  };
}

interface MonitoringSentimentResponse {
  sentiment: SentimentAnalysis;
  timestamp: string;
}

interface TrendingTopic {
  keyword: string;
  mentions: number;
  sentiment: number;
  platforms: string[];
  growth: number;
}

interface MonitoringTrendsResponse {
  trends: TrendingTopic[];
  timeframe: string;
  timestamp: string;
}

// GET /api/v1/monitoring/mentions - social mentions
export const getMonitoringMentions = api<{ limit?: number; platform?: string }, MonitoringMentionsResponse>(
  { expose: true, method: "GET", path: "/api/v1/monitoring/mentions" },
  async ({ limit = 20, platform }) => {
    console.log(`Fetching social mentions ${platform ? `for ${platform}` : ''}...`);
    
    // Mock data for now - replace with real social monitoring later
    const allMentions: SocialMention[] = [
      {
        id: "1",
        platform: "twitter",
        text: "Really impressed with the latest healthcare initiatives. This is the kind of leadership we need!",
        author: "@healthadvocate2024",
        url: "https://twitter.com/healthadvocate2024/status/123",
        sentiment: "positive",
        engagement: 847,
        reach: 12500,
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
      },
      {
        id: "2",
        platform: "facebook",
        text: "The new education policy seems promising but needs more funding details.",
        author: "Sarah Johnson",
        url: "https://facebook.com/posts/456",
        sentiment: "neutral",
        engagement: 234,
        reach: 5600,
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      },
      {
        id: "3",
        platform: "instagram",
        text: "Love seeing action on environmental issues! 🌱 #ClimateAction",
        author: "@ecofriendly_sarah",
        url: "https://instagram.com/p/789",
        sentiment: "positive",
        engagement: 1250,
        reach: 8900,
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString()
      },
      {
        id: "4",
        platform: "tiktok",
        text: "This infrastructure plan could really help our community",
        author: "@localnews_tiktok",
        url: "https://tiktok.com/@localnews_tiktok/video/101112",
        sentiment: "positive",
        engagement: 5670,
        reach: 45000,
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      }
    ];

    const filteredMentions = platform 
      ? allMentions.filter(m => m.platform === platform)
      : allMentions;

    const mentions = filteredMentions.slice(0, limit);

    return {
      mentions,
      total: filteredMentions.length,
      platforms: {
        twitter: allMentions.filter(m => m.platform === "twitter").length,
        facebook: allMentions.filter(m => m.platform === "facebook").length,
        instagram: allMentions.filter(m => m.platform === "instagram").length,
        tiktok: allMentions.filter(m => m.platform === "tiktok").length,
        youtube: allMentions.filter(m => m.platform === "youtube").length
      },
      timestamp: new Date().toISOString()
    };
  }
);

// GET /api/v1/monitoring/sentiment - sentiment analysis
export const getMonitoringSentiment = api<{}, MonitoringSentimentResponse>(
  { expose: true, method: "GET", path: "/api/v1/monitoring/sentiment" },
  async () => {
    console.log("Fetching monitoring sentiment analysis...");
    
    // Mock data for now - replace with real sentiment monitoring later
    return {
      sentiment: {
        overall: {
          positive: 68,
          negative: 17,
          neutral: 15,
          score: 76
        },
        platforms: [
          { platform: "twitter", positive: 70, negative: 20, neutral: 10, score: 75 },
          { platform: "facebook", positive: 65, negative: 15, neutral: 20, score: 75 },
          { platform: "instagram", positive: 80, negative: 10, neutral: 10, score: 85 },
          { platform: "tiktok", positive: 75, negative: 15, neutral: 10, score: 80 },
          { platform: "youtube", positive: 60, negative: 25, neutral: 15, score: 68 }
        ],
        trending: {
          direction: "up",
          change: 5.2
        }
      },
      timestamp: new Date().toISOString()
    };
  }
);

// GET /api/v1/monitoring/trends - trending topics
export const getMonitoringTrends = api<{}, MonitoringTrendsResponse>(
  { expose: true, method: "GET", path: "/api/v1/monitoring/trends" },
  async () => {
    console.log("Fetching monitoring trends...");
    
    // Mock data for now - replace with real trend monitoring later
    return {
      trends: [
        {
          keyword: "healthcare reform",
          mentions: 3420,
          sentiment: 0.72,
          platforms: ["twitter", "facebook", "instagram"],
          growth: 15.8
        },
        {
          keyword: "education policy",
          mentions: 2150,
          sentiment: 0.65,
          platforms: ["twitter", "facebook", "youtube"],
          growth: 8.3
        },
        {
          keyword: "climate action",
          mentions: 1890,
          sentiment: 0.78,
          platforms: ["instagram", "tiktok", "twitter"],
          growth: 22.4
        },
        {
          keyword: "infrastructure",
          mentions: 1670,
          sentiment: 0.58,
          platforms: ["facebook", "twitter", "youtube"],
          growth: 3.7
        },
        {
          keyword: "job creation",
          mentions: 1420,
          sentiment: 0.69,
          platforms: ["twitter", "facebook", "tiktok"],
          growth: 12.1
        }
      ],
      timeframe: "7d",
      timestamp: new Date().toISOString()
    };
  }
);