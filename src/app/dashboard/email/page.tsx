'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Link as LinkIcon,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
  Settings,
  Server,
  Shield,
  Loader2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface EmailConfig {
  imapHost: string;
  imapPort: string;
  imapSecure: boolean;
  imapUser: string;
  imapPassword: string;
  smtpHost: string;
  smtpPort: string;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPassword: string;
}

export default function EmailPage() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState('');
  const [provider, setProvider] = useState<'gmail' | 'custom'>('gmail');

  const [config, setConfig] = useState<EmailConfig>({
    imapHost: 'mail.innovmar.cloud',
    imapPort: '993',
    imapSecure: true,
    imapUser: '',
    imapPassword: '',
    smtpHost: 'mail.innovmar.cloud',
    smtpPort: '465',
    smtpSecure: true,
    smtpUser: '',
    smtpPassword: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'processed' | 'pending' | 'error'>('all');
  const [recentEmails, setRecentEmails] = useState<any[]>([]); // Initialize as empty array

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const res = await fetch('/api/email/connect');
      const data = await res.json();
      if (data.success && data.isConnected) {
        setIsConnected(true);
        setConnectedEmail(data.email);
        setProvider(data.provider);
        if (data.config) {
          setConfig(prev => ({ ...prev, ...data.config }));
        }
      }
    } catch (error) {
      console.error('Connection check failed:', error);
    }
  };


  const statistics = {
    totalEmails: 1250,
    processedEmails: 1180,
    pendingEmails: 45,
    errorEmails: 25,
    invoicesExtracted: 892,
    lastSync: '2024-06-15 14:30',
  };

  const handleConnect = async () => {
    if (provider === 'custom') {
      if (!config.imapHost || !config.imapUser || !config.imapPassword) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Lütfen gerekli alanları doldurun",
        });
        return;
      }
    }

    setIsConnecting(true);
    try {
      const res = await fetch('/api/email/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          ...config,
          imapPort: parseInt(config.imapPort),
          smtpPort: parseInt(config.smtpPort),
          // Use same credentials for SMTP if not provided
          smtpUser: config.smtpUser || config.imapUser,
          smtpPassword: config.smtpPassword || config.imapPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsConnected(true);
        setConnectedEmail(data.email || config.imapUser);
        toast({
          title: "Başarılı",
          description: "E-posta bağlantısı kuruldu",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Bağlantı Hatası",
        description: error.message || "E-posta sunucusuna bağlanılamadı",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectedEmail('');
    // TODO: Implement backend disconnect endpoint if needing to clear data
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/email/sync', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setRecentEmails(data.emails || []);
        toast({
          title: "Senkronizasyon Tamamlandı",
          description: `${data.count} e-posta güncellendi`,
        });
      }
    } catch (error) {
      console.error('Sync failed', error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "E-postalar senkronize edilemedi",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      processed: { label: 'İşlendi', variant: 'default' },
      pending: { label: 'Bekliyor', variant: 'secondary' },
      error: { label: 'Hata', variant: 'destructive' },
    };
    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredEmails = recentEmails.filter((email) => {
    const matchesSearch =
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || email.status === filterStatus;
    return matchesSearch && matchesStatus;
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
              <h1 className="text-3xl font-bold mb-2">E-posta Entegrasyonu</h1>
              <p className="text-muted-foreground">
                Gmail ile otomatik fatura işleme
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSync} disabled={!isConnected || isConnecting}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
                Senkronize Et
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Ayarlar
              </Button>
            </div>
          </div>

          {/* Connection Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Gmail Bağlantısı
              </CardTitle>
              <CardDescription>
                Gmail hesabınızı bağlayarak otomatik fatura işleme özelliğini kullanın
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium">Bağlantı Aktif</p>
                        <p className="text-sm text-muted-foreground">
                          {connectedEmail} ({provider === 'gmail' ? 'Gmail' : 'Özel Sunucu'})
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">Bağlı</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Son Senkronizasyon</p>
                      <p className="font-medium">{statistics.lastSync}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Toplam E-posta</p>
                      <p className="font-medium">{statistics.totalEmails.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Çıkarılan Fatura</p>
                      <p className="font-medium">{statistics.invoicesExtracted.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button variant="destructive" onClick={handleDisconnect}>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Bağlantıyı Kes
                  </Button>
                </div>
              ) : (
                <Tabs defaultValue="custom" className="w-full" onValueChange={(v) => setProvider(v as any)}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="custom">Özel Sunucu (IMAP/SMTP)</TabsTrigger>
                    <TabsTrigger value="gmail">Gmail (OAuth)</TabsTrigger>
                  </TabsList>

                  <TabsContent value="custom" className="space-y-4">
                    <div className="grid gap-4 py-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>IMAP Sunucusu</Label>
                          <Input
                            placeholder="mail.ornek.com"
                            value={config.imapHost}
                            onChange={(e) => setConfig({ ...config, imapHost: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Port</Label>
                          <Input
                            placeholder="993"
                            value={config.imapPort}
                            onChange={(e) => setConfig({ ...config, imapPort: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>E-posta Adresi</Label>
                          <Input
                            placeholder="info@ornek.com"
                            value={config.imapUser}
                            onChange={(e) => setConfig({ ...config, imapUser: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Şifre</Label>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            value={config.imapPassword}
                            onChange={(e) => setConfig({ ...config, imapPassword: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          className="w-full"
                          onClick={handleConnect}
                          disabled={isConnecting}
                        >
                          {isConnecting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Bağlanılıyor...
                            </>
                          ) : (
                            <>
                              <Server className="mr-2 h-4 w-4" />
                              Sunucuya Bağlan
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        * SMTP ayarları otomatik olarak IMAP bilgilerini kullanır. Gelişmiş ayarlar için Ayarlar menüsünü kullanın.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="gmail" className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                      <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Gmail Hesabınızı Bağlayın</h3>
                      <p className="text-center text-muted-foreground mb-6 max-w-sm">
                        Google hesabınızı bağlayarak faturalarınızı otomatik olarak içe aktarın.
                      </p>
                      <Button onClick={handleConnect} disabled={isConnecting}>
                        {isConnecting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Bağlanılıyor...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            Google ile Giriş Yap
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Toplam E-posta
                </CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.totalEmails.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Tüm zamanlar
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  İşlenen
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.processedEmails.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Başarılı işlem
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Bekleyen
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {statistics.pendingEmails}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  İşlenmeyi bekliyor
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Hata
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {statistics.errorEmails}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  İşlenemedi
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
                  placeholder="Gönderen veya konu ara..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  Tümü
                </Button>
                <Button
                  variant={filterStatus === 'processed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('processed')}
                >
                  İşlenen
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('pending')}
                >
                  Bekleyen
                </Button>
                <Button
                  variant={filterStatus === 'error' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('error')}
                >
                  Hata
                </Button>
              </div>

              {/* More Filters */}
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filtrele
              </Button>
            </div>
          </div>

          {/* Recent Emails */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Son E-postalar</CardTitle>
                <Button variant="outline" size="sm">
                  Tümünü Gör
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Gönderen
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Konu
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Tarih
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Durum
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Fatura
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        İşlem
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmails.length > 0 ? (
                      filteredEmails.map((email) => (
                        <tr key={email.id} className="border-t hover:bg-muted/50">
                          <td className="py-3 px-4 text-sm">{email.from}</td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex items-center gap-2">
                              {email.hasAttachment && (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span>{email.subject}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{new Date(email.date).toLocaleDateString('tr-TR')}</td>
                          <td className="py-3 px-4">
                            {getStatusBadge(email.status || 'pending')}
                          </td>
                          <td className="py-3 px-4">
                            {email.invoiceCount > 0 ? (
                              <Badge variant="default">{email.invoiceCount} Fatura</Badge>
                            ) : (
                              <Badge variant="outline">-</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {email.invoiceCount > 0 && (
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-12">
                          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">E-posta Bulunamadı</h3>
                          <p className="text-muted-foreground mb-4">
                            {isConnected ? 'Henüz e-posta bulunamadı veya senkronize edilmedi.' : 'E-posta hesabınızı bağlayın.'}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
