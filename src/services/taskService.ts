import { Task } from '@/types/task';

const API_BASE_URL = 'http://172.16.22.24:8000';

export const taskService = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get a specific task by ID
  getTask: async (taskId: string): Promise<Task> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Create a new search task
  createSearchTask: async (query: string, serviceName: string = 'work-internal'): Promise<{ task_id: string; status: string; message: string; created_at: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          task_type: 'search-and-answer',
          service_name: serviceName,
          filters: {
            category: 'technology'
          },
          max_results: 5
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create search task');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating search task:', error);
      throw error;
    }
  },

  // Poll task status until completion
  pollTaskStatus: async (taskId: string, interval: number = 5000, timeout: number = 300000): Promise<Task> => {
    const startTime = Date.now();
    
    const poll = async (): Promise<Task> => {
      const task = await taskService.getTask(taskId);
      
      if (task.status === 'completed' || task.status === 'failed') {
        return task;
      }
      
      if (Date.now() - startTime > timeout) {
        throw new Error('Task polling timed out');
      }
      
      await new Promise(resolve => setTimeout(resolve, interval));
      return poll();
    };
    
    return poll();
  }
}; 