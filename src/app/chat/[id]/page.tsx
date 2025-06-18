'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, Sparkles, Zap, Clock } from 'lucide-react';
import ServiceSelector from '@/components/ServiceSelector';
import ChatIntro from '@/components/ChatIntro';
import { Task } from '@/types/task';
import { taskService } from '@/services/taskService';

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: number;
  task?: Task;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState('work-internal');
  const [showIntro, setShowIntro] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check if user has seen intro before
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('hasSeenIntro', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      type: 'user',
      timestamp: Date.now(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a new search task
      const taskResponse = await taskService.createSearchTask(input.trim(), selectedService);
      
      // Poll for task completion
      const completedTask = await taskService.pollTaskStatus(taskResponse.task_id);
      
      // Add bot response with task data
      const botMessage: ChatMessage = {
        id: completedTask.task_id,
        content: completedTask.result?.answer || 'No response available',
        type: 'bot',
        timestamp: Date.now(),
        task: completedTask,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        content: 'Та түр хүлээнэ үү. Алдаа гарсан юм шиг байна.',
        type: 'bot',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('hasSeenIntro'); // Reset intro for next login
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAnswer = (answer: string) => {
    return answer.split('\n').map((line, index) => (
      <p key={index} className="mb-2">{line}</p>
    ));
  };

  return (
    <>
      {showIntro && <ChatIntro onComplete={handleIntroComplete} />}
      
      <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-30"></div>
          <div className="absolute bottom-32 left-32 w-3 h-3 bg-cyan-400 rounded-full animate-bounce opacity-20"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-25"></div>
        </div>

        <div className="flex-1 flex flex-col relative z-10">
          <div className="bg-white/80 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-purple-600 animate-pulse" />
                <div className="absolute inset-0 bg-purple-400 rounded-full blur-sm animate-ping opacity-30"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TavanAI Chat
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ServiceSelector
                onServiceChange={setSelectedService}
                defaultService={selectedService}
              />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((message, index) => (
              <div key={message.id} className="flex flex-col space-y-4 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                {message.type === 'user' ? (
                  /* User Message */
                  <div className="flex justify-end animate-slide-in-right">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-4 max-w-[80%] shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex items-center space-x-2 mb-2 relative z-10">
                        <User className="w-4 h-4" />
                        <span className="text-xs opacity-80">You</span>
                      </div>
                      <p className="text-sm relative z-10">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  /* Bot Message */
                  <div className="flex justify-start animate-slide-in-left">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 max-w-[80%] border border-gray-100 transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex items-center space-x-2 mb-3 relative z-10">
                        <div className="relative">
                          <Bot className="w-4 h-4 text-purple-600" />
                          <div className="absolute inset-0 bg-purple-400 rounded-full blur-sm animate-pulse opacity-30"></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500">
                          {message.task?.service_name || 'TavanAI'}
                        </span>
                        {message.task && (
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            message.task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {message.task.status}
                          </span>
                        )}
                      </div>
                      <div className="prose prose-sm max-w-none relative z-10">
                        {formatAnswer(message.content)}
                      </div>
                      {message.task && (
                        <div className="mt-3 text-xs text-gray-400 border-t border-gray-100 pt-2 relative z-10">
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3" />
                            <span>Processed in {message.task.result?.processing_time_ms}ms</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(message.task.created_at)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-slide-in-left">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 max-w-[80%] border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Bot className="w-5 h-5 text-purple-600 animate-pulse" />
                      <div className="absolute inset-0 bg-purple-400 rounded-full blur-sm animate-ping opacity-30"></div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
                    </div>
                    <span className="text-sm text-gray-600">Processing your request...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                <Send className="w-5 h-5 relative z-10" />
              </button>
            </div>
          </form>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slide-in-right {
            from { 
              opacity: 0; 
              transform: translateX(20px); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0); 
            }
          }
          
          @keyframes slide-in-left {
            from { 
              opacity: 0; 
              transform: translateX(-20px); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0); 
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          
          .animate-slide-in-right {
            animation: slide-in-right 0.5s ease-out;
          }
          
          .animate-slide-in-left {
            animation: slide-in-left 0.5s ease-out;
          }
        `}</style>
      </div>
    </>
  );
} 