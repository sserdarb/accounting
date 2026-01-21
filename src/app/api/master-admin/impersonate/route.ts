import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Company from '@/models/Company';
import { verifyToken, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/master-admin/impersonate - Impersonate a user
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

        await connectDB();

        // Verify caller is masteradmin
        const caller = await User.findById(decoded.userId).lean();
        if (!caller || caller.role !== 'masteradmin') {
            return NextResponse.json(
                { error: 'Bu işlem için yetkiniz yok' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { targetUserId } = body;

        if (!targetUserId) {
            return NextResponse.json(
                { error: 'Hedef kullanıcı ID gerekli' },
                { status: 400 }
            );
        }

        // Get target user
        const targetUser = await User.findById(targetUserId).lean();
        if (!targetUser) {
            return NextResponse.json(
                { error: 'Hedef kullanıcı bulunamadı' },
                { status: 404 }
            );
        }

        // Get target company
        const targetCompany = await Company.findById(targetUser.companyId).lean();

        // Create impersonation token
        const impersonationToken = signToken({
            userId: targetUser._id.toString(),
            email: targetUser.email,
            companyId: targetUser.companyId,
            role: targetUser.role,
            impersonatedBy: decoded.userId, // Track who is impersonating
        });

        // Set the new token as cookie
        const response = NextResponse.json({
            success: true,
            message: `${targetUser.name} olarak giriş yapıldı`,
            user: {
                id: targetUser._id.toString(),
                name: targetUser.name,
                email: targetUser.email,
                role: targetUser.role,
                companyName: targetCompany?.name || 'Bilinmeyen',
            },
        });

        response.cookies.set('token', impersonationToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        // Store original admin token for returning
        response.cookies.set('originalToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Impersonate error:', error);
        return NextResponse.json(
            { error: 'Kullanıcıya geçiş yapılamadı' },
            { status: 500 }
        );
    }
}
