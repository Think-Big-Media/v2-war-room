import { api, APIError } from "encore.dev/api";
import { chatDB } from "./db";
import type { SendMessageRequest, SendMessageResponse, ChatMessage, OpenAIMessage } from "./types";
import { callOpenAI } from "./utils";

// Accepts a user's message and returns both the user message and AI response.
export const sendMessage = api<SendMessageRequest, SendMessageResponse>(
  { expose: true, method: "POST", path: "/api/v1/chat/message" },
  async (req) => {
    if (!req.session_id || !req.session_id.trim()) {
      throw APIError.invalidArgument("Session ID is required");
    }

    if (!req.content || !req.content.trim()) {
      throw APIError.invalidArgument("Message content is required");
    }

    try {
      // Save the user's message to the database
      const userMessage = await chatDB.queryRow<ChatMessage>`
        INSERT INTO chat_messages (session_id, content, role)
        VALUES (${req.session_id}, ${req.content}, 'user')
        RETURNING id, session_id, content, role, created_at
      `;

      if (!userMessage) {
        throw APIError.internal("Failed to save user message");
      }

      // Get recent conversation history for context (last 10 messages)
      const recentMessages = await chatDB.queryAll<ChatMessage>`
        SELECT id, session_id, content, role, created_at
        FROM chat_messages
        WHERE session_id = ${req.session_id}
        ORDER BY created_at DESC
        LIMIT 10
      `;

      // Reverse to get chronological order and convert to OpenAI format
      const conversationHistory: OpenAIMessage[] = recentMessages
        .reverse()
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));

      // Add system message for context
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant in the War Room V2 chat system. Provide helpful, accurate, and engaging responses to user questions.'
        },
        ...conversationHistory
      ];

      // Get AI response
      const aiResponseContent = await callOpenAI(messages);

      // Save the AI response to the database
      const aiMessage = await chatDB.queryRow<ChatMessage>`
        INSERT INTO chat_messages (session_id, content, role)
        VALUES (${req.session_id}, ${aiResponseContent}, 'assistant')
        RETURNING id, session_id, content, role, created_at
      `;

      if (!aiMessage) {
        throw APIError.internal("Failed to save AI response");
      }

      return {
        message: userMessage,
        ai_response: aiMessage
      };
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      console.error("Send message error:", error);
      throw APIError.internal("Failed to process message");
    }
  }
);
