export interface TaskPayload {
  query: string;
  filters: {
    category: string;
  };
  max_results: number;
}

export interface TaskResult {
  answer: string;
  end_time: string;
  processed: boolean;
  timestamp: string;
  start_time: string;
  processing_time_ms: number;
}

export interface Task {
  task_id: string;
  service_name: string;
  task_type: string;
  payload: TaskPayload;
  status: string;
  created_at: string;
  updated_at: string;
  result: TaskResult;
  error: string | null;
} 