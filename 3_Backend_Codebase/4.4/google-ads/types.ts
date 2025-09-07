export interface Campaign {
  id: string;
  name: string;
  status: 'ENABLED' | 'PAUSED' | 'REMOVED';
  budget_amount_micros: number;
  currency_code: string;
  start_date: string;
  end_date?: string;
  advertising_channel_type: string;
  created_at: Date;
}

export interface PerformanceMetrics {
  campaign_id: string;
  campaign_name: string;
  impressions: number;
  clicks: number;
  cost_micros: number;
  conversions: number;
  conversion_value: number;
  ctr: number;
  cpc_micros: number;
  cost_per_conversion: number;
  date_range: {
    start_date: string;
    end_date: string;
  };
}

export interface CampaignInsights {
  campaign_id: string;
  campaign_name: string;
  quality_score_avg: number;
  search_impression_share: number;
  search_lost_impression_share_budget: number;
  search_lost_impression_share_rank: number;
  top_keywords: Array<{
    keyword: string;
    impressions: number;
    clicks: number;
    cost_micros: number;
  }>;
  device_performance: Array<{
    device: string;
    impressions: number;
    clicks: number;
    cost_micros: number;
  }>;
}

export interface ListCampaignsResponse {
  campaigns: Campaign[];
  total_count: number;
}

export interface GetPerformanceResponse {
  metrics: PerformanceMetrics[];
  summary: {
    total_impressions: number;
    total_clicks: number;
    total_cost_micros: number;
    total_conversions: number;
    average_ctr: number;
    average_cpc_micros: number;
  };
}

export interface GetInsightsResponse {
  insights: CampaignInsights[];
}

export interface OAuthToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at: Date;
  scope: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthStartRequest {
  user_id: string;
  redirect_uri: string;
}

export interface AuthStartResponse {
  authorization_url: string;
  state: string;
}

export interface AuthCallbackRequest {
  code: string;
  state: string;
  redirect_uri: string;
}

export interface AuthCallbackResponse {
  success: boolean;
  user_id: string;
}

export interface GoogleAdsApiResponse {
  results: any[];
  fieldMask: string;
  totalResultsCount: string;
}
