'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import RevenueChart from '@/components/dashboard/RevenueChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { exportToPDF, exportToExcel } from '@/lib/export';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  DollarSign,
  Users,
  AlertCircle,
  ArrowRight,
  Plus,
  Calendar,
  MoreHorizontal,
  FileDown,
  Printer,
  Zap,
  Smartphone,
  Droplets,
  Flame,
  Loader2,
} from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
}

interface Invoice {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: string;
}

interface PendingPayment {
  id: string;
  customer: string;
  amount: string;
  dueDate: string;
  daysLeft: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (!res.ok) {
          throw new Error('Veriler alınamadı');
        }
        const data = await res.json();

        // Transform stats data
        const formattedStats: Stat[] = [
          {
            title: 'Toplam Gelir',
            value: data.stats.totalRevenue.formatted,
            change: data.stats.totalRevenue.change,
            trend: data.stats.totalRevenue.trend,
            icon: TrendingUp,
          },
          {
            title: 'Toplam Gider',
            value: data.stats.totalExpenses.formatted,
            change: data.stats.totalExpenses.change,
            trend: data.stats.totalExpenses.trend,
            icon: TrendingDown,
          },
          {
            title: 'Toplam Fatura',
            value: data.stats.totalInvoices.formatted,
            change: data.stats.totalInvoices.change,
            trend: data.stats.totalInvoices.trend,
            icon: FileText,
          },
          {
            title: 'Bekleyen Ödeme',
            value: data.stats.pendingPayments.formatted,
            change: data.stats.pendingPayments.change,
            trend: data.stats.pendingPayments.trend,
            icon: DollarSign,
          },
        ];

        setStats(formattedStats);
        setRecentInvoices(data.recentInvoices || []);
        setPendingPayments(data.pendingPayments || []);
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      paid: { label: 'Ödendi', variant: 'default' },
      pending: { label: 'Bekliyor', variant: 'secondary' },
      overdue: { label: 'Gecikmiş', variant: 'destructive' },
      partial: { label: 'Kısmi', variant: 'outline' },
    };
    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Veriler yükleniyor...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-screen">
            <Card className="max-w-md w-full">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <h2 className="text-lg font-semibold mb-2">Hata Oluştu</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Tekrar Dene</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              İşletmenizin finansal özetine hoş geldiniz
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => router.push('/dashboard/invoices/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Fatura
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/dashboard/reports')}>
              <Calendar className="mr-2 h-4 w-4" />
              Rapor Oluştur
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const reportData = {
                  title: 'Dashboard Özeti',
                  subtitle: 'Finansal durum özeti',
                  headers: ['Metrik', 'Değer', 'Değişim'],
                  data: stats.map(stat => [
                    stat.title,
                    stat.value,
                    stat.change
                  ])
                };
                exportToPDF({ ...reportData, fileName: 'dashboard_ozeti' });
              }}
            >
              <Printer className="mr-2 h-4 w-4" />
              PDF Yazdır
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const reportData = {
                  title: 'Dashboard Özeti',
                  headers: ['Metrik', 'Değer', 'Değişim'],
                  data: stats.map(stat => [
                    stat.title,
                    stat.value,
                    stat.change
                  ])
                };
                exportToExcel({ ...reportData, fileName: 'dashboard_ozeti' });
              }}
            >
              <FileDown className="mr-2 h-4 w-4" />
              Excel İndir
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">geçen aya göre</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>

            {/* Pending Payments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Bekleyen Ödemeler</CardTitle>
                  <Badge variant="secondary">{pendingPayments.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {pendingPayments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Bekleyen ödeme yok</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPayments.map((payment, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">
                              {payment.customer}
                            </p>
                            <p className="text-sm font-medium">{payment.amount}</p>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-muted-foreground">
                              {payment.dueDate}
                            </p>
                            <Badge
                              variant={payment.daysLeft <= 3 ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {payment.daysLeft <= 0
                                ? `${Math.abs(payment.daysLeft)} gün gecikmiş`
                                : `${payment.daysLeft} gün kaldı`}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bill Providers Widget */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fatura Sağlayıcıları</CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/bill-providers')}>
                  Tümünü Gör
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                  onClick={() => router.push('/dashboard/bill-providers?type=gsm')}
                >
                  <Smartphone className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">GSM</span>
                  <span className="text-xs text-muted-foreground">3 sağlayıcı</span>
                </div>
                <div
                  className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
                  onClick={() => router.push('/dashboard/bill-providers?type=elektrik')}
                >
                  <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                  <span className="text-sm font-medium">Elektrik</span>
                  <span className="text-xs text-muted-foreground">3 sağlayıcı</span>
                </div>
                <div
                  className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
                  onClick={() => router.push('/dashboard/bill-providers?type=dogalgaz')}
                >
                  <Flame className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium">Doğalgaz</span>
                  <span className="text-xs text-muted-foreground">3 sağlayıcı</span>
                </div>
                <div
                  className="flex flex-col items-center p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors cursor-pointer"
                  onClick={() => router.push('/dashboard/bill-providers?type=su')}
                >
                  <Droplets className="h-8 w-8 text-cyan-600 mb-2" />
                  <span className="text-sm font-medium">Su</span>
                  <span className="text-xs text-muted-foreground">3 sağlayıcı</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Son Faturalar</CardTitle>
                <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/invoices')}>
                  Tümünü Gör
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentInvoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Henüz fatura yok</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push('/dashboard/invoices/new')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    İlk Faturanızı Oluşturun
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Fatura No
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Müşteri
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Tarih
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Tutar
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Durum
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                          İşlem
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.map((invoice, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-muted/50 cursor-pointer"
                          onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
                        >
                          <td className="py-3 px-4 text-sm font-medium">
                            {invoice.id}
                          </td>
                          <td className="py-3 px-4 text-sm">{invoice.customer}</td>
                          <td className="py-3 px-4 text-sm">{invoice.date}</td>
                          <td className="py-3 px-4 text-sm font-medium">
                            {invoice.amount}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(invoice.status)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          {(pendingPayments.length > 0 || recentInvoices.some(i => i.status === 'overdue')) && (
            <div className="mt-8">
              <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Dikkat Edilmesi Gerekenler</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {pendingPayments.filter(p => p.daysLeft <= 7 && p.daysLeft > 0).length > 0 && (
                          <li>• {pendingPayments.filter(p => p.daysLeft <= 7 && p.daysLeft > 0).length} faturanın vadesi yaklaşmakta</li>
                        )}
                        {pendingPayments.filter(p => p.daysLeft <= 0).length > 0 && (
                          <li>• {pendingPayments.filter(p => p.daysLeft <= 0).length} fatura gecikmiş durumda</li>
                        )}
                      </ul>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/invoices?status=overdue')}>
                      İncele
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
