import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock response
    const response = `This is a mock response to: "${message}". In a real implementation, this would be replaced with an actual API call to your backend service. If you said junk or slag words, i will tell you to your directors`;

    return NextResponse.json({ response });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('API Error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 