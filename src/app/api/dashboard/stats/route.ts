import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import Contact from '@/models/Contact';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/dashboard/stats - Get dashboard statistics
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

        // Get current month and last month dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Aggregate stats
        const [
            totalRevenue,
            lastMonthRevenue,
            totalExpenses,
            lastMonthExpenses,
            totalInvoices,
            lastMonthInvoices,
            pendingPayments,
            recentInvoices,
            contactCount
        ] = await Promise.all([
            // Total revenue (paid sales invoices)
            Invoice.aggregate([
                { $match: { companyId, type: 'sales', paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            // Last month revenue
            Invoice.aggregate([
                {
                    $match: {
                        companyId,
                        type: 'sales',
                        paymentStatus: 'paid',
                        date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                    }
                },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            // Total expenses (paid purchase invoices)
            Invoice.aggregate([
                { $match: { companyId, type: 'purchase', paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            // Last month expenses
            Invoice.aggregate([
                {
                    $match: {
                        companyId,
                        type: 'purchase',
                        paymentStatus: 'paid',
                        date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                    }
                },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]),
            // Total invoices count
            Invoice.countDocuments({ companyId }),
            // Last month invoices count
            Invoice.countDocuments({
                companyId,
                date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
            }),
            // Pending payments (pending or overdue invoices)
            Invoice.aggregate([
                {
                    $match: {
                        companyId,
                        type: 'sales',
                        paymentStatus: { $in: ['pending', 'overdue'] }
                    }
                },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            // Recent invoices (last 5)
            Invoice.find({ companyId })
                .sort({ date: -1 })
                .limit(5)
                .lean(),
            // Contact count
            Contact.countDocuments({ companyId })
        ]);

        // Calculate percentage changes
        const currentRevenue = totalRevenue[0]?.total || 0;
        const prevRevenue = lastMonthRevenue[0]?.total || 0;
        const revenueChange = prevRevenue > 0
            ? ((currentRevenue - prevRevenue) / prevRevenue * 100).toFixed(1)
            : '0';

        const currentExpenses = totalExpenses[0]?.total || 0;
        const prevExpenses = lastMonthExpenses[0]?.total || 0;
        const expensesChange = prevExpenses > 0
            ? ((currentExpenses - prevExpenses) / prevExpenses * 100).toFixed(1)
            : '0';

        const currentInvoices = totalInvoices || 0;
        const prevInvoices = lastMonthInvoices || 0;
        const invoicesChange = prevInvoices > 0
            ? ((currentInvoices - prevInvoices) / prevInvoices * 100).toFixed(1)
            : '0';

        // Format pending invoices for display
        const pendingInvoicesList = await Invoice.find({
            companyId,
            type: 'sales',
            paymentStatus: { $in: ['pending', 'overdue'] }
        })
            .sort({ dueDate: 1 })
            .limit(5)
            .lean();

        const formattedPendingPayments = pendingInvoicesList.map((inv: any) => {
            const dueDate = new Date(inv.dueDate || inv.date);
            const today = new Date();
            const daysLeft = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            return {
                id: inv.invoiceNumber,
                customer: inv.customerName || 'Bilinmeyen Müşteri',
                amount: `₺${inv.total.toLocaleString('tr-TR')}`,
                dueDate: dueDate.toISOString().split('T')[0],
                daysLeft: daysLeft
            };
        });

        return NextResponse.json({
            success: true,
            stats: {
                totalRevenue: {
                    value: currentRevenue,
                    formatted: `₺${currentRevenue.toLocaleString('tr-TR')}`,
                    change: `${parseFloat(revenueChange) >= 0 ? '+' : ''}${revenueChange}%`,
                    trend: parseFloat(revenueChange) >= 0 ? 'up' : 'down'
                },
                totalExpenses: {
                    value: currentExpenses,
                    formatted: `₺${currentExpenses.toLocaleString('tr-TR')}`,
                    change: `${parseFloat(expensesChange) >= 0 ? '+' : ''}${expensesChange}%`,
                    trend: parseFloat(expensesChange) <= 0 ? 'up' : 'down' // Less expenses is good
                },
                totalInvoices: {
                    value: currentInvoices,
                    formatted: currentInvoices.toString(),
                    change: `${parseFloat(invoicesChange) >= 0 ? '+' : ''}${invoicesChange}%`,
                    trend: parseFloat(invoicesChange) >= 0 ? 'up' : 'down'
                },
                pendingPayments: {
                    value: pendingPayments[0]?.total || 0,
                    formatted: `₺${(pendingPayments[0]?.total || 0).toLocaleString('tr-TR')}`,
                    change: `+${pendingPayments[0]?.count || 0}`,
                    trend: 'up'
                },
                contactCount
            },
            recentInvoices: recentInvoices.map((inv: any) => ({
                id: inv.invoiceNumber,
                customer: inv.customerName || 'Bilinmeyen',
                date: new Date(inv.date).toISOString().split('T')[0],
                amount: `₺${inv.total.toLocaleString('tr-TR')}`,
                status: inv.paymentStatus
            })),
            pendingPayments: formattedPendingPayments
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json(
            { error: 'İstatistikler alınamadı' },
            { status: 500 }
        );
    }
}
