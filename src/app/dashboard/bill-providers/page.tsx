'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Zap, 
  Flame, 
  Droplets, 
  Link, 
  Unlink, 
  RefreshCw, 
  Download,
  CheckCircle,
  AlertCircle,
  FileText,
  Filter
} from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';

interface Provider {
  id: string;
  name: string;
  type: 'gsm' | 'electricity' | 'gas' | 'water';
  logo: string;
  requiresAuth: boolean;
  authType: 'username_password' | 'api_key' | 'oauth' | 'customer_number';
  status: 'active' | 'inactive' | 'maintenance';
  features: string[];
}

interface Bill {
  id: string;
  providerId: string;
  providerName: string;
  billType: 'gsm' | 'electricity' | 'gas' | 'water';
  billNumber: string;
  period: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue';
  pdfUrl?: string;
  details?: {
    previousReading?: number;
    currentReading?: number;
    consumption?: number;
    unit?: string;
  };
}

export default function BillProvidersPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'gsm' | 'electricity' | 'gas' | 'water'>('all');
  const [connectedProviders, setConnectedProviders] = useState<Set<string>>(new Set());

  const [authForm, setAuthForm] = useState({
    username: '',
    password: '',
    customerId: '',
    contractNumber: '',
    apiKey: ''
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('/api/bill-providers');
      const data = await response.json();
      if (data.success) {
        setProviders(data.data);
      }
    } catch (error) {
      console.error('Sağlayıcılar alınamadı:', error);
    }
  };

  const fetchBills = async (providerId?: string) => {
    setLoading(true);
    try {
      const url = providerId 
        ? `/api/bill-providers/bills?providerId=${providerId}`
        : '/api/bill-providers/bills?fetchAll=true';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setBills(data.data || []);
      }
    } catch (error) {
      console.error('Faturalar çekilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (provider: Provider) => {
    setSelectedProvider(provider);
    setAuthForm({
      username: '',
      password: '',
      customerId: '',
      contractNumber: '',
      apiKey: ''
    });
    setShowAuthModal(true);
  };

  const handleDisconnect = async (providerId: string) => {
    try {
      // API çağrısı yapılabilir
      setConnectedProviders(prev => {
        const newSet = new Set(prev);
        newSet.delete(providerId);
        return newSet;
      });
      setBills(prev => prev.filter(b => b.providerId !== providerId));
    } catch (error) {
      console.error('Bağlantı kesilemedi:', error);
    }
  };

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    setLoading(true);
    try {
      const response = await fetch('/api/bill-providers/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: selectedProvider.id,
          credentials: authForm
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setConnectedProviders(prev => new Set([...prev, selectedProvider.id]));
        setShowAuthModal(false);
        await fetchBills(selectedProvider.id);
      } else {
        alert(data.error || 'Kimlik doğrulama başarısız');
      }
    } catch (error) {
      console.error('Kimlik doğrulama hatası:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (providerId: string) => {
    try {
      const response = await fetch('/api/bill-providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Bağlantı başarılı!');
      } else {
        alert(data.error || 'Bağlantı başarısız');
      }
    } catch (error) {
      console.error('Bağlantı testi hatası:', error);
      alert('Bir hata oluştu');
    }
  };

  const handleRefreshBills = async () => {
    await fetchBills();
  };

  const handleDownloadPDF = (bill: Bill) => {
    alert(`Fatura PDF indiriliyor: ${bill.billNumber}`);
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'gsm':
        return <Smartphone className="h-6 w-6" />;
      case 'electricity':
        return <Zap className="h-6 w-6" />;
      case 'gas':
        return <Flame className="h-6 w-6" />;
      case 'water':
        return <Droplets className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getProviderTypeLabel = (type: string) => {
    switch (type) {
      case 'gsm':
        return 'GSM';
      case 'electricity':
        return 'Elektrik';
      case 'gas':
        return 'Doğalgaz';
      case 'water':
        return 'Su';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Bekliyor</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ödendi</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Gecikmiş</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredProviders = filterType === 'all' 
    ? providers 
    : providers.filter(p => p.type === filterType);

  const totalPendingAmount = bills
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fatura Sağlayıcıları</h1>
            <p className="text-gray-600 mt-1">
              GSM, elektrik, doğalgaz ve su faturalarınızı tek bir yerden yönetin
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bekleyen Faturalar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {bills.filter(b => b.status === 'pending').length}
                </div>
                <p className="text-xs text-gray-500 mt-1">Toplam: ₺{totalPendingAmount.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Bağlı Sağlayıcılar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{connectedProviders.size}</div>
                <p className="text-xs text-gray-500 mt-1">Toplam {providers.length} sağlayıcı</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Toplam Fatura</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{bills.length}</div>
                <p className="text-xs text-gray-500 mt-1">Son 3 ay</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
            >
              Tümü
            </Button>
            <Button
              variant={filterType === 'gsm' ? 'default' : 'outline'}
              onClick={() => setFilterType('gsm')}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              GSM
            </Button>
            <Button
              variant={filterType === 'electricity' ? 'default' : 'outline'}
              onClick={() => setFilterType('electricity')}
            >
              <Zap className="h-4 w-4 mr-2" />
              Elektrik
            </Button>
            <Button
              variant={filterType === 'gas' ? 'default' : 'outline'}
              onClick={() => setFilterType('gas')}
            >
              <Flame className="h-4 w-4 mr-2" />
              Doğalgaz
            </Button>
            <Button
              variant={filterType === 'water' ? 'default' : 'outline'}
              onClick={() => setFilterType('water')}
            >
              <Droplets className="h-4 w-4 mr-2" />
              Su
            </Button>
          </div>

          {/* Providers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {getProviderIcon(provider.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <CardDescription>
                          {getProviderTypeLabel(provider.type)}
                        </CardDescription>
                      </div>
                    </div>
                    {connectedProviders.has(provider.id) && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {provider.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  {connectedProviders.has(provider.id) ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleTestConnection(provider.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Test Et
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(provider.id)}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => handleConnect(provider)}
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Bağla
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bills Section */}
          {bills.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Faturalar</CardTitle>
                    <CardDescription>
                      Son çekilen faturalar
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleRefreshBills}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Yenile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          {getProviderIcon(bill.billType)}
                        </div>
                        <div>
                          <div className="font-semibold">{bill.providerName}</div>
                          <div className="text-sm text-gray-600">
                            {bill.period} - {bill.billNumber}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Son Ödeme: {bill.dueDate}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-semibold">₺{bill.amount.toFixed(2)}</div>
                          {getStatusBadge(bill.status)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadPDF(bill)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Auth Modal */}
          {showAuthModal && selectedProvider && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>{selectedProvider.name} Bağlantısı</CardTitle>
                  <CardDescription>
                    {getProviderTypeLabel(selectedProvider.type)} sağlayıcısına giriş yapın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAuthenticate} className="space-y-4">
                    {selectedProvider.authType === 'username_password' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
                          <Input
                            type="text"
                            value={authForm.username}
                            onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Şifre</label>
                          <Input
                            type="password"
                            value={authForm.password}
                            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    {selectedProvider.authType === 'customer_number' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1">Müşteri Numarası</label>
                          <Input
                            type="text"
                            value={authForm.customerId}
                            onChange={(e) => setAuthForm({ ...authForm, customerId: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Sözleşme Numarası</label>
                          <Input
                            type="text"
                            value={authForm.contractNumber}
                            onChange={(e) => setAuthForm({ ...authForm, contractNumber: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                    
                    {selectedProvider.authType === 'api_key' && (
                      <div>
                        <label className="block text-sm font-medium mb-1">API Anahtarı</label>
                        <Input
                          type="password"
                          value={authForm.apiKey}
                          onChange={(e) => setAuthForm({ ...authForm, apiKey: e.target.value })}
                          required
                        />
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={loading}
                      >
                        {loading ? 'Bağlanıyor...' : 'Bağla'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAuthModal(false)}
                      >
                        İptal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
