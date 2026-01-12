import { NextRequest, NextResponse } from 'next/server';
import gmailService from '@/lib/gmail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, clientSecret, refreshToken } = body;

    // Validation
    if (!clientId || !clientSecret || !refreshToken) {
      return NextResponse.json(
        { error: 'Tüm alanlar gerekli' },
        { status: 400 }
      );
    }

    // Test Gmail connection
    const connected = await gmailService.connect({
      clientId,
      clientSecret,
      refreshToken,
    });

    if (!connected) {
      return NextResponse.json(
        { error: 'Gmail API bağlantısı başarısız' },
        { status: 500 }
      );
    }

    // Test connection
    const testResult = await gmailService.testConnection();

    return NextResponse.json({
      success: true,
      data: testResult,
    });
  } catch (error) {
    console.error('Gmail test error:', error);
    return NextResponse.json(
      { error: 'Gmail API test başarısız' },
      { status: 500 }
    );
  }
}
