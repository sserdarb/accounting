'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  FileDown,
  Printer,
} from 'lucide-react';

export default function InvoicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sales' | 'purchase'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');

  const invoices = [
    {
      id: 'FAT-2024001',
      type: 'sales',
      customer: 'ABC Ltd. Şti.',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      amount: '₺1,200',
      status: 'paid',
      gibStatus: 'accepted',
    },
    {
      id: 'FAT-2024002',
      type: 'sales',
      customer: 'XYZ A.Ş.',
      date: '2024-01-14',
      dueDate: '2024-01-20',
      amount: '₺3,500',
      status: 'pending',
      gibStatus: 'viewed',
    },
    {
      id: 'FAT-2024003',
      type: 'purchase',
      customer: 'DEF Ticaret',
      date: '2024-01-13',
      dueDate: '2024-02-13',
      amount: '₺2,800',
      status: 'paid',
      gibStatus: 'accepted',
    },
    {
      id: 'FAT-2024004',
      type: 'sales',
      customer: 'GHI Lojistik',
      date: '2024-01-12',
      dueDate: '2024-01-18',
      amount: '₺4,200',
      status: 'overdue',
      gibStatus: 'sent',
    },
    {
      id: 'FAT-2024005',
      type: 'sales',
      customer: 'JKL Teknoloji',
      date: '2024-01-11',
      dueDate: '2024-01-25',
      amount: '₺1,900',
      status: 'pending',
      gibStatus: 'viewed',
    },
    {
      id: 'FAT-2024006',
      type: 'purchase',
      customer: 'MNO İnşaat',
      date: '2024-01-10',
      dueDate: '2024-02-10',
      amount: '₺5,600',
      status: 'paid',
      gibStatus: 'accepted',
    },
    {
      id: 'FAT-2024007',
      type: 'draft',
      customer: 'PQR Otomotiv',
      date: '2024-01-09',
      dueDate: '2024-02-09',
      amount: '₺3,200',
      status: 'draft',
      gibStatus: null,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      paid: { label: 'Ödendi', variant: 'default' },
      pending: { label: 'Bekliyor', variant: 'secondary' },
      overdue: { label: 'Gecikmiş', variant: 'destructive' },
      draft: { label: 'Taslak', variant: 'outline' },
    };
    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getGibStatusBadge = (status: string | null) => {
    if (!status) return <Badge variant="outline">Gönderilmedi</Badge>;
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      sent: { label: 'Gönderildi', variant: 'secondary' },
      viewed: { label: 'Okundu', variant: 'outline' },
      accepted: { label: 'Kabul Edildi', variant: 'default' },
      rejected: { label: 'Reddedildi', variant: 'destructive' },
    };
    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || invoice.type === filterType;
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Faturalar</h1>
              <p className="text-muted-foreground">
                Tüm faturalarınızı tek yerden yönetin
              </p>
            </div>
            <Button size="lg" onClick={() => router.push('/dashboard/invoices/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Fatura
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Fatura no veya müşteri ara..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  Tümü
                </Button>
                <Button
                  variant={filterType === 'sales' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('sales')}
                >
                  Satış
                </Button>
                <Button
                  variant={filterType === 'purchase' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('purchase')}
                >
                  Alış
                </Button>
              </div>

              {/* More Filters */}
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrele
              </Button>

              {/* Export */}
              <Button variant="outline" size="sm" onClick={() => alert('PDF Export özelliği yakında aktif olacak')}>
                <Printer className="mr-2 h-4 w-4" />
                PDF Yazdır
              </Button>
              <Button variant="outline" size="sm" onClick={() => alert('Excel Export özelliği yakında aktif olacak')}>
                <FileDown className="mr-2 h-4 w-4" />
                Excel İndir
              </Button>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                Tüm Durumlar
              </Button>
              <Button
                variant={filterStatus === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('draft')}
              >
                Taslak
              </Button>
              <Button
                variant={filterStatus === 'sent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('sent')}
              >
                Gönderildi
              </Button>
              <Button
                variant={filterStatus === 'paid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('paid')}
              >
                Ödendi
              </Button>
              <Button
                variant={filterStatus === 'overdue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('overdue')}
              >
                Gecikmiş
              </Button>
            </div>
          </div>

          {/* Invoice Cards for Mobile */}
          <div className="lg:hidden space-y-4 mb-6">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">{invoice.id}</span>
                  </div>
                  {getStatusBadge(invoice.status)}
                </div>
                <div>
                  <p className="font-medium">{invoice.customer}</p>
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">{invoice.amount}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => alert('Fatura detayları görüntüleniyor: ' + invoice.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => alert('Fatura düzenleme: ' + invoice.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Invoice Table */}
          <div className="hidden lg:block border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Fatura No
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Müşteri/Tedarikçi
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Tarih
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Vade Tarihi
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Tutar
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Durum
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    GİB Durumu
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm font-medium">
                      {invoice.id}
                    </td>
                    <td className="py-3 px-4 text-sm">{invoice.customer}</td>
                    <td className="py-3 px-4 text-sm">{invoice.date}</td>
                    <td className="py-3 px-4 text-sm">{invoice.dueDate}</td>
                    <td className="py-3 px-4 text-sm font-medium">
                      {invoice.amount}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="py-3 px-4">
                      {getGibStatusBadge(invoice.gibStatus)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => alert('Fatura detayları görüntüleniyor: ' + invoice.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => alert('Fatura düzenleme: ' + invoice.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => alert('Fatura silme: ' + invoice.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => alert('Daha fazla işlem: ' + invoice.id)}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Fatura Bulunamadı</h3>
              <p className="text-muted-foreground mb-4">
                Arama kriterlerine uygun fatura bulunamadı.
              </p>
              <Button onClick={() => router.push('/dashboard/invoices/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Fatura Oluştur
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredInvoices.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Toplam {filteredInvoices.length} fatura gösteriliyor
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Önceki
                </Button>
                <Button variant="outline" size="sm">
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
