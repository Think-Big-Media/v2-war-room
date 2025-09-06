// This file was bundled by Encore v1.49.3
//
// https://encore.dev

// encore.gen/internal/entrypoints/combined/main.ts
import { registerGateways, registerHandlers, run } from "encore.dev/internal/codegen/appinit";

// auth/google-oauth.ts
import { api, APIError as APIError2 } from "encore.dev/api";

// auth/db.ts
import { SQLDatabase } from "encore.dev/storage/sqldb";
var authDB = new SQLDatabase("auth", {
  migrations: "./migrations"
});

// auth/utils.ts
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { secret } from "encore.dev/config";
import { APIError } from "encore.dev/api";
var jwtSecret = secret("JWT_SECRET");
var jwtRefreshSecret = secret("JWT_REFRESH_SECRET");
var dataMode = secret("DATA_MODE");
var googleClientId = secret("GOOGLE_CLIENT_ID");
var googleClientSecret = secret("GOOGLE_CLIENT_SECRET");
var googleRedirectUri = secret("GOOGLE_REDIRECT_URI");
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1e4, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}
function verifyPassword(password, hashedPassword) {
  const [salt, hash] = hashedPassword.split(":");
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1e4, 64, "sha512").toString("hex");
  return hash === verifyHash;
}
function generateAccessToken(userId, email) {
  const payload = {
    user_id: userId,
    email,
    exp: Math.floor(Date.now() / 1e3) + 60 * 60,
    // 1 hour
    iat: Math.floor(Date.now() / 1e3)
  };
  return jwt.sign(payload, jwtSecret(), { algorithm: "HS256" });
}
function generateRefreshToken(userId, email) {
  const payload = {
    user_id: userId,
    email,
    exp: Math.floor(Date.now() / 1e3) + 60 * 60 * 24 * 30,
    // 30 days as per Cleopatra requirements
    iat: Math.floor(Date.now() / 1e3)
  };
  return jwt.sign(payload, jwtRefreshSecret(), { algorithm: "HS256" });
}
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, jwtSecret());
  } catch (error) {
    throw APIError.unauthenticated("Invalid access token");
  }
}
function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, jwtRefreshSecret());
  } catch (error) {
    throw APIError.unauthenticated("Invalid refresh token");
  }
}
function isDataModeMock() {
  return dataMode() === "MOCK";
}
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function validatePassword(password) {
  return password.length >= 8;
}
function generateGoogleOAuthUrl(state) {
  if (isDataModeMock()) {
    return "https://mock-google-oauth.example.com";
  }
  const params = new URLSearchParams({
    client_id: googleClientId(),
    redirect_uri: googleRedirectUri(),
    scope: "openid profile email",
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    ...state && { state }
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
async function exchangeGoogleAuthCode(authCode) {
  if (isDataModeMock()) {
    return {
      access_token: "mock-google-access-token",
      refresh_token: "mock-google-refresh-token",
      expires_in: 3600,
      token_type: "Bearer",
      scope: "openid profile email",
      id_token: "mock-id-token"
    };
  }
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: googleClientId(),
      client_secret: googleClientSecret(),
      code: authCode,
      grant_type: "authorization_code",
      redirect_uri: googleRedirectUri()
    })
  });
  if (!response.ok) {
    throw APIError.invalidArgument("Failed to exchange authorization code");
  }
  return await response.json();
}
async function getGoogleUserProfile(accessToken) {
  if (isDataModeMock()) {
    return {
      id: "mock-google-user-id",
      email: "user@example.com",
      verified_email: true,
      name: "Mock User",
      given_name: "Mock",
      family_name: "User",
      picture: "https://via.placeholder.com/150"
    };
  }
  const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
  if (!response.ok) {
    throw APIError.unauthenticated("Failed to fetch user profile");
  }
  return await response.json();
}
function generateRandomState() {
  return crypto.randomBytes(32).toString("hex");
}

// auth/mock-data.ts
var mockOrganizations = [
  {
    id: "mock-org-1",
    name: "War Room Demo Organization",
    created_at: /* @__PURE__ */ new Date("2024-01-01T00:00:00Z"),
    updated_at: /* @__PURE__ */ new Date("2024-01-01T00:00:00Z")
  }
];
var mockUsers = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "admin@warroom.com",
    first_name: "War Room",
    last_name: "Admin",
    org_id: "mock-org-1",
    role: "admin",
    created_at: /* @__PURE__ */ new Date("2024-01-01T00:00:00Z"),
    updated_at: /* @__PURE__ */ new Date("2024-01-01T00:00:00Z"),
    last_login: /* @__PURE__ */ new Date("2024-01-15T10:30:00Z"),
    is_active: true
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "user@warroom.com",
    first_name: "Test",
    last_name: "User",
    org_id: "mock-org-1",
    role: "analyst",
    created_at: /* @__PURE__ */ new Date("2024-01-02T00:00:00Z"),
    updated_at: /* @__PURE__ */ new Date("2024-01-02T00:00:00Z"),
    last_login: /* @__PURE__ */ new Date("2024-01-14T15:45:00Z"),
    is_active: true
  }
];
function findOrganizationById(id) {
  return mockOrganizations.find((org) => org.id === id);
}
function findOrganizationByName(name) {
  return mockOrganizations.find((org) => org.name === name);
}
function createMockOrganization(name) {
  const newOrg = {
    id: `mock-org-${Date.now()}`,
    name,
    created_at: /* @__PURE__ */ new Date(),
    updated_at: /* @__PURE__ */ new Date()
  };
  mockOrganizations.push(newOrg);
  return newOrg;
}

