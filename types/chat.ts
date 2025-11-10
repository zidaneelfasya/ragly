// Database interfaces based on your SQL schema

export interface Thread {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thread_id: string;
  created_at: string;
  updated_at: string;
}

// UI interfaces for components
export interface ChatHistoryItem {
  id: string;
  title: string;
  preview: string;
  date: string;
  message_count?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sender: string;
  code?: string;
  avatar?: string;
  initials: string;
  isUser: boolean;
}
