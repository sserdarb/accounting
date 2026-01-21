'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import AIAssistant from '@/components/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RevenueChart from '@/components/dashboard/RevenueChart';
import VATChart from '@/components/dashboard/VATChart';
import CashFlowChart from '@/components/dashboard/CashFlowChart';
import {
  exportToPDF,
  exportToExcel,
  prepareRevenueReportData,
  prepareVATReportData,
  prepareCustomerReportData,
  prepareCashFlowReportData,
} from '@/lib/export';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Printer,
  FileDown,
} from 'lucide-react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('revenue');

  const reportTypes = [
    { id: 'revenue', label: 'Gelir-Gider', icon: BarChart3 },
    { id: 'vat', label: 'KDV Raporu', icon: PieChart },
    { id: 'customer', label: 'Müşteri Analizi', icon: FileText },
    { id: 'cashflow', label: 'Nakit Akışı', icon: LineChart },
  ];

  const revenueData = [
    { month: 'Ocak', revenue: 45000, expense: 28000, profit: 17000 },
    { month: 'Şubat', revenue: 52000, expense: 31000, profit: 21000 },
    { month: 'Mart', revenue: 48000, expense: 29000, profit: 19000 },
    { month: 'Nisan', revenue: 61000, expense: 35000, profit: 26000 },
    { month: 'Mayıs', revenue: 55000, expense: 32000, profit: 23000 },
    { month: 'Haziran', revenue: 67000, expense: 38000, profit: 29000 },
  ];

  const vatData = [
    { rate: '%1', amount: 1200, count: 45 },
    { rate: '%8', amount: 8500, count: 120 },
    { rate: '%10', amount: 6300, count: 85 },
    { rate: '%18', amount: 18500, count: 200 },
    { rate: '%20', amount: 9200, count: 95 },
  ];

  const topCustomers = [
    { name: 'ABC Ltd. Şti.', total: 125000, invoiceCount: 45, lastInvoice: '2024-06-15' },
    { name: 'XYZ A.Ş.', total: 98000, invoiceCount: 38, lastInvoice: '2024-06-14' },
    { name: 'DEF Ticaret', total: 76000, invoiceCount: 32, lastInvoice: '2024-06-12' },
    { name: 'GHI Lojistik', total: 65000, invoiceCount: 28, lastInvoice: '2024-06-10' },
    { name: 'JKL Teknoloji', total: 54000, invoiceCount: 25, lastInvoice: '2024-06-08' },
  ];

  const cashFlowData = [
    { date: '2024-06-01', inflow: 15000, outflow: 8000, balance: 50000 },
    { date: '2024-06-05', inflow: 22000, outflow: 12000, balance: 60000 },
    { date: '2024-06-10', inflow: 18000, outflow: 15000, balance: 63000 },
    { date: '2024-06-15', inflow: 25000, outflow: 18000, balance: 70000 },
    { date: '2024-06-20', inflow: 20000, outflow: 14000, balance: 76000 },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Raporlar</h1>
              <p className="text-muted-foreground">
                Finansal verilerinizi analiz edin ve raporlayın
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  let reportData;
                  if (reportType === 'revenue') {
                    reportData = prepareRevenueReportData(revenueData);
                  } else if (reportType === 'vat') {
                    reportData = prepareVATReportData(vatData);
                  } else if (reportType === 'customer') {
                    reportData = prepareCustomerReportData(topCustomers);
                  } else if (reportType === 'cashflow') {
                    reportData = prepareCashFlowReportData(cashFlowData);
                  }
                  if (reportData) {
                    exportToPDF({ ...reportData, fileName: `${reportType}_raporu` });
                  }
                }}
              >
                <Printer className="mr-2 h-4 w-4" />
                PDF Yazdır
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  let reportData;
                  if (reportType === 'revenue') {
                    reportData = prepareRevenueReportData(revenueData);
                  } else if (reportType === 'vat') {
                    reportData = prepareVATReportData(vatData);
                  } else if (reportType === 'customer') {
                    reportData = prepareCustomerReportData(topCustomers);
                  } else if (reportType === 'cashflow') {
                    reportData = prepareCashFlowReportData(cashFlowData);
                  }
                  if (reportData) {
                    exportToExcel({ ...reportData, fileName: `${reportType}_raporu` });
                  }
                }}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Excel İndir
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Date Range */}
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">Son 1 Hafta</option>
                  <option value="month">Son 1 Ay</option>
                  <option value="quarter">Son 3 Ay</option>
                  <option value="year">Son 1 Yıl</option>
                  <option value="custom">Özel Tarih Aralığı</option>
                </select>
              </div>

              {/* Filter Button */}
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrele
              </Button>

              {/* Export */}
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Dışa Aktar
              </Button>
            </div>

            {/* Report Type Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {reportTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={reportType === type.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setReportType(type.id)}
                  className="flex-shrink-0"
                >
                  <type.icon className="mr-2 h-4 w-4" />
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Gelir
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₺328,000</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+15.2%</span>
                  <span className="text-muted-foreground">geçen döneme göre</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Gider
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₺193,000</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <TrendingDown className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">-8.5%</span>
                  <span className="text-muted-foreground">geçen döneme göre</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Net Kâr
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₺135,000</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+22.8%</span>
                  <span className="text-muted-foreground">geçen döneme göre</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Fatura
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">545</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+12.1%</span>
                  <span className="text-muted-foreground">geçen döneme göre</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Report */}
          {reportType === 'revenue' && (
            <div className="space-y-6">
              <RevenueChart />

              {/* Revenue Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Aylık Gelir-Gider Özeti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Ay
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Gelir
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Gider
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Kâr
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Kâr Oranı
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueData.map((data, index) => (
                          <tr key={index} className="border-t hover:bg-muted/50">
                            <td className="py-3 px-4 text-sm font-medium">{data.month}</td>
                            <td className="py-3 px-4 text-sm text-right text-green-600">
                              ₺{data.revenue.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-right text-red-600">
                              ₺{data.expense.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-right font-medium">
                              ₺{data.profit.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-right">
                              <Badge variant={data.profit > 0 ? 'default' : 'destructive'}>
                                %{((data.profit / data.revenue) * 100).toFixed(1)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* VAT Report */}
          {reportType === 'vat' && (
            <div className="space-y-6">
              <VATChart />

              <Card>
                <CardHeader>
                  <CardTitle>KDV Özeti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            KDV Oranı
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Toplam Tutar
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Fatura Sayısı
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Dağılım
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {vatData.map((data, index) => (
                          <tr key={index} className="border-t hover:bg-muted/50">
                            <td className="py-3 px-4 text-sm font-medium">{data.rate}</td>
                            <td className="py-3 px-4 text-sm text-right font-medium">
                              ₺{data.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-right">{data.count}</td>
                            <td className="py-3 px-4 text-sm text-right">
                              <Badge variant="outline">
                                {((data.amount / vatData.reduce((sum, d) => sum + d.amount, 0)) * 100).toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 font-bold">
                          <td className="py-3 px-4 text-sm">Toplam</td>
                          <td className="py-3 px-4 text-sm text-right">
                            ₺{vatData.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            {vatData.reduce((sum, d) => sum + d.count, 0)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right">100%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Customer Report */}
          {reportType === 'customer' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    En Çok İş Yapan Müşteriler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Müşteri
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Toplam Tutar
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Fatura Sayısı
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Son Fatura
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {topCustomers.map((customer, index) => (
                          <tr key={index} className="border-t hover:bg-muted/50">
                            <td className="py-3 px-4 text-sm font-medium">{customer.name}</td>
                            <td className="py-3 px-4 text-sm text-right font-medium">
                              ₺{customer.total.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-right">{customer.invoiceCount}</td>
                            <td className="py-3 px-4 text-sm text-right">{customer.lastInvoice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Cash Flow Report */}
          {reportType === 'cashflow' && (
            <div className="space-y-6">
              <CashFlowChart />

              <Card>
                <CardHeader>
                  <CardTitle>Nakit Akışı Özeti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Tarih
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Giriş
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Çıkış
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            Bakiye
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {cashFlowData.map((data, index) => (
                          <tr key={index} className="border-t hover:bg-muted/50">
                            <td className="py-3 px-4 text-sm font-medium">{data.date}</td>
                            <td className="py-3 px-4 text-sm text-right text-green-600">
                              +₺{data.inflow.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-right text-red-600">
                              -₺{data.outflow.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-sm text-right font-medium">
                              ₺{data.balance.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant context="reports" />
    </div>
  );
}
