import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import customEmailService from '@/lib/email-service';

export const dynamic = 'force-dynamic';

// POST /api/email/sync - Sync emails from IMAP server
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

        // Initialize email service with company config
        const initialized = await customEmailService.initializeWithCompany(decoded.companyId);
        if (!initialized) {
            return NextResponse.json({
                success: false,
                error: 'Email service not configured',
            }, { status: 400 });
        }

        // Fetch recent emails
        const emails = await customEmailService.getRecentEmails(50);

        return NextResponse.json({
            success: true,
            count: emails.length,
            emails: emails.map(e => ({
                id: e.id,
                subject: e.subject,
                from: e.from,
                date: e.date,
                hasAttachments: e.hasAttachments,
                snippet: e.snippet,
                attachmentCount: e.attachments?.length || 0,
            })),
        });
    } catch (error: any) {
        console.error('Email sync error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to sync emails',
        }, { status: 500 });
    }
}
