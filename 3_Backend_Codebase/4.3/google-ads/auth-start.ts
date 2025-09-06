import { api, APIError } from "encore.dev/api";
import type { AuthStartRequest, AuthStartResponse } from "./types";
import { generateState, generateCodeVerifier, generateCodeChallenge, buildAuthUrl } from "./utils";

// Initiates the OAuth2 PKCE flow for Google Ads authorization.
export const authStart = api<AuthStartRequest, AuthStartResponse>(
  { expose: true, method: "POST", path: "/api/v1/google-ads/auth/start" },
  async (req) => {
    if (!req.user_id || !req.user_id.trim()) {
      throw APIError.invalidArgument("User ID is required");
    }

    if (!req.redirect_uri || !req.redirect_uri.trim()) {
      throw APIError.invalidArgument("Redirect URI is required");
    }

    try {
      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);

      // In a production environment, you would store the state and code_verifier
      // associated with the user_id in a temporary store (Redis, database, etc.)
      // For this example, we'll include them in the state parameter
      const stateWithData = JSON.stringify({
        state,
        user_id: req.user_id,
        code_verifier: codeVerifier
      });

      const authorizationUrl = buildAuthUrl(req.redirect_uri, stateWithData, codeChallenge);

      return {
        authorization_url: authorizationUrl,
        state: stateWithData
      };
    } catch (error) {
      console.error("OAuth start error:", error);
      throw APIError.internal("Failed to initiate OAuth flow");
    }
  }
);
