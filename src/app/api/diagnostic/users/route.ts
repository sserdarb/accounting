import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        if (secret !== 'diagnostic-secret-2024') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const users = await User.find({}).select('email role status companyId').lean();

        return NextResponse.json({
            success: true,
            count: users.length,
            users: users.map(u => ({
                id: u._id.toString(),
                email: u.email,
                role: u.role,
                status: u.status,
                companyId: u.companyId
            }))
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
