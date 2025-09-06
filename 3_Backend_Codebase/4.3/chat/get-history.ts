import { api, APIError } from "encore.dev/api";
import { chatDB } from "./db";
import type { GetHistoryParams, GetHistoryResponse, ChatMessage } from "./types";

// Retrieves the conversation history for a given session.
export const getHistory = api<GetHistoryParams, GetHistoryResponse>(
  { expose: true, method: "GET", path: "/api/v1/chat/history/:session_id" },
  async (params) => {
    if (!params.session_id || !params.session_id.trim()) {
      throw APIError.invalidArgument("Session ID is required");
    }

    try {
      const messages = await chatDB.queryAll<ChatMessage>`
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
      throw APIError.internal("Failed to retrieve chat history");
    }
  }
);
