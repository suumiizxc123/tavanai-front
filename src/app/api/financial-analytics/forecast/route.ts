import { NextRequest, NextResponse } from 'next/server';
import { financialAnalyticsService, ForecastRequest } from '@/services/financialAnalyticsService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ts, model = 'arima', frequency = 12, h = 6, level = 0.9 } = body;

    if (!ts || !Array.isArray(ts)) {
      return NextResponse.json(
        { error: 'Time series data (ts) is required and must be an array' },
        { status: 400 }
      );
    }

    const forecastRequest: ForecastRequest = {
      ts,
      model,
      frequency,
      h,
      level
    };

    const result = await financialAnalyticsService.getForecast(forecastRequest);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in forecast API:', error);
    return NextResponse.json(
      { error: 'Failed to process forecast request' },
      { status: 500 }
    );
  }
} 