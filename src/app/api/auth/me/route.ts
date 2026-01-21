import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Company from '@/models/Company';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/auth/me - Get current user info
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

        const user = await User.findById(decoded.userId).select('-password').lean();
        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        const company = await Company.findById(decoded.companyId).lean();

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: decoded.companyId,
                companyName: company?.name || 'Bilinmeyen Şirket'
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        return NextResponse.json(
            { error: 'Kullanıcı bilgileri alınamadı' },
            { status: 500 }
        );
    }
}
