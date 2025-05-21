'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { chatService } from '@/services/chatService';

export default function DefaultChatPage() {
  const router = useRouter();

  useEffect(() => {
    const createNewChat = async () => {
      try {
        const newChat = await chatService.createChatHistory();
        router.push(`/chat/${newChat.id}`);
      } catch (error) {
        console.error('Failed to create new chat:', error);
      }
    };

    createNewChat();
  }, [router]);

  return null;
} 