import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { verifyToken } from '@/lib/auth';
import gibService from '@/lib/gib';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Geçersiz oturum' }, { status: 401 });
        }

        const { id } = params;
        await connectDB();

        const invoice = await Invoice.findOne({ _id: id, companyId: decoded.companyId });
        if (!invoice) {
            return NextResponse.json({ error: 'Fatura bulunamadı' }, { status: 404 });
        }

        if (invoice.gibStatus === 'SUCCESS') {
            return NextResponse.json({ error: 'Fatura zaten GİB sistemine gönderilmiş' }, { status: 400 });
        }

        // Initialize GİB Service with company-specific configuration
        const isInitialized = await gibService.initializeWithCompany(decoded.companyId);
        if (!isInitialized) {
            return NextResponse.json({ error: 'GİB yapılandırması eksik veya hatalı. Lütfen ayarları kontrol edin.' }, { status: 400 });
        }

        // Prepare data for GİB
        const gibData = {
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: invoice.date.toISOString(),
            invoiceType: invoice.type as 'SATIS' | 'ALIS',
            customerVkn: invoice.customerTaxNumber || '',
            customerName: invoice.customerName || '',
            customerTaxOffice: '', // Optional or store in model
            items: invoice.items.map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                vatRate: item.vatRate,
            })),
            subtotal: invoice.subtotal,
            vatAmount: invoice.vatAmount,
            total: invoice.total,
        };

        // Call GİB Service
        const gibResponse = await gibService.sendInvoice(gibData);

        // Update database
        invoice.gibStatus = gibResponse.status === 'SUCCESS' ? 'SUCCESS' : (gibResponse.status === 'PENDING' ? 'PENDING' : 'ERROR');
        if (gibResponse.uuid) invoice.gibUuid = gibResponse.uuid;
        if (gibResponse.code) invoice.gibResponseCode = gibResponse.code;
        if (gibResponse.message) invoice.gibResponseMessage = gibResponse.message;

        // If successful, update general status
        if (gibResponse.success) {
            invoice.status = 'sent';
        }

        await invoice.save();

        return NextResponse.json({
            success: gibResponse.success,
            data: invoice,
            message: gibResponse.message
        });

    } catch (error) {
        console.error('GİB Sending Error:', error);
        return NextResponse.json(
            { error: 'Fatura GİB sistemine gönderilirken bir hata oluştu' },
            { status: 500 }
        );
    }
}
