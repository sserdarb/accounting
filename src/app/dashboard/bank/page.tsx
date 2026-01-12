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
  Wallet,
  Building2,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
} from 'lucide-react';

export default function BankPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'cash' | 'bank' | 'credit'>('all');

  const accounts = [
    {
      id: 'HES-001',
      type: 'cash',
      name: 'Ana Kasa',
      currency: 'TRY',
      balance: 45000,
      iban: null,
      bankName: null,
      accountNumber: null,
      lastTransaction: '2024-06-15',
      status: 'active',
    },
    {
      id: 'HES-002',
      type: 'bank',
      name: 'İş Bankası TL Hesabı',
      currency: 'TRY',
      balance: 125000,
      iban: 'TR12 3456 7890 1234 5678 9012 34',
      bankName: 'İş Bankası',
      accountNumber: '12345678',
      lastTransaction: '2024-06-15',
      status: 'active',
    },
    {
      id: 'HES-003',
      type: 'bank',
      name: 'Garanti USD Hesabı',
      currency: 'USD',
      balance: 25000,
      iban: 'TR98 7654 3210 9876 5432 1098 76',
      bankName: 'Garanti BBVA',
      accountNumber: '87654321',
      lastTransaction: '2024-06-14',
      status: 'active',
    },
    {
      id: 'HES-004',
      type: 'credit',
      name: 'Yapı Kredi Kredi Kartı',
      currency: 'TRY',
      balance: -8500,
      iban: null,
      bankName: 'Yapı Kredi',
      accountNumber: '**** **** **** 1234',
      lastTransaction: '2024-06-13',
      status: 'active',
    },
    {
      id: 'HES-005',
      type: 'bank',
      name: 'Ziraat Euro Hesabı',
      currency: 'EUR',
      balance: 15000,
      iban: 'TR54 3210 9876 5432 1098 7654 32',
      bankName: 'Ziraat Bankası',
      accountNumber: '54321098',
      lastTransaction: '2024-06-12',
      status: 'active',
    },
  ];

  const transactions = [
    {
      id: 'TRN-001',
      type: 'income',
      account: 'İş Bankası TL Hesabı',
      description: 'ABC Ltd. Şti. ödemesi',
      amount: 15000,
      date: '2024-06-15',
      category: 'Tahsilat',
      reference: 'FAT-2024001',
    },
    {
      id: 'TRN-002',
      type: 'expense',
      account: 'Yapı Kredi Kredi Kartı',
      description: 'Ofis giderleri',
      amount: 2500,
      date: '2024-06-15',
      category: 'Gider',
      reference: null,
    },
    {
      id: 'TRN-003',
      type: 'income',
      account: 'Garanti USD Hesabı',
      description: 'XYZ A.Ş. ödemesi',
      amount: 5000,
      date: '2024-06-14',
      category: 'Tahsilat',
      reference: 'FAT-2024002',
    },
    {
      id: 'TRN-004',
      type: 'expense',
      account: 'Ana Kasa',
      description: 'Personel ödemeleri',
      amount: 8000,
      date: '2024-06-14',
      category: 'Gider',
      reference: null,
    },
    {
      id: 'TRN-005',
      type: 'transfer',
      account: 'İş Bankası TL Hesabı',
      description: 'Ziraat Euro Hesabı transfer',
      amount: 10000,
      date: '2024-06-13',
      category: 'Transfer',
      reference: null,
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

  const getTypeBadge = (type: string) => {
    const typeConfig: Record<string, { label: string; icon: any; variant: 'default' | 'secondary' | 'outline' }> = {
      cash: { label: 'Kasa', icon: Wallet, variant: 'secondary' },
      bank: { label: 'Banka', icon: Building2, variant: 'default' },
      credit: { label: 'Kredi Kartı', icon: CreditCard, variant: 'outline' },
    };
    return typeConfig[type] || { label: type, icon: Wallet, variant: 'outline' };
  };

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.bankName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.iban?.includes(searchQuery);
    const matchesType = filterType === 'all' || account.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Kasa ve Banka</h1>
              <p className="text-muted-foreground">
                Kasa ve banka hesaplarınızı yönetin
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="lg" variant="outline">
                <ArrowRight className="mr-2 h-4 w-4" />
                Para Transferi
              </Button>
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Yeni Hesap Ekle
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Bakiye
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₺{totalBalance.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">+12.5%</span>
                  <span className="text-muted-foreground">geçen aya göre</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Giriş
                </CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ₺{totalIncome.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Bu ay tahsilat
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam Çıkış
                </CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  ₺{totalExpense.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Bu ay gider
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Aktif Hesap
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accounts.length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Toplam hesap sayısı
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
                  placeholder="Hesap adı, banka veya IBAN ara..."
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
                  variant={filterType === 'cash' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('cash')}
                >
                  Kasa
                </Button>
                <Button
                  variant={filterType === 'bank' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('bank')}
                >
                  Banka
                </Button>
                <Button
                  variant={filterType === 'credit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('credit')}
                >
                  Kredi Kartı
                </Button>
              </div>

              {/* More Filters */}
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrele
              </Button>
            </div>
          </div>

          {/* Account Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredAccounts.map((account) => {
              const typeConfig = getTypeBadge(account.type);
              return (
                <Card key={account.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <typeConfig.icon className={`h-5 w-5 ${
                        account.type === 'cash' ? 'text-orange-600' :
                        account.type === 'bank' ? 'text-blue-600' : 'text-purple-600'
                      }`} />
                      <CardTitle className="text-base">{account.name}</CardTitle>
                    </div>
                    <Badge variant={typeConfig.variant}>{typeConfig.label}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Bakiye</p>
                        <p className={`text-2xl font-bold ${
                          account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {account.currency === 'TRY' ? '₺' : account.currency === 'USD' ? '$' : '€'}
                          {Math.abs(account.balance).toLocaleString()}
                        </p>
                      </div>
                      {account.iban && (
                        <div>
                          <p className="text-xs text-muted-foreground">IBAN</p>
                          <p className="text-sm font-mono">{account.iban}</p>
                        </div>
                      )}
                      {account.bankName && (
                        <div>
                          <p className="text-xs text-muted-foreground">Banka</p>
                          <p className="text-sm">{account.bankName}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => alert('Hesap detayları görüntüleniyor: ' + account.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => alert('Hesap düzenleniyor: ' + account.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Son işlem: {account.lastTransaction}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Son İşlemler</CardTitle>
                <Button variant="outline" size="sm" onClick={() => alert('Tüm işlemler görüntüleniyor')}>
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
                        Tarih
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Hesap
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Açıklama
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Kategori
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Tutar
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        İşlem
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-t hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm">{transaction.date}</td>
                        <td className="py-3 px-4 text-sm">{transaction.account}</td>
                        <td className="py-3 px-4 text-sm">
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            {transaction.reference && (
                              <p className="text-xs text-muted-foreground">{transaction.reference}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{transaction.category}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-bold ${
                            transaction.type === 'income' ? 'text-green-600' :
                            transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {transaction.type === 'income' ? '+' :
                             transaction.type === 'expense' ? '-' : ''}
                            ₺{transaction.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => alert('İşlem detayları görüntüleniyor: ' + transaction.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => alert('İşlem düzenleniyor: ' + transaction.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => alert('Daha fazla işlem: ' + transaction.id)}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          {filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Hesap Bulunamadı</h3>
              <p className="text-muted-foreground mb-4">
                Arama kriterlerine uygun hesap bulunamadı.
              </p>
              <Button onClick={() => alert('Yeni hesap ekleme formu açılacak')}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Hesap Ekle
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
