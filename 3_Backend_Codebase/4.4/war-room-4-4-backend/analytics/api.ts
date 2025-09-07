import { api } from "encore.dev/api";

// Response types
interface Metric {
  name: string;
  value: number;
  change: number;
  period: string;
}

interface Trend {
  date: string;
  value: number;
}

interface AnalyticsSummaryResponse {
  metrics: Metric[];
  trends: Trend[];
  timestamp: string;
}

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
  score: number;
  trend: "up" | "down" | "stable";
}

interface AnalyticsSentimentResponse {
  sentiment: SentimentData;
  history: Array<{
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
  timestamp: string;
}

// GET /api/v1/analytics/summary - returns metrics + trends
export const getAnalyticsSummary = api<{}, AnalyticsSummaryResponse>(
  { expose: true, method: "GET", path: "/api/v1/analytics/summary" },
  async () => {
    console.log("Fetching analytics summary...");
    
    // Mock data for now - replace with real analytics later
    return {
      metrics: [
        {
          name: "Total Mentions",
          value: 12847,
          change: 12.5,
          period: "7d"
        },
        {
          name: "Engagement Rate",
          value: 3.8,
          change: -2.1,
          period: "7d"
        },
        {
          name: "Reach",
          value: 2847291,
          change: 8.7,
          period: "7d"
        },
        {
          name: "Sentiment Score",
          value: 72,
          change: 5.2,
          period: "7d"
        }
      ],
      trends: [
        { date: "2024-09-01", value: 1250 },
        { date: "2024-09-02", value: 1380 },
        { date: "2024-09-03", value: 1420 },
        { date: "2024-09-04", value: 1680 },
        { date: "2024-09-05", value: 1890 },
        { date: "2024-09-06", value: 2150 },
        { date: "2024-09-07", value: 2327 }
      ],
      timestamp: new Date().toISOString()
    };
  }
);

// GET /api/v1/analytics/sentiment - returns sentiment data
export const getAnalyticsSentiment = api<{}, AnalyticsSentimentResponse>(
  { expose: true, method: "GET", path: "/api/v1/analytics/sentiment" },
  async () => {
    console.log("Fetching analytics sentiment data...");
    
    // Mock data for now - replace with real sentiment analysis later
    return {
      sentiment: {
        positive: 67,
        negative: 18,
        neutral: 15,
        score: 74,
        trend: "up"
      },
      history: [
        { date: "2024-09-01", positive: 62, negative: 22, neutral: 16 },
        { date: "2024-09-02", positive: 64, negative: 21, neutral: 15 },
        { date: "2024-09-03", positive: 66, negative: 19, neutral: 15 },
        { date: "2024-09-04", positive: 68, negative: 17, neutral: 15 },
        { date: "2024-09-05", positive: 65, negative: 20, neutral: 15 },
        { date: "2024-09-06", positive: 69, negative: 16, neutral: 15 },
        { date: "2024-09-07", positive: 67, negative: 18, neutral: 15 }
      ],
      timestamp: new Date().toISOString()
    };
  }
);