// auth/google-oauth.ts
var googleLogin = api(
  { expose: true, method: "GET", path: "/api/v1/auth/google/login" },
  async () => {
    const state = generateRandomState();
    const redirectUrl = generateGoogleOAuthUrl(state);
    return {
      redirect_url: redirectUrl,
      state
    };
  }
);
var googleCallback = api(
  { expose: true, method: "POST", path: "/api/v1/auth/google/callback" },
  async (req) => {
    if (!req.auth_code) {
      throw APIError2.invalidArgument("Authorization code is required");
    }
    try {
      const tokenResponse = await exchangeGoogleAuthCode(req.auth_code);
      const googleProfile = await getGoogleUserProfile(tokenResponse.access_token);
      if (!googleProfile.email || !googleProfile.verified_email) {
        throw APIError2.invalidArgument("Email verification required");
      }
      if (isDataModeMock()) {
        let user2 = mockUsers.find((u) => u.email === googleProfile.email);
        if (!user2) {
          const defaultOrg = mockOrganizations[0];
          user2 = {
            id: `google-mock-${Date.now()}`,
            email: googleProfile.email,
            first_name: googleProfile.given_name,
            last_name: googleProfile.family_name,
            org_id: defaultOrg.id,
            role: "viewer",
            // Default role for OAuth users
            created_at: /* @__PURE__ */ new Date(),
            updated_at: /* @__PURE__ */ new Date(),
            is_active: true
          };
          mockUsers.push(user2);
        }
        const organization2 = findOrganizationById(user2.org_id) || mockOrganizations[0];
        const accessToken2 = generateAccessToken(user2.id, user2.email);
        const refreshToken2 = generateRefreshToken(user2.id, user2.email);
        return {
          access_token: accessToken2,
          refresh_token: refreshToken2,
          user: user2,
          organization: organization2,
          expires_in: 3600
        };
      }
      let user;
      user = await authDB.queryRow`
        SELECT id, email, first_name, last_name, org_id, role, created_at, updated_at, last_login, is_active
        FROM users 
        WHERE email = ${googleProfile.email}
      `;
      let organization;
      if (!user) {
        let defaultOrg = await authDB.queryRow`
          SELECT id, name, created_at, updated_at FROM organizations WHERE name = 'Default Organization'
        `;
        if (!defaultOrg) {
          defaultOrg = await authDB.queryRow`
            INSERT INTO organizations (name)
            VALUES ('Default Organization')
            RETURNING id, name, created_at, updated_at
          `;
        }
        if (!defaultOrg) {
          throw APIError2.internal("Failed to create default organization");
        }
        organization = defaultOrg;
        user = await authDB.queryRow`
          INSERT INTO users (email, first_name, last_name, org_id, role, is_active)
          VALUES (${googleProfile.email}, ${googleProfile.given_name || null}, ${googleProfile.family_name || null}, ${organization.id}, 'viewer', true)
          RETURNING id, email, first_name, last_name, org_id, role, created_at, updated_at, last_login, is_active
        `;
        if (!user) {
          throw APIError2.internal("Failed to create user from Google profile");
        }
      } else {
        const existingOrg = await authDB.queryRow`
          SELECT id, name, created_at, updated_at FROM organizations WHERE id = ${user.org_id}
        `;
        if (!existingOrg) {
          throw APIError2.internal("User's organization not found");
        }
        organization = existingOrg;
        await authDB.exec`
          UPDATE users 
          SET last_login = NOW(), updated_at = NOW()
          WHERE id = ${user.id}
        `;
      }
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user,
        organization,
        expires_in: 3600
      };
    } catch (error) {
      if (error instanceof APIError2) {
        throw error;
      }
      console.error("Google OAuth callback error:", error);
      throw APIError2.internal("OAuth authentication failed");
    }
  }
);

// auth/login.ts
import { api as api2, APIError as APIError3 } from "encore.dev/api";
var login = api2(
  { expose: true, method: "POST", path: "/api/v1/auth/login" },
  async (req) => {
    if (!validateEmail(req.email)) {
      throw APIError3.invalidArgument("Invalid email format");
    }
    if (!req.password) {
      throw APIError3.invalidArgument("Password is required");
    }
    if (isDataModeMock()) {
      const user = mockUsers.find((u) => u.email === req.email && u.is_active);
      if (!user || req.password !== "mockpassword") {
        throw APIError3.unauthenticated("Invalid email or password");
      }
      const organization = findOrganizationById(user.org_id);
      if (!organization) {
        throw APIError3.internal("User's organization not found");
      }
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user,
        organization,
        expires_in: 3600
      };
    }
    try {
      const userWithPassword = await authDB.queryRow`
        SELECT id, email, password_hash, first_name, last_name, org_id, role, created_at, updated_at, last_login, is_active
        FROM users 
        WHERE email = ${req.email} AND is_active = true
      `;
      if (!userWithPassword) {
        throw APIError3.unauthenticated("Invalid email or password");
      }
      if (!verifyPassword(req.password, userWithPassword.password_hash)) {
        throw APIError3.unauthenticated("Invalid email or password");
      }
      await authDB.exec`
        UPDATE users 
        SET last_login = NOW(), updated_at = NOW()
        WHERE id = ${userWithPassword.id}
      `;
      const organization = await authDB.queryRow`
        SELECT id, name, created_at, updated_at FROM organizations WHERE id = ${userWithPassword.org_id}
      `;
      if (!organization) {
        throw APIError3.internal("User's organization not found");
      }
      const user = {
        id: userWithPassword.id,
        email: userWithPassword.email,
        first_name: userWithPassword.first_name,
        last_name: userWithPassword.last_name,
        org_id: userWithPassword.org_id,
        role: userWithPassword.role,
        created_at: userWithPassword.created_at,
        updated_at: userWithPassword.updated_at,
        last_login: /* @__PURE__ */ new Date(),
        is_active: userWithPassword.is_active
      };
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user,
        organization,
        expires_in: 3600
      };
    } catch (error) {
      if (error instanceof APIError3) {
        throw error;
      }
      throw APIError3.internal("Login failed");
    }
  }
);

