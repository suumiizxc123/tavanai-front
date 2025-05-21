import { Message, ChatHistory } from '@/types/chat';

// Utility function to generate unique IDs
const generateUniqueId = (prefix: string = '') => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Mock initial chat histories
const initialChatHistories: ChatHistory[] = [
  {
    id: 'chat-1',
    title: 'Project Requirements Discussion',
    lastMessage: 'Let me know if you need any clarification on the requirements.',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    messages: [
      {
        id: 'msg-1-1',
        content: 'What are the main features needed for the project?',
        role: 'user',
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
      },
      {
        id: 'msg-1-2',
        content: 'The main features include user authentication, real-time chat, and file sharing capabilities.',
        role: 'assistant',
        timestamp: Date.now() - 1000 * 60 * 60 * 1.9,
      },
      {
        id: 'msg-1-3',
        content: 'Can you elaborate on the file sharing feature?',
        role: 'user',
        timestamp: Date.now() - 1000 * 60 * 60 * 1.8,
      },
      {
        id: 'msg-1-4',
        content: 'The file sharing feature will support multiple file formats, with a size limit of 10MB per file. Users can preview images and documents directly in the chat.',
        role: 'assistant',
        timestamp: Date.now() - 1000 * 60 * 60 * 1.7,
      },
      {
        id: 'msg-1-5',
        content: 'Let me know if you need any clarification on the requirements.',
        role: 'assistant',
        timestamp: Date.now() - 1000 * 60 * 60 * 1.6,
      },
    ],
  },
  {
    id: 'chat-2',
    title: 'Technical Architecture Planning',
    lastMessage: 'We should use WebSocket for real-time communication.',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    messages: [
      {
        id: 'msg-2-1',
        content: 'What technology stack should we use for the backend?',
        role: 'user',
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
      },
      {
        id: 'msg-2-2',
        content: 'I recommend using Node.js with Express for the backend, and MongoDB for the database. This stack will provide good scalability and real-time capabilities.',
        role: 'assistant',
        timestamp: Date.now() - 1000 * 60 * 60 * 23.9,
      },
      {
        id: 'msg-2-3',
        content: 'How should we handle real-time updates?',
        role: 'user',
        timestamp: Date.now() - 1000 * 60 * 60 * 23.8,
      },
      {
        id: 'msg-2-4',
        content: 'We should use WebSocket for real-time communication.',
        role: 'assistant',
        timestamp: Date.now() - 1000 * 60 * 60 * 23.7,
      },
    ],
  },
  {
    id: 'chat-3',
    title: 'UI/UX Design Discussion',
    lastMessage: 'The color scheme should be consistent with our brand guidelines.',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    messages: [
      {
        id: 'msg-3-1',
        content: 'What should be our primary color scheme?',
        role: 'user',
        timestamp: Date.now() - 1000 * 60 * 60 * 48,
      },
      {
        id: 'msg-3-2',
        content: 'I suggest using a combination of blue (#1E40AF) as primary, with white and light gray for contrast. This creates a professional and clean look.',
        role: 'assistant',
        timestamp: Date.now() - 1000 * 60 * 60 * 47.9,
      },
      {
        id: 'msg-3-3',
        content: 'Should we follow any specific design system?',
        role: 'user',
        timestamp: Date.now() - 1000 * 60 * 60 * 47.8,
      },
      {
        id: 'msg-3-4',
        content: 'The color scheme should be consistent with our brand guidelines.',
        role: 'assistant',
        timestamp: Date.now() - 1000 * 60 * 60 * 47.7,
      },
    ],
  },
];

// Mock storage for chat histories
let chatHistories: ChatHistory[] = [...initialChatHistories];

export const chatService = {
  // Get all chat histories
  getChatHistories: async (): Promise<ChatHistory[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return chatHistories;
  },

  // Get a specific chat history
  getChatHistory: async (id: string): Promise<ChatHistory | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return chatHistories.find(chat => chat.id === id) || null;
  },

  // Create a new chat history
  createChatHistory: async (): Promise<ChatHistory> => {
    const newChat: ChatHistory = {
      id: generateUniqueId('chat-'),
      title: 'New Chat',
      lastMessage: '',
      timestamp: Date.now(),
      messages: [],
    };
    chatHistories.unshift(newChat);
    return newChat;
  },

  // Add a message to a chat history
  addMessage: async (chatId: string, message: Message): Promise<ChatHistory> => {
    const chatIndex = chatHistories.findIndex(chat => chat.id === chatId);
    if (chatIndex === -1) {
      throw new Error('Chat not found');
    }

    const chat = chatHistories[chatIndex];
    const newMessage = {
      ...message,
      id: generateUniqueId('msg-'),
    };
    chat.messages.push(newMessage);
    chat.lastMessage = message.content;
    chat.timestamp = Date.now();

    // Update title if it's the first message
    if (chat.messages.length === 1) {
      chat.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
    }

    // Move chat to top of list
    chatHistories.splice(chatIndex, 1);
    chatHistories.unshift(chat);

    return chat;
  },

  // Delete a chat history
  deleteChatHistory: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    chatHistories = chatHistories.filter(chat => chat.id !== id);
  },

  // Update chat title
  updateChatTitle: async (id: string, title: string): Promise<ChatHistory> => {
    const chat = chatHistories.find(chat => chat.id === id);
    if (!chat) {
      throw new Error('Chat not found');
    }
    chat.title = title;
    return chat;
  },

  // Reset to initial mock data (for testing)
  resetToMockData: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    chatHistories = [...initialChatHistories];
  },
}; 