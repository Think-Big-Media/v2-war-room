import { api, APIError } from "encore.dev/api";
import { googleAdsDB } from "./db";
import type { AuthCallbackRequest, AuthCallbackResponse } from "./types";
import { exchangeCodeForTokens, isDataModeMock } from "./utils";

// Handles the OAuth2 callback and exchanges authorization code for tokens.
export const authCallback = api<AuthCallbackRequest, AuthCallbackResponse>(
  { expose: true, method: "POST", path: "/api/v1/google-ads/auth/callback" },
  async (req) => {
    if (!req.code || !req.code.trim()) {
      throw APIError.invalidArgument("Authorization code is required");
    }

    if (!req.state || !req.state.trim()) {
      throw APIError.invalidArgument("State parameter is required");
    }

    if (!req.redirect_uri || !req.redirect_uri.trim()) {
      throw APIError.invalidArgument("Redirect URI is required");
    }

    try {
      // Parse the state parameter to extract user_id and code_verifier
      const stateData = JSON.parse(req.state);
      const { user_id, code_verifier } = stateData;

      if (!user_id || !code_verifier) {
        throw APIError.invalidArgument("Invalid state parameter");
      }

      if (isDataModeMock()) {
        // In mock mode, simulate successful token storage
        const mockExpiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour from now
        
        await googleAdsDB.exec`
          INSERT INTO oauth_tokens (user_id, access_token, refresh_token, expires_at, scope)
          VALUES (${user_id}, 'mock_access_token', 'mock_refresh_token', ${mockExpiresAt}, 'https://www.googleapis.com/auth/adwords')
          ON CONFLICT (user_id) 
          DO UPDATE SET 
            access_token = 'mock_access_token',
            refresh_token = 'mock_refresh_token',
            expires_at = ${mockExpiresAt},
            scope = 'https://www.googleapis.com/auth/adwords',
            updated_at = NOW()
        `;

        return {
          success: true,
          user_id
        };
      }

      // Exchange authorization code for tokens
      const tokenData = await exchangeCodeForTokens(req.code, req.redirect_uri, code_verifier);
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

      // Store tokens in database
      await googleAdsDB.exec`
        INSERT INTO oauth_tokens (user_id, access_token, refresh_token, expires_at, scope)
        VALUES (${user_id}, ${tokenData.access_token}, ${tokenData.refresh_token || null}, ${expiresAt}, ${tokenData.scope})
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          access_token = ${tokenData.access_token},
          refresh_token = ${tokenData.refresh_token || null},
          expires_at = ${expiresAt},
          scope = ${tokenData.scope},
          updated_at = NOW()
      `;

      return {
        success: true,
        user_id
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      console.error("OAuth callback error:", error);
      throw APIError.internal("Failed to complete OAuth flow");
    }
  }
);
