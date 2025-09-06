import { api, APIError } from "encore.dev/api";
import { Query } from "encore.dev/api";
import type { GetInsightsResponse, CampaignInsights } from "./types";
import { 
  getValidAccessToken, 
  makeGoogleAdsApiCall, 
  isDataModeMock, 
  generateMockInsights,
  getCachedData,
  setCachedData 
} from "./utils";

interface GetInsightsParams {
  user_id: Query<string>;
  customer_id?: Query<string>;
  campaign_ids?: Query<string>;
}

// Retrieves campaign insights and analytics with caching.
export const getInsights = api<GetInsightsParams, GetInsightsResponse>(
  { expose: true, method: "GET", path: "/api/v1/google-ads/insights" },
  async (params) => {
    if (!params.user_id) {
      throw APIError.invalidArgument("User ID is required");
    }

    try {
      const campaignIds = params.campaign_ids ? params.campaign_ids.split(',') : [];

      if (isDataModeMock()) {
        const mockInsights = generateMockInsights();
        const filteredInsights = campaignIds.length > 0 
          ? mockInsights.filter(i => campaignIds.includes(i.campaign_id))
          : mockInsights;

        return {
          insights: filteredInsights
        };
      }

      if (!params.customer_id) {
        throw APIError.invalidArgument("Customer ID is required for live mode");
      }

      // Check cache first
      const cacheKey = `insights_${params.customer_id}_${campaignIds.join(',')}`;
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const accessToken = await getValidAccessToken(params.user_id);

      let campaignFilter = '';
      if (campaignIds.length > 0) {
        const campaignList = campaignIds.map(id => `'${id}'`).join(',');
        campaignFilter = `AND campaign.id IN (${campaignList})`;
      }

      // Get quality score and impression share data
      const qualityScoreQuery = `
        SELECT 
          campaign.id,
          campaign.name,
          metrics.quality_score,
          metrics.search_impression_share,
          metrics.search_lost_impression_share_budget,
          metrics.search_lost_impression_share_rank
        FROM campaign 
        WHERE campaign.status != 'REMOVED'
        ${campaignFilter}
        ORDER BY campaign.name
      `;

      // Get keyword performance data
      const keywordQuery = `
        SELECT 
          campaign.id,
          campaign.name,
          ad_group_criterion.keyword.text,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros
        FROM keyword_view 
        WHERE campaign.status != 'REMOVED'
        ${campaignFilter}
        ORDER BY metrics.impressions DESC
        LIMIT 100
      `;

      // Get device performance data
      const deviceQuery = `
        SELECT 
          campaign.id,
          campaign.name,
          segments.device,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros
        FROM campaign 
        WHERE campaign.status != 'REMOVED'
        ${campaignFilter}
        ORDER BY campaign.name, segments.device
      `;

      const [qualityResponse, keywordResponse, deviceResponse] = await Promise.all([
        makeGoogleAdsApiCall(accessToken, params.customer_id, qualityScoreQuery),
        makeGoogleAdsApiCall(accessToken, params.customer_id, keywordQuery),
        makeGoogleAdsApiCall(accessToken, params.customer_id, deviceQuery)
      ]);

      // Process and combine the data
      const insights: CampaignInsights[] = qualityResponse.results.map((result: any) => {
        const campaignId = result.campaign.id;
        
        // Find keywords for this campaign
        const campaignKeywords = keywordResponse.results
          .filter((kw: any) => kw.campaign.id === campaignId)
          .slice(0, 10)
          .map((kw: any) => ({
            keyword: kw.adGroupCriterion?.keyword?.text || 'N/A',
            impressions: parseInt(kw.metrics?.impressions || '0'),
            clicks: parseInt(kw.metrics?.clicks || '0'),
            cost_micros: parseInt(kw.metrics?.costMicros || '0')
          }));

        // Find device performance for this campaign
        const campaignDevices = deviceResponse.results
          .filter((dev: any) => dev.campaign.id === campaignId)
          .map((dev: any) => ({
            device: dev.segments?.device || 'UNKNOWN',
            impressions: parseInt(dev.metrics?.impressions || '0'),
            clicks: parseInt(dev.metrics?.clicks || '0'),
            cost_micros: parseInt(dev.metrics?.costMicros || '0')
          }));

        return {
          campaign_id: campaignId,
          campaign_name: result.campaign.name,
          quality_score_avg: parseFloat(result.metrics?.qualityScore || '0'),
          search_impression_share: parseFloat(result.metrics?.searchImpressionShare || '0'),
          search_lost_impression_share_budget: parseFloat(result.metrics?.searchLostImpressionShareBudget || '0'),
          search_lost_impression_share_rank: parseFloat(result.metrics?.searchLostImpressionShareRank || '0'),
          top_keywords: campaignKeywords,
          device_performance: campaignDevices
        };
      });

      const responseData = {
        insights
      };

      // Cache the response for 15 minutes
      await setCachedData(cacheKey, responseData, 15);

      return responseData;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      console.error("Get insights error:", error);
      throw APIError.internal("Failed to retrieve campaign insights");
    }
  }
);
