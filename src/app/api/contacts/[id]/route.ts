import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/contacts/[id] - Get single contact
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

        const contact = await Contact.findOne({
            _id: id,
            companyId: decoded.companyId,
        }).lean();

        if (!contact) {
            return NextResponse.json({ error: 'Cari bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                ...contact,
                _id: contact._id.toString(),
            },
        });
    } catch (error) {
        console.error('Get contact error:', error);
        return NextResponse.json(
            { error: 'Cari alınamadı' },
            { status: 500 }
        );
    }
}

// PUT /api/contacts/[id] - Update contact
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

        const contact = await Contact.findOne({
            _id: id,
            companyId: decoded.companyId,
        });

        if (!contact) {
            return NextResponse.json({ error: 'Cari bulunamadı' }, { status: 404 });
        }

        // Update fields
        const { name, type, taxNumber, taxOffice, email, phone, address } = body;

        if (name) contact.name = name;
        if (type) contact.type = type;
        if (taxNumber) contact.taxNumber = taxNumber;
        if (taxOffice !== undefined) contact.taxOffice = taxOffice;
        if (email !== undefined) contact.email = email;
        if (phone !== undefined) contact.phone = phone;
        if (address !== undefined) contact.address = address;

        await contact.save();

        return NextResponse.json({
            success: true,
            data: {
                _id: contact._id.toString(),
                name: contact.name,
                type: contact.type,
                taxNumber: contact.taxNumber,
            },
        });
    } catch (error) {
        console.error('Update contact error:', error);
        return NextResponse.json(
            { error: 'Cari güncellenemedi' },
            { status: 500 }
        );
    }
}

// DELETE /api/contacts/[id] - Delete contact
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

        const contact = await Contact.findOneAndDelete({
            _id: id,
            companyId: decoded.companyId,
        });

        if (!contact) {
            return NextResponse.json({ error: 'Cari bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Cari silindi',
        });
    } catch (error) {
        console.error('Delete contact error:', error);
        return NextResponse.json(
            { error: 'Cari silinemedi' },
            { status: 500 }
        );
    }
}
