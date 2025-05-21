export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  messages: Message[];
} 