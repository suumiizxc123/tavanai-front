// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://172.16.22.24:8000';
// const API_BASE_URL = 'http://localhost:8000';
const API_BASE_URL = 'https://chatbot.tavanbogd.com';

export interface FinancialAnalyticsResponse {
  success: boolean;
  answer: string;
  script_used: string;
  explanation: string;
  recommendations: string[];
  raw_data: {
    type: string;
    historical_totals: number[];
    historical_count: number;
    historical_sum: number;
    forecast_values: number[];
    forecast_periods: number;
    forecast_sum: number;
    output_length: number;
    script_type: string;
    summary: {
      total_count: number;
      total_sum: number;
      average: number;
      min: number;
      max: number;
    };
    raw_output: string;
  };
  error: string | null;
  execution_time: number | null;
}

export interface ForecastResponse {
  method: string;
  forecast: number[];
  lower: number[];
  upper: number[];
  level: number;
  success: boolean;
  error: string | null;
}

export interface ForecastRequest {
  ts: number[];
  model: 'arima' | 'ets' | 'naive';
  frequency: number;
  h: number;
  level: number;
}

export const financialAnalyticsService = {
  // Ask a financial question in Mongolian
  askQuestion: async (question: string, timeout: number = 60): Promise<FinancialAnalyticsResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/r-analytics/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          timeout
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get financial analysis: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting financial analysis:', error);
      throw error;
    }
  },

  // Get forecast data
  getForecast: async (request: ForecastRequest): Promise<ForecastResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/r-analytics/forecast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to get forecast: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting forecast:', error);
      throw error;
    }
  },

  // Predefined financial analysis methods
  getCreditAnalysis: async (timeout: number = 60): Promise<FinancialAnalyticsResponse> => {
    return financialAnalyticsService.askQuestion('Кредит явархуу хэмжээтэй байна ?', timeout);
  },

  getRevenueAnalysis: async (timeout: number = 60): Promise<FinancialAnalyticsResponse> => {
    return financialAnalyticsService.askQuestion('Орлогын хэмжээ хэрхэн өөрчлөгдөж байна ?', timeout);
  },

  getExpenseAnalysis: async (timeout: number = 60): Promise<FinancialAnalyticsResponse> => {
    return financialAnalyticsService.askQuestion('Зардлын хэмжээ хэрхэн өөрчлөгдөж байна ?', timeout);
  },

  getProfitAnalysis: async (timeout: number = 60): Promise<FinancialAnalyticsResponse> => {
    return financialAnalyticsService.askQuestion('Ашиг хэрхэн өөрчлөгдөж байна ?', timeout);
  },

  getCashFlowAnalysis: async (timeout: number = 60): Promise<FinancialAnalyticsResponse> => {
    return financialAnalyticsService.askQuestion('Мөнгөн хөрөнгийн урсгал хэрхэн байна ?', timeout);
  }
}; 