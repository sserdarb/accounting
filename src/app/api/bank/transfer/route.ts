import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BankAccount, BankTransaction } from '@/models/BankAccount';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST /api/bank/transfer - Transfer money between accounts
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
        const { fromAccountId, toAccountId, amount, description, date } = body;

        if (!fromAccountId || !toAccountId || !amount) {
            return NextResponse.json(
                { error: 'Kaynak hesap, hedef hesap ve tutar gerekli' },
                { status: 400 }
            );
        }

        if (fromAccountId === toAccountId) {
            return NextResponse.json(
                { error: 'Kaynak ve hedef hesap aynı olamaz' },
                { status: 400 }
            );
        }

        if (amount <= 0) {
            return NextResponse.json(
                { error: 'Transfer tutarı pozitif olmalı' },
                { status: 400 }
            );
        }

        // Verify both accounts belong to company
        const [fromAccount, toAccount] = await Promise.all([
            BankAccount.findOne({ _id: fromAccountId, companyId: decoded.companyId }),
            BankAccount.findOne({ _id: toAccountId, companyId: decoded.companyId }),
        ]);

        if (!fromAccount) {
            return NextResponse.json(
                { error: 'Kaynak hesap bulunamadı' },
                { status: 404 }
            );
        }

        if (!toAccount) {
            return NextResponse.json(
                { error: 'Hedef hesap bulunamadı' },
                { status: 404 }
            );
        }

        // Check sufficient balance
        if (fromAccount.balance < amount) {
            return NextResponse.json(
                { error: 'Yetersiz bakiye' },
                { status: 400 }
            );
        }

        const transferDate = date ? new Date(date) : new Date();
        const transferDescription = description || `${fromAccount.name} → ${toAccount.name} transfer`;

        // Create outgoing transaction
        const outTransaction = new BankTransaction({
            companyId: decoded.companyId,
            accountId: fromAccountId,
            type: 'transfer',
            amount: amount,
            description: transferDescription,
            category: 'Transfer Çıkış',
            relatedAccountId: toAccountId,
            date: transferDate,
        });

        // Create incoming transaction
        const inTransaction = new BankTransaction({
            companyId: decoded.companyId,
            accountId: toAccountId,
            type: 'transfer',
            amount: amount,
            description: transferDescription,
            category: 'Transfer Giriş',
            relatedAccountId: fromAccountId,
            date: transferDate,
        });

        // Update balances
        fromAccount.balance -= amount;
        toAccount.balance += amount;

        // Save all
        await Promise.all([
            outTransaction.save(),
            inTransaction.save(),
            fromAccount.save(),
            toAccount.save(),
        ]);

        return NextResponse.json(
            {
                success: true,
                message: 'Transfer başarılı',
                fromBalance: fromAccount.balance,
                toBalance: toAccount.balance,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Transfer error:', error);
        return NextResponse.json(
            { error: 'Transfer yapılamadı' },
            { status: 500 }
        );
    }
}
