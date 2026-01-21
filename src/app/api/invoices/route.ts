import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { verifyToken } from '@/lib/auth';

// GET /api/invoices - Get all invoices
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Geçersiz oturum' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    // Build query
    const query: any = { companyId: decoded.companyId };

    if (type !== 'all') {
      query.type = type;
    }

    if (status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { supplierName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Invoice.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch invoices error:', error);
    return NextResponse.json(
      { error: 'Faturalar alınamadı' },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Geçersiz oturum' }, { status: 401 });
    }

    const body = await request.json();
    const {
      type,
      customerId,
      supplierId,
      customerName,
      supplierName,
      customerTaxNumber,
      supplierTaxNumber,
      date,
      dueDate,
      items,
      notes,
    } = body;

    // Validation
    if (!type || !date || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    await connectDB();

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + (item.quantity * item.unitPrice),
      0
    );

    const vatAmount = items.reduce(
      (sum: number, item: any) =>
        sum + (item.quantity * item.unitPrice * (item.vatRate || 0)) / 100,
      0
    );

    const total = subtotal + vatAmount;

    // Generate invoice number
    // In a real system, this should be more robust (sequential and unique)
    const year = new Date(date).getFullYear();
    const count = await Invoice.countDocuments({
      companyId: decoded.companyId,
      date: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`)
      }
    });

    const invoiceNumber = `FAT-${year}${String(count + 1).padStart(6, '0')}`;

    // Create invoice
    const newInvoice = new Invoice({
      type,
      status: 'draft',
      paymentStatus: 'pending',
      invoiceNumber,
      date: new Date(date),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      companyId: decoded.companyId,
      customerId,
      supplierId,
      customerName,
      supplierName,
      customerTaxNumber,
      supplierTaxNumber,
      items: items.map((item: any) => ({
        ...item,
        vatAmount: (item.quantity * item.unitPrice * (item.vatRate || 0)) / 100,
        total: (item.quantity * item.unitPrice) * (1 + (item.vatRate || 0) / 100)
      })),
      subtotal,
      vatRate: items.length > 0 ? items[0].vatRate : 20, // Default or derived
      vatAmount,
      total,
      notes,
    });

    await newInvoice.save();

    return NextResponse.json(
      {
        success: true,
        data: newInvoice,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { error: 'Fatura oluşturulamadı' },
      { status: 500 }
    );
  }
}
