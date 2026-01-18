import { NextRequest, NextResponse } from 'next/server';
import { billProviderService } from '@/lib/billProviders';

/**
 * POST /api/bill-providers/auto-fetch
 * Tüm bağlı sağlayıcılardan faturaları otomatik çek
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { force } = body || {};

    // Tüm bağlı sağlayıcıları al
    const activeProviders = billProviderService.getActiveProviders();

    if (activeProviders.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Bağlı sağlayıcı bulunamadı'
      }, { status: 400 });
    }

    // Tüm sağlayıcılardan faturaları çek
    const results = await billProviderService.fetchAllBills();

    // Başarılı sonuçları birleştir
    const allBills = results
      .filter(r => r.success && r.bills)
      .flatMap(r => r.bills!);

    // Sonuçları özetle
    const summary = {
      totalProviders: activeProviders.length,
      successfulProviders: results.filter(r => r.success).length,
      failedProviders: results.filter(r => !r.success).length,
      totalBills: allBills.length,
      pendingBills: allBills.filter(b => b.status === 'pending').length,
      paidBills: allBills.filter(b => b.status === 'paid').length,
      overdueBills: allBills.filter(b => b.status === 'overdue').length,
      totalAmount: allBills.reduce((sum, b) => sum + b.amount, 0),
      pendingAmount: allBills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0),
    };

    return NextResponse.json({
      success: true,
      data: {
        bills: allBills,
        results: results,
        summary: summary
      },
      message: `${summary.successfulProviders}/${summary.totalProviders} sağlayıcıdan ${summary.totalBills} fatura çekildi`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Otomatik fatura çekme başarısız'
    }, { status: 500 });
  }
}

/**
 * GET /api/bill-providers/auto-fetch
 * Otomatik fatura çekme durumunu al
 */
export async function GET(request: NextRequest) {
  try {
    const activeProviders = billProviderService.getActiveProviders();

    return NextResponse.json({
      success: true,
      data: {
        activeProviders: activeProviders.length,
        lastFetch: new Date().toISOString(),
        status: 'ready'
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Durum alınamadı'
    }, { status: 500 });
  }
}
