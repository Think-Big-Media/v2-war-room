import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { secret } from "encore.dev/config";
import { APIError } from "encore.dev/api";
import type { TokenPayload } from "./types";

const jwtSecret = secret("JWT_SECRET");
const jwtRefreshSecret = secret("JWT_REFRESH_SECRET");
const dataMode = secret("DATA_MODE");

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(":");
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return hash === verifyHash;
}

export function generateAccessToken(userId: string, email: string): string {
  const payload: TokenPayload = {
    user_id: userId,
    email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    iat: Math.floor(Date.now() / 1000)
  };
  
  return jwt.sign(payload, jwtSecret(), { algorithm: "HS256" });
}

export function generateRefreshToken(userId: string, email: string): string {
  const payload: TokenPayload = {
    user_id: userId,
    email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
    iat: Math.floor(Date.now() / 1000)
  };
  
  return jwt.sign(payload, jwtRefreshSecret(), { algorithm: "HS256" });
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, jwtSecret()) as TokenPayload;
  } catch (error) {
    throw APIError.unauthenticated("Invalid access token");
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, jwtRefreshSecret()) as TokenPayload;
  } catch (error) {
    throw APIError.unauthenticated("Invalid refresh token");
  }
}

export function isDataModeMock(): boolean {
  return dataMode() === "MOCK";
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 8;
}
