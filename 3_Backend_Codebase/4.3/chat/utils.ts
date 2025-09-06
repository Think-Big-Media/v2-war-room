import { secret } from "encore.dev/config";
import { APIError } from "encore.dev/api";
import type { OpenAIMessage } from "./types";

const openaiApiKey = secret("OPENAI_API_KEY");
const dataMode = secret("DATA_MODE");

export function isDataModeMock(): boolean {
  return dataMode() === "MOCK";
}

export async function callOpenAI(messages: OpenAIMessage[]): Promise<string> {
  if (isDataModeMock()) {
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
        messages: messages,
        max_tokens: 1000,
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
    throw APIError.internal("Failed to generate AI response");
  }
}

function generateMockResponse(messages: OpenAIMessage[]): string {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || "";
  
  // Generate contextual mock responses based on the user's message
  if (lastUserMessage.toLowerCase().includes('hello') || lastUserMessage.toLowerCase().includes('hi')) {
    return "[MOCK MODE] Hello! I'm your AI assistant. I'm currently running in mock mode, so this is a test response. How can I help you today?";
  }
  
  if (lastUserMessage.toLowerCase().includes('weather')) {
    return "[MOCK MODE] I'd be happy to help with weather information! In mock mode, I can tell you it's a beautiful sunny day with 72°F. Remember, this is test data.";
  }
  
  if (lastUserMessage.toLowerCase().includes('help')) {
    return "[MOCK MODE] I'm here to assist you! This is a mock response demonstrating the chat functionality. In live mode, I would provide real AI-powered assistance.";
  }
  
  return `[MOCK MODE] Thank you for your message: "${lastUserMessage}". This is a mock AI response demonstrating the chat system functionality. In live mode, you would receive a real AI-generated response.`;
}
