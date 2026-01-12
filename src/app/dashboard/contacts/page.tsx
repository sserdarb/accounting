'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Plus,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier'>('all');

  const contacts = [
    {
      id: 'CAR-001',
      type: 'customer',
      name: 'ABC Ltd. Şti.',
      taxNumber: '1234567890',
      taxOffice: 'İstanbul Vergi Dairesi',
      email: 'info@abcltd.com',
      phone: '+90 212 123 45 67',
      address: 'Maslak Mah. Büyükdere Cad. No:123 İstanbul',
      balance: 15000,
      totalInvoices: 45,
      lastInvoiceDate: '2024-06-15',
      status: 'active',
    },
    {
      id: 'CAR-002',
      type: 'customer',
      name: 'XYZ A.Ş.',
      taxNumber: '0987654321',
      taxOffice: 'Ankara Vergi Dairesi',
      email: 'contact@xyz.com.tr',
      phone: '+90 312 234 56 78',
      address: 'Çankaya Mah. Atatürk Bulvarı No:456 Ankara',
      balance: -5000,
      totalInvoices: 38,
      lastInvoiceDate: '2024-06-14',
      status: 'active',
    },
    {
      id: 'CAR-003',
      type: 'supplier',
      name: 'DEF Ticaret',
      taxNumber: '1122334455',
      taxOffice: 'İzmir Vergi Dairesi',
      email: 'sales@defticaret.com',
      phone: '+90 232 345 67 89',
      address: 'Konak Mah. Gazi Bulvarı No:789 İzmir',
      balance: 25000,
      totalInvoices: 52,
      lastInvoiceDate: '2024-06-12',
      status: 'active',
    },
    {
      id: 'CAR-004',
      type: 'customer',
      name: 'GHI Lojistik',
      taxNumber: '5566778899',
      taxOffice: 'Bursa Vergi Dairesi',
      email: 'info@ghilojistik.com',
      phone: '+90 224 456 78 90',
      address: 'Nilüfer Mah. Mudanya Yolu No:321 Bursa',
      balance: 8000,
      totalInvoices: 28,
      lastInvoiceDate: '2024-06-10',
      status: 'active',
    },
    {
      id: 'CAR-005',
      type: 'supplier',
      name: 'JKL Teknoloji',
      taxNumber: '9988776655',
      taxOffice: 'Antalya Vergi Dairesi',
      email: 'support@jkltech.com',
      phone: '+90 242 567 89 01',
      address: 'Muratpaşa Mah. Lara Cad. No:654 Antalya',
      balance: 12000,
      totalInvoices: 35,
      lastInvoiceDate: '2024-06-08',
      status: 'active',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      active: { label: 'Aktif', variant: 'default' },
      inactive: { label: 'Pasif', variant: 'secondary' },
      blocked: { label: 'Engelli', variant: 'destructive' },
    };
    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.taxNumber.includes(searchQuery) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || contact.type === filterType;
    return matchesSearch && matchesType;
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
              <h1 className="text-3xl font-bold mb-2">Cari Hesaplar</h1>
              <p className="text-muted-foreground">
                Müşteri ve tedarikçilerinizi yönetin
              </p>
            </div>
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Cari Ekle
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Cari
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contacts.length}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+2</span>
                  <span className="text-muted-foreground">bu ay</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Müşteriler
                </CardTitle>
                <User className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {contacts.filter((c) => c.type === 'customer').length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Aktif müşteri sayısı
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tedarikçiler
                </CardTitle>
                <Building2 className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {contacts.filter((c) => c.type === 'supplier').length}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Aktif tedarikçi sayısı
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Bakiye
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₺{contacts.reduce((sum, c) => sum + c.balance, 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Alacak - Borç farkı
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari adı, vergi no veya e-posta ara..."
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
                  variant={filterType === 'customer' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('customer')}
                >
                  Müşteriler
                </Button>
                <Button
                  variant={filterType === 'supplier' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('supplier')}
                >
                  Tedarikçiler
                </Button>
              </div>

              {/* More Filters */}
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrele
              </Button>
            </div>
          </div>

          {/* Contact Cards for Mobile */}
          <div className="lg:hidden space-y-4 mb-6">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {contact.type === 'customer' ? (
                      <User className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Building2 className="h-5 w-5 text-orange-600" />
                    )}
                    <div>
                      <span className="font-medium">{contact.name}</span>
                      <p className="text-xs text-muted-foreground">{contact.id}</p>
                    </div>
                  </div>
                  {getStatusBadge(contact.status)}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Bakiye</p>
                    <p className={`font-bold ${contact.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₺{contact.balance.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Table */}
          <div className="hidden lg:block border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Cari Kodu
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Ad
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Tip
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    İletişim
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Bakiye
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Fatura Sayısı
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Son Fatura
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
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="border-t hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm font-medium">{contact.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.taxNumber}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={contact.type === 'customer' ? 'default' : 'secondary'}>
                        {contact.type === 'customer' ? 'Müşteri' : 'Tedarikçi'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{contact.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-bold ${contact.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₺{contact.balance.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">{contact.totalInvoices}</td>
                    <td className="py-3 px-4 text-sm">{contact.lastInvoiceDate}</td>
                    <td className="py-3 px-4">{getStatusBadge(contact.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Cari Bulunamadı</h3>
              <p className="text-muted-foreground mb-4">
                Arama kriterlerine uygun cari hesap bulunamadı.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Cari Ekle
              </Button>
            </div>
          )}

          {/* Pagination */}
          {filteredContacts.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Toplam {filteredContacts.length} cari gösteriliyor
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
