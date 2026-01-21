import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Company from '@/models/Company';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Middleware to check masteradmin role
async function checkMasterAdmin(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    if (!token) {
        return { error: 'Yetkisiz erişim', status: 401 };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return { error: 'Geçersiz oturum', status: 401 };
    }

    await connectDB();
    const user = await User.findById(decoded.userId).lean();

    if (!user || user.role !== 'masteradmin') {
        return { error: 'Bu işlem için yetkiniz yok', status: 403 };
    }

    return { user, decoded };
}

// GET /api/master-admin/companies - List all companies
export async function GET(request: NextRequest) {
    const authResult = await checkMasterAdmin(request);
    if ('error' in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const search = searchParams.get('search') || '';

        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { taxNumber: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (page - 1) * limit;

        const [companies, total] = await Promise.all([
            Company.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Company.countDocuments(query),
        ]);

        // Get user count for each company
        const companiesWithUserCount = await Promise.all(
            companies.map(async (company: any) => {
                const userCount = await User.countDocuments({ companyId: company._id.toString() });
                return {
                    ...company,
                    _id: company._id.toString(),
                    userCount,
                };
            })
        );

        return NextResponse.json({
            success: true,
            data: companiesWithUserCount,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('List companies error:', error);
        return NextResponse.json(
            { error: 'Şirketler alınamadı' },
            { status: 500 }
        );
    }
}

// POST /api/master-admin/companies - Create new company
export async function POST(request: NextRequest) {
    const authResult = await checkMasterAdmin(request);
    if ('error' in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const body = await request.json();
        const { name, taxNumber, taxOffice, address, phone, email } = body;

        if (!name || !taxNumber) {
            return NextResponse.json(
                { error: 'Şirket adı ve vergi numarası gerekli' },
                { status: 400 }
            );
        }

        // Check if taxNumber exists
        const existingCompany = await Company.findOne({ taxNumber });
        if (existingCompany) {
            return NextResponse.json(
                { error: 'Bu vergi numarası zaten kayıtlı' },
                { status: 400 }
            );
        }

        const newCompany = new Company({
            name,
            taxNumber,
            taxOffice: taxOffice || 'Belirtilmedi',
            address: address || '',
            phone: phone || '',
            email: email || '',
        });

        await newCompany.save();

        return NextResponse.json(
            {
                success: true,
                data: {
                    _id: newCompany._id.toString(),
                    name: newCompany.name,
                    taxNumber: newCompany.taxNumber,
                    taxOffice: newCompany.taxOffice,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create company error:', error);
        return NextResponse.json(
            { error: 'Şirket oluşturulamadı' },
            { status: 500 }
        );
    }
}
