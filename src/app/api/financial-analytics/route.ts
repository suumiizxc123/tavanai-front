import { NextRequest, NextResponse } from 'next/server';
import { financialAnalyticsService } from '@/services/financialAnalyticsService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, timeout = 60 } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const result = await financialAnalyticsService.askQuestion(question, timeout);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in financial analytics API:', error);
    return NextResponse.json(
      { error: 'Failed to process financial analytics request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const timeout = parseInt(searchParams.get('timeout') || '60');

    let result;

    switch (type) {
      case 'credit':
        result = await financialAnalyticsService.getCreditAnalysis(timeout);
        break;
      case 'revenue':
        result = await financialAnalyticsService.getRevenueAnalysis(timeout);
        break;
      case 'expense':
        result = await financialAnalyticsService.getExpenseAnalysis(timeout);
        break;
      case 'profit':
        result = await financialAnalyticsService.getProfitAnalysis(timeout);
        break;
      case 'cashflow':
        result = await financialAnalyticsService.getCashFlowAnalysis(timeout);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid analysis type. Use: credit, revenue, expense, profit, or cashflow' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in financial analytics API:', error);
    return NextResponse.json(
      { error: 'Failed to process financial analytics request' },
      { status: 500 }
    );
  }
} 