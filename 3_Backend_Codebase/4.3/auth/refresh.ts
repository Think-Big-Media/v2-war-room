import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import type { RefreshRequest, AuthResponse, User } from "./types";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken, isDataModeMock } from "./utils";
import { mockUsers } from "./mock-data";

// Refreshes an access token using a valid refresh token.
export const refresh = api<RefreshRequest, AuthResponse>(
  { expose: true, method: "POST", path: "/api/v1/auth/refresh" },
  async (req) => {
    if (!req.refresh_token) {
      throw APIError.invalidArgument("Refresh token is required");
    }

    try {
      const payload = verifyRefreshToken(req.refresh_token);

      if (isDataModeMock()) {
        // Mock mode - find user in mock data
        const user = mockUsers.find(u => u.id === payload.user_id && u.is_active);
        if (!user) {
          throw APIError.unauthenticated("User not found or inactive");
        }

        const accessToken = generateAccessToken(user.id, user.email);
        const refreshToken = generateRefreshToken(user.id, user.email);

        return {
          access_token: accessToken,
          refresh_token: refreshToken,
          user,
          expires_in: 3600
        };
      }

      // Live mode - database operations
      const user = await authDB.queryRow<User>`
        SELECT id, email, first_name, last_name, created_at, updated_at, last_login, is_active
        FROM users 
        WHERE id = ${payload.user_id} AND is_active = true
      `;

      if (!user) {
        throw APIError.unauthenticated("User not found or inactive");
      }

      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user,
        expires_in: 3600
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Token refresh failed");
    }
  }
);
