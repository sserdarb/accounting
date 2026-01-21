import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BankAccount, BankTransaction } from '@/models/BankAccount';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/bank/transactions - List transactions
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

        const { searchParams } = new URL(request.url);
        const accountId = searchParams.get('accountId');
        const limit = parseInt(searchParams.get('limit') || '50');

        const query: any = { companyId: decoded.companyId };
        if (accountId) {
            query.accountId = accountId;
        }

        const transactions = await BankTransaction.find(query)
            .sort({ date: -1 })
            .limit(limit)
            .lean();

        // Get account names
        const accountIds = [...new Set(transactions.map((t: any) => t.accountId))];
        const accounts = await BankAccount.find({ _id: { $in: accountIds } }).lean();
        const accountMap = new Map(accounts.map((a: any) => [a._id.toString(), a.name]));

        return NextResponse.json({
            success: true,
            data: transactions.map((t: any) => ({
                ...t,
                _id: t._id.toString(),
                accountName: accountMap.get(t.accountId) || 'Bilinmeyen',
            })),
        });
    } catch (error) {
        console.error('List transactions error:', error);
        return NextResponse.json(
            { error: 'İşlemler alınamadı' },
            { status: 500 }
        );
    }
}

// POST /api/bank/transactions - Create transaction (income/expense)
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
        const { accountId, type, amount, description, category, reference, date } = body;

        if (!accountId || !type || !amount || !description) {
            return NextResponse.json(
                { error: 'Gerekli alanlar eksik' },
                { status: 400 }
            );
        }

        // Verify account belongs to company
        const account = await BankAccount.findOne({
            _id: accountId,
            companyId: decoded.companyId,
        });

        if (!account) {
            return NextResponse.json(
                { error: 'Hesap bulunamadı' },
                { status: 404 }
            );
        }

        // Create transaction
        const transaction = new BankTransaction({
            companyId: decoded.companyId,
            accountId,
            type,
            amount: Math.abs(amount),
            description,
            category: category || (type === 'income' ? 'Tahsilat' : 'Gider'),
            reference,
            date: date ? new Date(date) : new Date(),
        });

        await transaction.save();

        // Update account balance
        const balanceChange = type === 'income' ? amount : -amount;
        account.balance += balanceChange;
        await account.save();

        return NextResponse.json(
            {
                success: true,
                data: {
                    _id: transaction._id.toString(),
                    type: transaction.type,
                    amount: transaction.amount,
                },
                newBalance: account.balance,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create transaction error:', error);
        return NextResponse.json(
            { error: 'İşlem oluşturulamadı' },
            { status: 500 }
        );
    }
}
