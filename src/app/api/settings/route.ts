import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Company from '@/models/Company';
import { verifyToken } from '@/lib/auth';

// GET /api/settings - Get company settings
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

        const company = await Company.findById(decoded.companyId);
        if (!company) {
            return NextResponse.json({ error: 'Şirket bulunamadı' }, { status: 404 });
        }

        // Mask sensitive information
        const settings = {
            name: company.name,
            taxNumber: company.taxNumber,
            taxOffice: company.taxOffice,
            address: company.address,
            phone: company.phone,
            email: company.email,
            gibUsername: company.gibUsername,
            gibAlias: company.gibAlias,
            ocrProvider: company.ocrProvider,
            gmailClientId: company.gmailClientId,
            // Pass booleans for existence of secrets
            hasGibPassword: !!company.gibPassword,
            hasOcrApiKey: !!company.ocrApiKey,
            hasGmailClientSecret: !!company.gmailClientSecret,
            hasGmailRefreshToken: !!company.gmailRefreshToken,
        };

        return NextResponse.json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error('Fetch settings error:', error);
        return NextResponse.json(
            { error: 'Ayarlar alınamadı' },
            { status: 500 }
        );
    }
}

// POST /api/settings - Update company settings
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

        const body = await request.json();
        await connectDB();

        const company = await Company.findById(decoded.companyId);
        if (!company) {
            return NextResponse.json({ error: 'Şirket bulunamadı' }, { status: 404 });
        }

        // Define allowed fields for update
        const allowedFields = [
            'name', 'taxOffice', 'address', 'phone', 'email',
            'gibUsername', 'gibPassword', 'gibAlias',
            'ocrProvider', 'ocrApiKey',
            'gmailClientId', 'gmailClientSecret', 'gmailRefreshToken'
        ];

        // Update fields if provided in body
        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                // Handle sensitive fields (don't clear if empty unless explicitly requested)
                if (['gibPassword', 'ocrApiKey', 'gmailClientSecret', 'gmailRefreshToken'].includes(field)) {
                    if (body[field] !== '') {
                        (company as any)[field] = body[field];
                    }
                } else {
                    (company as any)[field] = body[field];
                }
            }
        });

        await company.save();

        return NextResponse.json({
            success: true,
            message: 'Ayarlar başarıyla güncellendi',
        });
    } catch (error) {
        console.error('Update settings error:', error);
        return NextResponse.json(
            { error: 'Ayarlar güncellenemedi' },
            { status: 500 }
        );
    }
}
