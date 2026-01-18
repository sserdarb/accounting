import { NextRequest, NextResponse } from 'next/server';
import { billProviderService, BillCredentials } from '@/lib/billProviders';

/**
 * POST /api/bill-providers/authenticate
 * Fatura sağlayıcısına giriş yap
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, credentials } = body;

    if (!providerId || !credentials) {
      return NextResponse.json({
        success: false,
        error: 'providerId ve credentials gerekli'
      }, { status: 400 });
    }

    const result = await billProviderService.authenticate(providerId, credentials);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Kimlik doğrulama başarısız'
    }, { status: 500 });
  }
}
