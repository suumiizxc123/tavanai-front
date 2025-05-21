'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { taskService } from '@/services/taskService';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await taskService.getTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading tasks...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tasks</h1>
        
        <div className="grid gap-6">
          {tasks.map((task) => (
            <div
              key={task.task_id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{task.service_name}</h2>
                  <p className="text-sm text-gray-500">Type: {task.task_type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {task.status}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="font-medium mb-2">Query</h3>
                <p className="text-gray-700">{task.payload.query}</p>
              </div>

              {task.result && (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Result</h3>
                  <div className="bg-gray-50 rounded p-4">
                    <div className="prose max-w-none">
                      {task.result.answer}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <p>Created: {formatDate(task.created_at)}</p>
                  <p>Updated: {formatDate(task.updated_at)}</p>
                </div>
                {task.result && (
                  <div>
                    <p>Processing Time: {task.result.processing_time_ms}ms</p>
                    <p>Completed: {formatDate(task.result.end_time)}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 