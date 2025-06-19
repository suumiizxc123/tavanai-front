import { Task } from '@/types/task';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://172.16.22.24:8000';
// const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = 'https://chatbot.tavanbogd.com/r-api';

// Service mapping for API compatibility
const SERVICE_MAPPING = {
  'company-policies': 'work-internal',
  'employee-directory': 'workers-info',
  'financial-analytics': 'financial-analytics'
};

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
  createSearchTask: async (query: string, serviceName: string = 'company-policies'): Promise<{ task_id: string; status: string; message: string; created_at: string }> => {
    try {
      // Map the service name to API-compatible format
      const apiServiceName = SERVICE_MAPPING[serviceName as keyof typeof SERVICE_MAPPING] || serviceName;
      
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          task_type: 'search-and-answer',
          service_name: apiServiceName,
          filters: {
            category: serviceName === 'company-policies' ? 'policies' :
                     serviceName === 'employee-directory' ? 'employees' : 'general'
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
  },

  // Get service information
  getServiceInfo: (serviceId: string) => {
    const services = {
      'company-policies': {
        name: 'Компанийн Бодлого',
        description: 'Компанийн дотоод бодлого, журам, зохион байгуулалтын мэдээлэл',
        apiName: 'work-internal'
      },
      'employee-directory': {
        name: 'Ажилчдын Хуудас',
        description: 'Ажилчдын мэдээлэл, холбоо барих мэдээлэл',
        apiName: 'workers-info'
      },
      'financial-analytics': {
        name: 'Санхүүгийн Шинжилгээ',
        description: 'Санхүүгийн өгөгдөл дээр суурилсан шинжилгээ',
        apiName: 'financial-analytics'
      }
    };
    
    return services[serviceId as keyof typeof services] || services['company-policies'];
  }
}; 