// auth/refresh.ts
import { api as api3, APIError as APIError4 } from "encore.dev/api";
var refresh = api3(
  { expose: true, method: "POST", path: "/api/v1/auth/refresh" },
  async (req) => {
    if (!req.refresh_token) {
      throw APIError4.invalidArgument("Refresh token is required");
    }
    try {
      const payload = verifyRefreshToken(req.refresh_token);
      if (isDataModeMock()) {
        const user2 = mockUsers.find((u) => u.id === payload.user_id && u.is_active);
        if (!user2) {
          throw APIError4.unauthenticated("User not found or inactive");
        }
        const organization2 = findOrganizationById(user2.org_id);
        if (!organization2) {
          throw APIError4.internal("User's organization not found");
        }
        const accessToken2 = generateAccessToken(user2.id, user2.email);
        const refreshToken2 = generateRefreshToken(user2.id, user2.email);
        return {
          access_token: accessToken2,
          refresh_token: refreshToken2,
          user: user2,
          organization: organization2,
          expires_in: 3600
        };
      }
      const user = await authDB.queryRow`
        SELECT id, email, first_name, last_name, org_id, role, created_at, updated_at, last_login, is_active
        FROM users 
        WHERE id = ${payload.user_id} AND is_active = true
      `;
      if (!user) {
        throw APIError4.unauthenticated("User not found or inactive");
      }
      const organization = await authDB.queryRow`
        SELECT id, name, created_at, updated_at FROM organizations WHERE id = ${user.org_id}
      `;
      if (!organization) {
        throw APIError4.internal("User's organization not found");
      }
      const accessToken = generateAccessToken(user.id, user.email);
      const refreshToken = generateRefreshToken(user.id, user.email);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user,
        organization,
        expires_in: 3600
      };
    } catch (error) {
      if (error instanceof APIError4) {
        throw error;
      }
      throw APIError4.internal("Token refresh failed");
    }
  }
);

// auth/register.ts
import { api as api4, APIError as APIError5 } from "encore.dev/api";
var register = api4(
  { expose: true, method: "POST", path: "/api/v1/auth/register" },
  async (req) => {
    if (!validateEmail(req.email)) {
      throw APIError5.invalidArgument("Invalid email format");
    }
    if (!validatePassword(req.password)) {
      throw APIError5.invalidArgument("Password must be at least 8 characters long");
    }
    if (isDataModeMock()) {
      const existingUser = mockUsers.find((u) => u.email === req.email);
      if (existingUser) {
        throw APIError5.alreadyExists("User with this email already exists");
      }
      let organization;
      if (req.organization_name) {
        const existingOrg = findOrganizationByName(req.organization_name);
        organization = existingOrg || createMockOrganization(req.organization_name);
      } else {
        organization = mockOrganizations[0];
      }
      const newUser = {
        id: `mock-${Date.now()}`,
        email: req.email,
        first_name: req.first_name,
        last_name: req.last_name,
        org_id: organization.id,
        role: req.user_role || "viewer",
        created_at: /* @__PURE__ */ new Date(),
        updated_at: /* @__PURE__ */ new Date(),
        is_active: true
      };
      mockUsers.push(newUser);
      const accessToken = generateAccessToken(newUser.id, newUser.email);
      const refreshToken = generateRefreshToken(newUser.id, newUser.email);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: newUser,
        organization,
        expires_in: 3600
      };
    }
    const hashedPassword = hashPassword(req.password);
    const userRole = req.user_role || "viewer";
    try {
      const existingUser = await authDB.queryRow`
        SELECT id FROM users WHERE email = ${req.email}
      `;
      if (existingUser) {
        throw APIError5.alreadyExists("User with this email already exists");
      }
      let organization;
      if (req.organization_name) {
        const existingOrg = await authDB.queryRow`
          SELECT id, name, created_at, updated_at FROM organizations WHERE name = ${req.organization_name}
        `;
        if (existingOrg) {
          organization = existingOrg;
        } else {
          const newOrg = await authDB.queryRow`
            INSERT INTO organizations (name)
            VALUES (${req.organization_name})
            RETURNING id, name, created_at, updated_at
          `;
          if (!newOrg) {
            throw APIError5.internal("Failed to create organization");
          }
          organization = newOrg;
        }
      } else {
        let defaultOrg = await authDB.queryRow`
          SELECT id, name, created_at, updated_at FROM organizations WHERE name = 'Default Organization'
        `;
        if (!defaultOrg) {
          defaultOrg = await authDB.queryRow`
            INSERT INTO organizations (name)
            VALUES ('Default Organization')
            RETURNING id, name, created_at, updated_at
          `;
        }
        if (!defaultOrg) {
          throw APIError5.internal("Failed to create default organization");
        }
        organization = defaultOrg;
      }
      const newUser = await authDB.queryRow`
        INSERT INTO users (email, password_hash, first_name, last_name, org_id, role)
        VALUES (${req.email}, ${hashedPassword}, ${req.first_name || null}, ${req.last_name || null}, ${organization.id}, ${userRole})
        RETURNING id, email, first_name, last_name, org_id, role, created_at, updated_at, last_login, is_active
      `;
      if (!newUser) {
        throw APIError5.internal("Failed to create user");
      }
      const accessToken = generateAccessToken(newUser.id, newUser.email);
      const refreshToken = generateRefreshToken(newUser.id, newUser.email);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: newUser,
        organization,
        expires_in: 3600
      };
    } catch (error) {
      if (error instanceof APIError5) {
        throw error;
      }
      throw APIError5.internal("Registration failed");
    }
  }
);

