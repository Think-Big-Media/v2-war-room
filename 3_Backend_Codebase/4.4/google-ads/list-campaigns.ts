import { api, APIError } from "encore.dev/api";
import { Query } from "encore.dev/api";
import type { ListCampaignsResponse, Campaign } from "./types";
import { getValidAccessToken, makeGoogleAdsApiCall, isDataModeMock, generateMockCampaigns } from "./utils";

interface ListCampaignsParams {
  user_id: Query<string>;
  customer_id?: Query<string>;
}

// Lists all Google Ads campaigns for the authenticated user.
export const listCampaigns = api<ListCampaignsParams, ListCampaignsResponse>(
  { expose: true, method: "GET", path: "/api/v1/google-ads/campaigns" },
  async (params) => {
    if (!params.user_id) {
      throw APIError.invalidArgument("User ID is required");
    }

    try {
      if (isDataModeMock()) {
        const mockCampaigns = generateMockCampaigns();
        return {
          campaigns: mockCampaigns,
          total_count: mockCampaigns.length
        };
      }

      if (!params.customer_id) {
        throw APIError.invalidArgument("Customer ID is required for live mode");
      }

      const accessToken = await getValidAccessToken(params.user_id);

      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.start_date,
          campaign.end_date,
          campaign.advertising_channel_type,
          campaign.resource_name,
          campaign_budget.amount_micros,
          campaign_budget.currency_code
        FROM campaign 
        WHERE campaign.status != 'REMOVED'
        ORDER BY campaign.name
      `;

      const response = await makeGoogleAdsApiCall(accessToken, params.customer_id, query);

      const campaigns: Campaign[] = response.results.map((result: any) => ({
        id: result.campaign.id,
        name: result.campaign.name,
        status: result.campaign.status,
        budget_amount_micros: parseInt(result.campaignBudget?.amountMicros || '0'),
        currency_code: result.campaignBudget?.currencyCode || 'USD',
        start_date: result.campaign.startDate,
        end_date: result.campaign.endDate,
        advertising_channel_type: result.campaign.advertisingChannelType,
        created_at: new Date() // Google Ads API doesn't provide creation date directly
      }));

      return {
        campaigns,
        total_count: campaigns.length
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      console.error("List campaigns error:", error);
      throw APIError.internal("Failed to retrieve campaigns");
    }
  }
);
