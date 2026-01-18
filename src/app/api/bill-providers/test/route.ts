import { NextRequest, NextResponse } from 'next/server';
import { billProviderService } from '@/lib/billProviders';

/**
 * POST /api/bill-providers/test
 * Fatura sağlayıcısı bağlantısını test et
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId } = body;

    if (!providerId) {
      return NextResponse.json({
        success: false,
        error: 'providerId gerekli'
      }, { status: 400 });
    }

    const result = await billProviderService.testConnection(providerId);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Bağlantı testi başarısız'
    }, { status: 500 });
  }
}