// auth/session.ts
import { api as api5, APIError as APIError6 } from "encore.dev/api";
import { Header } from "encore.dev/api";
var getCurrentUser = api5(
  { expose: true, method: "GET", path: "/api/v1/auth/me" },
  async (req) => {
    const authHeader = Header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw APIError6.unauthenticated("Authorization header required");
    }
    const token = authHeader.substring(7);
    try {
      const payload = verifyAccessToken(token);
      if (isDataModeMock()) {
        const user2 = mockUsers.find((u) => u.id === payload.user_id);
        if (!user2) {
          throw APIError6.unauthenticated("User not found");
        }
        const organization2 = findOrganizationById(user2.org_id);
        if (!organization2) {
          throw APIError6.internal("User's organization not found");
        }
        return { user: user2, organization: organization2 };
      }
      const user = await authDB.queryRow`
        SELECT id, email, first_name, last_name, org_id, role, created_at, updated_at, last_login, is_active
        FROM users 
        WHERE id = ${payload.user_id} AND is_active = true
      `;
      if (!user) {
        throw APIError6.unauthenticated("User not found or inactive");
      }
      const organization = await authDB.queryRow`
        SELECT id, name, created_at, updated_at FROM organizations WHERE id = ${user.org_id}
      `;
      if (!organization) {
        throw APIError6.internal("User's organization not found");
      }
      return { user, organization };
    } catch (error) {
      if (error instanceof APIError6) {
        throw error;
      }
      console.error("Session validation error:", error);
      throw APIError6.unauthenticated("Invalid session");
    }
  }
);
var logout = api5(
  { expose: true, method: "POST", path: "/api/v1/auth/logout" },
  async () => {
    return { success: true };
  }
);

// chat/get-history.ts
import { api as api6, APIError as APIError7 } from "encore.dev/api";

// chat/db.ts
import { SQLDatabase as SQLDatabase2 } from "encore.dev/storage/sqldb";
var chatDB = new SQLDatabase2("chat", {
  migrations: "./migrations"
});

// chat/get-history.ts
var getHistory = api6(
  { expose: true, method: "GET", path: "/api/v1/chat/history/:session_id" },
  async (params) => {
    if (!params.session_id || !params.session_id.trim()) {
      throw APIError7.invalidArgument("Session ID is required");
    }
    try {
      const messages = await chatDB.queryAll`
        SELECT id, session_id, content, role, created_at
        FROM chat_messages
        WHERE session_id = ${params.session_id}
        ORDER BY created_at ASC
      `;
      return {
        messages
      };
    } catch (error) {
      console.error("Get history error:", error);
      throw APIError7.internal("Failed to retrieve chat history");
    }
  }
);

// chat/send-message.ts
import { api as api7, APIError as APIError9 } from "encore.dev/api";

// chat/utils.ts
import { secret as secret2 } from "encore.dev/config";
import { APIError as APIError8 } from "encore.dev/api";
var openaiApiKey = secret2("OPENAI_API_KEY");
var dataMode2 = secret2("DATA_MODE");
function isDataModeMock2() {
  return dataMode2() === "MOCK";
}
async function callOpenAI(messages) {
  if (isDataModeMock2()) {
    return generateMockResponse(messages);
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey()}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages,
        max_tokens: 1e3,
        temperature: 0.7
      })
    });
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response at this time.";
  } catch (error) {
    console.error("OpenAI API call failed:", error);
    throw APIError8.internal("Failed to generate AI response");
  }
}
function generateMockResponse(messages) {
  const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content || "";
  if (lastUserMessage.toLowerCase().includes("hello") || lastUserMessage.toLowerCase().includes("hi")) {
    return "[MOCK MODE] Hello! I'm your AI assistant. I'm currently running in mock mode, so this is a test response. How can I help you today?";
  }
  if (lastUserMessage.toLowerCase().includes("weather")) {
    return "[MOCK MODE] I'd be happy to help with weather information! In mock mode, I can tell you it's a beautiful sunny day with 72°F. Remember, this is test data.";
  }
  if (lastUserMessage.toLowerCase().includes("help")) {
    return "[MOCK MODE] I'm here to assist you! This is a mock response demonstrating the chat functionality. In live mode, I would provide real AI-powered assistance.";
  }
  return `[MOCK MODE] Thank you for your message: "${lastUserMessage}". This is a mock AI response demonstrating the chat system functionality. In live mode, you would receive a real AI-generated response.`;
}

// chat/send-message.ts
var sendMessage = api7(
  { expose: true, method: "POST", path: "/api/v1/chat/message" },
  async (req) => {
    if (!req.session_id || !req.session_id.trim()) {
      throw APIError9.invalidArgument("Session ID is required");
    }
    if (!req.content || !req.content.trim()) {
      throw APIError9.invalidArgument("Message content is required");
    }
    try {
      const userMessage = await chatDB.queryRow`
        INSERT INTO chat_messages (session_id, content, role)
        VALUES (${req.session_id}, ${req.content}, 'user')
        RETURNING id, session_id, content, role, created_at
      `;
      if (!userMessage) {
        throw APIError9.internal("Failed to save user message");
      }
      const recentMessages = await chatDB.queryAll`
        SELECT id, session_id, content, role, created_at
        FROM chat_messages
        WHERE session_id = ${req.session_id}
        ORDER BY created_at DESC
        LIMIT 10
      `;
      const conversationHistory = recentMessages.reverse().map((msg) => ({
        role: msg.role,
        content: msg.content
      }));
      const messages = [
        {
          role: "system",
          content: "You are a helpful AI assistant in the War Room V2 chat system. Provide helpful, accurate, and engaging responses to user questions."
        },
        ...conversationHistory
      ];
      const aiResponseContent = await callOpenAI(messages);
      const aiMessage = await chatDB.queryRow`
        INSERT INTO chat_messages (session_id, content, role)
        VALUES (${req.session_id}, ${aiResponseContent}, 'assistant')
        RETURNING id, session_id, content, role, created_at
      `;
      if (!aiMessage) {
        throw APIError9.internal("Failed to save AI response");
      }
      return {
        message: userMessage,
        ai_response: aiMessage
      };
    } catch (error) {
      if (error instanceof APIError9) {
        throw error;
      }
      console.error("Send message error:", error);
      throw APIError9.internal("Failed to process message");
    }
  }
);

