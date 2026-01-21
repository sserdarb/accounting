'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import AIAssistant from '@/components/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  ArrowRight,
  Eye,
  Edit,
  Loader2,
  X,
  Upload,
  FileSpreadsheet,
} from 'lucide-react';

interface Account {
  _id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit';
  currency: string;
  balance: number;
  iban?: string;
  bankName?: string;
  accountNumber?: string;
  status: string;
  createdAt: string;
}

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  accountName: string;
  reference?: string;
}

export default function BankPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'cash' | 'bank' | 'credit'>('all');

  // Modal states
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [accountForm, setAccountForm] = useState({
    name: '',
    type: 'bank',
    currency: 'TRY',
    balance: 0,
    iban: '',
    bankName: '',
    accountNumber: '',
  });

  const [transferForm, setTransferForm] = useState({
    fromAccountId: '',
    toAccountId: '',
    amount: 0,
    description: '',
  });

  const [importData, setImportData] = useState({
    accountId: '',
    rawText: '',
    importing: false,
    result: null as any,
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [accountsRes, transactionsRes] = await Promise.all([
          fetch('/api/bank/accounts'),
          fetch('/api/bank/transactions?limit=10'),
        ]);

        if (accountsRes.ok) {
          const data = await accountsRes.json();
          setAccounts(data.data || []);
        }

        if (transactionsRes.ok) {
          const data = await transactionsRes.json();
          setTransactions(data.data || []);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateAccount = async () => {
    if (!accountForm.name || !accountForm.type) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Hesap adı ve türü gerekli',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/bank/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountForm),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: 'Hesap oluşturuldu',
        });
        setShowAccountModal(false);
        setAccountForm({ name: '', type: 'bank', currency: 'TRY', balance: 0, iban: '', bankName: '', accountNumber: '' });
        // Refresh accounts
        const accountsRes = await fetch('/api/bank/accounts');
        if (accountsRes.ok) {
          const accountsData = await accountsRes.json();
          setAccounts(accountsData.data || []);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferForm.fromAccountId || !transferForm.toAccountId || !transferForm.amount) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Tüm alanları doldurun',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/bank/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transferForm),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: data.message,
        });
        setShowTransferModal(false);
        setTransferForm({ fromAccountId: '', toAccountId: '', amount: 0, description: '' });
        // Refresh data
        const [accountsRes, transactionsRes] = await Promise.all([
          fetch('/api/bank/accounts'),
          fetch('/api/bank/transactions?limit=10'),
        ]);
        if (accountsRes.ok) {
          const accountsData = await accountsRes.json();
          setAccounts(accountsData.data || []);
        }
        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setTransactions(transactionsData.data || []);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleImport = async () => {
    if (!importData.accountId || !importData.rawText) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Hesap ve ekstre verisi gerekli',
      });
      return;
    }

    setImportData({ ...importData, importing: true });
    try {
      // Parse the raw text into transactions
      // Simple format: date|description|amount per line
      const lines = importData.rawText.split('\n').filter(line => line.trim());
      const transactions = lines.map(line => {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 3) {
          return {
            date: parts[0],
            description: parts[1],
            amount: parseFloat(parts[2].replace(/[^0-9.-]/g, '')),
          };
        }
        // Try to parse as tab/comma separated
        const tabParts = line.split(/[\t,]/).map(p => p.trim());
        if (tabParts.length >= 3) {
          return {
            date: tabParts[0],
            description: tabParts[1],
            amount: parseFloat(tabParts[2].replace(/[^0-9.-]/g, '')),
          };
        }
        return null;
      }).filter(Boolean);

      if (transactions.length === 0) {
        toast({
          variant: 'destructive',
          title: 'Hata',
          description: 'Geçerli işlem bulunamadı. Format: tarih|açıklama|tutar',
        });
        setImportData({ ...importData, importing: false });
        return;
      }

      const res = await fetch('/api/bank/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: importData.accountId,
          transactions,
          useAI: true,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: data.message,
        });
        setImportData({ ...importData, importing: false, result: data, rawText: '' });
        // Refresh data
        const [accountsRes, transactionsRes] = await Promise.all([
          fetch('/api/bank/accounts'),
          fetch('/api/bank/transactions?limit=10'),
        ]);
        if (accountsRes.ok) {
          const accountsData = await accountsRes.json();
          setAccounts(accountsData.data || []);
        }
        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setTransactions(transactionsData.data || []);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: error.message,
      });
      setImportData({ ...importData, importing: false });
    }
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
              <h1 className="text-3xl font-bold mb-2">Kasa ve Banka</h1>
              <p className="text-muted-foreground">Kasa ve banka hesaplarınızı yönetin</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={() => setShowImportModal(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Ekstre İçe Aktar
              </Button>
              <Button variant="outline" onClick={() => setShowTransferModal(true)}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Para Transferi
              </Button>
              <Button onClick={() => setShowAccountModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Hesap Ekle
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Bakiye</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₺{totalBalance.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Giriş</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₺{totalIncome.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Çıkış</CardTitle>
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">₺{totalExpense.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Aktif Hesap</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{accounts.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
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
              <div className="flex gap-2">
                {(['all', 'cash', 'bank', 'credit'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(type)}
                  >
                    {type === 'all' ? 'Tümü' : type === 'cash' ? 'Kasa' : type === 'bank' ? 'Banka' : 'Kredi Kartı'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Account Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredAccounts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Henüz hesap yok</h3>
                <p className="text-muted-foreground mb-4">İlk hesabınızı ekleyin</p>
                <Button onClick={() => setShowAccountModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Hesap Ekle
                </Button>
              </div>
            ) : (
              filteredAccounts.map((account) => {
                const typeConfig = getTypeBadge(account.type);
                return (
                  <Card key={account._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <typeConfig.icon className={`h-5 w-5 ${account.type === 'cash' ? 'text-orange-600' :
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
                          <p className={`text-2xl font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Son İşlemler</CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Henüz işlem yok</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tarih</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Hesap</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Açıklama</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Kategori</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Tutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction._id} className="border-t hover:bg-muted/50">
                          <td className="py-3 px-4 text-sm">{new Date(transaction.date).toLocaleDateString('tr-TR')}</td>
                          <td className="py-3 px-4 text-sm">{transaction.accountName}</td>
                          <td className="py-3 px-4 text-sm">{transaction.description}</td>
                          <td className="py-3 px-4"><Badge variant="outline">{transaction.category}</Badge></td>
                          <td className="py-3 px-4 text-right">
                            <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' :
                                transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                              }`}>
                              {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                              ₺{transaction.amount.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant context="bank" />

      {/* Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Yeni Hesap Ekle</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowAccountModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Hesap Adı</Label>
                <Input
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                  placeholder="Örn: İş Bankası TL Hesabı"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hesap Türü</Label>
                  <Select value={accountForm.type} onValueChange={(v) => setAccountForm({ ...accountForm, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Kasa</SelectItem>
                      <SelectItem value="bank">Banka</SelectItem>
                      <SelectItem value="credit">Kredi Kartı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Para Birimi</Label>
                  <Select value={accountForm.currency} onValueChange={(v) => setAccountForm({ ...accountForm, currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRY">TRY (₺)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Başlangıç Bakiyesi</Label>
                <Input
                  type="number"
                  value={accountForm.balance}
                  onChange={(e) => setAccountForm({ ...accountForm, balance: parseFloat(e.target.value) || 0 })}
                />
              </div>
              {accountForm.type === 'bank' && (
                <>
                  <div className="space-y-2">
                    <Label>Banka Adı</Label>
                    <Input
                      value={accountForm.bankName}
                      onChange={(e) => setAccountForm({ ...accountForm, bankName: e.target.value })}
                      placeholder="Örn: İş Bankası"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>IBAN</Label>
                    <Input
                      value={accountForm.iban}
                      onChange={(e) => setAccountForm({ ...accountForm, iban: e.target.value })}
                      placeholder="TR00 0000 0000 0000 0000 0000 00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hesap Numarası</Label>
                    <Input
                      value={accountForm.accountNumber}
                      onChange={(e) => setAccountForm({ ...accountForm, accountNumber: e.target.value })}
                      placeholder="12345678"
                    />
                  </div>
                </>
              )}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={handleCreateAccount} disabled={submitting}>
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Kaydediliyor...</> : 'Oluştur'}
                </Button>
                <Button variant="outline" onClick={() => setShowAccountModal(false)}>İptal</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Para Transferi</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowTransferModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Kaynak Hesap</Label>
                <Select value={transferForm.fromAccountId} onValueChange={(v) => setTransferForm({ ...transferForm, fromAccountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Hesap seçin" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc._id} value={acc._id}>{acc.name} (₺{acc.balance.toLocaleString()})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hedef Hesap</Label>
                <Select value={transferForm.toAccountId} onValueChange={(v) => setTransferForm({ ...transferForm, toAccountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Hesap seçin" /></SelectTrigger>
                  <SelectContent>
                    {accounts.filter(a => a._id !== transferForm.fromAccountId).map((acc) => (
                      <SelectItem key={acc._id} value={acc._id}>{acc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tutar</Label>
                <Input
                  type="number"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Input
                  value={transferForm.description}
                  onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                  placeholder="Opsiyonel"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={handleTransfer} disabled={submitting}>
                  {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Transfer ediliyor...</> : 'Transfer Et'}
                </Button>
                <Button variant="outline" onClick={() => setShowTransferModal(false)}>İptal</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Banka Ekstresi İçe Aktar</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowImportModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  🤖 <strong>AI Sınıflandırma:</strong> İşlemler yapay zeka ile otomatik kategorize edilecek.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Hesap</Label>
                <Select value={importData.accountId} onValueChange={(v) => setImportData({ ...importData, accountId: v })}>
                  <SelectTrigger><SelectValue placeholder="Hesap seçin" /></SelectTrigger>
                  <SelectContent>
                    {accounts.map((acc) => (
                      <SelectItem key={acc._id} value={acc._id}>{acc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ekstre Verisi</Label>
                <Textarea
                  value={importData.rawText}
                  onChange={(e) => setImportData({ ...importData, rawText: e.target.value })}
                  placeholder="Her satırda bir işlem:&#10;tarih|açıklama|tutar&#10;&#10;Örnek:&#10;2024-01-15|ABC Ltd. ödemesi|15000&#10;2024-01-16|Kira ödemesi|-5000"
                  rows={8}
                />
              </div>
              {importData.result && (
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    ✅ {importData.result.message}
                  </p>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={handleImport} disabled={importData.importing}>
                  {importData.importing ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />AI ile işleniyor...</>
                  ) : (
                    <><FileSpreadsheet className="mr-2 h-4 w-4" />İçe Aktar</>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowImportModal(false)}>Kapat</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
