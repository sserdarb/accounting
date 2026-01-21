import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/master-admin/return - Return from impersonation to original masteradmin
export async function POST(request: NextRequest) {
    try {
        const originalToken = request.cookies.get('originalToken')?.value;

        if (!originalToken) {
            return NextResponse.json(
                { error: 'Orijinal oturum bulunamadı' },
                { status: 400 }
            );
        }

        const decoded = verifyToken(originalToken);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Orijinal oturum geçersiz' },
                { status: 401 }
            );
        }

        await connectDB();

        // Verify original user is still masteradmin
        const originalUser = await User.findById(decoded.userId).lean();
        if (!originalUser || originalUser.role !== 'masteradmin') {
            return NextResponse.json(
                { error: 'Orijinal kullanıcı artık masteradmin değil' },
                { status: 403 }
            );
        }

        // Restore original token
        const response = NextResponse.json({
            success: true,
            message: 'Master Admin hesabına geri dönüldü',
            user: {
                id: originalUser._id.toString(),
                name: originalUser.name,
                email: originalUser.email,
                role: originalUser.role,
            },
        });

        response.cookies.set('token', originalToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        // Clear the original token cookie
        response.cookies.set('originalToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Return from impersonation error:', error);
        return NextResponse.json(
            { error: 'Geri dönüş yapılamadı' },
            { status: 500 }
        );
    }
}
