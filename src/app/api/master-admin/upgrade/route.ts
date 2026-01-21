import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

// POST /api/master-admin/upgrade - Upgrade existing admin to masteradmin
export async function POST(request: NextRequest) {
    try {
        const { secret, email } = await request.json();

        // Only allow with secret key
        if (secret !== process.env.SEED_SECRET && secret !== 'innovmar-seed-2024') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await connectDB();

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Upgrade to masteradmin
        user.role = 'masteradmin';
        user.status = 'active';
        await user.save();

        return NextResponse.json({
            success: true,
            message: `User ${email} upgraded to masteradmin`,
            userId: user._id,
        });
    } catch (error: any) {
        console.error('Upgrade error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upgrade user' },
            { status: 500 }
        );
    }
}
