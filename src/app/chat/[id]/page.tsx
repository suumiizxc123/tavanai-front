'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Bot, User, Sparkles, Zap, Clock, CheckCircle, AlertCircle, Users, Phone, Briefcase, Mail, Building } from 'lucide-react';
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
        content: completedTask.result?.answer || 'Хариулт олдсонгүй',
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
    return new Date(dateString).toLocaleString('mn-MN');
  };

  const formatAnswer = (answer: string) => {
    // Check if this is worker information (contains specific patterns)
    const isWorkerInfo = answer.includes('гэдэг нэртэй ажилтны мэдээлэл') || 
                        (answer.includes('Утас:') && answer.includes('Ажлын байр:') && answer.includes('И-мэйл:'));
    
    if (isWorkerInfo) {
      return formatWorkerInfo(answer);
    }
    
    // Split by double newlines to separate sections
    const sections = answer.split('\n\n');
    
    return sections.map((section, sectionIndex) => {
      const lines = section.split('\n');
      
      return (
        <div key={sectionIndex} className="mb-4 last:mb-0">
          {lines.map((line, lineIndex) => {
            // Check if line is a header (starts with ** or contains :)
            const isHeader = line.startsWith('**') || (line.includes(':') && line.length < 50);
            const isListItem = line.trim().startsWith('-') || line.trim().startsWith('•');
            const isBoldText = line.includes('**') && !line.startsWith('**');
            
            if (isHeader) {
              // Remove ** from the beginning and end
              const cleanText = line.replace(/^\*\*(.*?)\*\*$/, '$1');
              return (
                <div key={lineIndex} className="flex items-center space-x-3 mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-l-4 border-purple-500 shadow-sm">
                  <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <h3 className="text-lg font-bold text-purple-800">
                    {cleanText}
                  </h3>
                </div>
              );
            } else if (isListItem) {
              return (
                <div key={lineIndex} className="flex items-start space-x-3 mb-3 ml-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">
                    {line.replace(/^[-•]\s*/, '')}
                  </p>
                </div>
              );
            } else if (isBoldText) {
              // Handle text with ** in the middle
              const parts = line.split('**');
              return (
                <p key={lineIndex} className="text-sm text-gray-700 leading-relaxed mb-3">
                  {parts.map((part, partIndex) => {
                    if (partIndex % 2 === 1) {
                      // Bold text (odd indices)
                      return (
                        <span key={partIndex} className="inline-flex items-center px-2 py-1 mx-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 font-semibold rounded-lg border border-purple-200">
                          {part}
                        </span>
                      );
                    } else {
                      // Regular text (even indices)
                      return part;
                    }
                  })}
                </p>
              );
            } else if (line.trim()) {
              return (
                <p key={lineIndex} className="text-sm text-gray-700 leading-relaxed mb-3">
                  {line}
                </p>
              );
            }
            return null;
          })}
        </div>
      );
    });
  };

  const formatWorkerInfo = (answer: string) => {
    // Extract worker information
    const lines = answer.split('\n');
    const workers: Array<{ name: string; details: Record<string, string> }> = [];
    let currentWorker: { name: string; details: Record<string, string> } | null = null;
    
    for (const line of lines) {
      if (line.startsWith('**') && line.endsWith('**')) {
        if (currentWorker) {
          workers.push(currentWorker);
        }
        const name = line.replace(/\*\*/g, '').trim();
        currentWorker = { name, details: {} };
      } else if (currentWorker && line.trim().startsWith('-')) {
        const detail = line.replace(/^-\s*/, '').trim();
        const [key, value] = detail.split(': ');
        if (key && value) {
          currentWorker.details[key] = value;
        }
      }
    }
    
    if (currentWorker) {
      workers.push(currentWorker);
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium">
            <Users className="w-4 h-4" />
            <span>Ажилтны мэдээлэл</span>
          </div>
        </div>
        
        {/* Worker Cards */}
        <div className="grid gap-4">
          {workers.map((worker, index) => (
            <div key={index} className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              {/* Worker Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {worker.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{worker.name}</h3>
                  <p className="text-sm text-gray-500">Ажилтны мэдээлэл</p>
                </div>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Worker Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(worker.details).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl border border-purple-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      {key === 'Утас' && <Phone className="w-4 h-4 text-white" />}
                      {key === 'Ажлын байр' && <Briefcase className="w-4 h-4 text-white" />}
                      {key === 'И-мэйл' && <Mail className="w-4 h-4 text-white" />}
                      {key === 'Хэлтэс' && <Building className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{key}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4 pt-4 border-t border-purple-100">
                <button className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200">
                  Холбоо барих
                </button>
                <button className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                  Дэлгэрэнгүй
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="text-center mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
          <p className="text-sm text-gray-600">
            Нийт <span className="font-bold text-green-600">{workers.length}</span> ажилтны мэдээлэл олдлоо
          </p>
        </div>
      </div>
    );
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
                Гарах
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
                        <span className="text-xs opacity-80">Та</span>
                      </div>
                      <p className="text-sm relative z-10">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  /* Bot Message */
                  <div className="flex justify-start animate-slide-in-left">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-4 max-w-[85%] border border-gray-100 transform hover:scale-105 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Message Header */}
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Bot className="w-5 h-5 text-purple-600" />
                            <div className="absolute inset-0 bg-purple-400 rounded-full blur-sm animate-pulse opacity-30"></div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">
                              {message.task?.service_name === 'work-internal' ? 'Дотоод' : 
                               message.task?.service_name === 'workers-info' ? 'Ажилчид' : 'TavanAI'}
                            </span>
                            {message.task && (
                              <span className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${
                                message.task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {message.task.status === 'completed' ? (
                                  <>
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Дууссан</span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Хүлээгдэж буй</span>
                                  </>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Message Content */}
                      <div className="relative z-10">
                        <div className="prose prose-sm max-w-none">
                          {formatAnswer(message.content)}
                        </div>
                      </div>

                      {/* Message Footer */}
                      {message.task && (
                        <div className="mt-4 pt-3 border-t border-gray-100 relative z-10">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                <span>{message.task.result?.processing_time_ms}ms-д боловсруулсан</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-blue-500" />
                                <span>{formatDate(message.task.created_at)}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span>AI Хариулт</span>
                            </div>
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
                    <span className="text-sm text-gray-600">Хүсэлтийг боловсруулж байна...</span>
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
                placeholder="Асуултаа бичнэ үү..."
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