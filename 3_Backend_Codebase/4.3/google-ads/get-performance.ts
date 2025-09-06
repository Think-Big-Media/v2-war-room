import { api, APIError } from "encore.dev/api";
import { Query } from "encore.dev/api";
import type { GetPerformanceResponse, PerformanceMetrics } from "./types";
import { 
  getValidAccessToken, 
  makeGoogleAdsApiCall, 
  isDataModeMock, 
  generateMockPerformanceMetrics,
  getCachedData,
  setCachedData 
} from "./utils";

interface GetPerformanceParams {
  user_id: Query<string>;
  customer_id?: Query<string>;
  start_date?: Query<string>;
  end_date?: Query<string>;
  campaign_ids?: Query<string>;
}

// Retrieves campaign performance metrics with caching.
export const getPerformance = api<GetPerformanceParams, GetPerformanceResponse>(
  { expose: true, method: "GET", path: "/api/v1/google-ads/performance" },
  async (params) => {
    if (!params.user_id) {
      throw APIError.invalidArgument("User ID is required");
    }

    try {
      const startDate = params.start_date || '2024-01-01';
      const endDate = params.end_date || new Date().toISOString().split('T')[0];
      const campaignIds = params.campaign_ids ? params.campaign_ids.split(',') : [];

      if (isDataModeMock()) {
        const mockMetrics = generateMockPerformanceMetrics();
        const filteredMetrics = campaignIds.length > 0 
          ? mockMetrics.filter(m => campaignIds.includes(m.campaign_id))
          : mockMetrics;

        const summary = calculateSummary(filteredMetrics);

        return {
          metrics: filteredMetrics,
          summary
        };
      }

      if (!params.customer_id) {
        throw APIError.invalidArgument("Customer ID is required for live mode");
      }

      // Check cache first
      const cacheKey = `performance_${params.customer_id}_${startDate}_${endDate}_${campaignIds.join(',')}`;
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

      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.ctr,
          metrics.average_cpc
        FROM campaign 
        WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
        AND campaign.status != 'REMOVED'
        ${campaignFilter}
        ORDER BY campaign.name
      `;

      const response = await makeGoogleAdsApiCall(accessToken, params.customer_id, query);

      const metrics: PerformanceMetrics[] = response.results.map((result: any) => ({
        campaign_id: result.campaign.id,
        campaign_name: result.campaign.name,
        impressions: parseInt(result.metrics.impressions || '0'),
        clicks: parseInt(result.metrics.clicks || '0'),
        cost_micros: parseInt(result.metrics.costMicros || '0'),
        conversions: parseFloat(result.metrics.conversions || '0'),
        conversion_value: parseFloat(result.metrics.conversionsValue || '0'),
        ctr: parseFloat(result.metrics.ctr || '0'),
        cpc_micros: parseInt(result.metrics.averageCpc || '0'),
        cost_per_conversion: result.metrics.conversions > 0 
          ? parseInt(result.metrics.costMicros || '0') / 1000000 / parseFloat(result.metrics.conversions)
          : 0,
        date_range: {
          start_date: startDate,
          end_date: endDate
        }
      }));

      const summary = calculateSummary(metrics);

      const responseData = {
        metrics,
        summary
      };

      // Cache the response for 15 minutes
      await setCachedData(cacheKey, responseData, 15);

      return responseData;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      console.error("Get performance error:", error);
      throw APIError.internal("Failed to retrieve performance metrics");
    }
  }
);

function calculateSummary(metrics: PerformanceMetrics[]) {
  const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
  const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0);
  const totalCostMicros = metrics.reduce((sum, m) => sum + m.cost_micros, 0);
  const totalConversions = metrics.reduce((sum, m) => sum + m.conversions, 0);

  return {
    total_impressions: totalImpressions,
    total_clicks: totalClicks,
    total_cost_micros: totalCostMicros,
    total_conversions: totalConversions,
    average_ctr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
    average_cpc_micros: totalClicks > 0 ? totalCostMicros / totalClicks : 0
  };
}
