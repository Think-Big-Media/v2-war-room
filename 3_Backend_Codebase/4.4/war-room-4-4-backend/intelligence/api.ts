import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

// Get OpenAI API key from secrets (with fallback for deployment)
const openaiApiKey = secret("OPENAI_API_KEY");

// Helper function to safely get OpenAI API key
async function getOpenAIApiKey(): Promise<string | null> {
  try {
    const key = await openaiApiKey();
    return key || null;
  } catch (error) {
    console.warn("OPENAI_API_KEY not configured, using mock AI responses for development");
    return null;
  }
}

// Request/Response types
interface ChatMessageRequest {
  message: string;
  sessionId?: string;
  context?: string;
}

interface ChatMessageResponse {
  response: string;
  sessionId: string;
  timestamp: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatHistoryResponse {
  messages: ChatMessage[];
  sessionId: string;
  totalMessages: number;
  timestamp: string;
}

interface DocumentUploadRequest {
  fileName: string;
  content: string;
  type: "text" | "pdf" | "docx";
  metadata?: Record<string, any>;
}

interface DocumentUploadResponse {
  documentId: string;
  fileName: string;
  status: "uploaded" | "processing" | "ready" | "error";
  extractedText?: string;
  summary?: string;
  timestamp: string;
}

// In-memory storage for demo purposes (replace with database in production)
let chatSessions: Record<string, ChatMessage[]> = {};
let documents: Record<string, any> = {};

// POST /api/v1/intelligence/chat/message - chat with AI
export const sendChatMessage = api<ChatMessageRequest, ChatMessageResponse>(
  { expose: true, method: "POST", path: "/api/v1/intelligence/chat/message" },
  async ({ message, sessionId, context }) => {
    console.log("Processing chat message...");
    
    const currentSessionId = sessionId || generateSessionId();
    
    if (!chatSessions[currentSessionId]) {
      chatSessions[currentSessionId] = [];
    }

    // Add user message to session
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString()
    };
    
    chatSessions[currentSessionId].push(userMessage);

    const apiKey = await getOpenAIApiKey();
    if (apiKey) {
      console.log("OpenAI API key available - using LIVE AI (when implemented)");
      // TODO: Implement real OpenAI API calls here
    } else {
      console.log("OpenAI API key not configured - using mock AI responses");
    }

    // Mock AI response for now - replace with real OpenAI API call later
    const aiResponses = [
      "Based on the current political climate and recent polling data, I'd recommend focusing on healthcare messaging in swing states.",
      "The sentiment analysis shows positive response to your education initiatives. Consider amplifying this message across digital platforms.",
      "Recent social media trends indicate strong engagement with environmental policy content. This could be an opportunity to expand your climate messaging.",
      "Cross-referencing campaign data with demographic insights suggests targeting urban millennials with economic opportunity messaging.",
      "The latest opposition research indicates potential vulnerabilities around infrastructure spending. Prepare defensive messaging."
    ];

    const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

    const assistantMessage: ChatMessage = {
      id: generateMessageId(),
      role: "assistant", 
      content: aiResponse,
      timestamp: new Date().toISOString()
    };

    chatSessions[currentSessionId].push(assistantMessage);

    return {
      response: aiResponse,
      sessionId: currentSessionId,
      timestamp: new Date().toISOString(),
      usage: {
        promptTokens: message.length / 4, // Rough estimate
        completionTokens: aiResponse.length / 4,
        totalTokens: (message.length + aiResponse.length) / 4
      }
    };
  }
);

// GET /api/v1/intelligence/chat/history - chat history
export const getChatHistory = api<{ sessionId: string; limit?: number }, ChatHistoryResponse>(
  { expose: true, method: "GET", path: "/api/v1/intelligence/chat/history" },
  async ({ sessionId, limit = 50 }) => {
    console.log(`Fetching chat history for session: ${sessionId}`);
    
    const sessionMessages = chatSessions[sessionId] || [];
    const messages = sessionMessages.slice(-limit); // Get most recent messages

    return {
      messages,
      sessionId,
      totalMessages: sessionMessages.length,
      timestamp: new Date().toISOString()
    };
  }
);

// POST /api/v1/intelligence/documents/upload - upload documents
export const uploadDocument = api<DocumentUploadRequest, DocumentUploadResponse>(
  { expose: true, method: "POST", path: "/api/v1/intelligence/documents/upload" },
  async ({ fileName, content, type, metadata }) => {
    console.log(`Uploading document: ${fileName} (${type})`);
    
    const documentId = generateDocumentId();
    
    // Mock document processing for now - replace with real document processing later
    let extractedText = content;
    let summary = "";
    
    // Simulate text extraction based on type
    if (type === "pdf" || type === "docx") {
      // In real implementation, use libraries like pdf-parse or mammoth.js
      extractedText = `[Extracted from ${type.toUpperCase()}] ${content}`;
    }
    
    // Generate a simple summary
    if (extractedText.length > 200) {
      summary = extractedText.substring(0, 200) + "...";
    } else {
      summary = extractedText;
    }

    const document = {
      id: documentId,
      fileName,
      type,
      content,
      extractedText,
      summary,
      metadata: metadata || {},
      status: "ready",
      uploadedAt: new Date().toISOString()
    };

    documents[documentId] = document;

    return {
      documentId,
      fileName,
      status: "ready",
      extractedText,
      summary,
      timestamp: new Date().toISOString()
    };
  }
);

// Helper functions
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function generateDocumentId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}