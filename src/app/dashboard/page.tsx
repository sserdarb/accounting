'use client';

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
  BarChart3,
  FileDown,
  Printer,
  Zap,
  Smartphone,
  Droplets,
  Flame,
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Toplam Gelir',
      value: '₺125,430',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Toplam Gider',
      value: '₺42,150',
      change: '-5.2%',
      trend: 'down',
      icon: TrendingDown,
    },
    {
      title: 'Toplam Fatura',
      value: '1,234',
      change: '+8.1%',
      trend: 'up',
      icon: FileText,
    },
    {
      title: 'Bekleyen Ödeme',
      value: '₺15,800',
      change: '+23',
      trend: 'up',
      icon: DollarSign,
    },
  ];

  const recentInvoices = [
    {
      id: 'FAT-2024001',
      customer: 'ABC Ltd. Şti.',
      date: '2024-01-15',
      amount: '₺1,200',
      status: 'paid',
    },
    {
      id: 'FAT-2024002',
      customer: 'XYZ A.Ş.',
      date: '2024-01-14',
      amount: '₺3,500',
      status: 'pending',
    },
    {
      id: 'FAT-2024003',
      customer: 'DEF Ticaret',
      date: '2024-01-13',
      amount: '₺2,800',
      status: 'paid',
    },
    {
      id: 'FAT-2024004',
      customer: 'GHI Lojistik',
      date: '2024-01-12',
      amount: '₺4,200',
      status: 'overdue',
    },
    {
      id: 'FAT-2024005',
      customer: 'JKL Teknoloji',
      date: '2024-01-11',
      amount: '₺1,900',
      status: 'pending',
    },
  ];

  const pendingPayments = [
    {
      id: 'FAT-2024002',
      customer: 'XYZ A.Ş.',
      amount: '₺3,500',
      dueDate: '2024-01-20',
      daysLeft: 5,
    },
    {
      id: 'FAT-2024004',
      customer: 'GHI Lojistik',
      amount: '₺4,200',
      dueDate: '2024-01-18',
      daysLeft: 3,
    },
    {
      id: 'FAT-2024005',
      customer: 'JKL Teknoloji',
      amount: '₺1,900',
      dueDate: '2024-01-25',
      daysLeft: 10,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      paid: { label: 'Ödendi', variant: 'default' },
      pending: { label: 'Bekliyor', variant: 'secondary' },
      overdue: { label: 'Gecikmiş', variant: 'destructive' },
    };
    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

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
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Fatura
            </Button>
            <Button size="lg" variant="outline">
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
                      <TrendingDown className="h-3 w-3 text-green-600" />
                    )}
                    <span
                      className={
                        stat.trend === 'up' ? 'text-green-600' : 'text-green-600'
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
                            {payment.daysLeft} gün kaldı
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bill Providers Widget */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fatura Sağlayıcıları</CardTitle>
                <Button variant="outline" size="sm">
                  Tümünü Gör
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  <Smartphone className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">GSM</span>
                  <span className="text-xs text-muted-foreground">3 sağlayıcı</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer">
                  <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                  <span className="text-sm font-medium">Elektrik</span>
                  <span className="text-xs text-muted-foreground">3 sağlayıcı</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
                  <Flame className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium">Doğalgaz</span>
                  <span className="text-xs text-muted-foreground">3 sağlayıcı</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors cursor-pointer">
                  <Droplets className="h-8 w-8 text-cyan-600 mb-2" />
                  <span className="text-sm font-medium">Su</span>
                  <span className="text-xs text-muted-foreground">3 sağlayıcı</span>
                </div>
              </div>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Bekleyen Faturalar</span>
                  <span className="text-2xl font-bold">₺1,250</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  5 fatura ödeme bekliyor
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Son Faturalar</CardTitle>
                <Button variant="outline" size="sm">
                  Tümünü Gör
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
                      <tr key={index} className="border-b hover:bg-muted/50">
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
            </CardContent>
          </Card>

          {/* Alerts */}
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
                      <li>• 3 faturanın vadesi yaklaşmakta</li>
                      <li>• 1 fatura gecikmiş durumda</li>
                      <li>• GİB entegrasyonu için gerekli bilgiler eksik</li>
                    </ul>
                  </div>
                  <Button variant="outline" size="sm">
                    İncele
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
