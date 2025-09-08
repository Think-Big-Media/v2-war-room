import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

// Get API tokens from secrets (with fallbacks for deployment)
const metaAccessToken = secret("META_ACCESS_TOKEN");
const googleAdsApiKey = secret("GOOGLE_ADS_API_KEY");

// Helper function to safely get secrets
async function getSecretSafely(secretFn: () => Promise<string>, secretName: string): Promise<string | null> {
  try {
    const value = await secretFn();
    return value || null;
  } catch (error) {
    console.warn(`${secretName} not configured, using mock data for development`);
    return null;
  }
}

// Response types
interface MetaCampaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  objective: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  costPerConversion: number;
  startDate: string;
  endDate?: string;
}

interface MetaCampaignsResponse {
  campaigns: MetaCampaign[];
  summary: {
    totalCampaigns: number;
    totalSpend: number;
    totalImpressions: number;
    totalClicks: number;
    averageCTR: number;
  };
  timestamp: string;
}

interface GoogleAdsCampaign {
  id: string;
  name: string;
  status: "enabled" | "paused" | "removed";
  type: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  avgCPC: number;
  conversions: number;
  conversionValue: number;
  startDate: string;
  endDate?: string;
}

interface GoogleAdsCampaignsResponse {
  campaigns: GoogleAdsCampaign[];
  summary: {
    totalCampaigns: number;
    totalSpend: number;
    totalImpressions: number;
    totalClicks: number;
    averageCTR: number;
  };
  timestamp: string;
}

interface CampaignInsight {
  platform: string;
  metric: string;
  value: number;
  change: number;
  trend: "up" | "down" | "stable";
  recommendation: string;
}

interface UnifiedCampaignInsightsResponse {
  insights: CampaignInsight[];
  totalSpend: number;
  totalROAS: number;
  bestPerforming: {
    platform: string;
    campaignId: string;
    campaignName: string;
    metric: string;
    value: number;
  };
  recommendations: string[];
  timestamp: string;
}

// GET /api/v1/campaigns/meta - Meta/Facebook campaigns
export const getMetaCampaigns = api<{}, MetaCampaignsResponse>(
  { expose: true, method: "GET", path: "/api/v1/campaigns/meta" },
  async () => {
    console.log("Fetching Meta/Facebook campaigns...");
    
    const token = await getSecretSafely(metaAccessToken, "META_ACCESS_TOKEN");
    if (token) {
      console.log("Meta access token available - using LIVE data!");
      
      try {
        // REAL Meta Graph API call
        const response = await fetch(
          `https://graph.facebook.com/v19.0/act_917316510623086/campaigns?fields=id,name,status,objective,daily_budget,lifetime_budget,spend,impressions,clicks,ctr,cpc,conversions,cost_per_conversion,start_time,stop_time&access_token=${token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Fetched ${data.data?.length || 0} REAL Meta campaigns`);
          
          // Transform Meta API response to our format
          const campaigns: MetaCampaign[] = (data.data || []).map((campaign: any) => ({
            id: campaign.id,
            name: campaign.name,
            status: campaign.status?.toLowerCase() || "active",
            objective: campaign.objective,
            budget: parseFloat(campaign.daily_budget || campaign.lifetime_budget || 0) / 100,
            spend: parseFloat(campaign.spend || 0) / 100,
            impressions: parseInt(campaign.impressions || 0),
            clicks: parseInt(campaign.clicks || 0),
            ctr: parseFloat(campaign.ctr || 0),
            cpc: parseFloat(campaign.cpc || 0) / 100,
            conversions: parseInt(campaign.conversions || 0),
            costPerConversion: parseFloat(campaign.cost_per_conversion || 0) / 100,
            startDate: campaign.start_time,
            endDate: campaign.stop_time
          }));
          
          const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
          const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
          const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
          const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
          
          return {
            campaigns,
            summary: {
              totalCampaigns: campaigns.length,
              totalSpend,
              totalImpressions,
              totalClicks,
              averageCTR: Math.round(averageCTR * 100) / 100
            },
            timestamp: new Date().toISOString()
          };
        } else {
          console.error("Meta API error:", response.status, await response.text());
        }
      } catch (error) {
        console.error("Error fetching real Meta campaigns:", error);
      }
    } else {
      console.log("Meta access token not configured - using mock data");
    }
    
    // Fallback to mock data if API call fails
    const campaigns: MetaCampaign[] = [
      {
        id: "meta_camp_1",
        name: "Healthcare Awareness Q4",
        status: "active",
        objective: "conversions",
        budget: 10000,
        spend: 7500,
        impressions: 250000,
        clicks: 12500,
        ctr: 5.0,
        cpc: 0.60,
        conversions: 875,
        costPerConversion: 8.57,
        startDate: "2024-09-01",
        endDate: "2024-12-31"
      },
      {
        id: "meta_camp_2",
        name: "Education Policy Outreach",
        status: "active",
        objective: "traffic",
        budget: 5000,
        spend: 3200,
        impressions: 180000,
        clicks: 9000,
        ctr: 5.0,
        cpc: 0.36,
        conversions: 450,
        costPerConversion: 7.11,
        startDate: "2024-08-15",
        endDate: "2024-11-15"
      },
      {
        id: "meta_camp_3",
        name: "Climate Action Campaign",
        status: "paused",
        objective: "brand_awareness",
        budget: 8000,
        spend: 8000,
        impressions: 500000,
        clicks: 15000,
        ctr: 3.0,
        cpc: 0.53,
        conversions: 600,
        costPerConversion: 13.33,
        startDate: "2024-07-01",
        endDate: "2024-08-31"
      }
    ];

    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      campaigns,
      summary: {
        totalCampaigns: campaigns.length,
        totalSpend,
        totalImpressions,
        totalClicks,
        averageCTR: Math.round(averageCTR * 100) / 100
      },
      timestamp: new Date().toISOString()
    };
  }
);