// google-ads/auth-callback.ts
import { api as api8, APIError as APIError11 } from "encore.dev/api";

// google-ads/db.ts
import { SQLDatabase as SQLDatabase3 } from "encore.dev/storage/sqldb";
var googleAdsDB = new SQLDatabase3("google_ads", {
  migrations: "./migrations"
});

// google-ads/utils.ts
import { secret as secret3 } from "encore.dev/config";
import { APIError as APIError10 } from "encore.dev/api";
import * as crypto2 from "crypto";
var googleAdsClientId = secret3("GOOGLE_ADS_CLIENT_ID");
var googleAdsClientSecret = secret3("GOOGLE_ADS_CLIENT_SECRET");
var dataMode3 = secret3("DATA_MODE");
function isDataModeMock3() {
  return dataMode3() === "MOCK";
}
function generateState() {
  return crypto2.randomBytes(32).toString("hex");
}
function generateCodeVerifier() {
  return crypto2.randomBytes(32).toString("base64url");
}
function generateCodeChallenge(verifier) {
  return crypto2.createHash("sha256").update(verifier).digest("base64url");
}
function buildAuthUrl(redirectUri, state, codeChallenge) {
  const params = new URLSearchParams({
    client_id: googleAdsClientId(),
    redirect_uri: redirectUri,
    scope: "https://www.googleapis.com/auth/adwords",
    response_type: "code",
    state,
    access_type: "offline",
    prompt: "consent",
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
async function exchangeCodeForTokens(code, redirectUri, codeVerifier) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: googleAdsClientId(),
      client_secret: googleAdsClientSecret(),
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    })
  });
  if (!response.ok) {
    throw APIError10.internal(`OAuth token exchange failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}
async function refreshAccessToken(refreshToken) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      client_id: googleAdsClientId(),
      client_secret: googleAdsClientSecret(),
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
  });
  if (!response.ok) {
    throw APIError10.internal(`Token refresh failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}
async function getValidAccessToken(userId) {
  if (isDataModeMock3()) {
    return "mock_access_token";
  }
  const token = await googleAdsDB.queryRow`
    SELECT * FROM oauth_tokens 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  if (!token) {
    throw APIError10.unauthenticated("No Google Ads authorization found. Please authorize first.");
  }
  if (/* @__PURE__ */ new Date() >= token.expires_at) {
    if (!token.refresh_token) {
      throw APIError10.unauthenticated("Access token expired and no refresh token available. Please re-authorize.");
    }
    const refreshedData = await refreshAccessToken(token.refresh_token);
    const newExpiresAt = new Date(Date.now() + refreshedData.expires_in * 1e3);
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
async function makeGoogleAdsApiCall(accessToken, customerId, query) {
  if (isDataModeMock3()) {
    return getMockApiResponse(query);
  }
  const response = await fetch(`https://googleads.googleapis.com/v16/customers/${customerId}/googleAds:searchStream`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN || ""
    },
    body: JSON.stringify({
      query,
      summaryRowSetting: "WITH_SUMMARY_ROW"
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw APIError10.internal(`Google Ads API call failed: ${response.status} ${errorText}`);
  }
  return response.json();
}
function getMockApiResponse(query) {
  if (query.includes("campaign.")) {
    return {
      results: [
        {
          campaign: {
            resourceName: "customers/1234567890/campaigns/111111",
            id: "111111",
            name: "Search Campaign - Brand",
            status: "ENABLED",
            advertisingChannelType: "SEARCH",
            startDate: "2024-01-01",
            campaignBudget: "customers/1234567890/campaignBudgets/222222"
          },
          campaignBudget: {
            amountMicros: "50000000",
            currencyCode: "USD"
          }
        },
        {
          campaign: {
            resourceName: "customers/1234567890/campaigns/333333",
            id: "333333",
            name: "Display Campaign - Awareness",
            status: "ENABLED",
            advertisingChannelType: "DISPLAY",
            startDate: "2024-02-01",
            campaignBudget: "customers/1234567890/campaignBudgets/444444"
          },
          campaignBudget: {
            amountMicros: "30000000",
            currencyCode: "USD"
          }
        }
      ]
    };
  }
  if (query.includes("metrics.")) {
    return {
      results: [
        {
          campaign: {
            id: "111111",
            name: "Search Campaign - Brand"
          },
          metrics: {
            impressions: "15000",
            clicks: "1200",
            costMicros: "8500000",
            conversions: 85.5,
            conversionValue: 12750.5,
            ctr: 0.08,
            averageCpc: "7083333"
          }
        },
        {
          campaign: {
            id: "333333",
            name: "Display Campaign - Awareness"
          },
          metrics: {
            impressions: "50000",
            clicks: "750",
            costMicros: "5200000",
            conversions: 45.2,
            conversionValue: 6780.3,
            ctr: 0.015,
            averageCpc: "6933333"
          }
        }
      ]
    };
  }
  return { results: [] };
}
async function getCachedData(cacheKey) {
  const cached = await googleAdsDB.queryRow`
    SELECT data FROM performance_cache 
    WHERE cache_key = ${cacheKey} AND expires_at > NOW()
  `;
  return cached?.data || null;
}
async function setCachedData(cacheKey, data, ttlMinutes = 15) {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1e3);
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
function generateMockCampaigns() {
  return [
    {
      id: "111111",
      name: "Search Campaign - Brand",
      status: "ENABLED",
      budget_amount_micros: 5e7,
      currency_code: "USD",
      start_date: "2024-01-01",
      advertising_channel_type: "SEARCH",
      created_at: /* @__PURE__ */ new Date("2024-01-01T00:00:00Z")
    },
    {
      id: "333333",
      name: "Display Campaign - Awareness",
      status: "ENABLED",
      budget_amount_micros: 3e7,
      currency_code: "USD",
      start_date: "2024-02-01",
      advertising_channel_type: "DISPLAY",
      created_at: /* @__PURE__ */ new Date("2024-02-01T00:00:00Z")
    },
    {
      id: "555555",
      name: "Shopping Campaign - Products",
      status: "PAUSED",
      budget_amount_micros: 75e6,
      currency_code: "USD",
      start_date: "2024-01-15",
      end_date: "2024-12-31",
      advertising_channel_type: "SHOPPING",
      created_at: /* @__PURE__ */ new Date("2024-01-15T00:00:00Z")
    }
  ];
}
function generateMockPerformanceMetrics() {
  return [
    {
      campaign_id: "111111",
      campaign_name: "Search Campaign - Brand",
      impressions: 15e3,
      clicks: 1200,
      cost_micros: 85e5,
      conversions: 85.5,
      conversion_value: 12750.5,
      ctr: 0.08,
      cpc_micros: 7083333,
      cost_per_conversion: 99.42,
      date_range: {
        start_date: "2024-01-01",
        end_date: "2024-01-31"
      }
    },
    {
      campaign_id: "333333",
      campaign_name: "Display Campaign - Awareness",
      impressions: 5e4,
      clicks: 750,
      cost_micros: 52e5,
      conversions: 45.2,
      conversion_value: 6780.3,
      ctr: 0.015,
      cpc_micros: 6933333,
      cost_per_conversion: 115.04,
      date_range: {
        start_date: "2024-02-01",
        end_date: "2024-02-29"
      }
    },
    {
      campaign_id: "555555",
      campaign_name: "Shopping Campaign - Products",
      impressions: 25e3,
      clicks: 1800,
      cost_micros: 12e6,
      conversions: 120.8,
      conversion_value: 24160,
      ctr: 0.072,
      cpc_micros: 6666667,
      cost_per_conversion: 99.34,
      date_range: {
        start_date: "2024-01-15",
        end_date: "2024-02-15"
      }
    }
  ];
}
function generateMockInsights() {
  return [
    {
      campaign_id: "111111",
      campaign_name: "Search Campaign - Brand",
      quality_score_avg: 8.2,
      search_impression_share: 0.75,
      search_lost_impression_share_budget: 0.15,
      search_lost_impression_share_rank: 0.1,
      top_keywords: [
        { keyword: "brand name", impressions: 5e3, clicks: 400, cost_micros: 3e6 },
        { keyword: "company brand", impressions: 3500, clicks: 280, cost_micros: 21e5 },
        { keyword: "brand products", impressions: 2800, clicks: 224, cost_micros: 168e4 }
      ],
      device_performance: [
        { device: "DESKTOP", impressions: 7500, clicks: 600, cost_micros: 425e4 },
        { device: "MOBILE", impressions: 6e3, clicks: 480, cost_micros: 34e5 },
        { device: "TABLET", impressions: 1500, clicks: 120, cost_micros: 85e4 }
      ]
    },
    {
      campaign_id: "333333",
      campaign_name: "Display Campaign - Awareness",
      quality_score_avg: 6.8,
      search_impression_share: 0,
      search_lost_impression_share_budget: 0,
      search_lost_impression_share_rank: 0,
      top_keywords: [],
      device_performance: [
        { device: "DESKTOP", impressions: 2e4, clicks: 300, cost_micros: 208e4 },
        { device: "MOBILE", impressions: 25e3, clicks: 375, cost_micros: 26e5 },
        { device: "TABLET", impressions: 5e3, clicks: 75, cost_micros: 52e4 }
      ]
    },
    {
      campaign_id: "555555",
      campaign_name: "Shopping Campaign - Products",
      quality_score_avg: 7.5,
      search_impression_share: 0.65,
      search_lost_impression_share_budget: 0.25,
      search_lost_impression_share_rank: 0.1,
      top_keywords: [
        { keyword: "product category a", impressions: 8e3, clicks: 640, cost_micros: 48e5 },
        { keyword: "specific product b", impressions: 6500, clicks: 520, cost_micros: 39e5 },
        { keyword: "brand product c", impressions: 5200, clicks: 416, cost_micros: 312e4 }
      ],
      device_performance: [
        { device: "DESKTOP", impressions: 1e4, clicks: 800, cost_micros: 6e6 },
        { device: "MOBILE", impressions: 12e3, clicks: 960, cost_micros: 72e5 },
        { device: "TABLET", impressions: 3e3, clicks: 240, cost_micros: 18e5 }
      ]
    }
  ];
}

// google-ads/auth-callback.ts
var authCallback = api8(
  { expose: true, method: "POST", path: "/api/v1/google-ads/auth/callback" },
  async (req) => {
    if (!req.code || !req.code.trim()) {
      throw APIError11.invalidArgument("Authorization code is required");
    }
    if (!req.state || !req.state.trim()) {
      throw APIError11.invalidArgument("State parameter is required");
    }
    if (!req.redirect_uri || !req.redirect_uri.trim()) {
      throw APIError11.invalidArgument("Redirect URI is required");
    }
    try {
      const stateData = JSON.parse(req.state);
      const { user_id, code_verifier } = stateData;
      if (!user_id || !code_verifier) {
        throw APIError11.invalidArgument("Invalid state parameter");
      }
      if (isDataModeMock3()) {
        const mockExpiresAt = new Date(Date.now() + 3600 * 1e3);
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
      const tokenData = await exchangeCodeForTokens(req.code, req.redirect_uri, code_verifier);
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1e3);
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
      if (error instanceof APIError11) {
        throw error;
      }
      console.error("OAuth callback error:", error);
      throw APIError11.internal("Failed to complete OAuth flow");
    }
  }
);

// google-ads/auth-start.ts
import { api as api9, APIError as APIError12 } from "encore.dev/api";
var authStart = api9(
  { expose: true, method: "POST", path: "/api/v1/google-ads/auth/start" },
  async (req) => {
    if (!req.user_id || !req.user_id.trim()) {
      throw APIError12.invalidArgument("User ID is required");
    }
    if (!req.redirect_uri || !req.redirect_uri.trim()) {
      throw APIError12.invalidArgument("Redirect URI is required");
    }
    try {
      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);
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
      throw APIError12.internal("Failed to initiate OAuth flow");
    }
  }
);

