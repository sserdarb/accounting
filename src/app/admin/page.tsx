'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Users,
  FileText,
  Settings,
  Activity,
  Database,
  Search,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  AlertCircle,
  Loader2,
  LogIn,
  Building2,
  X,
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  companyId: string;
  company?: { name: string };
  lastLogin?: string;
  createdAt: string;
}

interface Company {
  _id: string;
  name: string;
  taxNumber: string;
  taxOffice: string;
  userCount: number;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'companies'>('overview');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
    companyId: '',
  });

  const [companyForm, setCompanyForm] = useState({
    name: '',
    taxNumber: '',
    taxOffice: '',
    address: '',
    phone: '',
    email: '',
  });

  const tabs = [
    { id: 'overview', label: 'Genel Bakış', icon: Activity },
    { id: 'users', label: 'Kullanıcılar', icon: Users },
    { id: 'companies', label: 'Firmalar', icon: Building2 },
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, companiesRes] = await Promise.all([
          fetch('/api/master-admin/users'),
          fetch('/api/master-admin/companies'),
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.data || []);
        }

        if (companiesRes.ok) {
          const companiesData = await companiesRes.json();
          setCompanies(companiesData.data || []);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast({
          variant: 'destructive',
          title: 'Hata',
          description: 'Veriler yüklenemedi',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImpersonate = async (userId: string) => {
    try {
      const res = await fetch('/api/master-admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: data.message,
        });
        router.push('/dashboard');
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: error.message,
      });
    }
  };

  const handleCreateUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.password || !userForm.companyId) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Lütfen tüm alanları doldurun',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/master-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: 'Kullanıcı oluşturuldu',
        });
        setShowUserModal(false);
        setUserForm({ name: '', email: '', password: '', role: 'user', status: 'active', companyId: '' });
        // Refresh users
        const usersRes = await fetch('/api/master-admin/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.data || []);
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

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/master-admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userForm.name,
          role: userForm.role,
          status: userForm.status,
          companyId: userForm.companyId,
          ...(userForm.password && { password: userForm.password }),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: 'Kullanıcı güncellendi',
        });
        setEditingUser(null);
        setShowUserModal(false);
        // Refresh users
        const usersRes = await fetch('/api/master-admin/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.data || []);
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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/master-admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: 'Kullanıcı silindi',
        });
        setUsers(users.filter(u => u._id !== userId));
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: error.message,
      });
    }
  };

  const handleCreateCompany = async () => {
    if (!companyForm.name || !companyForm.taxNumber) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Şirket adı ve vergi numarası gerekli',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/master-admin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyForm),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: 'Şirket oluşturuldu',
        });
        setShowCompanyModal(false);
        setCompanyForm({ name: '', taxNumber: '', taxOffice: '', address: '', phone: '', email: '' });
        // Refresh companies
        const companiesRes = await fetch('/api/master-admin/companies');
        if (companiesRes.ok) {
          const companiesData = await companiesRes.json();
          setCompanies(companiesData.data || []);
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

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status || 'active',
      companyId: user.companyId,
    });
    setShowUserModal(true);
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      masteradmin: { label: 'Master Admin', variant: 'default' },
      admin: { label: 'Admin', variant: 'secondary' },
      user: { label: 'Kullanıcı', variant: 'outline' },
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
    const config = statusConfig[status] || { label: status || 'Aktif', variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.taxNumber.includes(searchQuery)
  );

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Master Admin Paneli</h1>
            <p className="text-muted-foreground">Tüm kullanıcıları ve firmaları yönetin</p>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b">
            <div className="flex gap-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Kullanıcı</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Aktif Firma</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{companies.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Admin Sayısı</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin' || u.role === 'masteradmin').length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Aktif Kullanıcı</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{users.filter(u => u.status === 'active' || !u.status).length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Hızlı İşlemler</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button onClick={() => {
                    setEditingUser(null);
                    setUserForm({ name: '', email: '', password: '', role: 'user', status: 'active', companyId: '' });
                    setShowUserModal(true);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Kullanıcı
                  </Button>
                  <Button variant="outline" onClick={() => setShowCompanyModal(true)}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Yeni Firma
                  </Button>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => {
                  setEditingUser(null);
                  setUserForm({ name: '', email: '', password: '', role: 'user', status: 'active', companyId: '' });
                  setShowUserModal(true);
                }}>
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
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Kullanıcı</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rol</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Firma</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Durum</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user._id} className="border-t hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                            <td className="py-3 px-4 text-sm">{user.company?.name || 'Bilinmeyen'}</td>
                            <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleImpersonate(user._id)}
                                  title="Olarak giriş yap"
                                >
                                  <LogIn className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditModal(user)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user._id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={() => setShowCompanyModal(true)}>
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
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Firma</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vergi No</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vergi Dairesi</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Kullanıcı</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCompanies.map((company) => (
                          <tr key={company._id} className="border-t hover:bg-muted/50">
                            <td className="py-3 px-4 text-sm font-medium">{company.name}</td>
                            <td className="py-3 px-4 text-sm">{company.taxNumber}</td>
                            <td className="py-3 px-4 text-sm">{company.taxOffice}</td>
                            <td className="py-3 px-4 text-sm">{company.userCount || 0}</td>
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

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowUserModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Ad Soyad</Label>
                <Input
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Kullanıcı adı"
                />
              </div>
              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="ornek@email.com"
                  disabled={!!editingUser}
                />
              </div>
              <div className="space-y-2">
                <Label>{editingUser ? 'Yeni Şifre (Boş bırakabilirsiniz)' : 'Şifre'}</Label>
                <Input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label>Firma</Label>
                <Select
                  value={userForm.companyId}
                  onValueChange={(value) => setUserForm({ ...userForm, companyId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Firma seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select
                    value={userForm.role}
                    onValueChange={(value) => setUserForm({ ...userForm, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Kullanıcı</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="masteradmin">Master Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Durum</Label>
                  <Select
                    value={userForm.status}
                    onValueChange={(value) => setUserForm({ ...userForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Pasif</SelectItem>
                      <SelectItem value="suspended">Askıya Alındı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={editingUser ? handleUpdateUser : handleCreateUser}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    editingUser ? 'Güncelle' : 'Oluştur'
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowUserModal(false)}>
                  İptal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Modal */}
      {showCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Yeni Firma</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCompanyModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Firma Adı</Label>
                <Input
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  placeholder="ABC Ltd. Şti."
                />
              </div>
              <div className="space-y-2">
                <Label>Vergi Numarası</Label>
                <Input
                  value={companyForm.taxNumber}
                  onChange={(e) => setCompanyForm({ ...companyForm, taxNumber: e.target.value })}
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label>Vergi Dairesi</Label>
                <Input
                  value={companyForm.taxOffice}
                  onChange={(e) => setCompanyForm({ ...companyForm, taxOffice: e.target.value })}
                  placeholder="İstanbul VD"
                />
              </div>
              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input
                  type="email"
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  placeholder="info@firma.com"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleCreateCompany}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    'Oluştur'
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowCompanyModal(false)}>
                  İptal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
