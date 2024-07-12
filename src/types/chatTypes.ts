export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  status: string;
  message?: string | null;
  data?: string | null;
}

export interface AppChatMessage {
  message: string;
  sender: string;
}