// google-ads/get-insights.ts
import { api as api10, APIError as APIError13 } from "encore.dev/api";
var getInsights = api10(
  { expose: true, method: "GET", path: "/api/v1/google-ads/insights" },
  async (params) => {
    if (!params.user_id) {
      throw APIError13.invalidArgument("User ID is required");
    }
    try {
      const campaignIds = params.campaign_ids ? params.campaign_ids.split(",") : [];
      if (isDataModeMock3()) {
        const mockInsights = generateMockInsights();
        const filteredInsights = campaignIds.length > 0 ? mockInsights.filter((i) => campaignIds.includes(i.campaign_id)) : mockInsights;
        return {
          insights: filteredInsights
        };
      }
      if (!params.customer_id) {
        throw APIError13.invalidArgument("Customer ID is required for live mode");
      }
      const cacheKey = `insights_${params.customer_id}_${campaignIds.join(",")}`;
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      const accessToken = await getValidAccessToken(params.user_id);
      let campaignFilter = "";
      if (campaignIds.length > 0) {
        const campaignList = campaignIds.map((id) => `'${id}'`).join(",");
        campaignFilter = `AND campaign.id IN (${campaignList})`;
      }
      const qualityScoreQuery = `
        SELECT 
          campaign.id,
          campaign.name,
          metrics.quality_score,
          metrics.search_impression_share,
          metrics.search_lost_impression_share_budget,
          metrics.search_lost_impression_share_rank
        FROM campaign 
        WHERE campaign.status != 'REMOVED'
        ${campaignFilter}
        ORDER BY campaign.name
      `;
      const keywordQuery = `
        SELECT 
          campaign.id,
          campaign.name,
          ad_group_criterion.keyword.text,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros
        FROM keyword_view 
        WHERE campaign.status != 'REMOVED'
        ${campaignFilter}
        ORDER BY metrics.impressions DESC
        LIMIT 100
      `;
      const deviceQuery = `
        SELECT 
          campaign.id,
          campaign.name,
          segments.device,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros
        FROM campaign 
        WHERE campaign.status != 'REMOVED'
        ${campaignFilter}
        ORDER BY campaign.name, segments.device
      `;
      const [qualityResponse, keywordResponse, deviceResponse] = await Promise.all([
        makeGoogleAdsApiCall(accessToken, params.customer_id, qualityScoreQuery),
        makeGoogleAdsApiCall(accessToken, params.customer_id, keywordQuery),
        makeGoogleAdsApiCall(accessToken, params.customer_id, deviceQuery)
      ]);
      const insights = qualityResponse.results.map((result) => {
        const campaignId = result.campaign.id;
        const campaignKeywords = keywordResponse.results.filter((kw) => kw.campaign.id === campaignId).slice(0, 10).map((kw) => ({
          keyword: kw.adGroupCriterion?.keyword?.text || "N/A",
          impressions: parseInt(kw.metrics?.impressions || "0"),
          clicks: parseInt(kw.metrics?.clicks || "0"),
          cost_micros: parseInt(kw.metrics?.costMicros || "0")
        }));
        const campaignDevices = deviceResponse.results.filter((dev) => dev.campaign.id === campaignId).map((dev) => ({
          device: dev.segments?.device || "UNKNOWN",
          impressions: parseInt(dev.metrics?.impressions || "0"),
          clicks: parseInt(dev.metrics?.clicks || "0"),
          cost_micros: parseInt(dev.metrics?.costMicros || "0")
        }));
        return {
          campaign_id: campaignId,
          campaign_name: result.campaign.name,
          quality_score_avg: parseFloat(result.metrics?.qualityScore || "0"),
          search_impression_share: parseFloat(result.metrics?.searchImpressionShare || "0"),
          search_lost_impression_share_budget: parseFloat(result.metrics?.searchLostImpressionShareBudget || "0"),
          search_lost_impression_share_rank: parseFloat(result.metrics?.searchLostImpressionShareRank || "0"),
          top_keywords: campaignKeywords,
          device_performance: campaignDevices
        };
      });
      const responseData = {
        insights
      };
      await setCachedData(cacheKey, responseData, 15);
      return responseData;
    } catch (error) {
      if (error instanceof APIError13) {
        throw error;
      }
      console.error("Get insights error:", error);
      throw APIError13.internal("Failed to retrieve campaign insights");
    }
  }
);

