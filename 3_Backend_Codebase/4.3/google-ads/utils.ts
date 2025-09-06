import { secret } from "encore.dev/config";
import { APIError } from "encore.dev/api";
import { googleAdsDB } from "./db";
import type { OAuthToken, Campaign, PerformanceMetrics, CampaignInsights } from "./types";
import * as crypto from "crypto";

const googleAdsClientId = secret("GOOGLE_ADS_CLIENT_ID");
const googleAdsClientSecret = secret("GOOGLE_ADS_CLIENT_SECRET");
const dataMode = secret("DATA_MODE");

export function isDataModeMock(): boolean {
  return dataMode() === "MOCK";
}

export function generateState(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

export function buildAuthUrl(redirectUri: string, state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    client_id: googleAdsClientId(),
    redirect_uri: redirectUri,
    scope: 'https://www.googleapis.com/auth/adwords',
    response_type: 'code',
    state: state,
    access_type: 'offline',
    prompt: 'consent',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string, redirectUri: string, codeVerifier: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
}> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: googleAdsClientId(),
      client_secret: googleAdsClientSecret(),
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    })
  });

  if (!response.ok) {
    throw APIError.internal(`OAuth token exchange failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
}> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: googleAdsClientId(),
      client_secret: googleAdsClientSecret(),
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });

  if (!response.ok) {
    throw APIError.internal(`Token refresh failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function getValidAccessToken(userId: string): Promise<string> {
  if (isDataModeMock()) {
    return 'mock_access_token';
  }

  const token = await googleAdsDB.queryRow<OAuthToken>`
    SELECT * FROM oauth_tokens 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  if (!token) {
    throw APIError.unauthenticated('No Google Ads authorization found. Please authorize first.');
  }

  // Check if token is expired
  if (new Date() >= token.expires_at) {
    if (!token.refresh_token) {
      throw APIError.unauthenticated('Access token expired and no refresh token available. Please re-authorize.');
    }

    // Refresh the token
    const refreshedData = await refreshAccessToken(token.refresh_token);
    const newExpiresAt = new Date(Date.now() + refreshedData.expires_in * 1000);

    await googleAdsDB.exec`
      UPDATE oauth_tokens 
      SET access_token = ${refreshedData.access_token}, 
          expires_at = ${newExpiresAt},
          updated_at = NOW()
      WHERE id = ${token.id}
    `;

    return refreshedData.access_token;
  }

  return token.access_token;
}

export async function makeGoogleAdsApiCall(
  accessToken: string,
  customerId: string,
  query: string
): Promise<any> {
  if (isDataModeMock()) {
    return getMockApiResponse(query);
  }

  const response = await fetch(`https://googleads.googleapis.com/v16/customers/${customerId}/googleAds:searchStream`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
    },
    body: JSON.stringify({
      query: query,
      summaryRowSetting: 'WITH_SUMMARY_ROW'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw APIError.internal(`Google Ads API call failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

function getMockApiResponse(query: string): any {
  if (query.includes('campaign.')) {
    return {
      results: [
        {
          campaign: {
            resourceName: 'customers/1234567890/campaigns/111111',
            id: '111111',
            name: 'Search Campaign - Brand',
            status: 'ENABLED',
            advertisingChannelType: 'SEARCH',
            startDate: '2024-01-01',
            campaignBudget: 'customers/1234567890/campaignBudgets/222222'
          },
          campaignBudget: {
            amountMicros: '50000000',
            currencyCode: 'USD'
          }
        },
        {
          campaign: {
            resourceName: 'customers/1234567890/campaigns/333333',
            id: '333333',
            name: 'Display Campaign - Awareness',
            status: 'ENABLED',
            advertisingChannelType: 'DISPLAY',
            startDate: '2024-02-01',
            campaignBudget: 'customers/1234567890/campaignBudgets/444444'
          },
          campaignBudget: {
            amountMicros: '30000000',
            currencyCode: 'USD'
          }
        }
      ]
    };
  }

  if (query.includes('metrics.')) {
    return {
      results: [
        {
          campaign: {
            id: '111111',
            name: 'Search Campaign - Brand'
          },
          metrics: {
            impressions: '15000',
            clicks: '1200',
            costMicros: '8500000',
            conversions: 85.5,
            conversionValue: 12750.50,
            ctr: 0.08,
            averageCpc: '7083333'
          }
        },
        {
          campaign: {
            id: '333333',
            name: 'Display Campaign - Awareness'
          },
          metrics: {
            impressions: '50000',
            clicks: '750',
            costMicros: '5200000',
            conversions: 45.2,
            conversionValue: 6780.30,
            ctr: 0.015,
            averageCpc: '6933333'
          }
        }
      ]
    };
  }

  return { results: [] };
}

export async function getCachedData(cacheKey: string): Promise<any | null> {
  const cached = await googleAdsDB.queryRow<{data: any}>`
    SELECT data FROM performance_cache 
    WHERE cache_key = ${cacheKey} AND expires_at > NOW()
  `;

  return cached?.data || null;
}

export async function setCachedData(cacheKey: string, data: any, ttlMinutes: number = 15): Promise<void> {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  
  await googleAdsDB.exec`
    INSERT INTO performance_cache (cache_key, data, expires_at)
    VALUES (${cacheKey}, ${JSON.stringify(data)}, ${expiresAt})
    ON CONFLICT (cache_key) 
    DO UPDATE SET 
      data = ${JSON.stringify(data)},
      expires_at = ${expiresAt},
      created_at = NOW()
  `;
}

export function generateMockCampaigns(): Campaign[] {
  return [
    {
      id: '111111',
      name: 'Search Campaign - Brand',
      status: 'ENABLED',
      budget_amount_micros: 50000000,
      currency_code: 'USD',
      start_date: '2024-01-01',
      advertising_channel_type: 'SEARCH',
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      id: '333333',
      name: 'Display Campaign - Awareness',
      status: 'ENABLED',
      budget_amount_micros: 30000000,
      currency_code: 'USD',
      start_date: '2024-02-01',
      advertising_channel_type: 'DISPLAY',
      created_at: new Date('2024-02-01T00:00:00Z')
    },
    {
      id: '555555',
      name: 'Shopping Campaign - Products',
      status: 'PAUSED',
      budget_amount_micros: 75000000,
      currency_code: 'USD',
      start_date: '2024-01-15',
      end_date: '2024-12-31',
      advertising_channel_type: 'SHOPPING',
      created_at: new Date('2024-01-15T00:00:00Z')
    }
  ];
}

export function generateMockPerformanceMetrics(): PerformanceMetrics[] {
  return [
    {
      campaign_id: '111111',
      campaign_name: 'Search Campaign - Brand',
      impressions: 15000,
      clicks: 1200,
      cost_micros: 8500000,
      conversions: 85.5,
      conversion_value: 12750.50,
      ctr: 0.08,
      cpc_micros: 7083333,
      cost_per_conversion: 99.42,
      date_range: {
        start_date: '2024-01-01',
        end_date: '2024-01-31'
      }
    },
    {
      campaign_id: '333333',
      campaign_name: 'Display Campaign - Awareness',
      impressions: 50000,
      clicks: 750,
      cost_micros: 5200000,
      conversions: 45.2,
      conversion_value: 6780.30,
      ctr: 0.015,
      cpc_micros: 6933333,
      cost_per_conversion: 115.04,
      date_range: {
        start_date: '2024-02-01',
        end_date: '2024-02-29'
      }
    },
    {
      campaign_id: '555555',
      campaign_name: 'Shopping Campaign - Products',
      impressions: 25000,
      clicks: 1800,
      cost_micros: 12000000,
      conversions: 120.8,
      conversion_value: 24160.00,
      ctr: 0.072,
      cpc_micros: 6666667,
      cost_per_conversion: 99.34,
      date_range: {
        start_date: '2024-01-15',
        end_date: '2024-02-15'
      }
    }
  ];
}

export function generateMockInsights(): CampaignInsights[] {
  return [
    {
      campaign_id: '111111',
      campaign_name: 'Search Campaign - Brand',
      quality_score_avg: 8.2,
      search_impression_share: 0.75,
      search_lost_impression_share_budget: 0.15,
      search_lost_impression_share_rank: 0.10,
      top_keywords: [
        { keyword: 'brand name', impressions: 5000, clicks: 400, cost_micros: 3000000 },
        { keyword: 'company brand', impressions: 3500, clicks: 280, cost_micros: 2100000 },
        { keyword: 'brand products', impressions: 2800, clicks: 224, cost_micros: 1680000 }
      ],
      device_performance: [
        { device: 'DESKTOP', impressions: 7500, clicks: 600, cost_micros: 4250000 },
        { device: 'MOBILE', impressions: 6000, clicks: 480, cost_micros: 3400000 },
        { device: 'TABLET', impressions: 1500, clicks: 120, cost_micros: 850000 }
      ]
    },
    {
      campaign_id: '333333',
      campaign_name: 'Display Campaign - Awareness',
      quality_score_avg: 6.8,
      search_impression_share: 0.0,
      search_lost_impression_share_budget: 0.0,
      search_lost_impression_share_rank: 0.0,
      top_keywords: [],
      device_performance: [
        { device: 'DESKTOP', impressions: 20000, clicks: 300, cost_micros: 2080000 },
        { device: 'MOBILE', impressions: 25000, clicks: 375, cost_micros: 2600000 },
        { device: 'TABLET', impressions: 5000, clicks: 75, cost_micros: 520000 }
      ]
    },
    {
      campaign_id: '555555',
      campaign_name: 'Shopping Campaign - Products',
      quality_score_avg: 7.5,
      search_impression_share: 0.65,
      search_lost_impression_share_budget: 0.25,
      search_lost_impression_share_rank: 0.10,
      top_keywords: [
        { keyword: 'product category a', impressions: 8000, clicks: 640, cost_micros: 4800000 },
        { keyword: 'specific product b', impressions: 6500, clicks: 520, cost_micros: 3900000 },
        { keyword: 'brand product c', impressions: 5200, clicks: 416, cost_micros: 3120000 }
      ],
      device_performance: [
        { device: 'DESKTOP', impressions: 10000, clicks: 800, cost_micros: 6000000 },
        { device: 'MOBILE', impressions: 12000, clicks: 960, cost_micros: 7200000 },
        { device: 'TABLET', impressions: 3000, clicks: 240, cost_micros: 1800000 }
      ]
    }
  ];
}
