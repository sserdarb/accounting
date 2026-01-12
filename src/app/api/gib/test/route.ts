import { NextRequest, NextResponse } from 'next/server';
import gibService from '@/lib/gib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, vkn, alias } = body;

    // Validation
    if (!username || !password || !vkn || !alias) {
      return NextResponse.json(
        { error: 'Tüm alanlar gerekli' },
        { status: 400 }
      );
    }

    // Test GİB connection
    const connected = await gibService.connect({
      username,
      password,
      vkn,
      alias,
    });

    if (!connected) {
      return NextResponse.json(
        { error: 'GİB API bağlantısı başarısız' },
        { status: 500 }
      );
    }

    // Test connection
    const testResult = await gibService.testConnection();

    return NextResponse.json({
      success: true,
      data: testResult,
    });
  } catch (error) {
    console.error('GİB test error:', error);
    return NextResponse.json(
      { error: 'GİB API test başarısız' },
      { status: 500 }
    );
  }
}
