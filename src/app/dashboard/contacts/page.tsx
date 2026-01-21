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
  Plus,
  User,
  Building2,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Loader2,
  X,
} from 'lucide-react';

interface Contact {
  _id: string;
  type: 'customer' | 'supplier';
  name: string;
  taxNumber: string;
  taxOffice?: string;
  email?: string;
  phone?: string;
  address?: string;
  balance: number;
  createdAt: string;
}

export default function ContactsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'supplier'>('all');

  // Modal states
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [contactForm, setContactForm] = useState({
    type: 'customer',
    name: '',
    taxNumber: '',
    taxOffice: '',
    email: '',
    phone: '',
    address: '',
  });

  // Fetch contacts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contacts?limit=100');
      if (res.ok) {
        const data = await res.json();
        setContacts(data.data || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Cariler yüklenemedi',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async () => {
    if (!contactForm.name || !contactForm.taxNumber) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Cari adı ve vergi numarası gerekli',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: 'Cari oluşturuldu',
        });
        setShowContactModal(false);
        resetForm();
        fetchContacts();
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

  const handleUpdateContact = async () => {
    if (!editingContact) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/contacts/${editingContact._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: 'Cari güncellendi',
        });
        setShowContactModal(false);
        setEditingContact(null);
        resetForm();
        fetchContacts();
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

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Bu cariyi silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Başarılı',
          description: 'Cari silindi',
        });
        fetchContacts();
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

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setContactForm({
      type: contact.type,
      name: contact.name,
      taxNumber: contact.taxNumber,
      taxOffice: contact.taxOffice || '',
      email: contact.email || '',
      phone: contact.phone || '',
      address: contact.address || '',
    });
    setShowContactModal(true);
  };

  const resetForm = () => {
    setContactForm({
      type: 'customer',
      name: '',
      taxNumber: '',
      taxOffice: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      active: { label: 'Aktif', variant: 'default' },
      inactive: { label: 'Pasif', variant: 'secondary' },
      blocked: { label: 'Engelli', variant: 'destructive' },
    };
    const config = statusConfig[status] || { label: 'Aktif', variant: 'default' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.taxNumber.includes(searchQuery) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || contact.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalBalance = contacts.reduce((sum, c) => sum + (c.balance || 0), 0);

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
              <h1 className="text-3xl font-bold mb-2">Cari Hesaplar</h1>
              <p className="text-muted-foreground">Müşteri ve tedarikçilerinizi yönetin</p>
            </div>
            <Button size="lg" onClick={() => {
              setEditingContact(null);
              resetForm();
              setShowContactModal(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Cari Ekle
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Cari</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contacts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Müşteriler</CardTitle>
                <User className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contacts.filter((c) => c.type === 'customer').length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tedarikçiler</CardTitle>
                <Building2 className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contacts.filter((c) => c.type === 'supplier').length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Bakiye</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₺{totalBalance.toLocaleString()}</div>
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
                  placeholder="Cari adı, vergi no veya e-posta ara..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'customer', 'supplier'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(type)}
                  >
                    {type === 'all' ? 'Tümü' : type === 'customer' ? 'Müşteriler' : 'Tedarikçiler'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Table */}
          <div className="border rounded-lg overflow-hidden">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {contacts.length === 0 ? 'Henüz cari yok' : 'Cari Bulunamadı'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {contacts.length === 0 ? 'İlk carinizi ekleyin' : 'Arama kriterlerine uygun cari bulunamadı.'}
                </p>
                <Button onClick={() => {
                  setEditingContact(null);
                  resetForm();
                  setShowContactModal(true);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Cari Ekle
                </Button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ad</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tip</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Vergi No</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">İletişim</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Bakiye</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact._id} className="border-t hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {contact.type === 'customer' ? (
                            <User className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Building2 className="h-4 w-4 text-orange-600" />
                          )}
                          <span className="font-medium">{contact.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={contact.type === 'customer' ? 'default' : 'secondary'}>
                          {contact.type === 'customer' ? 'Müşteri' : 'Tedarikçi'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{contact.taxNumber}</td>
                      <td className="py-3 px-4 text-sm">
                        <div className="space-y-1">
                          {contact.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{contact.email}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs">{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-bold ${(contact.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₺{(contact.balance || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(contact)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteContact(contact._id)}>
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
          {filteredContacts.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Toplam {filteredContacts.length} cari gösteriliyor</p>
            </div>
          )}
        </div>
      </main>

      {/* AI Assistant */}
      <AIAssistant context="contacts" />

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editingContact ? 'Cari Düzenle' : 'Yeni Cari Ekle'}
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowContactModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cari Tipi</Label>
                <Select
                  value={contactForm.type}
                  onValueChange={(v) => setContactForm({ ...contactForm, type: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Müşteri</SelectItem>
                    <SelectItem value="supplier">Tedarikçi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cari Adı *</Label>
                <Input
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="ABC Ltd. Şti."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vergi Numarası *</Label>
                  <Input
                    value={contactForm.taxNumber}
                    onChange={(e) => setContactForm({ ...contactForm, taxNumber: e.target.value })}
                    placeholder="1234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vergi Dairesi</Label>
                  <Input
                    value={contactForm.taxOffice}
                    onChange={(e) => setContactForm({ ...contactForm, taxOffice: e.target.value })}
                    placeholder="İstanbul VD"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="info@firma.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="+90 212 123 45 67"
                />
              </div>
              <div className="space-y-2">
                <Label>Adres</Label>
                <Textarea
                  value={contactForm.address}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                  placeholder="Tam adres..."
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={editingContact ? handleUpdateContact : handleCreateContact}
                  disabled={submitting}
                >
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Kaydediliyor...</>
                  ) : (
                    editingContact ? 'Güncelle' : 'Oluştur'
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowContactModal(false)}>İptal</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
