export interface ChatMessage {
  id: string;
  session_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: Date;
}

export interface SendMessageRequest {
  session_id: string;
  content: string;
}

export interface SendMessageResponse {
  message: ChatMessage;
  ai_response: ChatMessage;
}

export interface GetHistoryParams {
  session_id: string;
}

export interface GetHistoryResponse {
  messages: ChatMessage[];
}

export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
