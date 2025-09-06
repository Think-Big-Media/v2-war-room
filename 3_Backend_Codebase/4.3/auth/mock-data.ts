import type { User } from "./types";

export const mockUsers: User[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "admin@warroom.com",
    first_name: "War Room",
    last_name: "Admin",
    created_at: new Date("2024-01-01T00:00:00Z"),
    updated_at: new Date("2024-01-01T00:00:00Z"),
    last_login: new Date("2024-01-15T10:30:00Z"),
    is_active: true
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "user@warroom.com",
    first_name: "Test",
    last_name: "User",
    created_at: new Date("2024-01-02T00:00:00Z"),
    updated_at: new Date("2024-01-02T00:00:00Z"),
    last_login: new Date("2024-01-14T15:45:00Z"),
    is_active: true
  }
];

export const mockPasswordHash = "mockSalt:mockHash123"; // For demo purposes only
