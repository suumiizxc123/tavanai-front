'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import ServiceSelector from '@/components/ServiceSelector';
import { Task } from '@/types/task';
import { taskService } from '@/services/taskService';

export default function ChatPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState('work-internal');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll to bottom when tasks change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setInput('');
    setIsLoading(true);

    try {
      // Create a new search task
      const taskResponse = await taskService.createSearchTask(input.trim(), selectedService);
      
      // Poll for task completion
      const completedTask = await taskService.pollTaskStatus(taskResponse.task_id);
      
      // Add task to the list (append to end)
      setTasks(prev => [...prev, completedTask]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
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
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">TavanAI Chat</h1>
          <div className="flex items-center space-x-4">
            <ServiceSelector
              onServiceChange={setSelectedService}
              defaultService={selectedService}
            />
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {tasks.map((task) => (
            <div key={task.task_id} className="flex flex-col space-y-2">
              {/* User Query */}
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">{task.payload.query}</p>
                </div>
              </div>

              {/* Task Response */}
              {task.result && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg shadow p-4 max-w-[80%]">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-medium text-gray-500">{task.service_name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      {formatAnswer(task.result.answer)}
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      <p>Processed in {task.result.processing_time_ms}ms</p>
                      <p>{formatDate(task.created_at)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-lg p-4 shadow">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 