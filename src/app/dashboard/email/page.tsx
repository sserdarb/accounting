'use client';

import { useState } from 'react';
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
} from 'lucide-react';

export default function EmailPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'processed' | 'pending' | 'error'>('all');

  const recentEmails = [
    {
      id: 'EML-001',
      from: 'musteri@abcltd.com',
      subject: 'Fatura - FAT-2024001',
      date: '2024-06-15 14:30',
      status: 'processed',
      invoiceCount: 1,
      hasAttachment: true,
    },
    {
      id: 'EML-002',
      from: 'finance@xyz.com.tr',
      subject: 'Ödeme Bildirimi',
      date: '2024-06-15 11:20',
      status: 'processed',
      invoiceCount: 0,
      hasAttachment: true,
    },
    {
      id: 'EML-003',
      from: 'info@defticaret.com',
      subject: 'Fatura #INV-12345',
      date: '2024-06-14 16:45',
      status: 'pending',
      invoiceCount: 0,
      hasAttachment: true,
    },
    {
      id: 'EML-004',
      from: 'support@jkltech.com',
      subject: 'Teknik Destek Talebi',
      date: '2024-06-14 09:15',
      status: 'processed',
      invoiceCount: 0,
      hasAttachment: false,
    },
    {
      id: 'EML-005',
      from: 'billing@ghilojistik.com',
      subject: 'Fatura - Haziran 2024',
      date: '2024-06-13 15:30',
      status: 'error',
      invoiceCount: 0,
      hasAttachment: true,
    },
  ];

  const statistics = {
    totalEmails: 1250,
    processedEmails: 1180,
    pendingEmails: 45,
    errorEmails: 25,
    invoicesExtracted: 892,
    lastSync: '2024-06-15 14:30',
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const handleSync = async () => {
    setIsConnecting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnecting(false);
    alert('E-postalar başarıyla senkronize edildi!');
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
                          demo@gmail.com
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-red-600" />
                      <div>
                        <p className="font-medium">Bağlantı Pasif</p>
                        <p className="text-sm text-muted-foreground">
                          Gmail hesabınızı bağlayın
                        </p>
                      </div>
                    </div>
                    <Badge variant="destructive">Bağlı Değil</Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Bu entegrasyon şunları sağlar:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Gelen e-postaları otomatik tara</li>
                      <li>E-posta eklerinden fatura çıkar</li>
                      <li>Faturaları otomatik sisteme ekle</li>
                      <li>Düzenli senkronizasyon</li>
                    </ul>
                  </div>

                  <Button onClick={handleConnect} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Bağlanılıyor...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Google ile Bağla
                      </>
                    )}
                  </Button>
                </div>
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
                    {filteredEmails.map((email) => (
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
                        <td className="py-3 px-4 text-sm">{email.date}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(email.status)}
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
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          {filteredEmails.length === 0 && (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">E-posta Bulunamadı</h3>
              <p className="text-muted-foreground mb-4">
                Arama kriterlerine uygun e-posta bulunamadı.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
