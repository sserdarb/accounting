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

// GET /api/master-admin/users/[id] - Get user details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await checkMasterAdmin(request);
    if ('error' in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;
        const user = await User.findById(id).select('-password').lean();

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        const company = await Company.findById(user.companyId).lean();

        return NextResponse.json({
            success: true,
            data: {
                ...user,
                _id: user._id.toString(),
                company,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Kullanıcı alınamadı' },
            { status: 500 }
        );
    }
}

// PUT /api/master-admin/users/[id] - Update user
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await checkMasterAdmin(request);
    if ('error' in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { name, role, status, companyId, password } = body;

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Update fields
        if (name) user.name = name;
        if (role) user.role = role;
        if (status) user.status = status;
        if (companyId) user.companyId = companyId;
        if (password) user.password = password; // Will be hashed by pre-save hook

        await user.save();

        return NextResponse.json({
            success: true,
            data: {
                _id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
                companyId: user.companyId,
            },
        });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: 'Kullanıcı güncellenemedi' },
            { status: 500 }
        );
    }
}

// DELETE /api/master-admin/users/[id] - Delete user
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authResult = await checkMasterAdmin(request);
    if ('error' in authResult) {
        return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    try {
        const { id } = await params;

        // Prevent deleting self
        if (id === authResult.decoded.userId) {
            return NextResponse.json(
                { error: 'Kendinizi silemezsiniz' },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Kullanıcı silindi',
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { error: 'Kullanıcı silinemedi' },
            { status: 500 }
        );
    }
}
