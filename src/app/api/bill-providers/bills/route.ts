import { NextRequest, NextResponse } from 'next/server';
import { billProviderService } from '@/lib/billProviders';

/**
 * GET /api/bill-providers/bills
 * Faturaları çek
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const fetchAll = searchParams.get('fetchAll') === 'true';

    if (fetchAll) {
      // Tüm sağlayıcılardan faturaları çek
      const results = await billProviderService.fetchAllBills({ startDate, endDate });
      
      // Başarılı sonuçları birleştir
      const allBills = results
        .filter(r => r.success && r.bills)
        .flatMap(r => r.bills!);

      return NextResponse.json({
        success: true,
        data: allBills,
        results: results
      });
    }

    if (!providerId) {
      return NextResponse.json({
        success: false,
        error: 'providerId gerekli veya fetchAll=true kullanın'
      }, { status: 400 });
    }

    // Belirli bir sağlayıcıdan faturaları çek
    const result = await billProviderService.fetchBills(providerId, { startDate, endDate });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Faturalar çekilemedi'
    }, { status: 500 });
  }
}
