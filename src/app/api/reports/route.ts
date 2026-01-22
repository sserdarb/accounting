import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { BankTransaction } from '@/models/BankAccount';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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
        const companyId = decoded.companyId;

        // Get date ranges for the last 6 months
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        // 1. Monthly Revenue & Expense (last 6 months)
        const monthlyStats = await Invoice.aggregate([
            {
                $match: {
                    companyId,
                    date: { $gte: sixMonthsAgo },
                    status: { $ne: 'draft' }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                        type: '$type'
                    },
                    total: { $sum: '$total' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Format monthly data
        const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        const revenueData: any[] = [];

        for (let i = 0; i < 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
            const year = d.getFullYear();
            const month = d.getMonth() + 1;

            const monthRevenue = monthlyStats.find(s => s._id.year === year && s._id.month === month && s._id.type === 'sales')?.total || 0;
            const monthExpense = monthlyStats.find(s => s._id.year === year && s._id.month === month && s._id.type === 'purchase')?.total || 0;

            revenueData.push({
                month: monthNames[d.getMonth()],
                revenue: monthRevenue,
                expense: monthExpense,
                profit: monthRevenue - monthExpense
            });
        }

        // 2. VAT Distribution
        const vatStats = await Invoice.aggregate([
            {
                $match: {
                    companyId,
                    type: 'sales',
                    status: { $ne: 'draft' }
                }
            },
            {
                $group: {
                    _id: '$taxRate',
                    amount: { $sum: '$taxAmount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const vatData = vatStats.map(s => ({
            rate: `%${s._id || 20}`,
            amount: s.amount,
            count: s.count
        }));

        // 3. Top Customers
        const customerStats = await Invoice.aggregate([
            {
                $match: {
                    companyId,
                    type: 'sales',
                    status: { $ne: 'draft' }
                }
            },
            {
                $group: {
                    _id: '$customerName',
                    total: { $sum: '$total' },
                    invoiceCount: { $sum: 1 },
                    lastInvoice: { $max: '$date' }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 5 }
        ]);

        const topCustomers = customerStats.map(s => ({
            name: s._id || 'Bilinmeyen Müşteri',
            total: s.total,
            invoiceCount: s.invoiceCount,
            lastInvoice: new Date(s.lastInvoice).toISOString().split('T')[0]
        }));

        // 4. Cash Flow (last 30 days)
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const cashFlowStats = await BankTransaction.aggregate([
            {
                $match: {
                    companyId,
                    date: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    inflow: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                    outflow: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        let runningBalance = 0; // In a real app we'd fetch the balance at thirtyDaysAgo
        const cashFlowData = cashFlowStats.map(s => {
            runningBalance += (s.inflow - s.outflow);
            return {
                date: s._id,
                inflow: s.inflow,
                outflow: s.outflow,
                balance: runningBalance
            };
        });

        // 5. Summary Stats
        const summary = {
            totalRevenue: revenueData.reduce((sum, d) => sum + d.revenue, 0),
            totalExpenses: revenueData.reduce((sum, d) => sum + d.expense, 0),
            netProfit: revenueData.reduce((sum, d) => sum + d.profit, 0),
            invoiceCount: await Invoice.countDocuments({ companyId })
        };

        return NextResponse.json({
            success: true,
            revenueData,
            vatData,
            topCustomers,
            cashFlowData,
            summary
        });

    } catch (error) {
        console.error('Reports error:', error);
        return NextResponse.json({ error: 'Raporlar alınamadı' }, { status: 500 });
    }
}
