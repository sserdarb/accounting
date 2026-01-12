'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  FileText,
  Settings,
  Activity,
  Database,
  Shield,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'companies' | 'settings' | 'logs'>('overview');

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: Activity },
    { id: 'users', label: 'Kullanıcılar', icon: Users },
    { id: 'companies', label: 'Firmalar', icon: Settings },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
    { id: 'logs', label: 'Loglar', icon: Database },
  ];

  const stats = [
    {
      title: 'Toplam Kullanıcı',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Aktif Firma',
      value: '456',
      change: '+8.1%',
      trend: 'up',
      icon: Settings,
    },
    {
      title: 'Toplam Fatura',
      value: '12,345',
      change: '+23.2%',
      trend: 'up',
      icon: FileText,
    },
    {
      title: 'Sistem Hataları',
      value: '5',
      change: '-15.3%',
      trend: 'down',
      icon: AlertCircle,
    },
  ];

  const users = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@firma.com',
      role: 'admin',
      company: 'ABC Ltd. Şti.',
      status: 'active',
      lastLogin: '2024-01-15 10:30',
    },
    {
      id: 2,
      name: 'Ayşe Demir',
      email: 'ayse@sirket.com',
      role: 'user',
      company: 'XYZ A.Ş.',
      status: 'active',
      lastLogin: '2024-01-14 14:45',
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      email: 'mehmet@ticaret.com',
      role: 'user',
      company: 'DEF Ticaret',
      status: 'inactive',
      lastLogin: '2024-01-10 09:15',
    },
    {
      id: 4,
      name: 'Fatma Öz',
      email: 'fatma@lojistik.com',
      role: 'user',
      company: 'GHI Lojistik',
      status: 'active',
      lastLogin: '2024-01-15 16:20',
    },
  ];

  const companies = [
    {
      id: 1,
      name: 'ABC Ltd. Şti.',
      taxNumber: '1234567890',
      taxOffice: 'İstanbul Vergi Dairesi',
      users: 5,
      status: 'active',
      plan: 'Profesyonel',
      createdAt: '2024-01-01',
    },
    {
      id: 2,
      name: 'XYZ A.Ş.',
      taxNumber: '0987654321',
      taxOffice: 'Ankara Vergi Dairesi',
      users: 12,
      status: 'active',
      plan: 'Kurumsal',
      createdAt: '2024-01-05',
    },
    {
      id: 3,
      name: 'DEF Ticaret',
      taxNumber: '1122334455',
      taxOffice: 'İzmir Vergi Dairesi',
      users: 3,
      status: 'inactive',
      plan: 'Başlangıç',
      createdAt: '2024-01-10',
    },
  ];

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      admin: { label: 'Admin', variant: 'default' },
      user: { label: 'Kullanıcı', variant: 'secondary' },
    };
    const config = roleConfig[role] || { label: role, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      active: { label: 'Aktif', variant: 'default' },
      inactive: { label: 'Pasif', variant: 'secondary' },
      suspended: { label: 'Askıya Alındı', variant: 'destructive' },
    };
    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Paneli</h1>
            <p className="text-muted-foreground">
              Sistem yönetimi ve izleme merkezi
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b">
            <div className="flex gap-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="flex items-center gap-1 text-xs mt-1">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingUp className="h-3 w-3 text-green-600 rotate-180" />
                        )}
                        <span
                          className={
                            stat.trend === 'up' ? 'text-green-600' : 'text-green-600'
                          }
                        >
                          {stat.change}
                        </span>
                        <span className="text-muted-foreground">geçen aya göre</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Son Aktiviteler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Yeni kullanıcı kaydı', user: 'Ahmet Yılmaz', time: '10 dakika önce' },
                      { action: 'Fatura oluşturuldu', user: 'Ayşe Demir', time: '15 dakika önce' },
                      { action: 'Firma bilgileri güncellendi', user: 'Mehmet Kaya', time: '1 saat önce' },
                      { action: 'GİB entegrasyonu tamamlandı', user: 'Sistem', time: '2 saat önce' },
                      { action: 'Yeni firma kaydı', user: 'Fatma Öz', time: '3 saat önce' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Kullanıcı ara..."
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Kullanıcı
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Kullanıcı
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Rol
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Firma
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Durum
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Son Giriş
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                            İşlem
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-t hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                            <td className="py-3 px-4 text-sm">{user.company}</td>
                            <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {user.lastLogin}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
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
                </CardContent>
              </Card>
            </div>
          )}

          {/* Companies Tab */}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Firma ara..."
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Firma
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Firma
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Vergi No
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Vergi Dairesi
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Kullanıcı
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Plan
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
                        {companies.map((company) => (
                          <tr key={company.id} className="border-t hover:bg-muted/50">
                            <td className="py-3 px-4 text-sm font-medium">
                              {company.name}
                            </td>
                            <td className="py-3 px-4 text-sm">{company.taxNumber}</td>
                            <td className="py-3 px-4 text-sm">{company.taxOffice}</td>
                            <td className="py-3 px-4 text-sm">{company.users}</td>
                            <td className="py-3 px-4">
                              <Badge variant="secondary">{company.plan}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              {getStatusBadge(company.status)}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
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
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sistem Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sistem Adı</label>
                    <Input defaultValue="E-Fatura Sistemi" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destek E-posta</label>
                    <Input defaultValue="destek@efatura.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Varsayılan KDV Oranı (%)</label>
                    <Input type="number" defaultValue="20" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="registration" className="h-4 w-4 rounded" defaultChecked />
                    <label htmlFor="registration" className="text-sm">
                      Yeni kayıtlar otomatik onaylansın
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="notifications" className="h-4 w-4 rounded" defaultChecked />
                    <label htmlFor="notifications" className="text-sm">
                      Hata bildirimleri e-posta ile gönderilsin
                    </label>
                  </div>
                  <Button>Kaydet</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GİB Entegrasyon Ayarları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GİB API URL</label>
                    <Input defaultValue="https://efatura.gib.gov.tr" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Test Modu</label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                      <option value="test">Test Modu</option>
                      <option value="production">Canlı Mod</option>
                    </select>
                  </div>
                  <Button>Kaydet</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <Card>
              <CardHeader>
                <CardTitle>Sistem Logları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm">
                  {[
                    { level: 'INFO', message: 'User logged in: ahmet@firma.com', time: '2024-01-15 10:30:00' },
                    { level: 'INFO', message: 'Invoice created: FAT-2024001', time: '2024-01-15 10:35:00' },
                    { level: 'WARNING', message: 'GIB API rate limit approaching', time: '2024-01-15 10:40:00' },
                    { level: 'ERROR', message: 'Database connection timeout', time: '2024-01-15 10:45:00' },
                    { level: 'INFO', message: 'Invoice sent to GIB: FAT-2024001', time: '2024-01-15 10:50:00' },
                  ].map((log, index) => (
                    <div key={index} className="flex items-start gap-3 pb-2 last:pb-0 border-b last:border-0">
                      <span
                        className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                          log.level === 'ERROR'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : log.level === 'WARNING'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="text-muted-foreground">{log.time}</span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
