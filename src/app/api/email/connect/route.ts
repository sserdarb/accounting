import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Company from '@/models/Company';
import { verifyToken } from '@/lib/auth';
import customEmailService from '@/lib/email-service';

export const dynamic = 'force-dynamic';

// POST /api/email/connect - Test and save email configuration
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.companyId) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        await connectDB();

        const body = await request.json();
        const { provider, imapHost, imapPort, imapSecure, imapUser, imapPassword, smtpHost, smtpPort, smtpSecure, smtpUser, smtpPassword } = body;

        // Test IMAP connection
        const testResult = await customEmailService.testImapConnection({
            provider: 'custom',
            imapHost,
            imapPort: imapPort || 993,
            imapSecure: imapSecure !== false,
            imapUser,
            imapPassword,
        });

        if (!testResult.success) {
            return NextResponse.json({
                success: false,
                error: testResult.message,
            }, { status: 400 });
        }

        // Save configuration to company
        const company = await Company.findById(decoded.companyId);
        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        company.emailProvider = provider || 'custom';
        company.imapHost = imapHost;
        company.imapPort = imapPort || 993;
        company.imapSecure = imapSecure !== false;
        company.imapUser = imapUser;
        company.imapPassword = imapPassword;
        company.smtpHost = smtpHost;
        company.smtpPort = smtpPort || 587;
        company.smtpSecure = smtpSecure !== false;
        company.smtpUser = smtpUser;
        company.smtpPassword = smtpPassword;

        await company.save();

        return NextResponse.json({
            success: true,
            message: 'Email configuration saved successfully',
            email: testResult.email,
        });
    } catch (error: any) {
        console.error('Email connect error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to connect email',
        }, { status: 500 });
    }
}

// GET /api/email/connect - Get current email configuration status
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded || !decoded.companyId) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        await connectDB();

        const company = await Company.findById(decoded.companyId);
        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        const isConnected = !!(company.imapHost && company.imapUser && company.imapPassword);

        return NextResponse.json({
            success: true,
            isConnected,
            provider: company.emailProvider || 'gmail',
            email: company.imapUser || company.email,
            config: isConnected ? {
                imapHost: company.imapHost,
                imapPort: company.imapPort,
                imapSecure: company.imapSecure,
                smtpHost: company.smtpHost,
                smtpPort: company.smtpPort,
                smtpSecure: company.smtpSecure,
            } : null,
        });
    } catch (error: any) {
        console.error('Get email config error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
