'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import AIAssistant from '@/components/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Plus,
  Search,
  FileText,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  type: 'sales' | 'purchase' | 'draft';
  customerName: string;
  date: string;
  dueDate?: string;
  totalAmount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  gibStatus?: string;
}

export default function InvoicesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sales' | 'purchase'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'pending' | 'paid' | 'overdue'>('all');

  // Fetch invoices
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/invoices?limit=100');
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.data || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Faturalar yüklenemedi',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Bu faturayı silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: 'Fatura silindi',
        });
        fetchInvoices();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: error.message || 'Fatura silinemedi',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      paid: { label: 'Ödendi', variant: 'default' },
      pending: { label: 'Bekliyor', variant: 'secondary' },
      overdue: { label: 'Gecikmiş', variant: 'destructive' },
      draft: { label: 'Taslak', variant: 'outline' },
      cancelled: { label: 'İptal', variant: 'destructive' },
    };
    const config = statusConfig[status] || { label: status || 'Taslak', variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getGibStatusBadge = (status: string | undefined) => {
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
      invoice.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || invoice.type === filterType;
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Yükleniyor...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Faturalar</h1>
              <p className="text-muted-foreground">Tüm faturalarınızı tek yerden yönetin</p>
            </div>
            <Button size="lg" onClick={() => router.push('/dashboard/invoices/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Fatura
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
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
              <div className="flex gap-2 flex-wrap">
                {(['all', 'sales', 'purchase'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(type)}
                  >
                    {type === 'all' ? 'Tümü' : type === 'sales' ? 'Satış' : 'Alış'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'draft', 'pending', 'paid', 'overdue'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status === 'all' ? 'Tüm Durumlar' :
                    status === 'draft' ? 'Taslak' :
                      status === 'pending' ? 'Bekliyor' :
                        status === 'paid' ? 'Ödendi' : 'Gecikmiş'}
                </Button>
              ))}
            </div>
          </div>

          {/* Invoice Table */}
          <div className="border rounded-lg overflow-hidden">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {invoices.length === 0 ? 'Henüz fatura yok' : 'Fatura Bulunamadı'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {invoices.length === 0 ? 'İlk faturanızı oluşturun' : 'Arama kriterlerine uygun fatura bulunamadı.'}
                </p>
                <Button onClick={() => router.push('/dashboard/invoices/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Fatura Oluştur
                </Button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fatura No</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Müşteri/Tedarikçi</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tarih</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Tutar</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Durum</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">GİB</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="border-t hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium">{invoice.invoiceNumber}</td>
                      <td className="py-3 px-4 text-sm">{invoice.customerName}</td>
                      <td className="py-3 px-4 text-sm">{new Date(invoice.date).toLocaleDateString('tr-TR')}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium">₺{invoice.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                      <td className="py-3 px-4">{getGibStatusBadge(invoice.gibStatus)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/invoices/${invoice._id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/invoices/${invoice._id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteInvoice(invoice._id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {filteredInvoices.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Toplam {filteredInvoices.length} fatura gösteriliyor</p>
            </div>
          )}
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant context="invoice" />
    </div>
  );
}
