import { api, APIError } from "encore.dev/api";
import { authDB } from "./db";
import type { RegisterRequest, AuthResponse, User } from "./types";
import { hashPassword, generateAccessToken, generateRefreshToken, validateEmail, validatePassword, isDataModeMock } from "./utils";
import { mockUsers, mockPasswordHash } from "./mock-data";

// Registers a new user account.
export const register = api<RegisterRequest, AuthResponse>(
  { expose: true, method: "POST", path: "/api/v1/auth/register" },
  async (req) => {
    // Validate input
    if (!validateEmail(req.email)) {
      throw APIError.invalidArgument("Invalid email format");
    }
    
    if (!validatePassword(req.password)) {
      throw APIError.invalidArgument("Password must be at least 8 characters long");
    }

    if (isDataModeMock()) {
      // Mock mode - check if user already exists in mock data
      const existingUser = mockUsers.find(u => u.email === req.email);
      if (existingUser) {
        throw APIError.alreadyExists("User with this email already exists");
      }

      // Create mock user
      const newUser: User = {
        id: `mock-${Date.now()}`,
        email: req.email,
        first_name: req.first_name,
        last_name: req.last_name,
        created_at: new Date(),
        updated_at: new Date(),
        is_active: true
      };

      const accessToken = generateAccessToken(newUser.id, newUser.email);
      const refreshToken = generateRefreshToken(newUser.id, newUser.email);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: newUser,
        expires_in: 3600
      };
    }

    // Live mode - database operations
    const hashedPassword = hashPassword(req.password);

    try {
      // Check if user already exists
      const existingUser = await authDB.queryRow<{ id: string }>`
        SELECT id FROM users WHERE email = ${req.email}
      `;

      if (existingUser) {
        throw APIError.alreadyExists("User with this email already exists");
      }

      // Create new user
      const newUser = await authDB.queryRow<User>`
        INSERT INTO users (email, password_hash, first_name, last_name)
        VALUES (${req.email}, ${hashedPassword}, ${req.first_name || null}, ${req.last_name || null})
        RETURNING id, email, first_name, last_name, created_at, updated_at, last_login, is_active
      `;

      if (!newUser) {
        throw APIError.internal("Failed to create user");
      }

      const accessToken = generateAccessToken(newUser.id, newUser.email);
      const refreshToken = generateRefreshToken(newUser.id, newUser.email);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: newUser,
        expires_in: 3600
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw APIError.internal("Registration failed");
    }
  }
);