// GET /api/v1/campaigns/google - Google Ads campaigns
export const getGoogleAdsCampaigns = api<{}, GoogleAdsCampaignsResponse>(
  { expose: true, method: "GET", path: "/api/v1/campaigns/google" },
  async () => {
    console.log("Fetching Google Ads campaigns...");
    
    const apiKey = await getSecretSafely(googleAdsApiKey, "GOOGLE_ADS_API_KEY");
    if (apiKey) {
      console.log("Google Ads API key available - using LIVE data (when implemented)");
      // TODO: Implement real Google Ads API calls here
    } else {
      console.log("Google Ads API key not configured - using mock data");
    }
    
    // Mock data for now - replace with real Google Ads API calls later
    const campaigns: GoogleAdsCampaign[] = [
      {
        id: "google_camp_1",
        name: "Healthcare Search Campaign",
        status: "enabled",
        type: "search",
        budget: 15000,
        spend: 12500,
        impressions: 125000,
        clicks: 6250,
        ctr: 5.0,
        avgCPC: 2.00,
        conversions: 625,
        conversionValue: 31250,
        startDate: "2024-09-01",
        endDate: "2024-12-31"
      },
      {
        id: "google_camp_2",
        name: "Education Display Campaign",
        status: "enabled",
        type: "display",
        budget: 8000,
        spend: 6400,
        impressions: 800000,
        clicks: 8000,
        ctr: 1.0,
        avgCPC: 0.80,
        conversions: 200,
        conversionValue: 10000,
        startDate: "2024-08-15",
        endDate: "2024-11-15"
      },
      {
        id: "google_camp_3",
        name: "Local Services Campaign",
        status: "enabled",
        type: "local",
        budget: 5000,
        spend: 3750,
        impressions: 50000,
        clicks: 2500,
        ctr: 5.0,
        avgCPC: 1.50,
        conversions: 125,
        conversionValue: 6250,
        startDate: "2024-09-01",
        endDate: "2024-10-31"
      }
    ];

    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      campaigns,
      summary: {
        totalCampaigns: campaigns.length,
        totalSpend,
        totalImpressions,
        totalClicks,
        averageCTR: Math.round(averageCTR * 100) / 100
      },
      timestamp: new Date().toISOString()
    };
  }
);

// GET /api/v1/campaigns/insights - unified campaign insights
export const getUnifiedCampaignInsights = api<{}, UnifiedCampaignInsightsResponse>(
  { expose: true, method: "GET", path: "/api/v1/campaigns/insights" },
  async () => {
    console.log("Fetching unified campaign insights...");
    
    // Mock data for now - replace with real unified analytics later
    return {
      insights: [
        {
          platform: "Meta",
          metric: "Cost Per Conversion",
          value: 8.57,
          change: -12.5,
          trend: "down",
          recommendation: "Excellent improvement in conversion efficiency"
        },
        {
          platform: "Google Ads",
          metric: "Click-Through Rate",
          value: 3.67,
          change: 15.3,
          trend: "up",
          recommendation: "Strong CTR performance across search campaigns"
        },
        {
          platform: "Meta",
          metric: "ROAS",
          value: 4.2,
          change: 8.7,
          trend: "up",
          recommendation: "Return on ad spend exceeding targets"
        },
        {
          platform: "Google Ads",
          metric: "Impression Share",
          value: 78,
          change: -3.2,
          trend: "down",
          recommendation: "Consider increasing budgets for higher impression share"
        }
      ],
      totalSpend: 41350,
      totalROAS: 3.85,
      bestPerforming: {
        platform: "Google Ads",
        campaignId: "google_camp_1",
        campaignName: "Healthcare Search Campaign",
        metric: "ROAS",
        value: 5.2
      },
      recommendations: [
        "Increase budget allocation to high-performing search campaigns",
        "Pause underperforming display campaigns and reallocate budget",
        "Test new ad creatives for Meta campaigns to improve CTR",
        "Expand keyword targeting for Google Ads healthcare campaigns",
        "Implement more granular audience targeting on Meta platform"
      ],
      timestamp: new Date().toISOString()
    };
  }
);