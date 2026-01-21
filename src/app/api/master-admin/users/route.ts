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

// GET /api/master-admin/users - List all users
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
        const role = searchParams.get('role') || '';
        const status = searchParams.get('status') || '';

        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        if (role) {
            query.role = role;
        }

        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
        ]);

        // Get company info for each user
        const companyIds = [...new Set(users.map((u: any) => u.companyId))];
        const companies = await Company.find({ _id: { $in: companyIds } }).lean();
        const companyMap = new Map(companies.map((c: any) => [c._id.toString(), c]));

        const usersWithCompany = users.map((user: any) => ({
            ...user,
            _id: user._id.toString(),
            companyId: user.companyId,
            company: companyMap.get(user.companyId) || null,
        }));

        return NextResponse.json({
            success: true,
            data: usersWithCompany,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('List users error:', error);
        return NextResponse.json(
            { error: 'Kullanıcılar alınamadı' },
            { status: 500 }
        );
    }
}

// POST /api/master-admin/users - Create new user
export async function POST(request: NextRequest) {
    const authResult = await checkMasterAdmin(request);
    if ('error' in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const body = await request.json();
        const { email, password, name, role, companyId, status } = body;

        if (!email || !password || !name || !companyId) {
            return NextResponse.json(
                { error: 'Gerekli alanlar eksik' },
                { status: 400 }
            );
        }

        // Check if email exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Bu e-posta adresi zaten kullanımda' },
                { status: 400 }
            );
        }

        // Check if company exists
        const company = await Company.findById(companyId);
        if (!company) {
            return NextResponse.json(
                { error: 'Şirket bulunamadı' },
                { status: 400 }
            );
        }

        const newUser = new User({
            email: email.toLowerCase(),
            password,
            name,
            role: role || 'user',
            status: status || 'active',
            companyId,
        });

        await newUser.save();

        return NextResponse.json(
            {
                success: true,
                data: {
                    _id: newUser._id.toString(),
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role,
                    status: newUser.status,
                    companyId: newUser.companyId,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { error: 'Kullanıcı oluşturulamadı' },
            { status: 500 }
        );
    }
}
