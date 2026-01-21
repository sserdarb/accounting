import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BankAccount, BankTransaction } from '@/models/BankAccount';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const AI_API_KEY = process.env.AI_API_KEY || 'sk-N30PKdJ0Oc6wGU4p6gX5ibHfV5LHw1bw9t0voOkBauDqNVih';
const AI_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Classify transactions using AI
async function classifyTransactionsWithAI(transactions: any[]): Promise<any[]> {
    try {
        const prompt = `Aşağıdaki banka işlemlerini analiz et ve her biri için kategori belirle.
Kategoriler şunlardan biri olmalı:
- Tahsilat (müşteri ödemeleri, satış gelirleri)
- Gider (ofis, kira, fatura ödemeleri)
- Maaş (personel ödemeleri)
- Vergi (vergi ödemeleri, SGK)
- Kira (kira gelirleri veya giderleri)
- Faiz (banka faiz gelirleri veya giderleri)
- Komisyon (banka komisyonları)
- Transfer (hesaplar arası transfer)
- Diğer (sınıflandırılamayan)

İşlemler:
${transactions.map((t, i) => `${i + 1}. Tarih: ${t.date}, Açıklama: "${t.description}", Tutar: ${t.amount}`).join('\n')}

Her işlem için JSON formatında cevap ver:
[{"index": 0, "category": "Kategori", "confidence": 0.9}, ...]`;

        const response = await fetch(AI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_API_KEY}`,
                'HTTP-Referer': 'https://accounting.innovmar.cloud',
                'X-Title': 'Innovmar Accounting',
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3-haiku',
                messages: [
                    {
                        role: 'system',
                        content: 'Sen bir muhasebe uzmanısın. Banka işlemlerini analiz edip doğru kategoriye yerleştiriyorsun. Sadece JSON formatında cevap ver.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.3,
                max_tokens: 2000,
            }),
        });

        if (!response.ok) {
            console.error('AI API error:', await response.text());
            return transactions.map((t, i) => ({
                ...t,
                category: t.amount >= 0 ? 'Tahsilat' : 'Gider',
                aiClassified: false,
            }));
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        // Parse AI response
        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                const classifications = JSON.parse(jsonMatch[0]);
                return transactions.map((t, i) => {
                    const classification = classifications.find((c: any) => c.index === i);
                    return {
                        ...t,
                        category: classification?.category || (t.amount >= 0 ? 'Tahsilat' : 'Gider'),
                        confidence: classification?.confidence || 0.5,
                        aiClassified: true,
                    };
                });
            }
        } catch (parseError) {
            console.error('Parse error:', parseError);
        }

        // Fallback to basic classification
        return transactions.map((t) => ({
            ...t,
            category: t.amount >= 0 ? 'Tahsilat' : 'Gider',
            aiClassified: false,
        }));
    } catch (error) {
        console.error('AI classification error:', error);
        return transactions.map((t) => ({
            ...t,
            category: t.amount >= 0 ? 'Tahsilat' : 'Gider',
            aiClassified: false,
        }));
    }
}

// POST /api/bank/import - Import bank statement with AI classification
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
        const { accountId, transactions: importedTransactions, useAI = true } = body;

        if (!accountId || !importedTransactions || !Array.isArray(importedTransactions)) {
            return NextResponse.json(
                { error: 'Hesap ve işlem listesi gerekli' },
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

        // Classify transactions with AI if enabled
        let classifiedTransactions = importedTransactions;
        if (useAI && importedTransactions.length > 0) {
            classifiedTransactions = await classifyTransactionsWithAI(importedTransactions);
        }

        let imported = 0;
        let skipped = 0;
        let balanceChange = 0;

        for (const item of classifiedTransactions) {
            // Basic validation
            if (!item.date || !item.description || item.amount === undefined) {
                skipped++;
                continue;
            }

            // Determine type based on amount sign
            const amount = parseFloat(item.amount);
            const type = amount >= 0 ? 'income' : 'expense';

            // Check for duplicate (same date, description, amount)
            const existing = await BankTransaction.findOne({
                companyId: decoded.companyId,
                accountId,
                date: new Date(item.date),
                description: item.description,
                amount: Math.abs(amount),
            });

            if (existing) {
                skipped++;
                continue;
            }

            // Create transaction
            const transaction = new BankTransaction({
                companyId: decoded.companyId,
                accountId,
                type,
                amount: Math.abs(amount),
                description: item.description,
                category: item.category || (type === 'income' ? 'Tahsilat' : 'Gider'),
                reference: item.reference || null,
                date: new Date(item.date),
            });

            await transaction.save();
            balanceChange += amount;
            imported++;
        }

        // Update account balance
        account.balance += balanceChange;
        await account.save();

        return NextResponse.json({
            success: true,
            message: `${imported} işlem AI ile sınıflandırılarak içe aktarıldı, ${skipped} işlem atlandı`,
            imported,
            skipped,
            newBalance: account.balance,
            aiUsed: useAI,
        });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json(
            { error: 'İçe aktarma başarısız' },
            { status: 500 }
        );
    }
}
