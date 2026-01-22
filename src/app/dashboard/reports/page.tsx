'use client';

import { useState, useEffect } from 'react';
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

  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [vatData, setVatData] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    invoiceCount: 0
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        const data = await response.json();
        if (data.success) {
          setRevenueData(data.revenueData);
          setVatData(data.vatData);
          setTopCustomers(data.topCustomers);
          setCashFlowData(data.cashFlowData);
          setSummary(data.summary);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
                <div className="text-2xl font-bold">₺{summary.totalRevenue.toLocaleString('tr-TR')}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Bu Ay</span>
                  <span className="text-muted-foreground">gerçek veriler</span>
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
                <div className="text-2xl font-bold">₺{summary.totalExpenses.toLocaleString('tr-TR')}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <TrendingDown className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Bu Ay</span>
                  <span className="text-muted-foreground">gerçek veriler</span>
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
                <div className="text-2xl font-bold">₺{summary.netProfit.toLocaleString('tr-TR')}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Net</span>
                  <span className="text-muted-foreground">kar/zarar durumu</span>
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
                <div className="text-2xl font-bold">{summary.invoiceCount}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <FileText className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-600">Toplam</span>
                  <span className="text-muted-foreground">kayıtlı fatura</span>
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
