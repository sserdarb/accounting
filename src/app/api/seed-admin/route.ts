import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Company from '@/models/Company';

// This endpoint creates the initial admin user
// POST /api/seed-admin
export async function POST(request: NextRequest) {
    try {
        // Check for secret key to prevent unauthorized access
        const { secret, email, password, name, companyName } = await request.json();

        if (secret !== process.env.SEED_SECRET && secret !== 'innovmar-seed-2024') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        // Check if admin already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists', userId: existingUser._id },
                { status: 409 }
            );
        }

        // Create or find the company
        let company = await Company.findOne({ name: companyName || 'Innovmar A.Ş.' });

        if (!company) {
            company = await Company.create({
                name: companyName || 'Innovmar A.Ş.',
                vkn: '1234567890',
                address: 'İstanbul, Türkiye',
                phone: '+90 212 555 01 23',
                email: email,
            });
        }

        // Create admin user
        const user = await User.create({
            email,
            password,
            name: name || 'Admin',
            role: 'admin',
            companyId: company._id.toString(),
        });

        return NextResponse.json({
            success: true,
            message: 'Admin user created successfully',
            userId: user._id,
            companyId: company._id,
        });
    } catch (error: any) {
        console.error('Seed admin error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create admin user' },
            { status: 500 }
        );
    }
}
