import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BankAccount, BankTransaction } from '@/models/BankAccount';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/bank/accounts - List all bank accounts
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

        const accounts = await BankAccount.find({ companyId: decoded.companyId })
            .sort({ createdAt: -1 })
            .lean();

        // Calculate totals
        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

        return NextResponse.json({
            success: true,
            data: accounts.map((acc: any) => ({
                ...acc,
                _id: acc._id.toString(),
            })),
            totalBalance,
        });
    } catch (error) {
        console.error('List accounts error:', error);
        return NextResponse.json(
            { error: 'Hesaplar alınamadı' },
            { status: 500 }
        );
    }
}

// POST /api/bank/accounts - Create new bank account
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

        const body = await request.json();
        const { name, type, currency, balance, iban, bankName, accountNumber, branchCode } = body;

        if (!name || !type) {
            return NextResponse.json(
                { error: 'Hesap adı ve türü gerekli' },
                { status: 400 }
            );
        }

        const newAccount = new BankAccount({
            companyId: decoded.companyId,
            name,
            type,
            currency: currency || 'TRY',
            balance: balance || 0,
            iban,
            bankName,
            accountNumber,
            branchCode,
            status: 'active',
        });

        await newAccount.save();

        return NextResponse.json(
            {
                success: true,
                data: {
                    _id: newAccount._id.toString(),
                    name: newAccount.name,
                    type: newAccount.type,
                    balance: newAccount.balance,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create account error:', error);
        return NextResponse.json(
            { error: 'Hesap oluşturulamadı' },
            { status: 500 }
        );
    }
}
