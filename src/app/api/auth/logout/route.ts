import { NextResponse } from 'next/server';

// POST /api/auth/logout - Logout user
export async function POST() {
    const response = NextResponse.json({ success: true, message: 'Çıkış yapıldı' });

    // Clear the token cookie
    response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
    });

    return response;
}
