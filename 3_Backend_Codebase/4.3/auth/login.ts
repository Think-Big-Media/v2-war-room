import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import type { LoginRequest, AuthResponse, User } from "./types";
import { verifyPassword, generateAccessToken, generateRefreshToken, validateEmail, isDataModeMock } from "./utils";
import { mockUsers, mockPasswordHash } from "./mock-data";

interface UserWithPassword extends User {
  password_hash: string;
}

// Authenticates a user and returns access tokens.
export const login = api<LoginRequest, AuthResponse>(
  { expose: true, method: "POST", path: "/api/v1/auth/login" },
  async (req) => {
    // Validate input
    if (!validateEmail(req.email)) {
      throw APIError.invalidArgument("Invalid email format");
    }

    if (!req.password) {
      throw APIError.invalidArgument("Password is required");
    }

    if (isDataModeMock()) {
      // Mock mode - check credentials
      const user = mockUsers.find(u => u.email === req.email && u.is_active);
      if (!user || req.password !== "mockpassword") {
        throw APIError.unauthenticated("Invalid email or password");
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
    try {
      const userWithPassword = await authDB.queryRow<UserWithPassword>`
        SELECT id, email, password_hash, first_name, last_name, created_at, updated_at, last_login, is_active
        FROM users 
        WHERE email = ${req.email} AND is_active = true
      `;

      if (!userWithPassword) {
        throw APIError.unauthenticated("Invalid email or password");
      }

      if (!verifyPassword(req.password, userWithPassword.password_hash)) {
        throw APIError.unauthenticated("Invalid email or password");
      }

      // Update last login
      await authDB.exec`
        UPDATE users 
        SET last_login = NOW(), updated_at = NOW()
        WHERE id = ${userWithPassword.id}
      `;

      const user: User = {
        id: userWithPassword.id,
        email: userWithPassword.email,
        first_name: userWithPassword.first_name,
        last_name: userWithPassword.last_name,
        created_at: userWithPassword.created_at,
        updated_at: userWithPassword.updated_at,
        last_login: new Date(),
        is_active: userWithPassword.is_active
      };

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
      throw APIError.internal("Login failed");
    }
  }
);
