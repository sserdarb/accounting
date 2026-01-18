import { NextRequest, NextResponse } from 'next/server';
import { billProviderService, BILL_PROVIDERS, BillCredentials } from '@/lib/billProviders';

/**
 * GET /api/bill-providers
 * Tüm fatura sağlayıcılarını getir
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'gsm' | 'electricity' | 'gas' | 'water' | null;

    let providers = BILL_PROVIDERS;

    if (type) {
      providers = providers.filter(p => p.type === type);
    }

    return NextResponse.json({
      success: true,
      data: providers
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Sağlayıcılar alınamadı'
    }, { status: 500 });
  }
}
