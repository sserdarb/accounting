import { NextRequest, NextResponse } from 'next/server';

// GET /api/contacts - Get all contacts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') || 'all';
    const search = searchParams.get('search') || '';

    // TODO: Implement actual database query
    // 1. Build query filters based on params
    // 2. Fetch contacts from database
    // 3. Paginate results
    // 4. Return paginated contacts

    // Mock response for now
    const mockContacts = [
      {
        id: '1',
        type: 'customer',
        name: 'ABC Ltd. Şti.',
        taxNumber: '1234567890',
        taxOffice: 'İstanbul Vergi Dairesi',
        address: 'Maslak Mah. Büyükdere Cad. No:123',
        phone: '+90 212 123 45 67',
        email: 'info@abcltd.com',
        balance: 1200,
      },
      {
        id: '2',
        type: 'supplier',
        name: 'XYZ A.Ş.',
        taxNumber: '0987654321',
        taxOffice: 'Ankara Vergi Dairesi',
        address: 'Çankaya Mah. Atatürk Bulvarı No:456',
        phone: '+90 312 987 65 43',
        email: 'info@xyzas.com',
        balance: -3500,
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockContacts,
      pagination: {
        page,
        limit,
        total: mockContacts.length,
        totalPages: Math.ceil(mockContacts.length / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Cari hesaplar alınamadı' },
      { status: 500 }
    );
  }
}

// POST /api/contacts - Create new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, taxNumber, taxOffice, address, phone, email } = body;

    // Validation
    if (!type || !name || !taxNumber) {
      return NextResponse.json(
        { error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Tax number validation
    if (!/^\d{10}$/.test(taxNumber)) {
      return NextResponse.json(
        { error: 'Vergi numarası 10 haneli olmalı' },
        { status: 400 }
      );
    }

    // Email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta adresi' },
        { status: 400 }
      );
    }

    // TODO: Implement actual contact creation
    // 1. Check if tax number already exists
    // 2. Create contact in database
    // 3. Return created contact

    // Mock response for now
    return NextResponse.json(
      {
        success: true,
        data: {
          id: Date.now().toString(),
          type,
          name,
          taxNumber,
          taxOffice,
          address,
          phone,
          email,
          balance: 0,
          companyId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Cari hesap oluşturulamadı' },
      { status: 500 }
    );
  }
}
