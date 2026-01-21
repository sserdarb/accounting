import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { verifyToken } from '@/lib/auth';

// GET /api/contacts - Get all contacts
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
    const search = searchParams.get('search') || '';

    // Build query
    const query: any = { companyId: decoded.companyId };

    if (type !== 'all') {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { taxNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Fetch contacts error:', error);
    return NextResponse.json(
      { error: 'Cari hesaplar alınamadı' },
      { status: 500 }
    );
  }
}

// POST /api/contacts - Create new contact
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
    const { type, name, taxNumber, taxOffice, address, phone, email } = body;

    // Validation
    if (!type || !name || !taxNumber) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if contact already exists for this company
    const existingContact = await Contact.findOne({
      companyId: decoded.companyId,
      taxNumber,
    });

    if (existingContact) {
      return NextResponse.json(
        { error: 'Bu vergi numarasına sahip cari zaten mevcut' },
        { status: 400 }
      );
    }

    // Create contact
    const newContact = new Contact({
      type,
      name,
      taxNumber,
      taxOffice,
      address,
      phone,
      email,
      companyId: decoded.companyId,
    });

    await newContact.save();

    return NextResponse.json(
      {
        success: true,
        data: newContact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create contact error:', error);
    return NextResponse.json(
      { error: 'Cari hesap oluşturulamadı' },
      { status: 500 }
    );
  }
}