// google-ads/get-performance.ts
import { api as api11, APIError as APIError14 } from "encore.dev/api";
var getPerformance = api11(
  { expose: true, method: "GET", path: "/api/v1/google-ads/performance" },
  async (params) => {
    if (!params.user_id) {
      throw APIError14.invalidArgument("User ID is required");
    }
    try {
      const startDate = params.start_date || "2024-01-01";
      const endDate = params.end_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const campaignIds = params.campaign_ids ? params.campaign_ids.split(",") : [];
      if (isDataModeMock3()) {
        const mockMetrics = generateMockPerformanceMetrics();
        const filteredMetrics = campaignIds.length > 0 ? mockMetrics.filter((m) => campaignIds.includes(m.campaign_id)) : mockMetrics;
        const summary2 = calculateSummary(filteredMetrics);
        return {
          metrics: filteredMetrics,
          summary: summary2
        };
      }
      if (!params.customer_id) {
        throw APIError14.invalidArgument("Customer ID is required for live mode");
      }
      const cacheKey = `performance_${params.customer_id}_${startDate}_${endDate}_${campaignIds.join(",")}`;
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      const accessToken = await getValidAccessToken(params.user_id);
      let campaignFilter = "";
      if (campaignIds.length > 0) {
        const campaignList = campaignIds.map((id) => `'${id}'`).join(",");
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
      const metrics = response.results.map((result) => ({
        campaign_id: result.campaign.id,
        campaign_name: result.campaign.name,
        impressions: parseInt(result.metrics.impressions || "0"),
        clicks: parseInt(result.metrics.clicks || "0"),
        cost_micros: parseInt(result.metrics.costMicros || "0"),
        conversions: parseFloat(result.metrics.conversions || "0"),
        conversion_value: parseFloat(result.metrics.conversionsValue || "0"),
        ctr: parseFloat(result.metrics.ctr || "0"),
        cpc_micros: parseInt(result.metrics.averageCpc || "0"),
        cost_per_conversion: result.metrics.conversions > 0 ? parseInt(result.metrics.costMicros || "0") / 1e6 / parseFloat(result.metrics.conversions) : 0,
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
      await setCachedData(cacheKey, responseData, 15);
      return responseData;
    } catch (error) {
      if (error instanceof APIError14) {
        throw error;
      }
      console.error("Get performance error:", error);
      throw APIError14.internal("Failed to retrieve performance metrics");
    }
  }
);
function calculateSummary(metrics) {
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

// google-ads/list-campaigns.ts
import { api as api12, APIError as APIError15 } from "encore.dev/api";
var listCampaigns = api12(
  { expose: true, method: "GET", path: "/api/v1/google-ads/campaigns" },
  async (params) => {
    if (!params.user_id) {
      throw APIError15.invalidArgument("User ID is required");
    }
    try {
      if (isDataModeMock3()) {
        const mockCampaigns = generateMockCampaigns();
        return {
          campaigns: mockCampaigns,
          total_count: mockCampaigns.length
        };
      }
      if (!params.customer_id) {
        throw APIError15.invalidArgument("Customer ID is required for live mode");
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
      const campaigns = response.results.map((result) => ({
        id: result.campaign.id,
        name: result.campaign.name,
        status: result.campaign.status,
        budget_amount_micros: parseInt(result.campaignBudget?.amountMicros || "0"),
        currency_code: result.campaignBudget?.currencyCode || "USD",
        start_date: result.campaign.startDate,
        end_date: result.campaign.endDate,
        advertising_channel_type: result.campaign.advertisingChannelType,
        created_at: /* @__PURE__ */ new Date()
        // Google Ads API doesn't provide creation date directly
      }));
      return {
        campaigns,
        total_count: campaigns.length
      };
    } catch (error) {
      if (error instanceof APIError15) {
        throw error;
      }
      console.error("List campaigns error:", error);
      throw APIError15.internal("Failed to retrieve campaigns");
    }
  }
);

// health/health.ts
import { api as api13 } from "encore.dev/api";
import { secret as secret4 } from "encore.dev/config";
var dataMode4 = secret4("DATA_MODE");
var health = api13(
  { expose: true, method: "GET", path: "/api/v1/health" },
  async () => {
    return {
      status: "ok",
      data_mode: dataMode4() || "MOCK"
    };
  }
);

// chat/encore.service.ts
import { Service } from "encore.dev/service";
var encore_service_default = new Service("chat");

// auth/encore.service.ts
import { Service as Service2 } from "encore.dev/service";
var encore_service_default2 = new Service2("auth");

// google-ads/encore.service.ts
import { Service as Service3 } from "encore.dev/service";
var encore_service_default3 = new Service3("google-ads");

// health/encore.service.ts
import { Service as Service4 } from "encore.dev/service";
var encore_service_default4 = new Service4("health");

// encore.gen/internal/entrypoints/combined/main.ts
var gateways = [];
var handlers = [
  {
    apiRoute: {
      service: "auth",
      name: "googleLogin",
      handler: googleLogin,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "auth",
      name: "googleCallback",
      handler: googleCallback,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "auth",
      name: "login",
      handler: login,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "auth",
      name: "refresh",
      handler: refresh,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "auth",
      name: "register",
      handler: register,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "auth",
      name: "getCurrentUser",
      handler: getCurrentUser,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "auth",
      name: "logout",
      handler: logout,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "chat",
      name: "getHistory",
      handler: getHistory,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "chat",
      name: "sendMessage",
      handler: sendMessage,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "google-ads",
      name: "authCallback",
      handler: authCallback,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default3.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "google-ads",
      name: "authStart",
      handler: authStart,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default3.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "google-ads",
      name: "getInsights",
      handler: getInsights,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default3.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "google-ads",
      name: "getPerformance",
      handler: getPerformance,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default3.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "google-ads",
      name: "listCampaigns",
      handler: listCampaigns,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default3.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "health",
      name: "health",
      handler: health,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default4.cfg.middlewares || []
  }
];
registerGateways(gateways);
registerHandlers(handlers);
await run(import.meta.url);
//# sourceMappingURL=main.mjs.map
