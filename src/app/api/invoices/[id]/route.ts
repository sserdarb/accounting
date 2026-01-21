import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/invoices/[id] - Get single invoice
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        await connectDB();
        const { id } = await params;

        const invoice = await Invoice.findOne({
            _id: id,
            companyId: decoded.companyId,
        }).lean();

        if (!invoice) {
            return NextResponse.json({ error: 'Fatura bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                ...invoice,
                _id: invoice._id.toString(),
            },
        });
    } catch (error) {
        console.error('Get invoice error:', error);
        return NextResponse.json(
            { error: 'Fatura alınamadı' },
            { status: 500 }
        );
    }
}

// PUT /api/invoices/[id] - Update invoice
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const invoice = await Invoice.findOne({
            _id: id,
            companyId: decoded.companyId,
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Fatura bulunamadı' }, { status: 404 });
        }

        // Update allowed fields
        const allowedFields = [
            'customerName', 'customerTaxNumber', 'customerAddress',
            'items', 'subtotal', 'vatAmount', 'totalAmount',
            'status', 'notes', 'dueDate'
        ];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                (invoice as any)[field] = body[field];
            }
        }

        await invoice.save();

        return NextResponse.json({
            success: true,
            data: {
                _id: invoice._id.toString(),
                invoiceNumber: invoice.invoiceNumber,
                status: invoice.status,
            },
        });
    } catch (error) {
        console.error('Update invoice error:', error);
        return NextResponse.json(
            { error: 'Fatura güncellenemedi' },
            { status: 500 }
        );
    }
}

// DELETE /api/invoices/[id] - Delete invoice
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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

        await connectDB();
        const { id } = await params;

        const invoice = await Invoice.findOneAndDelete({
            _id: id,
            companyId: decoded.companyId,
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Fatura bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Fatura silindi',
        });
    } catch (error) {
        console.error('Delete invoice error:', error);
        return NextResponse.json(
            { error: 'Fatura silinemedi' },
            { status: 500 }
        );
    }
}
