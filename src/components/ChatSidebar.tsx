'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { ChatHistory } from '@/types/chat';
import { chatService } from '@/services/chatService';

export default function ChatSidebar() {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    loadChatHistories();
  }, []);

  const loadChatHistories = async () => {
    try {
      const histories = await chatService.getChatHistories();
      setChatHistories(histories);
    } catch (error) {
      console.error('Failed to load chat histories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const newChat = await chatService.createChatHistory();
      router.push(`/chat/${newChat.id}`);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await chatService.deleteChatHistory(id);
      setChatHistories(prev => prev.filter(chat => chat.id !== id));
      if (pathname === `/chat/${id}`) {
        router.push('/chat');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : chatHistories.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No chat history</div>
        ) : (
          <div className="space-y-1 p-2">
            {chatHistories.map((chat) => (
              <div
                key={chat.id}
                onClick={() => router.push(`/chat/${chat.id}`)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                  pathname === `/chat/${chat.id}` ? 'bg-gray-100' : ''
                }`}
              >
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {chat.title || 'New Chat'}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {chat.lastMessage}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {formatDate(chat.timestamp)}
                  </span>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 