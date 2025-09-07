import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import jwt from "jsonwebtoken";

// Get JWT secret from secrets
const jwtSecret = secret("JWT_SECRET");

// Request/Response types
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
    permissions: string[];
  };
  expiresIn: number;
  timestamp: string;
}

interface ValidateTokenRequest {
  token: string;
}

interface ValidateTokenResponse {
  valid: boolean;
  user?: {
    id: string;
    username: string;
    role: string;
    permissions: string[];
  };
  error?: string;
  timestamp: string;
}

interface RefreshTokenRequest {
  token: string;
}

interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
  timestamp: string;
}

// Mock user data (replace with database in production)
const mockUsers = [
  {
    id: "user_001",
    username: "admin",
    password: "admin123", // In production, hash passwords properly
    role: "admin",
    permissions: ["read:all", "write:all", "admin:all"]
  },
  {
    id: "user_002", 
    username: "campaign_manager",
    password: "campaign123",
    role: "campaign_manager",
    permissions: ["read:campaigns", "write:campaigns", "read:analytics"]
  },
  {
    id: "user_003",
    username: "analyst",
    password: "analyst123", 
    role: "analyst",
    permissions: ["read:analytics", "read:monitoring", "read:intelligence"]
  }
];

// POST /api/v1/auth/login - authenticate user
export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/api/v1/auth/login" },
  async ({ username, password }) => {
    console.log(`Login attempt for username: ${username}`);
    
    // Find user (in production, hash and compare passwords properly)
    const user = mockUsers.find(u => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error("Invalid username or password");
    }

    const secret = await jwtSecret();
    if (!secret) {
      throw new Error("JWT secret not configured");
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions
      },
      secret,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions
      },
      expiresIn: 24 * 60 * 60, // 24 hours in seconds
      timestamp: new Date().toISOString()
    };
  }
);

// POST /api/v1/auth/validate - validate JWT token
export const validateToken = api<ValidateTokenRequest, ValidateTokenResponse>(
  { expose: true, method: "POST", path: "/api/v1/auth/validate" },
  async ({ token }) => {
    console.log("Validating JWT token...");
    
    try {
      const secret = await jwtSecret();
      if (!secret) {
        throw new Error("JWT secret not configured");
      }

      const decoded = jwt.verify(token, secret) as any;
      
      return {
        valid: true,
        user: {
          id: decoded.userId,
          username: decoded.username,
          role: decoded.role,
          permissions: decoded.permissions
        },
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        valid: false,
        error: error.message || "Invalid token",
        timestamp: new Date().toISOString()
      };
    }
  }
);

// POST /api/v1/auth/refresh - refresh JWT token
export const refreshToken = api<RefreshTokenRequest, RefreshTokenResponse>(
  { expose: true, method: "POST", path: "/api/v1/auth/refresh" },
  async ({ token }) => {
    console.log("Refreshing JWT token...");
    
    try {
      const secret = await jwtSecret();
      if (!secret) {
        throw new Error("JWT secret not configured");
      }

      // Verify current token (even if expired)
      const decoded = jwt.verify(token, secret, { ignoreExpiration: true }) as any;
      
      // Create new token
      const newToken = jwt.sign(
        {
          userId: decoded.userId,
          username: decoded.username,
          role: decoded.role,
          permissions: decoded.permissions
        },
        secret,
        { expiresIn: "24h" }
      );

      return {
        token: newToken,
        expiresIn: 24 * 60 * 60, // 24 hours in seconds
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      throw new Error("Invalid or expired token");
    }
  }
);

// GET /api/v1/auth/me - get current user info
export const getCurrentUser = api<{}, { user: any; timestamp: string }>(
  { expose: true, method: "GET", path: "/api/v1/auth/me" },
  async () => {
    console.log("Getting current user info...");
    
    // This would normally extract user from JWT token in headers
    // For now, return mock admin user
    return {
      user: {
        id: "user_001",
        username: "admin",
        role: "admin", 
        permissions: ["read:all", "write:all", "admin:all"],
        lastLogin: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };
  }
);